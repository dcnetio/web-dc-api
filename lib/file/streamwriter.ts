import { pipe } from 'it-pipe'  
import { pushable, Pushable } from 'it-pushable'  

interface StreamWriterOptions {  
  /** 分块大小（默认1MB） */  
  chunkSize?: number  
  /** 背压缓冲区最大值（默认5MB） */  
  bufferSize?: number  
  /** 失败重试次数（默认3次） */  
  retries?: number  
}  

interface BackpressureEventDetail {  
  currentSize: number  
  averageSize: number  
  threshold: number  
  waitingTime: number  
}  

interface EnhancedPushable<T> extends Pushable<T> {  
    // 使用类型合并增加自定义方法  
    _originalPush: Pushable<T>['push']  
    _originalNext: Pushable<T>['next']
    _queueSize: number  
  }  
  

const MaxChunkSize = 4 * 1024 - 5 
export class EnhancedStreamWriter {  
  private p: EnhancedPushable<Uint8Array>  
  //private p = pushable({ objectMode: false }) 
  
  private bytesWritten = 0  
  private abortController = new AbortController()  
  
  // 背压控制相关属性  
  private backpressureHistory: number[] = []  
  private isBackpressure = false  
  private writeQueue: (() => Promise<void>)[] = []  
  private isProcessingQueue = false  


  constructor(  
    private sink: any,  
    private options: StreamWriterOptions = {}  
  ) {  
    
    if (options){
        this.options = {  
            chunkSize: options.chunkSize ?? MaxChunkSize,  
            bufferSize: options.bufferSize ?? 5 * 1024 * 1024,  
            retries: options.retries ?? 3  
          }  
    }else{
        this.options = {  
            chunkSize: MaxChunkSize,  
            bufferSize: 5 * 1024 * 1024,  
            retries: 3
        }
    }
   
    if (this.options.chunkSize && this.options.chunkSize > MaxChunkSize) {  
      this.options.chunkSize = MaxChunkSize 
    }
    const basePushable = pushable<Uint8Array>({ objectMode: false }) as EnhancedPushable<Uint8Array>  
    
     // 保留原始方法引用  
     basePushable._originalPush = basePushable.push.bind(basePushable) 
        basePushable._originalNext = basePushable.next.bind(basePushable) 
     basePushable._queueSize = 0  
    // 重写 next 方法  
    Object.defineProperty(basePushable, 'next', {  
        value: async () => {  
        const result = await basePushable._originalNext();  
        if (!result.done && result.value) {  
            basePushable._queueSize -= result.value.byteLength;  
        }  
        return result;  
        },  
        writable: false,  
        configurable: false  
    });  
     // 安全重写 push 方法  
     Object.defineProperty(basePushable, 'push', {  
       value: (chunk: Uint8Array) => {  
         basePushable._queueSize += chunk.byteLength  
         return basePushable._originalPush(chunk)  
       },  
       writable: false,  
       configurable: false  
     })  
     this.p = basePushable  
    this.startPipeline()  
  }  

   
  get queueSize() {  
    return this.p._queueSize  
  }  

  // 在 next() 操作时更新队列大小  
  private async safeNext() {  
    const result = await this.p.next()  
    if (!result.done) {  
      this.p._queueSize -= result.value.byteLength  
    }  
    return result  
  }  

  private handleError(err: Error) {  
    this.dispatchEvent(new CustomEvent('error', { detail: err }))  
    this.abort(err.message)  
  }  


  private startPipeline() {  
    pipe(  
      this.p,  
      this.createTransform(),  
      this.sink  
    ).catch((err: Error) => this.handleError(err)) // 正确绑定this  
  }  

  private createTransform() {  
    return async function* (source: AsyncIterable<Uint8Array>) {  
      for await (const chunk of source) {  
        yield chunk  
      }  
    }  
  }  

  async write(data: ArrayBuffer | Blob | string): Promise<void> {  
    if (this.abortController.signal.aborted) return  

    return new Promise((resolve, reject) => {  
      const task = async () => {  
        try {  
          const buffer = await this.convertToBuffer(data)  
          await this.writeChunks(buffer)  
          resolve()  
        } catch (err) {  
          reject(err)  
        }  
      }  

      this.writeQueue.push(task)  
      this.processQueue()  
    })  
  }  

  private async convertToBuffer(data: ArrayBuffer | Blob | string): Promise<ArrayBuffer> {  
    if (data instanceof Blob) return data.arrayBuffer()  
    if (typeof data === 'string') return new TextEncoder().encode(data).buffer  
    return data  
  }  

  private async writeChunks(buffer: ArrayBuffer) {  
    for (let offset = 0; offset < buffer.byteLength; offset += this.options.chunkSize!) {  
      const end = Math.min(offset + this.options.chunkSize!, buffer.byteLength)  
      const chunk = new Uint8Array( end - offset)  
      chunk.set(new Uint8Array(buffer.slice(offset, end)))

      await this.retryableWrite(chunk)  
      this.updateProgress(chunk.byteLength)  
    }  
  }  

  private async retryableWrite(chunk: Uint8Array, attempt = 0): Promise<void> {  
    try {  
      await this.monitorBackpressure()  
      
      await new Promise<void>((resolve, reject) => {  
        try {
            this.p.push(chunk)
        }catch(err){
            reject(err)
        }
        resolve()
      })  
    } catch (err) {  
      if (attempt < this.options.retries!) {  
        const delay = this.calculateRetryDelay(attempt)  
        await new Promise(r => setTimeout(r, delay))  
        return this.retryableWrite(chunk, attempt + 1)  
      }  
      throw err  
    }  
  }  

  private async monitorBackpressure(): Promise<void> {  
    const checkInterval = 50  
    const historySize = 10  

    while (true) {  
        const currentSize = this.queueSize // 空值合并运算符  
        this.backpressureHistory.push(currentSize)  
      
      if (this.backpressureHistory.length > historySize) {  
        this.backpressureHistory.shift()  
      }  

      const avg = this.backpressureHistory.reduce((a, b) => a + b, 0) / historySize  
      const dynamicThreshold = Math.min(  
        this.options.bufferSize! * 0.8,   
        avg * 1.5  
      )  

      if (currentSize < dynamicThreshold || currentSize === 0 ) {  
        if (this.isBackpressure) {  
          this.isBackpressure = false  
          this.dispatchEvent(new CustomEvent('backpressure', {   
            detail: {   
              currentSize,  
              averageSize: avg,  
              threshold: dynamicThreshold,  
              waitingTime: 0  
            }   
          }))  
        }  
        return  
      }  

      if (!this.isBackpressure) {  
        this.isBackpressure = true  
        this.dispatchEvent(new CustomEvent('backpressure', {   
          detail: {   
            currentSize,  
            averageSize: avg,  
            threshold: dynamicThreshold,  
            waitingTime: 0  
          }   
        }))  
      }  

      const waitTime = Math.min(  
        1000,   
        checkInterval * Math.pow(2, currentSize / dynamicThreshold)  
      )  
      await new Promise(r => setTimeout(r, waitTime))  

      if (this.abortController.signal.aborted) break  
    }  
  } 


  private calculateRetryDelay(attempt: number): number {  
    const baseDelay = 100  
    const maxDelay = 5000  
    return Math.min(  
      baseDelay * Math.pow(2, attempt) + Math.random() * 100,  
      maxDelay  
    )  
  }  

  private async processQueue() {  
    if (this.isProcessingQueue || this.abortController.signal.aborted) return  
    this.isProcessingQueue = true  

    while (this.writeQueue.length > 0) {  
      if (this.abortController.signal.aborted) break  
      await this.monitorBackpressure()  
      const task = this.writeQueue.shift()!  
      await task()  
    }  

    this.isProcessingQueue = false  
  }  

  private updateProgress(bytes: number) {  
    this.bytesWritten += bytes  
    this.dispatchEvent(new CustomEvent('progress', {  
      detail: { loaded: this.bytesWritten }  
    }))  
  }  

  async end(): Promise<void> {  
    this.p.end()  
    await this.sink.return?.()  
    this.cleanup()  
  }  

  abort(reason = 'User aborted') {  
    this.abortController.abort(reason)  
    this.cleanup()  
    this.dispatchEvent(new CustomEvent('abort', { detail: reason }))  
  }  

  private cleanup() {  
    this.p.end()  
    this.abortController.abort()  
    this.writeQueue = []  
  }  

  // 事件系统  
  private listeners = new Map<string, Function[]>()  
  
  addEventListener(type: string, callback: (event: CustomEvent) => void) {  
    const handlers = this.listeners.get(type) || []  
    handlers.push(callback)  
    this.listeners.set(type, handlers)  
  }  

// 修复后的代码片段  
private dispatchEvent(event: CustomEvent) {  
    const handlers = this.listeners.get(event.type) || []  
    handlers.forEach(handler => handler(event))  
  }  
  
  // 明确指定事件类型  
  private dispatchBackpressureEvent(detail: BackpressureEventDetail) {  
    this.dispatchEvent(new CustomEvent<BackpressureEventDetail>('backpressure', {   
      detail   
    }))  
  }  
   
}  
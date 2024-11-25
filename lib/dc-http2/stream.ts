
import { pipe } from 'it-pipe'     
import { pushable } from 'it-pushable'    



export class StreamWriter {  
    sink: any;
    p: any;
    pipelinePromise: null;
    started: boolean;
    ended: boolean;
    error: any;

    constructor(sink:any) {  
        this.p = pushable()  
        this.sink = sink  
        this.pipelinePromise = null  
        this.started = false  
        this.ended = false  
        this.error = null  
    }  

    start() {  
        if (this.started) return  
        if (this.ended) throw new Error('Stream already ended')  
        this.started = true  

        // 在后台运行 pipeline  
        this.pipelinePromise = pipe(  
            this.p,  
            async function* (source) {  
                try {  
                    for await (const chunk of source) {  
                        yield chunk  
                    }  
                } catch (err) {  
                    console.error('Transform error:', err)  
                    throw err  
                }  
            },  
            this.sink  
        ).catch((err: Error) => {  
            this.error = err  
            console.error('Pipeline error:', err)  
            throw err  
        })  
    }  

    async write(data: any) {  
        if (this.error) throw this.error  
        if (this.ended) throw new Error('Cannot write after end')  
        if (!this.started) {  
            this.start()  
        }  

        try {  
            await this.p.push(data)  
        } catch (err) {  
            this.error = err  
            throw err  
        }  
    }  

    async end() {  
        if (this.ended) return  
        this.ended = true  
        
        try {  
            this.p.end()  
            if (this.pipelinePromise) {  
                await this.pipelinePromise  
            }  
        } catch (err) {  
            this.error = err  
            throw err  
        }  
    }  

    // 添加状态检查方法  
    isStarted() {  
        return this.started  
    }  

    isEnded() {  
        return this.ended  
    }  

    hasError() {  
        return this.error !== null  
    }  

    // 获取错误信息  
    getError() {  
        return this.error  
    }  
}  
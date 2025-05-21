/**
 * 从ReadableStream逐行读取数据的工具类
 */
export class LineReader {
    private reader: ReadableStreamDefaultReader<Uint8Array>;
    private textDecoder: TextDecoder;
    private buffer: string = '';
    private isEOF: boolean = false;
  
    /**
     * 创建LineReader实例
     * @param stream 可读数据流
     * @param encoding 文本编码（默认为'utf-8'）
     */
    constructor(
      stream: ReadableStream<Uint8Array>,
      encoding: string = 'utf-8'
    ) {
      this.reader = stream.getReader();
      this.textDecoder = new TextDecoder(encoding);
    }
  
    /**
     * 读取下一行数据
     * @returns 返回一行数据，如果到达流末尾则返回null
     */
    async readLine(): Promise<string | null> {
      // 如果已经到达EOF且缓冲区为空，则返回null
      if (this.isEOF && this.buffer.length === 0) {
        return null;
      }
  
      // 尝试从缓冲区中找到一行
      const newlineIndex = this.buffer.indexOf('\n');
      
      if (newlineIndex !== -1) {
        // 找到完整行，提取并更新缓冲区
        const line = this.buffer.substring(0, newlineIndex);
        this.buffer = this.buffer.substring(newlineIndex + 1);
        return line;
      }
      
      // 需要读取更多数据
      if (!this.isEOF) {
        const { value, done } = await this.reader.read();
        
        if (done) {
          // 流结束，返回剩余的缓冲区内容作为最后一行
          this.isEOF = true;
          if (this.buffer.length > 0) {
            const lastLine = this.buffer;
            this.buffer = '';
            return lastLine;
          }
          return null;
        }
        
        // 将新数据添加到缓冲区并递归调用
        this.buffer += this.textDecoder.decode(value, { stream: true });
        return this.readLine();
      }
      
      // 已到达EOF，但缓冲区还有内容
      if (this.buffer.length > 0) {
        const lastLine = this.buffer;
        this.buffer = '';
        return lastLine;
      }
      
      return null;
    }
  
    /**
     * 释放读取器资源
     */
    release(): void {
      this.reader.releaseLock();
    }
  }
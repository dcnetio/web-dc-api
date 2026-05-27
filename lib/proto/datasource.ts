
// 数据源类,主要用于客户端数据流式发送,每次发送的数据是Uint8Array类型,调用setData即可,调用close关闭数据源
export class DataSource {   
    private waitingPromises: Array<{  
        resolve: (data: Uint8Array) => void;  
        reject: (error: Error) => void;  
    }> = [];  
    private closed = false;  

    /**  
     * 设置要发送的数据,可以根据需要多次调用 
     * @throws {Error} 如果数据源已关闭  
     */  
    setData(data: Uint8Array) {  
        if (this.closed) {  
            throw new Error('DataSource is closed');  
        }
        // 快照并清空，确保 setData 期间新注册的 waitForData 不会收到同一块数据
        const pending = this.waitingPromises;
        this.waitingPromises = [];
        pending.forEach(({ resolve }) => resolve(data));  
    }  

    /**  
     * 关闭数据源  
     */  
    close() {  
        if (this.closed) return;  
        this.closed = true;  
        const error = new Error('DataSource has been closed');
        // 快照并清空，然后逐一 reject，避免 reject 回调中再次调用 close 时的重入问题
        const pending = this.waitingPromises;
        this.waitingPromises = [];
        pending.forEach(({ reject }) => reject(error));
    }  

    /**  
     * 等待数据  
     * @throws {Error} 如果数据源已关闭  
     */  
    async waitForData(): Promise<Uint8Array> {  
        if (this.closed) {  
            throw new Error('DataSource is closed');  
        }  
        return new Promise<Uint8Array>((resolve, reject) => {
            // JS 单线程：此处与上方 closed 检查之间不存在并发，无需再次检查
            this.waitingPromises.push({ resolve, reject });  
        });  
    }  

    /**  
     * 检查数据源是否已关闭  
     */  
    isClosed(): boolean {  
        return this.closed;  
    }  

    /**  
     * 获取数据源的异步迭代器  
     * @throws {Error} 如果数据源已关闭  
     */  
    getDataSource(): AsyncIterable<Uint8Array> {  
        if (this.closed) {  
            throw new Error('DataSource is closed');  
        }  

        return {  
            [Symbol.asyncIterator]: () => {  
                return {  
                    next: async (): Promise<IteratorResult<Uint8Array>> => {  
                        try {  
                            if (this.closed) {  
                                return { done: true, value: undefined };  
                            }  
                            const data = await this.waitForData();  
                            return { done: false, value: data };  
                        } catch {  
                            return { done: true, value: undefined };  
                        }  
                    }  
                };  
            }  
        };  
    }  
} 
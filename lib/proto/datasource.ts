
// 数据源类,主要用于客户端数据流式发送,每次发送的数据是Uint8Array类型,调用setData即可,调用close关闭数据源
export class DataSource {   
    private waitingPromises: Array<{  
        resolve: (data: Uint8Array) => void;  
        reject: (error: Error) => void;  
    }> = [];  
    private closed = false;  
    private abortController = new AbortController();  

    /**  
     * 设置要发送的数据,可以根据需要多次调用 
     * @throws {Error} 如果数据源已关闭  
     */  
    setData(data: Uint8Array) {  
        if (this.closed) {  
            throw new Error('DataSource is closed');  
        }   
        const promises  = this.waitingPromises;
        this.waitingPromises = []; 
        // 通知所有等待的promise  
        promises.forEach(({ resolve }) => resolve(data));  
    }  
    /**  
     * 关闭数据源  
     */  
    close() {  
        if (this.closed) return;  
        this.closed = true;  
        this.abortController.abort();  
        // 拒绝所有等待的promise  
        const error = new Error('DataSource has been closed');  
        this.waitingPromises.forEach(({ reject }) => reject(error));  
        this.waitingPromises = [];    
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
            // 如果在创建Promise时数据源已关闭，立即拒绝  
            if (this.closed) {  
                reject(new Error('DataSource is closed'));  
                return;  
            }  
            this.waitingPromises.push({ resolve, reject });  
            // 设置中止信号处理  
            this.abortController.signal.addEventListener('abort', () => {  
                reject(new Error('DataSource has been closed'));  
            });  
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
                        } catch (error) {  
                            return { done: true, value: undefined };  
                        }  
                    }  
                };  
            }  
        };  
    }  
} 
import ThreadID from "@textile/threads-id";
import { DBManager } from "./dbmanager";
import * as buffer from "buffer/";
const { Buffer } = buffer;


export class DBAccess {
    dbManager: DBManager;
    constructor(dbManager: DBManager) {
        this.dbManager = dbManager;
    }
    /**
     * Create creates new instances of objects in a collection
     * @param threadId Thread ID string
     * @param collectionName Collection name
     * @param jsonInstance JSON string representing the instance
     * @returns Promise resolving to the created instance ID
     * @throws Error if creation fails
     */
    async  create(threadId: string, collectionName: string, jsonInstance: string): Promise<string> {
        // 检查实例大小
        if (jsonInstance.length > 100 * 1024) { // 100 KB
        throw new Error("instance too big");
        }
        try {
        // 解码threaddbID
        const tID = ThreadID.fromString(threadId);
        
        // 检查数据库管理器
        if (!this.dbManager) {
            throw new Error("No database manager available");
        }
        
        // 获取threaddb数据库
        const threadDB = await this.dbManager.getDB(tID);
        
        // 获取集合
        const collection = threadDB.getCollection(collectionName);
        if (!collection) {
            throw new Error("Collection does not exist");
        }
        
        // 创建实例
        const instanceID = await collection.create(Buffer.from(jsonInstance));
        // 返回实例ID
        return instanceID.toString();
        } catch (err) {
        console.error(`Failed to create instance: ${err instanceof Error ? err.message : String(err)}`);
        throw err;
        }
    }


    /**
         * Delete deletes an instance by ID
         * @param threadId Thread ID string
         * @param collectionName Collection name
         * @param instanceID Instance ID to delete
         * @throws Error if deletion fails
         */
    async delete(threadId: string, collectionName: string, instanceID: string): Promise<void> {
        try {
            // 解码线程ID
            const tID = ThreadID.fromString(threadId);
            
            // 检查数据库管理器
            if (!this.dbManager) {
                throw new Error("No database manager available");
            }
            
            // 获取线程数据库
            const threadDB = await this.dbManager.getDB(tID);
            
            // 获取集合
            const collection = threadDB.getCollection(collectionName);
            if (!collection) {
                throw new Error("Collection does not exist");
            }
            // 删除实例
            await collection.delete(instanceID);
        } catch (err) {
            console.error(`Failed to delete instance: ${err instanceof Error ? err.message : String(err)}`);
            throw err;
        }
    }

    /**
     * Save updates an existing instance
     * @param threadId Thread ID string
     * @param collectionName Collection name
     * @param instance JSON string representing the instance
     * @throws Error if update fails
     */
    async save(threadId: string, collectionName: string, instance: string): Promise<void> {
        // 检查实例大小
        if (instance.length > 100 * 1024) { // 100 KB
            throw new Error("instance too big");
        }
        
        try {
            // 解码线程ID
            const tID = ThreadID.fromString(threadId);
            
            // 检查数据库管理器
            if (!this.dbManager) {
                throw new Error("No database manager available");
            }
            
            // 获取线程数据库
            const threadDB = await this.dbManager.getDB(tID);
            
            // 获取集合
            const collection = threadDB.getCollection(collectionName);
            if (!collection) {
                throw new Error("Collection does not exist");
            }
            // 保存实例
            await collection.save(Buffer.from(instance));
        } catch (err) {
            console.error(`Failed to save instance: ${err instanceof Error ? err.message : String(err)}`);
            throw err;
        }
    }

    /**
     * DeleteMany deletes multiple instances by their IDs
     * @param threadId Thread ID string
     * @param collectionName Collection name
     * @param instanceIDs Comma-separated or JSON array of instance IDs
     * @throws Error if deletion fails
     */
    async deleteMany(threadId: string, collectionName: string, instanceIDs: string): Promise<void> {
        try {
            // 解码线程ID
            const tID = ThreadID.fromString(threadId);
            
            // 检查数据库管理器
            if (!this.dbManager) {
                throw new Error("No database manager available");
            }
            
            // 获取线程数据库
            const threadDB = await this.dbManager.getDB(tID);
            
            // 获取集合
            const collection = threadDB.getCollection(collectionName);
            if (!collection) {
                throw new Error("Collection does not exist");
            }
            
            // 解析实例ID列表
            let IDs: string[] = [];
            instanceIDs = instanceIDs.trim();
            if (instanceIDs === "") {
                return;
            }
            
            if (instanceIDs[0] !== '[') {
                // 逗号分隔的ID列表
                IDs = instanceIDs.split(',');
            } else {
                // JSON数组
                try {
                    IDs = JSON.parse(instanceIDs);
                } catch (err) {
                    // 解析失败时，将整个字符串作为一个ID
                    IDs = [instanceIDs];
                }
            }
            
            // 批量处理，每次最多100个（避免事务过大）
            const idsLen = IDs.length;
            for (let i = 0; i < idsLen; i += 100) {
                const batchIds = IDs.slice(i, Math.min(i + 100, idsLen));
                await collection.deleteMany(batchIds);
            }
        } catch (err) {
            console.error(`Failed to delete instances: ${err instanceof Error ? err.message : String(err)}`);
            throw err;
        }
    }

    /**
     * Has checks if the specified instance exists
     * @param threadId Thread ID string
     * @param collectionName Collection name
     * @param instanceID Instance ID to check
     * @returns Promise resolving to a boolean indicating if instance exists
     */
    async has(threadId: string, collectionName: string, instanceID: string): Promise<boolean> {
        try {
            // 解码线程ID
            const tID = ThreadID.fromString(threadId);
            
            // 检查数据库管理器
            if (!this.dbManager) {
                return false;
            }
            
            // 获取线程数据库
            const threadDB = await this.dbManager.getDB(tID);
            
            // 获取集合
            const collection = threadDB.getCollection(collectionName);
            if (!collection) {
                return false;
            }
            
            // 检查实例是否存在
            return await collection.has(instanceID);
        } catch (err) {
            console.error(`Failed to check instance existence: ${err instanceof Error ? err.message : String(err)}`);
            return false;
        }
    }

    /**
     * Find finds instances by query
     * @param threadId Thread ID string
     * @param collectionName Collection name
     * @param queryString JSON string representing the query
     * @returns Promise resolving to a JSON string with found instances
     * @throws Error if query fails
     */
    async find(threadId: string, collectionName: string, queryString: string): Promise<string> {
        try {
            // 解析查询字符串
            const query = JSON.parse(queryString);
            
            // 解码线程ID
            const tID = ThreadID.fromString(threadId);
            
            // 检查数据库管理器
            if (!this.dbManager) {
                throw new Error("No database manager available");
            }
            
            // 获取线程数据库
            const threadDB = await this.dbManager.getDB(tID);
            
            // 获取集合
            const collection = threadDB.getCollection(collectionName);
            if (!collection) {
                throw new Error("Collection does not exist");
            }
            
            // 执行查询
            const results = await collection.find(query);
            
            // 合并结果并返回JSON字符串
            if (Array.isArray(results)) {
                return JSON.stringify(results);
            } else {
                // 如果结果是字节数组，则需要连接它们
                const resultArray = results as Buffer[];
                const joinedResult = Buffer.concat([
                    Buffer.from('['),
                    Buffer.concat(
                        resultArray.map((buf, idx) => 
                            Buffer.concat([
                                buf,
                                idx < resultArray.length - 1 ? Buffer.from(',') : Buffer.from('')
                            ])
                        )
                    ),
                    Buffer.from(']')
                ]);
                return joinedResult.toString();
            }
        } catch (err) {
            console.error(`Failed to find instances: ${err instanceof Error ? err.message : String(err)}`);
            throw err;
        }
    }

    /**
     * FindByID finds an instance by ID
     * @param threadId Thread ID string
     * @param collectionName Collection name
     * @param instanceID Instance ID to find
     * @returns Promise resolving to a JSON string with found instance
     * @throws Error if query fails
     */
    async findByID(threadId: string, collectionName: string, instanceID: string): Promise<string> {
        try {
            // 解码线程ID
            const tID = ThreadID.fromString(threadId);
            
            // 检查数据库管理器
            if (!this.dbManager) {
                throw new Error("No database manager available");
            }
            
            // 获取线程数据库
            const threadDB = await this.dbManager.getDB(tID);
            
            // 获取集合
            const collection = threadDB.getCollection(collectionName);
            if (!collection) {
                throw new Error("Collection does not exist");
            }
            
            // 根据ID查找实例
            const result = await collection.findByID(instanceID);
            
            // 返回实例
            return result instanceof Buffer ? result.toString() : JSON.stringify(result);
        } catch (err) {
            console.error(`Failed to find instance by ID: ${err instanceof Error ? err.message : String(err)}`);
            throw err;
        }
    }

    /**
     * ModifiedSince returns instance IDs modified since the given time
     * @param threadId Thread ID string
     * @param collectionName Collection name
     * @param time Unix timestamp in milliseconds
     * @returns Promise resolving to a JSON string with instance IDs
     * @throws Error if query fails
     */
    async modifiedSince(threadId: string, collectionName: string, time: number): Promise<string> {
        try {
            // 解码线程ID
            const tID = ThreadID.fromString(threadId);
            
            // 检查数据库管理器
            if (!this.dbManager) {
                throw new Error("No database manager available");
            }
            
            // 获取线程数据库
            const threadDB = await this.dbManager.getDB(tID);
            
            // 获取集合
            const collection = threadDB.getCollection(collectionName);
            if (!collection) {
                throw new Error("Collection does not exist");
            }
            
            // 获取指定时间后修改的实例ID列表
            const ids = await collection.modifiedSince(time);
            
            // 序列化并返回ID列表
            return JSON.stringify(ids);
        } catch (err) {
            console.error(`Failed to get modified instances: ${err instanceof Error ? err.message : String(err)}`);
            throw err;
        }
    }
}
import { IAppInfo } from '../../lib/common/types/types';
import { SymmetricKey, Key as ThreadKey } from '../implements/threaddb/common/key';
import { IFileOperations } from './file-interface';


export interface IUtilOperations {
    createSymmetricKey(): SymmetricKey;
    createThreadKey(): ThreadKey;
    /**
     * 设置应用信息,发布应用时调用  
     * @param appId string 应用ID
     * @param fid 
     * @param domain 
     * @param owner 
     * @param rewarder 
     */
    setAppInfo(appId: string,fid:string,domain:string,owner?: string,rewarder?: string): Promise<[boolean|null, Error | null]>;
    getAppInfo(appId: string): Promise<[IAppInfo|null, Error | null]>;

    /**
     * 处理IPFS请求
     * @param data 请求数据
     * @param port 消息端口
     * @param fileOps 文件操作对象
     */
     handleIpfsRequest(
      data: { id: string, pathname: string, range?: string }, 
      port: MessagePort, 
      fileOps?: IFileOperations
    ): Promise<void>
}
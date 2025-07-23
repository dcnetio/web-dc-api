import { IAppInfo } from '../../lib/common/types/types';
import { SymmetricKey, Key as ThreadKey } from '../implements/threaddb/common/key';


export interface IUtilOperations {
    createSymmetricKey(): SymmetricKey;
    createThreadKey(): ThreadKey;
    /**
     * 设置应用信息,发布应用时调用  
     * @param appId string 应用ID
     * @param domain 
     * @param fid 
     * @param owner 
     * @param rewarder 
     */
    setAppInfo(appId: string,domain:string,fid:string,owner?: string,rewarder?: string): Promise<[boolean|null, Error | null]>;
    getAppInfo(appId: string): Promise<[IAppInfo|null, Error | null]>;
}
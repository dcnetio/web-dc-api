
import { IUtilOperations } from '../interfaces/util-interface';
import { SymmetricKey,Key as  ThreadKey } from '../implements/threaddb/common/key';
import { CoreModuleName } from '../common/module-system';
import { DCContext } from '../interfaces';
import { createLogger } from '../util/logger';
import { UtilManager } from '../../lib/implements/util/manager';
import { IAppInfo } from '../../lib/common/types/types';
import { Errors } from '../../lib/common/error';
const logger = createLogger("UtilModule");
export class UtilModule implements IUtilOperations {
    readonly moduleName = CoreModuleName.UTIL;
    private initialized: boolean = false;
    private context!: DCContext;
    private utilManager!: UtilManager;
    private dcChain!: DCContext['dcChain'];
   
     
      /**
       * 初始化工具模块
       * @param context DC上下文
       * @returns 是否初始化成功
       */
     async initialize(context: DCContext): Promise<boolean> {
         try {
              this.context = context;
              this.utilManager = new UtilManager(
                context
              );
              this.initialized = true;
              return true;
            } catch (error) {
              logger.error("工具模块初始化失败:", error);
              return false;
            }

      }
    /**
     * 创建对称密钥
     * @returns 对称密钥
     */
    createSymmetricKey(): SymmetricKey {
        return SymmetricKey.new();
    }

    /**
     * 创建threaddb密钥
     * @returns 线程密钥
     */
    createThreadKey(): ThreadKey {
        // 生成一个新的密钥，包含两个对称密钥
        return  new ThreadKey(SymmetricKey.new(),SymmetricKey.new()); 
    }


    /**
         * 设置应用信息,发布应用时调用  
         * @param appId string 应用ID
         * @param domain 
         * @param owner 
         * @param rewarder 
         */
    async setAppInfo(appId: string,domain:string,owner?: string,rewarder?: string): Promise<[boolean|null, Error | null]> {
        if (!this.initialized) {
            return [null, new Error("UtilModule not initialized")];
        }
        
        try {
            if (!appId ) {
                throw new Error("appId are required");
            }
              if(!this.context.publicKey || !this.context.ethAddress){
                  throw  Errors.NO_USER_INFO;
                }
                if (!owner || owner.length < 10) {
                     owner = this.context.publicKey.string();
                }
                if (!rewarder || rewarder.length < 10) {
                    rewarder = this.context.ethAddress;
                }
            const [appInfo, error] = await  this.getAppInfo(appId);
            if (appInfo && !error) {
               if (appInfo.owner == owner && appInfo.rewarder == rewarder && appInfo.domain == domain) {//已经与之前一致
                    return [true, null];
                }
            }
            await this.utilManager.setAppInfo(
                appId,
                domain,
                owner,
                rewarder
            );
            // 假设保存成功
            return [true, null];
        } catch (error) {
            return [null, error as Error];
        }     
    };

    /**
   * 获取应用信息
   * @param appId 应用ID
   * @returns 应用信息
   * */
  async  getAppInfo(appId: string): Promise<[IAppInfo|null, Error | null]> {
    if (!this.initialized) {
      return [null, new Error("UtilModule not initialized")];
    }
    try {
      const appInfo = await this.utilManager.getAppInfo(appId);
      return [appInfo, null];
    } catch (error) {
      return [null, error as Error];
    }
  };
      
  /**
   * 关闭消息模块
   */
  async shutdown(): Promise<void> {
    this.initialized = false;
  }
  
}
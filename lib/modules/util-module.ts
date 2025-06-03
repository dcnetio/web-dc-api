
import { UtilInterface } from '../interfaces/util-interface';
import { SymmetricKey,Key as  ThreadKey } from '../implements/threaddb/common/key';
import { CoreModuleName } from 'lib/common/module-system';
import { DCContext } from 'lib/interfaces';
import { createLogger } from 'lib/util/logger';
const logger = createLogger("UtilModule");
export class UtilModule implements UtilInterface {
    readonly moduleName = CoreModuleName.UTIL;
    private context: DCContext;
     
      /**
       * 初始化认证模块
       * @param context DC上下文
       * @returns 是否初始化成功
       */
     async initialize(context: DCContext): Promise<boolean> {
        this.context = context;
          return true;

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
}
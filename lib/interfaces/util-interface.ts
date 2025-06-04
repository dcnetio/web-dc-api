import { SymmetricKey, Key as ThreadKey } from '../implements/threaddb/common/key';


export interface UtilInterface {
    createSymmetricKey(): SymmetricKey;
    createThreadKey(): ThreadKey;
}
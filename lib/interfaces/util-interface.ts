import { SymmetricKey, Key as ThreadKey } from '../implements/threaddb/common/key';


export interface IUtilOperations {
    createSymmetricKey(): SymmetricKey;
    createThreadKey(): ThreadKey;
}
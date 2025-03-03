import {Key as ThreadKey,LogKey} from '../key';
import { Ed25519PubKey } from "../../dc-key/ed25519";
import {ThreadToken} from './identity';


export type NewThreadOptions = {
    threadKey: ThreadKey;
    logKey: LogKey;
    token: ThreadToken;
    pubkey: Ed25519PubKey;
    blockHeight: number; // uint32 can be represented as number in TypeScript
    signature: Uint8Array; // []byte can be represented as Uint8Array in TypeScript
    vaccount: Ed25519PubKey;
};
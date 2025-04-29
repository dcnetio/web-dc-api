import { IRecord,IThreadRecord } from '../core/record'; 
import { ThreadID } from '@textile/threads-id';
import type { PeerId } from '@libp2p/interface';
import Multiaddr, { protocols } from 'multiaddr';


export const netPullingLimit = 1000; // 拉取记录数的限制

  declare type IProtocol = {
    code: number;
    size: number;
    name: string;
    resolvable: boolean | undefined;
    path: boolean | undefined;
  };

// 协议常量定义  
export const Protocol = {  
    code: 406, // 根据实际协议代码调整  
    name: 'thread', // 协议名称  
    version: "0.0.1",
    resolvable: false,
    path: false,
    size:-1
  } 
  const V = -1
export const table: Array<[number, number, string, boolean?, boolean?]> = [
  [4, 32, 'ip4'],
  [6, 16, 'tcp'],
  [33, 16, 'dccp'],
  [41, 128, 'ip6'],
  [42, V, 'ip6zone'],
  [43, 8, 'ipcidr'],
  [53, V, 'dns', true],
  [54, V, 'dns4', true],
  [55, V, 'dns6', true],
  [56, V, 'dnsaddr', true],
  [132, 16, 'sctp'],
  [273, 16, 'udp'],
  [275, 0, 'p2p-webrtc-star'],
  [276, 0, 'p2p-webrtc-direct'],
  [277, 0, 'p2p-stardust'],
  [280, 0, 'webrtc-direct'],
  [281, 0, 'webrtc'],
  [290, 0, 'p2p-circuit'],
  [301, 0, 'udt'],
  [302, 0, 'utp'],
  [400, V, 'unix', false, true],
  // `ipfs` is added before `p2p` for legacy support.
  // All text representations will default to `p2p`, but `ipfs` will
  // still be supported
  [421, V, 'ipfs'],
  // `p2p` is the preferred name for 421, and is now the default
  [421, V, 'p2p'],
  [443, 0, 'https'],
  [444, 96, 'onion'],
  [445, 296, 'onion3'],
  [446, V, 'garlic64'],
  [448, 0, 'tls'],
  [449, V, 'sni'],
  [460, 0, 'quic'],
  [461, 0, 'quic-v1'],
  [465, 0, 'webtransport'],
  [466, V, 'certhash'],
  [477, 0, 'ws'],
  [478, 0, 'wss'],
  [479, 0, 'p2p-websocket-star'],
  [480, 0, 'http'],
  [481, V, 'http-path'],
  [777, V, 'memory']
]
function createProtocol (code: number, size: number, name: string, resolvable?: any, path?: any): IProtocol {
    return {
      code,
      size,
      name,
      resolvable: Boolean(resolvable),
      path: Boolean(path)
    }
  }
// populate tables
table.forEach(row => {
  const proto = createProtocol(...row)
  if (!protocols.codes[proto.code]) {
    protocols.codes[proto.code] = proto
    protocols.names[proto.name] = proto
  }
})
if (!protocols.codes[Protocol.code]) {
    protocols.codes[Protocol.code] = Protocol;
    protocols.names[Protocol.name] = Protocol;
}
 


/**
 * Records with counters from a peer
 */
export interface PeerRecords {
  records: IRecord[];
  counter: number;
}

/**
 * Record with timestamp for sorting
 */
export interface TimestampedRecord {
  record: IRecord;
  counter: number;
  createtime: BigInt;
  logid: PeerId;

}


/**
 * Record implements IThreadRecord
 */
export class ThreadRecord implements IThreadRecord {
  constructor(
    private record: IRecord,
    private _threadID: ThreadID,
    private _logID: PeerId
  ) {}

  value(): IRecord {
    return this.record;
  }

 threadID(): ThreadID {
    return this._threadID;
  }

  logID(): PeerId {
    return this._logID;
  }
}


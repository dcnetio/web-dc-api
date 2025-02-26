// addr-info.ts  
import { peerIdFromString } from '@libp2p/peer-id' 
import { PeerId } from '@libp2p/interface';
import { PeerRecord } from '@libp2p/peer-record'  
import { multiaddr, type Multiaddr } from '@multiformats/multiaddr'  
import { CodeError } from '@libp2p/interfaces/errors'  
import { equals as uint8ArrayEquals } from 'uint8arrays'  

export interface AddrInfo {  
  peerId: PeerId  
  multiaddrs: Multiaddr[]  
}  

export class AddrInfoManager implements AddrInfo {  
  public readonly peerId: PeerId  
  public multiaddrs: Multiaddr[]  

  constructor({ peerId, multiaddrs }: AddrInfo) {  
    this.peerId = peerId  
    this.multiaddrs = multiaddrs  
  }  

  /**  
   * 验证地址有效性 (等价 Go 的 Validate 方法)  
   */  
  validate(): void {  
    if (this.peerId.type !== 'Ed25519') {  
      throw new CodeError('Only Ed25519 peer IDs are supported', 'ERR_INVALID_PEER_ID')  
    }  

    const seen = new Set<string>()  
    for (const ma of this.multiaddrs) {  
      const str = ma.toString()  
      if (seen.has(str)) {  
        //删除重复的地址
        this.multiaddrs.splice(this.multiaddrs.indexOf(ma), 1)
       continue
      }  
      seen.add(str)  

      if (ma.getPeerId() != this.peerId.toString()) {  
        throw new CodeError(`Multiaddr ${str} does not contain peer ID ${this.peerId}`, 'ERR_INVALID_MULTIADDR')  
      }  
    }  
  }  

  /**  
   * 序列化方法 (等价 Go 的 MarshalBinary)  
   */  
  marshal(): Uint8Array {  
    this.validate()  
    const record = new PeerRecord({  
      peerId: this.peerId,  
      multiaddrs: this.multiaddrs  
    })  
    return record.marshal()  
  }  

  /**  
   * 反序列化方法 (等价 Go 的 UnmarshalBinary)  
   */  
  static unmarshal(data: Uint8Array): AddrInfoManager {  
    const record = PeerRecord.createFromProtobuf(data)  
    return new AddrInfoManager({  
      peerId: record.peerId,  
      multiaddrs: record.multiaddrs  
    })  
  }  

  /**  
   * 合并地址 (等价 Go 的地址合并逻辑)  
   */  
  merge(other: AddrInfo): AddrInfoManager {  
    if (this.peerId.toString() != other.peerId.toString() ) {  
      throw new CodeError('Cannot merge different peer IDs', 'ERR_MISMATCHED_PEER_IDS')  
    }  

    const mergedAddrs = new Map<string, Multiaddr>()  
    for (const addr of [...this.multiaddrs, ...other.multiaddrs]) {  
      mergedAddrs.set(addr.toString(), addr)  
    }  

    return new AddrInfoManager({  
      peerId: this.peerId,  
      multiaddrs: Array.from(mergedAddrs.values())  
    })  
  }  

  /**  
   * 地址过滤 (类似 Go 的地址筛选逻辑)  
   */  
  filter(predicate: (ma: Multiaddr) => boolean): AddrInfoManager {  
    return new AddrInfoManager({  
      peerId: this.peerId,  
      multiaddrs: this.multiaddrs.filter(predicate)  
    })  
  }  
}  

// 使用示例  
async function exampleUsage() {  
  // 创建实例 (等价 Go 的 NewAddrInfo)  
  const peerId = await peerIdFromString('QmNnooDu5...')  
  const multiaddrs = [  
    multiaddr('/ip4/192.168.1.1/tcp/4001/p2p/' + peerId.toString())  
  ]  
  
  const addrInfo = new AddrInfoManager({ peerId, multiaddrs })  

  try {  
    // 验证地址  
    addrInfo.validate()  

    // 序列化  
    const encoded = addrInfo.marshal()  

    // 反序列化  
    const decoded = AddrInfoManager.unmarshal(encoded)  
    console.log(decoded.multiaddrs)  

    // 合并测试  
    const otherAddr = new AddrInfoManager({  
      peerId,  
      multiaddrs: [multiaddr('/ip4/10.0.0.1/tcp/4001/p2p/' + peerId.toString())]  
    })  
    const merged = addrInfo.merge(otherAddr)  
    console.log(merged.multiaddrs)  

    // 过滤测试  
    const filtered = merged.filter(ma => ma.toString().startsWith('/ip4/192'))  
    console.log(filtered.multiaddrs)  
  } catch (err) {  
    console.error('Address validation failed:', err)  
  }  
}  
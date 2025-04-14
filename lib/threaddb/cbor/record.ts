import { Context } from '../core/core';
import { IRecord } from '../core/record';
import { IThreadEvent as NetEvent, EventHeader as NetEventHeader } from '../core/event';
import { Ed25519PrivKey  as PrivKey,Ed25519PubKey as PubKey} from "../../dc-key/ed25519";
import type { PublicKey  } from '@libp2p/interface-keys' 
import { SymmetricKey } from '../common/key';
import { CID, Link } from 'multiformats/cid';
import * as dagCBOR from '@ipld/dag-cbor';
import { sha256 } from 'multiformats/hashes/sha2';
import { Node } from './node';
import { Block } from './node';
import { Event, EventFromNode,EventObj,EventHeader } from './event';
import { encodeBlock, decodeBlock } from './coding';
import { DAGCBOR } from '@helia/dag-cbor';
import { Blocks } from 'helia';
import  * as net_pb from '../pb/net_pb'
import { IPLDNode } from '../core/core';
// 记录的节点结构
interface RecordObj {
  Block: CID;
  Sig: Uint8Array;
  PubKey: Uint8Array;
  Prev?: CID;
}

// 创建记录的配置
interface CreateRecordConfig {
  Block: Node;
  Prev?: CID;
  Key: PrivKey;
  PubKey: PubKey;
  ServiceKey: SymmetricKey;
}

// 用于传输的记录协议结构
interface LogRecord {
  RecordNode: Uint8Array;
  EventNode: Uint8Array;
  HeaderNode: Uint8Array;
  BodyNode: Uint8Array;
}

/**
 * 从给定的块和日志私钥创建新记录
 * @param ctx 上下文
 * @param dag DAG服务
 * @param config 记录创建配置
 * @returns 创建的记录
 */
export async function CreateRecord(
  ctx: Context,
  dag: DAGCBOR,
  config: CreateRecordConfig
): Promise<IRecord> {
  // 序列化公钥
  const pkb =  config.PubKey.bytes();
  
  // 创建签名有效载荷
  let payload: Uint8Array;
  if (config.Prev && CID.asCID(config.Prev) !== null) {
    // 连接块CID和前一个CID的字节
    const blockBytes = config.Block.cid().bytes;
    const prevBytes = config.Prev.bytes;
    payload = new Uint8Array(blockBytes.length + prevBytes.length);
    payload.set(blockBytes);
    payload.set(prevBytes, blockBytes.length);
  } else {
    payload = pkb;
  }
  
  // 使用私钥签名
  const sig =  config.Key.sign(payload);
  
  // 创建记录对象
  const obj: RecordObj = {
    Block: config.Block.cid(),
    Sig: sig,
    PubKey: pkb,
    Prev: config.Prev
  };
  
  // 将对象打包为CBOR节点
  const bytes = dagCBOR.encode(obj);
  const hash = await sha256.digest(bytes);
  const cid = CID.createV1(dagCBOR.code, hash);
  const node = new Block(bytes,cid );
  
  // 使用服务密钥加密节点
  const coded = await encodeBlock(node, config.ServiceKey);
  
  // 如果提供了DAG服务，则添加到DAG
  if (dag) {
    await dag.add(coded);
  }
  
  // 返回Record实例
  return new Record(
    coded,
    obj,
    config.Block
  );
}

/**
 * 从给定CID获取记录
 * @param ctx 上下文
 * @param dag DAG服务
 * @param id 记录CID
 * @param key 解密密钥
 * @returns 获取的记录
 */
export async function GetRecord(
  dag: DAGCBOR,
  id: CID,
  key: SymmetricKey
): Promise<IRecord> {
  const coded = await dag.get<Node>(id);
  return RecordFromNode(coded, key);
}

/**
 * 使用给定密钥从节点解码记录
 * @param coded 编码的节点
 * @param key 解密密钥
 * @returns 解码的记录
 */
export async function RecordFromNode(
  coded: Node,
  key: SymmetricKey
): Promise<IRecord> {
   const block = new Block(coded.rawData(), coded.cid());
  // 解码节点
  const node = await decodeBlock(block, key);
  // 解析记录对象
  const obj = dagCBOR.decode<RecordObj>(node.rawData());
  // 返回Record实例
  return new Record(
    coded,
    obj
  );
}

/**
 * 从DAG服务中删除记录
 * @param ctx 上下文
 * @param blockstore 块存储
 * @param rec 要删除的记录
 */
export async function RemoveRecord(
  blockstore: Blocks,
  rec: IRecord
): Promise<void> {
  await blockstore.delete(rec.cid());
}

/**
 * 将记录转换为用于传输的proto版本
 * 节点以加密形式发送
 * @param ctx 上下文
 * @param dag DAG服务
 * @param rec 记录
 * @returns proto记录
 */
export async function RecordToProto(
  ctx: Context,
  dag: DAGCBOR,
  rec: IRecord
): Promise<net_pb.net.pb.Log.Record> {
  const block = await rec.getBlock( dag);
  let event: NetEvent;
  if (block instanceof Event) {
    event = block;
  } else {
    event = await EventFromNode(block as Node);
  }
  const header = await event.getHeader( dag);
  const body = await event.getBody(dag);
  const record = new net_pb.net.pb.Log.Record();
  record.recordNode = rec.data();
  record.eventNode = event.data();
  record.headerNode = header.data();
  record.bodyNode = body.data();
  return record;
}

/**
 * 从包含链接数据的序列化版本返回节点
 * @param rec proto记录
 * @param key 解密密钥
 * @returns 记录
 */
export async function RecordFromProto(
  rec: net_pb.net.pb.Log.Record,
  key: SymmetricKey
): Promise<IRecord> {
  if (!key) {
    throw new Error("解密密钥是必需的");
  }

  // 解码各个节点
  const rnode =  dagCBOR.decode<Node>(rec.recordNode);
  const enode =  dagCBOR.decode<Node>(rec.eventNode);
  const hnode =  dagCBOR.decode<Node>(rec.headerNode);
  const body =  dagCBOR.decode<Node>(rec.bodyNode);
  
  // 解密记录节点
  const rBlock = new Block(rnode.rawData(), rnode.cid());
  const decoded = await decodeBlock(rBlock, key);
  const robj = dagCBOR.decode<RecordObj>(decoded.data());
  
  // 解析事件对象
  const eBlock = new Block(enode.rawData(), enode.cid());
  const eobj = dagCBOR.decode<EventObj>(eBlock.data());
  
  const eventHeader = new EventHeader(hnode);
  // 创建事件
  const event = new Event(
    enode as Node,
    eobj,
    eventHeader,
    body as Node
  );
  
  // 返回记录
  return new Record(
    rnode ,
    robj,
    event
  );
}

/**
 * 表示记录的IPLD节点
 */
export class Record implements IRecord {
  private _node: Node;
  private _obj: RecordObj;
  private _block?: IPLDNode;
  
  constructor(node: Node, obj: RecordObj, block?: IPLDNode) {
    this._node = node;
    this._obj = obj;
    this._block = block;
  }
  
  cid(): CID {
    return this._node.cid();
  }
  
  rawData(): Uint8Array {
    return this._node.rawData();
  }
  
  blockID(): CID {
    return this._obj.Block;
  }
  async getBlock( dag: DAGCBOR): Promise<IPLDNode> {
    if (this._block) {
      return this._block;
    }
    
    this._block = await dag.get(this._obj.Block);
    return this._block;
  }
  
  prevID(): CID | undefined {
    return this._obj.Prev;
  }
  
  sig(): Uint8Array {
    return this._obj.Sig;
  }
  
  pubKey(): Uint8Array {
    return this._obj.PubKey;
  }
  links(): Link[] {
    return this._node.links();
  }
size(): number {
        return this._node.size();
 }

data(): Uint8Array {
    return this._node.data();
}
  

  async verify(key: PublicKey): Promise<Error|undefined>   {
    if (!this._block) {
      return  new Error("块未加载");
    }
    
    let payload: Uint8Array;
    if (this.prevID() && CID.asCID(this.prevID()) !== null) {
      // 连接块CID和前一个CID的字节
      const blockBytes = this._block.cid().bytes;
      const prevBytes = this.prevID()!.bytes;
      payload = new Uint8Array(blockBytes.length + prevBytes.length);
      payload.set(blockBytes);
      payload.set(prevBytes, blockBytes.length);
    } else {
      payload = this.pubKey();
    }
    
    const ok = await key.verify(payload, this.sig());
    if (!ok) {
      return new Error("签名无效");
    }
  }
}
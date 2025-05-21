import {  IThreadLogInfo } from '../core/core';
import { IRecord } from '../core/record';
import { IThreadEvent as NetEvent, EventHeader as NetEventHeader } from '../core/event';
import { Ed25519PrivKey  as PrivKey,Ed25519PubKey as PubKey} from "../../../dc-key/ed25519";
import type { PublicKey  } from '@libp2p/interface-keys' 
import { SymmetricKey } from '../common/key';
import { CID, Link } from 'multiformats/cid';
import * as dagCBOR from '@ipld/dag-cbor';
import { Node, wrapObject } from './node';
import { Block } from './node';
import { Event, EventFromNode,EventObj,EventHeader } from './event';
import { encodeBlock, decodeBlock } from './coding';
import {  DAGCBOR } from '@helia/dag-cbor';
import { Blocks } from 'helia';
import {net as net_pb} from "../pb/net_pb";
import { IPLDNode } from '../core/core';
import * as cbornode from './node';
import { KeyConverter, PeerIDConverter } from '../pb/proto-custom-types';
import { decode } from 'multiformats/hashes/digest';
import { peerIdFromMultihash } from '@libp2p/peer-id';
import {multiaddr} from "@multiformats/multiaddr";
// 记录的节点结构
interface RecordObj {
  block: CID;
  sig: Uint8Array;
  pubKey: Uint8Array;
  prev?: CID;
}

// 创建记录的配置
interface CreateRecordConfig {
  block: IPLDNode;
  prev?: CID;
  key: PrivKey;
  pubKey: PubKey;
  serviceKey: SymmetricKey;
}

// 用于传输的记录协议结构
interface LogRecord {
  recordNode: Uint8Array;
  eventNode: Uint8Array;
  headerNode: Uint8Array;
  bodyNode: Uint8Array;
}

/**
 * 从给定的块和日志私钥创建新记录
 * @param ctx 上下文
 * @param dag DAG服务
 * @param config 记录创建配置
 * @returns 创建的记录
 */
export async function CreateRecord(
 bstore: Blocks,
  config: CreateRecordConfig
): Promise<IRecord> {
  // 序列化公钥
  const pkb =  await KeyConverter.publicToBytes(config.pubKey);
  
  // 创建签名有效载荷
  let payload: Uint8Array;
  if (config.prev && CID.asCID(config.prev) !== null) {
    // 连接块CID和前一个CID的字节
    const blockBytes = config.block.cid().bytes;
    const prevBytes = config.prev.bytes;
    payload = new Uint8Array(blockBytes.length + prevBytes.length);
    payload.set(blockBytes);
    payload.set(prevBytes, blockBytes.length);
  } else {
    payload = pkb;
   
  }
  
  // 使用私钥签名
  const sig =  config.key.sign(payload);
  
  // 创建记录对象
  const obj: RecordObj = {
    block: config.block.cid(),
    sig: sig,
    pubKey: pkb,
  };
  if (config.prev) {
    obj.prev = config.prev;
  }
  
   const node = await wrapObject(obj);

  // 将对象打包为CBOR节点
  // const bytes = dagCBOR.encode(obj);
  // const hash = await sha256.digest(bytes);
  // const cid = CID.createV1(dagCBOR.code, hash);
  // const node = new Block(bytes,cid );
  
  // 使用服务密钥加密节点
  const coded = await encodeBlock(node, config.serviceKey);
  

  if (bstore) {
    await bstore.put(coded.cid(), coded.data());
  }
  
  // 返回Record实例
  return new Record(
    coded,
    obj,
    config.block
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
  const blockData = await dag.get<Uint8Array>(id);
  const decrypt = await key.decrypt(blockData);
  const decoded =  dagCBOR.decode<RecordObj>(decrypt);
 // const dblock = await dag.get<Uint8Array>(decoded.block);
  const wrapedRnode = await wrapObject(blockData);
  const record = new Record(wrapedRnode, decoded);
  return record
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
 // const wrapedRnode = await  wrapObject(block);
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
 * 将日志信息转换为protobuf格式
 * @param info 日志信息
 * @returns protobuf格式的日志
 */
 export async function  logToProto(lg: IThreadLogInfo): Promise<net_pb.pb.ILog> {
  if (!lg.pubKey){
    throw new Error('Missing required fields in LogInfo: pubKey');
  }
  const publicKeyBytes =  await KeyConverter.publicToBytes(lg.pubKey);
  const lgid = lg.id.toString();
  const idBytes = PeerIDConverter.toBytes(lgid);
  const addrs = lg.addrs? lg.addrs.map(addr => addr.bytes) : [];
  // 创建protobuf日志对象
  const log: net_pb.pb.ILog = {
    ID: idBytes,
    pubKey:publicKeyBytes,
    addrs: addrs,
    head: lg.head?.id ? lg.head.id.bytes : undefined,
    counter: lg.head?.counter 
  };
  return log;
}


/**
 * 将protobuf格式的日志转换为应用格式
 * @param protoLog protobuf格式的日志
 * @returns 应用格式的日志信息
 */
export async function logFromProto(protoLog: net_pb.pb.ILog): Promise<IThreadLogInfo> {
  if (!protoLog.ID || !protoLog.pubKey) {
    throw new Error('Missing required fields in Log: ID or pubKey');
  }
  const multihash = decode(protoLog.ID);
  const id = peerIdFromMultihash(multihash);
  // 解析日志ID
  //const id =  PeerIDConverter.fromBytes(logId);
  
  // 解析公钥
  const pubKey = await KeyConverter.publicFromBytes(protoLog.pubKey);
  

  // 解析地址
  const addrs = (protoLog.addrs || []).map(addr => multiaddr(addr));
  
  // 解析头部信息
  const head = protoLog.head && protoLog.head.length > 0
    ?  CID.decode(protoLog.head)
    : undefined;
  
  // 解析计数器
  const counter = protoLog.counter
    ? Number(protoLog.counter)
    : 0;
  
  return {
    id,
    pubKey,
    addrs,
    managed: true,
    head: {
      id: head,
      counter
    }
  };
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
  bstore: Blocks,
  rec: IRecord
): Promise<net_pb.pb.Log.Record> {
  const block = await rec.getBlock( bstore);
  let event: NetEvent;
  if (block instanceof Event) {
    event = block;
  } else {
    event = await EventFromNode(block as Node);
  }
  const header = await event.getHeader( bstore);
  const body = await event.getBody(bstore);
  const record = new net_pb.pb.Log.Record();
  record.recordNode = rec.data();
  record.eventNode = event.data();
  record.headerNode = header.data();
  record.bodyNode = body.data();
  return record;
}




export async function RecordFromProto(
  rec: net_pb.pb.Log.Record,
  key: SymmetricKey
): Promise<IRecord> {
  if (!key) {
    throw new Error("解密密钥是必需的");
  }
 const encryptRec = dagCBOR.decode<Uint8Array>(rec.recordNode);
 const recData = await key.decrypt(encryptRec);
 const recObj = dagCBOR.decode<RecordObj>(recData);
 const rnode = await cbornode.decode(rec.recordNode)
 
  // 解析记录对象
  const eventNode = await cbornode.decode(rec.eventNode);
  const headerNode = await cbornode.decode(rec.headerNode);
  const bodyNode =await cbornode.decode(rec.bodyNode);
  // 解析事件对象
  const eobj = dagCBOR.decode<EventObj>(eventNode.rawData());
  
  // 创建事件头和事件
  const eventHeader = new EventHeader(headerNode);
  const event = new Event(
    eventNode,
    eobj,
    eventHeader,
    bodyNode
  );
  
  // 返回记录
  return new Record(
    rnode,
    recObj,
    event,
     
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
    return this._obj.block;
  }
  async getBlock( bstore:Blocks): Promise<IPLDNode> {
    if (this._block) {
      return this._block;
    }
    
    const data = await bstore.get(this._obj.block);
    this._block = await cbornode.wrapObject(data);
    return this._block;
  }
  
  prevID(): CID | undefined {
    return this._obj.prev;
  }
  
  sig(): Uint8Array {
    return this._obj.sig;
  }
  
  pubKey(): Uint8Array {
    return this._obj.pubKey;
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
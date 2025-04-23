import { Context } from '../core/core';
import { IThreadEvent as NetEvent, EventHeader as NetEventHeader } from '../core/event';
import {  IRecord } from '../core/record';
import { SymmetricKey } from '../common/key'
import { CID } from 'multiformats/cid';
import * as dagCBOR from '@ipld/dag-cbor';
import { sha256 } from 'multiformats/hashes/sha2';
import {  Format } from 'interface-ipld-format';

import { encodeBlock, decodeBlock } from './coding';
import {Block,Node} from './node';  
import CID_IPLD from 'cids';
import { dagCbor ,DAGCBOR} from '@helia/dag-cbor'
import * as cbornode from './node';
import { Link } from 'multiformats/link'
import {IPLDNode} from '../core/core';
import {Blocks} from 'helia'
import { decode } from 'cbor-x';




// 注册 CBOR 类型
// TypeScript 不需要像 Go 一样的 init 函数中的注册
// dagCBOR 库会自动处理大多数类型

// 事件的节点结构
export interface EventObj {
  Body: CID;
  Header: CID;
}

// 事件头部的节点结构
interface EventHeaderObj {
  key?: Uint8Array;
}

/**
 * 创建一个新事件，包装 body 节点
 * @param dag DAG 服务
 * @param body 要封装的节点
 * @param rkey 加密密钥
 * @returns 创建的事件
 */
export async function CreateEvent(
  dag: DAGCBOR,
  body: Node,
  rkey: SymmetricKey
): Promise<NetEvent> {
  // 创建随机对称密钥
  const key = SymmetricKey.new();
  if (!body.rawData) {
    throw new Error("Node data is undefined");
  }
  const bodyBlock = new Block (body.rawData(), body.cid());
  // 使用密钥加密 body
  const codedBody = await encodeBlock(bodyBlock, key);
  
  // 序列化密钥
  const keyb = key.bytes();
  
  // 创建事件头部
  const eventHeader: EventHeaderObj = {
    key: keyb
  };

  const header = await cbornode.wrapObject(eventHeader);
  const codedHeader = await encodeBlock(header, rkey);
 
  // 创建事件对象
  const obj: EventObj = {
    Body: body.cid(),
    Header: codedHeader.cid()
  };
  
  // 包装事件对象为 CBOR 节点
  const node = await cbornode.wrapObject(obj);
  // 添加到 DAG
  if (dag) {
    await dag.add(codedHeader);
    await dag.add(codedBody);
    await dag.add(node);
  }
  
  // 返回事件
  return new Event(
    node,
    obj,
    new EventHeader(codedHeader, eventHeader),
    codedBody
  );
}

/**
 * 根据 CID 获取事件
 * @param ctx 上下文
 * @param dag DAG 服务
 * @param id 事件的 CID
 * @returns 获取的事件
 */
export async function GetEvent(
  dag: DAGCBOR,
  id: CID
): Promise<NetEvent> {
  const node = await dag.get<Node>( id);
  return EventFromNode(node);
}

/**
 * 将节点解码为事件
 * @param node 要解码的节点
 * @returns 解码后的事件
 */
export async function EventFromNode(eNode: Node): Promise<NetEvent> {
  try {
    const eventObj = eNode.toJSON();
    if (!eventObj || !eventObj.Body || !eventObj.Header) {
      throw new Error("Event object is undefined");
    }
    const obj: EventObj = {
      Body: eventObj.Body,
      Header: eventObj.Header
    };
    // 包装事件对象为 CBOR 节点
   const node = await cbornode.wrapObject(obj);
    // 返回事件
  return new Event(
    node,
    obj
  );
  } catch (err) {
    throw new Error(`Failed to decode node into event: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * 从记录中获取事件
 * @param ctx 上下文
 * @param dag DAG 服务
 * @param rec 记录
 * @returns 获取的事件
 */
export async function EventFromRecord(
  dag: DAGCBOR,
  rec: IRecord
): Promise<NetEvent> {
  try {
    const block = await rec.getBlock( dag);
    
    // 检查是否已经是 Event
    if (block instanceof Event) {
      return block;
    }
    return await EventFromNode(block as Node);
  } catch (err) {
    throw new Error(`Failed to get event from record: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * 从 DAG 服务中移除事件
 * @param ctx 上下文
 * @param dag DAG 服务
 * @param e 要移除的事件
 */
export async function RemoveEvent(
  ctx: Context,
  blockstore: Blocks,
  e: Event
): Promise<void> {
  await blockstore.delete(e.cid());
  await blockstore.delete(e.headerCID());
  await blockstore.delete(e.bodyCID());
}

/**
 * 表示事件的 IPLD 节点
 */
export class Event implements NetEvent {
  private _node: Node;
  private _obj: EventObj;
  private _header?: EventHeader ;
  private _body?: Node;
  
  constructor(
    node: Node,
    obj: EventObj,
    header?: EventHeader ,
    body?: Node 
  ) {
    this._node = node;
    this._obj = obj;
    this._header = header;
    this._body = body;
  }
  
   cid(): CID {
    return this._node.cid();
  }
  
  headerCID(): CID {
    return this._obj.Header;
  }

    
 

  async getHeader(
    dag: DAGCBOR,
    key?: SymmetricKey
  ): Promise<NetEventHeader> {
    if (!this._header) {
      const coded = await dag.get<Node>(this._obj.Header);
      this._header = new EventHeader(coded);
    }
    try{
    if (!this._header.isLoaded() && key) {
      const decoded = dagCBOR.decode<Block>(this._header.node().data()) ; 
      if (!decoded) {
        throw new Error("Failed to decode block");
      }
      const encryptedData = dagCBOR.decode<Uint8Array>(decoded._data); ;
      const data: Uint8Array =  await key.decrypt(encryptedData);
      const header = dagCBOR.decode<EventHeaderObj>(data) ;
      this._header.setObj(header);
    }
    }catch(err){
      throw new Error(`Failed to decode header: ${err instanceof Error ? err.message : String(err)}`);
    }
    
    
    return this._header;
  }
  
  bodyCID(): CID {
    return this._obj.Body;
  }
  
  async getBody(
    dag: DAGCBOR,
    key?: SymmetricKey
  ): Promise<IPLDNode> {
    let k: SymmetricKey | null = null;
    
    if (key) {
      const header = await this.getHeader( dag, key);
      k = await header.key();
    }
    
    if (!this._body) {
      this._body = await dag.get(this._obj.Body);
    }
    
    if (!k) {
      return this._body;
    } else {
      return decodeBlock(this._body, k);
    }
  }
  

  data(): Uint8Array {
    return this._node.data();
  }
  
  links(): Link[]   {
    return this._node.links();
  }
  
  size(): number {
    return this._node.size();
  }
  
  
}

/**
 * 表示事件头部的 IPLD 节点
 */
export class EventHeader implements NetEventHeader {
  private _node: Node;
  private _obj: EventHeaderObj | null;
  

  constructor(node: Node, obj: EventHeaderObj | null = null) {
    this._node = node;
    this._obj = obj;
  }
  
  isLoaded(): boolean {
    return this._obj !== null;
  }
  
  setObj(obj: EventHeaderObj): void {
    this._obj = obj;
  }
  
  node(): Node {
    return this._node;
  }

  cid(): CID {
    return this._node.cid();
  }
  links(): Link[] {
    return this._node.links();
  }
  
  async key(): Promise<SymmetricKey> {
    if (!this._obj) {
      throw new Error("EventHeader object not loaded");
    }
    
    if (!this._obj.key) {
      throw new Error("Key is undefined");
    }
    
    return SymmetricKey.fromBytes(this._obj.key);
  }

   data(): Uint8Array {
    return this._node.data();
  }
  
  
   size(): number {
    return this._node.size();
  }
}
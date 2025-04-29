// app.ts  
import EventEmitter from 'eventemitter3';
import { ThreadID } from '@textile/threads-id'
import { IThreadRecord } from './record'
import { Key as ThreadKey } from '../common/key';
import { SymKey, ThreadInfo } from './core';
import { ThreadToken } from './identity';
import { Ed25519PubKey } from '../../dc-key/ed25519';
import { INet as net_Net } from './core'
import { Context } from './core'
import { IPLDNode } from './core';
import { PeerId } from '@libp2p/interface';
import { Head } from './head';
import {net as net_pb} from "../pb/net_pb";
import { DBClient } from '../dbclient';


// 类型定义  
export type PubKey = Ed25519PubKey  
export type Token = Uint8Array

// 错误定义  
export const ErrThreadInUse = new Error('thread is in use')  
export const ErrInvalidNetRecordBody = new Error('app denied net record body')  

// 核心接口  
export interface App {  
  validateNetRecordBody( body: IPLDNode, identity: PubKey): Promise<Error | undefined>  
  handleNetRecord( rec: IThreadRecord, key?: ThreadKey): Promise<Error | undefined>  
  getNetRecordCreateTime(rec: IThreadRecord, key?: ThreadKey): Promise<BigInt>  
}  

// 本地事件总线实现  
export class LocalEventsBus {  
  private bus = new EventEmitter()  
  private static readonly busTimeout = 15000 // 15秒  

  send(event: LocalEvent): Promise<void> {  
    return new Promise((resolve, reject) => {  
      const timeout = setTimeout(() =>   
        reject(new Error('Event send timeout')), LocalEventsBus.busTimeout  
      )  
      
      this.bus.emit('event', event, () => {  
        clearTimeout(timeout)  
        resolve()  
      })  
    })  
  }  

  listen(): LocalEventListener {  
    return new LocalEventListener(this.bus)  
  }  

  discard() {  
    this.bus.removeAllListeners()  
  }  
}  

export class LocalEventListener {  
  private handler: (event: LocalEvent) => void  

  constructor(private bus: EventEmitter) {  
    this.handler = (event: LocalEvent) => this.onEvent(event)  
    bus.on('event', this.handler)  
  }  

  private onEvent(event: LocalEvent) {  
    // 处理事件  
  }  

  discard() {  
    this.bus.off('event', this.handler)  
  }  
}  

export interface LocalEvent {  
  node: IPLDNode  
  token: ThreadToken  
}  

// 网络接口  
export interface Net extends net_Net {  
  connectApp(app: App, threadId: ThreadID): Promise<Connector>

  createRecord(  
    threadId: ThreadID,  
    body: IPLDNode,  
    options?: { threadToken?: ThreadToken, apiToken?: Token }  
  ): Promise<IThreadRecord>  

  validate(  
    id: ThreadID,  
    token?: ThreadToken
  ): Promise<Ed25519PubKey |undefined>  
  exchange(id: ThreadID): Promise<void>  
  threadOffsets(tid: ThreadID): Promise<[Record<string, Head>, PeerId[]]> 
  buildGetRecordsRequest(
    tid: ThreadID,
    offsets: Record<string,Head>,
    limit: number
  ): Promise<{ req: net_pb.pb.IGetRecordsRequest, serviceKey: SymKey }> 
  updateRecordsFromPeer(tid: ThreadID,peerId: PeerId|null,client?:DBClient): Promise<void>
}  

// 连接器实现  
export class Connector {  
  public readonly token: Token
  
  constructor(  
    public net: Net,  
    private app: App,  
    private threadInfo: ThreadInfo  
  ) {  
    if (!threadInfo.key?.canRead()) {  
      throw new Error(`Read key not found for thread ${threadInfo.id}`)  
    }  
    this.token = this.generateRandomBytes(32)  
  }  

  get threadId(): ThreadID {  
    return this.threadInfo.id  
  }

  get threadKey(): ThreadKey|undefined {
    return this.threadInfo.key
  }


  // 调用 net.createRecord 并提供线程 ID 和 API 令牌
  async createNetRecord(
    body: IPLDNode, 
    token?: ThreadToken
  ): Promise<IThreadRecord> {
    return this.net.createRecord(
      this.threadId, 
      body, 
      {
        threadToken: token,
        apiToken: this.token
      }
    );
  }

  // 验证线程令牌
  async validate(
    token?: ThreadToken
  ): Promise<Error | undefined> {
    try{
      await this.net.validate( this.threadId, token);
      return 
    }catch(err){
      return err
    }
  }

  // 调用连接应用的 ValidateNetRecordBody
  async validateNetRecordBody(
    body: IPLDNode, 
    identity: PubKey
  ): Promise<Error|undefined> {
    return this.app.validateNetRecordBody( body, identity);
  }

  // 调用连接应用的 HandleNetRecord 并提供线程密钥
  async handleNetRecord(
    rec: IThreadRecord
  ): Promise<Error | undefined> {
    return this.app.handleNetRecord( rec, this.threadKey);
  }

  // 调用连接应用的 GetNetRecordCreateTime 解析记录创建时间
  async getNetRecordCreateTime(
    rec: IThreadRecord
  ): Promise<BigInt> {
    return this.app.getNetRecordCreateTime(rec, this.threadKey);
  }

  private generateRandomBytes(size: number): Uint8Array {  
    return crypto.getRandomValues(new Uint8Array(size))  
  }  
}  

// 工具函数  
export function NewConnector(  
  app: App,  
  net: Net,  
  threadInfo: ThreadInfo  
): [Connector | null, Error | null] {  
  try {  
    return [new Connector(net, app, threadInfo), null]  
  } catch (err) {  
    return [null, err as Error]  
  }  
}
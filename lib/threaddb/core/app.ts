// app.ts  
import { EventEmitter } from 'events'  
import {ThreadID} from '@textile/threads-id'
import {ThreadRecord} from './record'
import {Key as ThreadKey} from '../key';
import {ThreadInfo } from './core';
import {ThreadToken} from './identity';
import {Ed25519PubKey} from '../../dc-key/ed25519';
import {Net as net_Net} from './core'
import {Context} from './core'
import { DAGNode } from 'ipld-dag-pb';


// 类型定义  

 
export type PubKey = Ed25519PubKey  
export type Token = Uint8Array






// 错误定义  
export const ErrThreadInUse = new Error('thread is in use')  
export const ErrInvalidNetRecordBody = new Error('app denied net record body')  

// 核心接口  
export interface App {  
  validateNetRecordBody( body: DAGNode, identity: PubKey): Promise<Error | null>  
  handleNetRecord( rec: ThreadRecord, key: ThreadKey): Promise<Error | null>  
  getNetRecordCreateTime( rec: ThreadRecord, key: ThreadKey): Promise<[number, Error | null]>  
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
  node: DAGNode  
  token: ThreadToken  
}  

// 网络接口  
export interface Net extends net_Net {  

  connectApp(app:App,threadId: ThreadID): Promise<[Connector | null, Error | null]>

  createRecord(  
       
    threadId: ThreadID,  
    body: DAGNode,  
    options?: { threadToken?: ThreadToken, apiToken?: Token }  
  ): Promise<ThreadRecord>  

  validate(  
    id: ThreadID,  
    token: ThreadToken,  
    readOnly: boolean  
  ): Promise<[PubKey | null, Error | null]>  

  exchange(ctx:Context, id: ThreadID): Promise<Error | null>  
}  

// 连接器实现  
export class Connector {  
  public readonly token: Token  
  
  constructor(  
    private net: Net,  
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

  async createNetRecord(  
      
    body: DAGNode,  
    token: ThreadToken  
  ): Promise<[ThreadRecord | null, Error | null]> {  
    try {  
      const rec = await this.net.createRecord( this.threadId, body, {  
        threadToken: token,  
        apiToken: this.token  
      })  
      return [rec, null]  
    } catch (err) {  
      return [null, err as Error]  
    }  
  }  

  async validate(token: ThreadToken, readOnly: boolean): Promise<Error | null> {  
    const [_, err] = await this.net.validate(this.threadId, token, readOnly)  
    return err  
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
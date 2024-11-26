
import type { Libp2p } from 'libp2p'
import { HTTP2Parser } from './dc-http2/parser';
import {StreamWriter} from './dc-http2/stream'
import { Http2Frame } from './dc-http2/frame';
import  type { Stream } from '@libp2p/interface';
import { HPACK} from './dc-http2/hpack'

import type {Multiaddr} from '@multiformats/multiaddr'


console.log("ASDDSDS")


class StreamManager {  
    currentStreamId: number;

    constructor() {  
      this.currentStreamId = 1; // 从 1 开始，以模拟奇数 ID  
    }  

    getNextAppLevelStreamId() {  
      const id = this.currentStreamId;  
      this.currentStreamId += 2; // 确保奇数步进  
      return id;  
    }  
  } 


export class Libp2pGrpcClient {
    node: Libp2p;
    protocol: string;
    steamManager: StreamManager;
    peerAddr: Multiaddr;
    token: string;


    constructor(node:Libp2p,peerAddr:Multiaddr,token:string,protocol?:string) {
        this.node = node
        this.peerAddr = peerAddr
        if (protocol) {
            this.protocol = protocol
        }else{
             this.protocol = '/dc/thread/0.0.1'
        }
        this.steamManager = new StreamManager()
        this.token = token
    }  

    setToken(token:string) {
        this.token = token
    }
    

    async unaryCall(method:string, requestData:Uint8Array,timeout:number): Promise<Uint8Array> {  
        let stream:Stream|null = null
        let responseData: Uint8Array | null = null
        const hpack = new HPACK()
        let exitFlag = false
        let errMsg = ''
        try {
           
           // const stream = await this.node.dialProtocol(this.peerAddr, this.protocol)
            const connection = await this.node.dial(this.peerAddr)
            stream = await connection.newStream(this.protocol)
            const streamId = this.steamManager.getNextAppLevelStreamId()
            const writer = new StreamWriter(stream.sink)  
            const parser = new HTTP2Parser();  
            
            parser.onData = (payload,frameHeader) => {//接收数据
                responseData = payload.subarray(5) 
            }
            parser.onSettings = () => {//接收settings,反馈ack
                console.log('Settings received')
                const ackSettingFrame = Http2Frame.createSettingsAckFrame()
                writer.write(ackSettingFrame)
            }
            parser.onHeaders = (headers,header) => {
                const plainHeaders = hpack.decodeHeaderFields(headers)
                console.log('Received headers:', plainHeaders);
                if (plainHeaders.get('grpc-status') === '0') {
                    console.log('gRPC call success')
                } else if (plainHeaders.get('grpc-status') !== undefined) {
                    exitFlag = true
                    errMsg = plainHeaders.get('grpc-message') || 'gRPC call failed'
                }
            }
            parser.processStream(stream);
            // 握手
            const preface = Http2Frame.createPreface();  
            await writer.write(preface)
            // 发送Settings请求
            const settingFrme = Http2Frame.createSettingsFrame()
            await writer.write(settingFrme)
            await parser.waitForSettingsAck()
            // 创建头部帧
            const headerFrame = Http2Frame.createHeadersFrame( streamId,method,true,this.token)
            await writer.write(headerFrame)
            // 创建数据帧
            const dataFrame = Http2Frame.createDataFrame( streamId,requestData, true)
            // 发送请求
            await writer.write(dataFrame)
            // 等待responseData 不为空,或超时
            await new Promise((resolve, reject) => {
                const t = setTimeout(() => {
                    reject(new Error('gRPC response timeout'))
                }, timeout)
                const checkResponse = () => {
                    if (responseData || exitFlag) {
                        clearTimeout(t)
                        resolve(responseData)
                    } else {
                        setTimeout(checkResponse, 50)
                    }
                }
                checkResponse()
            })
            await writer.end()
        } catch (err) {
            console.error('unaryCall error:', err)
            throw err
        }finally{
            if (stream) {
                stream.close()
            }
        }
        if (exitFlag) {
            throw new Error(errMsg)
        }
        if (!responseData) {
           responseData = new Uint8Array()
        }
        return responseData
    }
    
    async  Call(   
        method: string,  
        requestData: Uint8Array,  
        timeout: number,  
        mode: 'unary' | 'server-streaming' | 'client-streaming' | 'bidirectional', 
        onDataCallback: (payload: Uint8Array) => void,  
        dataSourceCallback?: () => AsyncIterable<Uint8Array>,
        onEndCallback?: () => void,  
        onErrorCallback?: (error: unknown) => void,    
      ): Promise<void> {  
        const timeoutPromise = new Promise<never>((_, reject) =>  
          setTimeout(() => reject(new Error('Operation timed out')), timeout)  
        );  
        let exitFlag = false;
        let errMsg = '';
        const hpack = new HPACK()
        const operationPromise = (async () => {  
          let stream: Stream | null = null;
          try {  
            const connection = await this.node.dial(this.peerAddr)
            stream = await connection.newStream(this.protocol)
            const streamId = this.steamManager.getNextAppLevelStreamId();  
            const writer = new StreamWriter(stream.sink);  
            const parser = new HTTP2Parser();  
      
            // Define the onData method to utilize the provided callback  
            parser.onData = async (payload, frameHeader): Promise<void> => {  
              try {  
                onDataCallback(payload.subarray(5));  
              } catch (error: unknown) {  
                console.error('Error processing data:', error);  
                if (onErrorCallback) {  
                  onErrorCallback(error);  
                } else {  
                  throw error;  
                }  
              }  
            };  
            parser.onSettings = () => {//接收settings,反馈ack
                console.log('Settings received')
                const ackSettingFrame = Http2Frame.createSettingsAckFrame()
                writer.write(ackSettingFrame)
            }
            parser.onHeaders = (headers,header) => {
                const plainHeaders = hpack.decodeHeaderFields(headers)
                console.log('Received headers:', plainHeaders);
                if (plainHeaders.get('grpc-status') === '0') {
                    console.log('gRPC call success')
                } else if (plainHeaders.get('grpc-status') !== undefined) {
                    exitFlag = true
                    errMsg = plainHeaders.get('grpc-message') || 'gRPC call failed'
                }
            }
            parser.processStream(stream);  
            // Handshake - send HTTP/2 preface  
            const preface = Http2Frame.createPreface();  
            await writer.write(preface);  
      
            // Send Settings request  
            const settingFrame = Http2Frame.createSettingsFrame();  
            await writer.write(settingFrame);  
            // Wait for the acknowledgement of SETTINGS  
            await parser.waitForSettingsAck();  
            // Send Settings ACK  
            const ackSettingFrame = Http2Frame.createSettingsAckFrame();  
            await writer.write(ackSettingFrame);  
           
      
            // Create header frame  
            const headerFrame = Http2Frame.createHeadersFrame(streamId, method, true,this.token);  
            if (mode === 'unary' || mode === 'server-streaming') {  
              const dataFrame = Http2Frame.createDataFrame(streamId,requestData,  true);  
              await writer.write(new Uint8Array([...headerFrame, ...dataFrame]));  
            } else if ((mode === 'client-streaming' || mode === 'bidirectional') && dataSourceCallback) {  
              await writer.write(headerFrame);  
              if (requestData.length > 0) {
                const dataFrame = Http2Frame.createDataFrame(streamId,requestData,  false); 
                await writer.write(dataFrame);
            }
              for await (const chunk of dataSourceCallback()) {  
                const dataFrame = Http2Frame.createDataFrame( streamId,chunk, false);  
                await writer.write(dataFrame);  
              }  
              const finalFrame = Http2Frame.createDataFrame(streamId,new Uint8Array(),  true);  
              await writer.write(finalFrame);  
              await writer.end()
            }  
            if (onEndCallback) {  
              await parser.waitForEndOfStream(0);  
              onEndCallback();  
            }  
          } catch (err: unknown) {  
            if (onErrorCallback) {  
              onErrorCallback(err);  
            } else {  
              if (err instanceof Error) {  
                console.error('asyncCall error:', err.message);  
              } else {  
                console.error('asyncCall error:', err);  
              }  
            }  
          } finally {
            if (stream) {
                stream.close()
            }
          } 
        })();  
        return Promise.race([operationPromise, timeoutPromise]);  
      }    
      
}


   

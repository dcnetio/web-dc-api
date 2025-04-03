import { Libp2p } from "@libp2p/interface";
import { CID } from 'multiformats/cid';
import {multiaddr} from '@multiformats/multiaddr'
import { Uint8ArrayList } from 'uint8arraylist'; 
import {StreamWriter } from 'grpc-libp2p-client/dc-http2/stream'
import { Http2Frame } from 'grpc-libp2p-client/dc-http2/frame';
 import  * as net_pb from './pb/net_pb'
 import { HTTP2Parser } from "grpc-libp2p-client/dc-http2/parser";
import { HPACK } from "grpc-libp2p-client/dc-http2/hpack";
import { keys } from "@libp2p/crypto";
import {   
    PeerIDConverter,  
    MultiaddrConverter,  
    CidConverter,  
    ThreadIDConverter,  
    KeyConverter,  
    ProtoKeyConverter,
    json,  
    ProtoPeerID
  } from './pb/proto-custom-types' 
export class DCGrpcServer {
    constructor(private libp2p: Libp2p, private protocol: string) {}
  
    start() {
      this.libp2p.handle(this.protocol, async ({ stream }) => {
        try {
             let exitFlag = false
        let errMsg = ''
            const hpack = new HPACK()
          console.log(
            "Received a request on %s protocol, streamId: %s",
            this.protocol,
            stream.id
          );
          //生成number的streamId
          
        
          let method = "";
          const writer =  new StreamWriter(stream.sink) 
          const http2Parser = new HTTP2Parser(writer)
          http2Parser.onData = async (payload, frameHeader) => {
            const requestData = payload.subarray(5) // 去除帧头部分
            if (method === "/net.pb.Service/GetLogs") {
                this.getLogs(frameHeader.streamId,requestData,writer)
            }
            
          };
            http2Parser.onSettings = async () => {
                console.log('Settings received')
                const ackSettingFrame = Http2Frame.createSettingsAckFrame()
                writer.write(ackSettingFrame)
            };
            http2Parser.onHeaders = (headers,header) => {
                const plainHeaders = hpack.decodeHeaderFields(headers)
                console.log('Received headers:', plainHeaders);
                method = plainHeaders.get(':path')
            }

          http2Parser.processStream(stream)
        } catch (err) {
          console.error("Error handling request:", err);
        }
      });
    }
  
    _parseFrameHeader(buffer: Uint8Array) {
        const length = (buffer[0] << 16) | (buffer[1] << 8) | buffer[2];
        const type = buffer[3];
        const flags = buffer[4];
        const streamId =
          (buffer[5] << 24) | (buffer[6] << 16) | (buffer[7] << 8) | buffer[8];
    
        return {
          length,
          type,
          flags,
          streamId,
          payload: buffer.slice(0, 9),
        };
      }
      
  
    private async getLogs(streamId: number,request: any,writer: StreamWriter): Promise<any> {
        console.log('Received GetLogs request')
        const req = net_pb.net.pb.GetLogsRequest.decode(request)
        if (req.body?.threadID) {
            const threadId = ThreadIDConverter.fromBytes(req.body?.threadID)
            console.log('Thread ID:', threadId.toString())
        }
        if (req.body?.serviceKey) {
            const serviceKey = ProtoKeyConverter.fromBytes(req.body?.serviceKey)
            console.log('Service Key:', serviceKey.toString())
        }
       const response = new net_pb.net.pb.GetLogsReply()
       const keyPair = await keys.generateKeyPair("Ed25519");
        
           // 获取公钥
        const publicKey = keyPair.publicKey;
        const pid = this.libp2p.peerId.toString()
      // const headBytes  = new TextEncoder().encode("bafybeiai3u5rmdsbmqklo7icdn3x5suoyepu2mqms3vgj4rvnkuyjnivmy")
        const head = CID.parse("bafybeiai3u5rmdsbmqklo7icdn3x5suoyepu2mqms3vgj4rvnkuyjnivmy")
        const addr = MultiaddrConverter.toBytes(multiaddr('/ip4/10.0.0.1/tcp/4001/p2p/'+pid))
        let pubkeyBytes = await KeyConverter.publicToBytes(publicKey)
        const addrs: Uint8Array[] = []
        addrs.push(addr)
       
       const log = new net_pb.net.pb.Log({
        /** Log ID */
        ID: PeerIDConverter.toBytes(pid as ProtoPeerID),

        /** Log pubKey */
        pubKey: pubkeyBytes,

        /** Log addrs */
        addrs: addrs,

        /** Log head */
        head: CidConverter.toBytes(head),

        /** Log counter */
        counter: 0,
    })
    
    response.logs.push(log)
    const headlist = { 
        ':status': '200',
        'content-type': 'application/grpc',
        'grpc-status': '0', // 表示成功
    }
    // 设置响应头部
    const headerResponseFrame = Http2Frame.createResponseHeadersFrame(streamId, headlist,true)
    writer.write(headerResponseFrame)
     // 创建数据帧
     const bytes =  net_pb.net.pb.GetLogsReply.encode(response).finish()
     const dataFrame = Http2Frame.createDataFrame( streamId,bytes, false)
     writer.write(dataFrame)
     //发送tailer
     const trailers = {
        ':status': '200',
        'content-type': 'application/grpc',
        'grpc-status': '0', // 表示成功
        'grpc-message': 'Operation completed successfully'
    };
    const trailersFrame = Http2Frame.createTrailersFrame(streamId, trailers);
    console.log('Trailers Frame:', trailersFrame);
    writer.write(trailersFrame)
      return 
    }
  
    private async sendGrpcResponse(response: any, writer: StreamWriter) {
      const responseBuffer = new TextEncoder().encode(JSON.stringify(response));
      await writer.write(responseBuffer);
    }
  
    private async sendGrpcError(error: Error, writer: StreamWriter) {
      const errorBuffer = new TextEncoder().encode(
        JSON.stringify({ error: error.message })
      );
      await writer.write(errorBuffer);
    }
  
    private parseGrpcRequest(buffer: Uint8Array) {
        const decoder = new TextDecoder();
      
        // HTTP/2 帧头部解析
        if (buffer.length < 9) {
          throw new Error("Incomplete HTTP/2 frame");
        }
      
        const length = (buffer[0] << 16) | (buffer[1] << 8) | buffer[2]; // 帧长度
        const type = buffer[3]; // 帧类型
        const flags = buffer[4]; // 帧标志
        const streamId = (buffer[5] << 24) | (buffer[6] << 16) | (buffer[7] << 8) | buffer[8]; // 流 ID
      
        if (buffer.length < 9 + length) {
          throw new Error("Incomplete HTTP/2 frame payload");
        }
      
        const payload = buffer.slice(9, 9 + length); // 提取帧的有效载荷
      
        // 检查帧类型是否为 HEADERS 或 DATA（根据 HTTP/2 协议）
        if (type !== 0x01 && type !== 0x00) {
          throw new Error(`Unsupported HTTP/2 frame type: ${type}`);
        }
      
        // 解析 HTTP/2 头部
        const headers = this.parseHttp2Headers(payload);
      
        // 提取 gRPC 方法名
        const method = headers[":path"] || "UnknownMethod";
      
        // 提取 gRPC 请求体
        const headerLength = this.calculateHeaderLength(headers); // 计算头部长度
        const body = payload.slice(headerLength); // 提取请求体
      
        return { method, headers, body };
      }
      
      /**
       * 计算 HTTP/2 头部的长度
       * @param headers HTTP/2 头部对象
       * @returns 头部长度
       */
      private calculateHeaderLength(headers: Record<string, string>): number {
        // 模拟计算头部长度（实际需要根据 HPACK 解码的结果计算）
        let length = 0;
        for (const key in headers) {
          length += key.length + headers[key].length + 2; // 假设每个键值对有 2 字节的长度字段
        }
        return length;
      }
      
      /**
       * 模拟解析 HTTP/2 头部
       * @param payload HTTP/2 帧的有效载荷
       * @returns 解析后的头部对象
       */
      private parseHttp2Headers(payload: Uint8Array): Record<string, string> {
        const decoder = new TextDecoder();
        const headers: Record<string, string> = {};
      
        // 假设头部是简单的键值对（实际需要根据 HPACK 解码）
        let offset = 0;
        while (offset < payload.length) {
          const keyLength = payload[offset++];
          const key = decoder.decode(payload.slice(offset, offset + keyLength));
          offset += keyLength;
      
          const valueLength = payload[offset++];
          const value = decoder.decode(payload.slice(offset, offset + valueLength));
          offset += valueLength;
      
          headers[key] = value;
        }
      
        return headers;
      }
  
    private concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
      const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
      }
      return result;
    }
  
    private isHttp2Preface(buffer: Uint8Array): boolean {
      const PREFACE = new TextEncoder().encode("PRI * HTTP/2.0\r\n\r\nSM\r\n\r\n");
      if (buffer.length < PREFACE.length) return false;
      for (let i = 0; i < PREFACE.length; i++) {
        if (buffer[i] !== PREFACE[i]) return false;
      }
      return true;
    }
  
    private isHttp2SettingsFrame(buffer: Uint8Array): boolean {
      return buffer.length >= 9 && buffer[3] === 0x04;
    }
  
    private isHttp2SettingsAckFrame(buffer: Uint8Array): boolean {
      // HTTP/2 SETTINGS ACK 帧的类型为 0x04，且标志位为 0x01
      return buffer.length >= 9 && buffer[3] === 0x04 && buffer[4] === 0x01;
    }
  
    private async sendHttp2Settings(writer: StreamWriter) {
      const settingsFrame = this.createHttp2SettingsFrame();
      await writer.write(settingsFrame);
      console.log("HTTP/2 SETTINGS frame sent");
    }
  
    private async sendHttp2SettingsAck(writer: StreamWriter) {
      const ackFrame = this.createHttp2SettingsAckFrame();
      await writer.write(ackFrame);
      console.log("HTTP/2 SETTINGS ACK frame sent");
    }
  
    private createHttp2SettingsFrame(): Uint8Array {
      const settings = new Uint8Array(9 + 6);
      settings[3] = 0x04;
      settings[4] = 0x00;
      settings[8] = 0x00;
  
      settings[9] = 0x00;
      settings[10] = 0x03;
      settings[11] = 0x00;
      settings[12] = 0x00;
      settings[13] = 0x00;
      settings[14] = 0x10;
  
      return settings;
    }
  
    private createHttp2SettingsAckFrame(): Uint8Array {
      const ack = new Uint8Array(9);
      ack[3] = 0x04;
      ack[4] = 0x01;
      ack[8] = 0x00;
      return ack;
    }
  }
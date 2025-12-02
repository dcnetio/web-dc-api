import { Libp2p } from "@libp2p/interface";
import { CID } from 'multiformats/cid';
import {multiaddr} from '@multiformats/multiaddr'
import {StreamWriter } from 'grpc-libp2p-client/dc-http2/stream'
import { Http2Frame } from 'grpc-libp2p-client/dc-http2/frame';
 import  * as net_pb from '../pb/net_pb'
 import { HTTP2Parser } from "grpc-libp2p-client/dc-http2/parser";
import { HPACK } from "grpc-libp2p-client/dc-http2/hpack";
import { keys } from "@libp2p/crypto";
import {   
    PeerIDConverter,  
    MultiaddrConverter,  
    CidConverter,  
    ThreadIDConverter,  
    KeyConverter,  
    ProtoKeyConverter
  } from '../pb/proto-custom-types' 
import { Net } from '../core/app';
import { ThreadID } from '@textile/threads-id';

export class DCGrpcServer {
    private net: Net | undefined;
    constructor(private libp2p: Libp2p, private protocol: string) {}
  
    setNetwork(net: Net) {
        this.net = net;
    }

    start() {
      this.libp2p.handle(this.protocol, async ({ stream }) => {
        try {
          const hpack = new HPACK()
          //生成number的streamId
          let method = "";
          const writer =  new StreamWriter(stream.sink) as any;
          const http2Parser = new HTTP2Parser(writer)
          http2Parser.onData = async (payload, frameHeader) => {
            const requestData = payload.subarray(5) // 去除帧头部分
            if (method === "/net.pb.Service/GetLogs") {
                this.getLogs(frameHeader.streamId,requestData,writer)
            }
            
          };
            http2Parser.onSettings = async () => {
                const ackSettingFrame = Http2Frame.createSettingsAckFrame()
                writer.write(ackSettingFrame)
            };
            http2Parser.onHeaders = (headers,header) => {
                const plainHeaders = hpack.decodeHeaderFields(headers)
                method = plainHeaders.get(':path')
            }

          http2Parser.processStream(stream)
        } catch (err) {
          console.error("Error handling request:", err);
        }
      });
    }

    stop() {
      this.libp2p.stop()
    }
  
    _parseFrameHeader(buffer: Uint8Array) {
        if (buffer.length < 9) {
          throw new Error("Invalid frame header length");
        }
        const length = (buffer[0]! << 16) | (buffer[1]! << 8) | buffer[2]!;
        const type = buffer[3];
        const flags = buffer[4];
        const streamId =
          (buffer[5]! << 24) | (buffer[6]! << 16) | (buffer[7]! << 8) | buffer[8]!;
    
        return {
          length,
          type,
          flags,
          streamId,
          payload: buffer.slice(0, 9),
        };
      }
      
  
     async getLogs(streamId: number,request: any,writer: any): Promise<any> {
        console.log('Received GetLogs request')
        const req = net_pb.net.pb.GetLogsRequest.decode(request)
        let threadId: ThreadID | undefined;
        if (req.body?.threadID) {
            const threadIdStr = ThreadIDConverter.fromBytes(req.body?.threadID)
            threadId = ThreadID.fromString(threadIdStr)
            console.log('Thread ID:', threadId.toString())
        }
        if (req.body?.serviceKey) {
            const serviceKey = ProtoKeyConverter.fromBytes(req.body?.serviceKey)
            console.log('Service Key:', serviceKey.toString())
        }

        if (!this.net) {
            console.error("Network not set");
            return;
       }
       
       if (!threadId) {
            console.error("Thread ID missing");
            return;
       }

       const [logs, _] = await this.net.getPbLogs(threadId);

       const response = new net_pb.net.pb.GetLogsReply()
       response.logs = logs;
       
    const headlist = { 
        ':status': '200',
        'content-type': 'application/grpc'
    }
    // 设置响应头部
    const headerResponseFrame = Http2Frame.createResponseHeadersFrame(streamId, headlist,true)
    await writer.write(headerResponseFrame)
     // 创建数据帧
    const bytes =  net_pb.net.pb.GetLogsReply.encode(response).finish()
    const dataFrame = Http2Frame.createDataFrame( streamId,bytes, false)
    await writer.write(dataFrame);

     //发送tailer
     const trailers = {
        'grpc-status': '0', // 表示成功
        'grpc-message': 'Operation completed successfully'
    };
    const trailersFrame = Http2Frame.createTrailersFrame(streamId, trailers);
    console.log('Trailers Frame:', trailersFrame);
    await writer.write(trailersFrame)
    await writer.end()
      return 
    }

    


  }
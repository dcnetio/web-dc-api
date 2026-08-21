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

const isExpectedInboundStreamClosure = (error: unknown): boolean => {
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message : String(error || "");
  return (
    name === "TimeoutError" ||
    name === "AbortError" ||
    /(?:signal|operation|stream).*timed?\s*out|aborted|stream.*closed|closed.*stream/i.test(
      `${name} ${message}`
    )
  );
};

async function* normalizeInboundStream(source: AsyncIterable<unknown>) {
  try {
    for await (const chunk of source) {
      yield chunk;
    }
  } catch (error) {
    // Inbound diagnostic streams are routinely closed by timeout/abort when
    // the remote side goes away. End them normally so the parser can clean up
    // without producing an unhandled rejection in the host application.
    if (isExpectedInboundStreamClosure(error)) {
      const message = error instanceof Error ? error.message : String(error);
      console.debug("Inbound DC stream closed:", message);
      return;
    }
    throw error;
  }
}

export class DCGrpcServer {
    private net: Net | undefined;
    constructor(private libp2p: Libp2p, private protocol: string) {}
  
    setNetwork(net: Net) {
        this.net = net;
    }

    start() {
      this.libp2p.handle(this.protocol, async (data: any) => {
        try {
          // 兼容不同的 handler 签名 (data.stream 或 data 本身是 stream)
          let stream: any = data;
          if (data && data.stream) {
              stream = data.stream;
          }

          if (!stream) {
              console.warn("Stream is undefined in handle callback", data);
              return;
          }
          const hpack = new HPACK()
          //生成number的streamId
          let method = "";
          
          // 兼容新版 libp2p, stream 可能本身就是 sink/source，或者没有 .sink/.source 属性
          const sink = stream.sink || stream;
          const source = stream.source || stream;

          const writer =  new StreamWriter(sink) as any;
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

          await http2Parser.processStream(normalizeInboundStream(source) as any)
        } catch (err) {
          console.warn("Error handling request:", err);
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
            console.warn("Network not set");
            return;
       }
       
       if (!threadId) {
            console.warn("Thread ID missing");
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

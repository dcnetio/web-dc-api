import { Libp2p } from "@libp2p/interface";
import { CID } from 'multiformats/cid';
import {multiaddr} from '@multiformats/multiaddr'
import { Uint8ArrayList } from 'uint8arraylist'; 
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
    ProtoKeyConverter,
    json,  
    ProtoPeerID
  } from '../pb/proto-custom-types' 
export class DCGrpcServer {
    constructor(private libp2p: Libp2p, private protocol: string) {}
  
    start() {
      this.libp2p.handle(this.protocol, async ({ stream }) => {
        try {
          const hpack = new HPACK()
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
      
  
     async getLogs(streamId: number,request: any,writer: StreamWriter): Promise<any> {
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
    for (var i = 0; i < 5000; i++) {//模拟5000个log信息,测试大数据grpc请求是否正常
        response.logs.push(log)
    }
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
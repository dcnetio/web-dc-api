import { Libp2p } from "@libp2p/interface";
import { Uint8ArrayList } from 'uint8arraylist'; 
import {StreamWriter } from '../file/streamwriter'

export class DCGrpcServer {
    constructor(private libp2p: Libp2p, private protocol: string) {}
  
    start() {
      this.libp2p.handle(this.protocol, async ({ stream }) => {
        try {
          console.log(
            "Received a request on %s protocol, streamId: %s",
            this.protocol,
            stream.id
          );
          const writer =  new StreamWriter(stream.sink) 
  
          let state = "PREFACE"; // 初始状态为等待 PREFACE 帧
          let requestBuffer = new Uint8Array(0); // 用于存储接收到的数据
  
          for await (const chunk of stream.source) {
            const data =
              chunk instanceof Uint8ArrayList ? chunk.subarray() : chunk;
  
            // 将新接收到的数据追加到 requestBuffer
            requestBuffer = this.concatUint8Arrays([requestBuffer, data]);
  
            while (requestBuffer.length > 0) {
              // 检测 SETTINGS ACK 帧，无论当前状态为何
              if (requestBuffer.length >= 9 && this.isHttp2SettingsAckFrame(requestBuffer)) {
                console.log("Received HTTP/2 SETTINGS ACK frame");
                requestBuffer = requestBuffer.slice(9); // 移除已处理的 SETTINGS ACK 帧
                continue;
              }
  
              if (state === "PREFACE" && requestBuffer.length >= 24) {
                if (this.isHttp2Preface(requestBuffer)) {
                  console.log("Received HTTP/2 PREFACE frame");
                  await this.sendHttp2Settings(writer);
                  state = "SETTINGS"; // 切换到等待 SETTINGS 帧的状态
                  requestBuffer = requestBuffer.slice(24); // 移除已处理的 PREFACE 帧
                  continue;
                } else {
                  throw new Error("Invalid HTTP/2 PREFACE frame");
                }
              }
  
              if (state === "SETTINGS" && requestBuffer.length >= 9) {
                if (this.isHttp2SettingsFrame(requestBuffer)) {
                  console.log("Received HTTP/2 SETTINGS frame");
                  await this.sendHttp2SettingsAck(writer);
                  state = "READY"; // 切换到准备处理 gRPC 请求的状态
                  requestBuffer = requestBuffer.slice(9); // 移除已处理的 SETTINGS 帧
                  continue;
                } else {
                  throw new Error("Invalid HTTP/2 SETTINGS frame");
                }
              }
  
              if (state === "READY") {
                // 假设 gRPC 请求的最小长度为 5 字节（根据实际协议调整）
                if (requestBuffer.length >= 5) {
                  await this.handleGrpcRequest(requestBuffer, writer);
                  requestBuffer = new Uint8Array(0); // 假设整个请求已处理完
                }
              }
  
              break; // 如果没有匹配的帧类型，退出循环等待更多数据
            }
          }
        } catch (err) {
          console.error("Error handling request:", err);
        }
      });
    }
  
    private async handleGrpcRequest(requestBuffer: Uint8Array,writer: StreamWriter) {
      try {
        const { method, headers, body } = this.parseGrpcRequest(requestBuffer);
  
        if (method === "GetLogs") {
          const response = await this.getLogs(body);
          await this.sendGrpcResponse(response, writer);
        } else {
          throw new Error(`Unknown gRPC method: ${method}`);
        }
      } catch (err) {
        console.error("Error parsing gRPC request:", err);
        await this.sendGrpcError(err, writer);
      }
    }
  
    private async getLogs(request: any): Promise<any> {
      return {
        logs: [
          { id: "1", message: "Log 1" },
          { id: "2", message: "Log 2" },
        ],
      };
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
      const headers = {}; // 模拟解析 HTTP/2 头部
      const body = decoder.decode(buffer.slice(5)); // 假设前 5 个字节是头部
      const method = "GetLogs"; // 模拟解析方法名
      return { method, headers, body };
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
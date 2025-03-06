import { Libp2pGrpcClient } from "grpc-libp2p-client";
import type { Client } from "../dcapi";
import { dcnet } from "../proto/dcnet_proto";
import { DataSource } from "../proto/datasource";

const uploadStatus = {
  OK: 0,
  ENCRYPTING: 1, // 加密中
  UPLOADING: 2, // 上传中
  ERROR: 3,
  ABNORMAL: 4,
};

const chunkSize = 1024 * 1024;

export class FileClient {
  client: Client;

  constructor(dcClient: Client) {
    this.client = dcClient;
  }

  async addFile(
    file: File,
    onUpdateTransmitSize: (status: number, size: number) => void,
    onSuccess: (cid: string, decryptKey: string) => void,
    onError: (err: Error) => void,
    signCallback: (challenge: Uint8Array) => Uint8Array
  ) {
    try {
      if (this.client.p2pNode == null) {
        throw new Error("p2pNode is null");
      }
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const cid = "sadasdsad";
      const signatureDataSource = new DataSource();
      const message = new dcnet.pb.StroeFileRequest({});
      message.cid = new TextEncoder().encode(cid);
      const messageBytes = dcnet.pb.StroeFileRequest.encode(message).finish();
      
      const abortController = new AbortController();  
      let currentPosition = 0;
      const uploadState = {
        totalSize: file.size,
        currentChunk: 0,
        uploadedSize: 0,
      }
      
      const onDataCallback = async (payload: Uint8Array) => {
        console.log("onDataCallback:", payload);
        const decodedPayload = dcnet.pb.StroeFileReply.decode(payload);
        if (decodedPayload.status === uploadStatus.OK) {
          // 成功
          signatureDataSource.close(); //关闭数据源
        } else if (decodedPayload.status === uploadStatus.ENCRYPTING) {
          // 加密中
        } else if (decodedPayload.status === uploadStatus.UPLOADING) {
          // 上传中
        } else if (decodedPayload.status === uploadStatus.ABNORMAL) {
          // 异常
        } else if (decodedPayload.status === uploadStatus.ERROR) {
          // 失败
        }
        onUpdateTransmitSize(decodedPayload.status, Number(decodedPayload.receivesize));
      };
      // 使用方法
      const dataSourceCallback = async (): Promise<AsyncIterable<Uint8Array>> => {
        console.log("dataSourceCallback");
        // 读取file数据
        const fileDataSource = new DataSource();
        while (currentPosition < file.size && !abortController.signal.aborted) { 
          const chunk = file.slice(currentPosition, Math.min(currentPosition + chunkSize, file.size));
          const buffer = await chunk.arrayBuffer();
          const uint8arrays = new Uint8Array(buffer);
          // 添加chunk头信息
          const chunkHeader = {
            position: currentPosition,
            size: uint8arrays.length,
            isLast: currentPosition + uint8arrays.length >= file.size,
          };

          // 组合chunk头和数据
          const headerBuffer = new TextEncoder().encode(JSON.stringify(chunkHeader));
          const combinedBuffer = new Uint8Array(headerBuffer.length + uint8arrays.length + 1);
          combinedBuffer[0] = headerBuffer.length;
          combinedBuffer.set(headerBuffer, 1);
          combinedBuffer.set(uint8arrays, headerBuffer.length + 1);

          fileDataSource.setData(combinedBuffer);

          currentPosition += uint8arrays.length;
          uploadState.uploadedSize = currentPosition;
          uploadState.currentChunk++;

        }
        fileDataSource.close();
        return fileDataSource.getDataSource();
      };
      await grpcClient.Call(
        "/dcnet.pb.Service/StoreFile",
        messageBytes,
        30000,
        "client-streaming",
        onDataCallback,
        dataSourceCallback
      );
      // const decoded = dcnet.pb.StroeFileReply.decode(responseData);
      // return [decoded.cid, decoded.decryptKey, null];
    } catch (err) {
      console.error("storeFile error:", err);
      throw err;
    }
  }
}

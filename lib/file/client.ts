import { Libp2pGrpcClient } from "grpc-libp2p-client";
import type { Client } from "../dcapi";
import { dcnet } from "../proto/dcnet_proto";
import { DataSource } from "../proto/datasource";
import { HeliaLibp2p } from "helia";
import { unixfs } from "@helia/unixfs";
import { uint32ToLittleEndianBytes, uint64ToLittleEndianBytes } from "../util/utils";

const uploadStatus = {
  OK: 0,
  ENCRYPTING: 1, // 加密中
  UPLOADING: 2, // 上传中
  ERROR: 3,
  ABNORMAL: 4,
};


export class FileClient {
  client: Client;
  dcNodeClient: HeliaLibp2p;


  constructor(dcClient: Client, dcNodeClient: HeliaLibp2p) {
    this.client = dcClient;
    this.dcNodeClient = dcNodeClient;
  }

  async storeFile(
    fileSize: number,
    blockHeight: number,
    signature: Uint8Array,
    cid: string,
    onUpdateTransmitSize: (status: number, size: number) => void,
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

      const message = new dcnet.pb.StroeFileRequest({});
      message.cid = new TextEncoder().encode(cid);
      message.filesize = fileSize;
      message.blockheight = blockHeight;
      message.signature = signature;
      const messageBytes = dcnet.pb.StroeFileRequest.encode(message).finish();
      
      const signatureDataSource = new DataSource();
      const onDataCallback = async (payload: Uint8Array) => {
        const decodedPayload = dcnet.pb.StroeFileReply.decode(payload);
        console.log("onDataCallback decodedPayload:", decodedPayload);
        // todo 需要转换
        if (decodedPayload.status === uploadStatus.OK) {
          // 成功
          signatureDataSource.close();
        } else if (decodedPayload.status === uploadStatus.ENCRYPTING) {
          // 加密中
        } else if (decodedPayload.status === uploadStatus.UPLOADING) {
          // 上传中
        } else if (decodedPayload.status === uploadStatus.ABNORMAL) {
          // 异常
          // signatureDataSource.close();
        } else if (decodedPayload.status === uploadStatus.ERROR) {
          onUpdateTransmitSize(decodedPayload.status, Number(decodedPayload.receivesize));
          // 失败
          // signatureDataSource.close();
        }
        // if(onUpdateTransmitSize ) {
        //   onUpdateTransmitSize(decodedPayload.status, Number(decodedPayload.receivesize));
        // }
      };
      // 使用方法
      const dataSourceCallback = (): AsyncIterable<Uint8Array> => {
        console.log("dataSourceCallback");
        return signatureDataSource.getDataSource();
      };

      // 使用方法
      await grpcClient.Call(
        "/dcnet.pb.Service/StoreFile",
        messageBytes,
        1000000,
        "server-streaming",
        onDataCallback,
        dataSourceCallback,
      );
      return;
      // const decoded = dcnet.pb.StroeFileReply.decode(responseData);
      // return [decoded.cid, decoded.decryptKey, null];
    } catch (err) {
      console.error("storeFile error:", err);
      throw err;
    }
  }
}

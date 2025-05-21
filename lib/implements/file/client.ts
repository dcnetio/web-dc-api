import { Libp2pGrpcClient } from "grpc-libp2p-client";
import type { Client } from "../../common/dcapi";
import { dcnet } from "../../proto/dcnet_proto";
import { HeliaLibp2p } from "helia";
import { Libp2p } from "libp2p";
import { DCContext } from "../../interfaces";
import { uint32ToLittleEndianBytes, uint64ToLittleEndianBytes } from "lib/util/utils";

const uploadStatus = {
  OK: 0,
  ENCRYPTING: 1, // 加密中
  UPLOADING: 2, // 上传中
  ERROR: 3,
  ABNORMAL: 4,
};

const uploadRespondStatus = {
  FilePulling: 3, //文件拉取中
  PullFail: 4, //拉取失败
  PullSuccess: 5, //拉取成功
  BlockFinality: 6, //区块已经最终
  FinalityTimeout: 7, //最终化超时
  FaultSize: 8, //文件大小错误
  FaultCount: 9, //文件总数错误
  NoUserSpace: 10, //用户存储空间不足
  NoPeerSpace: 11, //节点空间不足
  SpaceExpire: 12, //用户空间过期
  Error: 13, //内部错误
  TooManyBackups: 14, //备份过多
  VAccountParseError: 15, //Virth Account解析错误
};

export class FileClient {
  client: Client;
  dcNodeClient: HeliaLibp2p<Libp2p>;
  context: DCContext;

  constructor(
    dcClient: Client,
    dcNodeClient: HeliaLibp2p<Libp2p>,
    context: DCContext
  ) {
    this.client = dcClient;
    this.dcNodeClient = dcNodeClient;
    this.context = context;
  }

  async storeFile(
    fileSize: number,
    blockHeight: number,
    cid: string,
    peerId: string,
    onUpdateTransmitSize: (status: number, size: number) => void,
    onErrorCallback: (error: Error) => void
  ) {

      const sizeValue = uint64ToLittleEndianBytes(fileSize);
      const bhValue = uint32ToLittleEndianBytes(blockHeight ? blockHeight : 0);
      const typeValue = uint32ToLittleEndianBytes(1);
      // 将字符串 (dc.ConnectedDc.peerid) 转换为字节数组
      const peerIdValue = new TextEncoder().encode(peerId);
      const cidIdValue = new TextEncoder().encode(cid);
      // 组合所有部分
      const messageParts = new Uint8Array([
        ...cidIdValue,
        ...sizeValue,
        ...bhValue,
        ...typeValue,
        ...peerIdValue,
      ]);
      const signature = await this.context.sign(messageParts);
    try {
      if (this.client.p2pNode == null) {
        throw new Error("p2pNode is null");
      }
      const message = new dcnet.pb.StroeFileRequest({});
      message.cid = new TextEncoder().encode(cid);
      message.filesize = fileSize;
      message.blockheight = blockHeight;
      message.signature = signature;
      const messageBytes = dcnet.pb.StroeFileRequest.encode(message).finish();
      
    //  const signatureDataSource = new DataSource();
      const onDataCallback = async (payload: Uint8Array) => {
        const decodedPayload = dcnet.pb.StroeFileReply.decode(payload);
        let resStatus = uploadStatus.UPLOADING;
        switch (decodedPayload.status) {
          case uploadRespondStatus.FilePulling:
            resStatus = uploadStatus.UPLOADING;
            break;
          case uploadRespondStatus.PullFail:
            resStatus = uploadStatus.ERROR;
            break;
          case uploadRespondStatus.PullSuccess:
            resStatus = uploadStatus.OK;
            break;
          case uploadRespondStatus.BlockFinality:
            resStatus = uploadStatus.OK;
            break;
          case uploadRespondStatus.FinalityTimeout:
            resStatus = uploadStatus.ABNORMAL;
            break;
          case uploadRespondStatus.FaultSize:
            resStatus = uploadStatus.ERROR;
            break;
          case uploadRespondStatus.FaultCount:
            resStatus = uploadStatus.ERROR;
            break;
          case uploadRespondStatus.NoUserSpace:
            resStatus = uploadStatus.ERROR;
            break;
        }
        if(onUpdateTransmitSize ) {
          onUpdateTransmitSize(resStatus, Number(decodedPayload.receivesize));
        }
      };
    
      // const dataSourceCallback = (): AsyncIterable<Uint8Array> => {
      //   console.log("dataSourceCallback");
      //   return signatureDataSource.getDataSource();
      // };

    
      // 使用方法
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );

      await grpcClient.Call(
        "/dcnet.pb.Service/StoreFile",
        messageBytes,
        100000,
        "server-streaming",
        onDataCallback,
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

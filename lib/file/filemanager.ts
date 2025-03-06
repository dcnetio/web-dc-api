import type { Multiaddr } from "@multiformats/multiaddr";
import { AccountKey, DCConnectInfo } from "../types/types";
import { FileClient } from "./client";
import type { HeliaLibp2p } from "helia";
import { ChainUtil } from "../chain";
import { uint32ToLittleEndianBytes, uint64ToLittleEndianBytes } from "../util/utils";
import { unixfs } from "@helia/unixfs";

const chunkSize = 1024 * 1024;

// 错误定义
export class FileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileError";
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new FileError("no dc peer connected"),
  ErrNoFileChose: new FileError("no file choose"),
  ErrNoPeerIdIsNull: new FileError("peerId is null"),
};

export class FileManager {
  connectedDc: DCConnectInfo = {};
  chainUtil: ChainUtil;
  dcNodeClient: HeliaLibp2p;
    accountKey : AccountKey;
  constructor(connectedDc: DCConnectInfo, chainUtil: ChainUtil, dcNodeClient: HeliaLibp2p, accountKey: AccountKey) {
    this.connectedDc = connectedDc;
    this.chainUtil = chainUtil;
    this.dcNodeClient = dcNodeClient;
    this.accountKey = accountKey;
  }

  // 上传文件
  async addFile(
    file: File,
    onUpdateTransmitSize: (status: number, size: number) => void,
  ): Promise<[string | null, Error | null]> {
    if (!this.connectedDc?.client) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    const blockHeight = await this.chainUtil.getBlockHeight();
    const peerId = this.connectedDc.nodeAddr?.getPeerId();
    if(!peerId) {
      return [null, Errors.ErrNoPeerIdIsNull];
    }

    try {
      const fs = unixfs(this.dcNodeClient);
  
        // 创建可读流  
      const createReadStream = async function* (){  
        let offset = 0;
          while(offset < file.size) {  
              const chunk = file.slice(offset, offset + chunkSize);  
              const arrayBuffer = await chunk.arrayBuffer();  
              yield new Uint8Array(arrayBuffer);  
              offset += chunk.size;  
          }  
      }  
      const byteStream = await createReadStream();
      const cid = await fs.addByteStream(byteStream);
      const cidStr = cid.toString();
      const fileSize = file.size;
      const sizeValue = uint64ToLittleEndianBytes(fileSize);
      const bhValue = uint32ToLittleEndianBytes(blockHeight ? blockHeight : 0);
      const typeValue = uint32ToLittleEndianBytes(1);
      // 将字符串 (dc.ConnectedDc.peerid) 转换为字节数组  
      const peerIdValue = new TextEncoder().encode(peerId);  
      const cidIdValue = new TextEncoder().encode(cidStr);  
      // 将 cidIdValue,sizeValue,bhValue,typeValue 和 peerIdValue 连接起来
      const preSign = new Uint8Array(cidIdValue.length + sizeValue.length + bhValue.length + typeValue.length + peerIdValue.length);
      preSign.set(cidIdValue, 0);
      preSign.set(sizeValue, cidIdValue.length);
      preSign.set(bhValue, cidIdValue.length + sizeValue.length);
      preSign.set(typeValue, cidIdValue.length + sizeValue.length + bhValue.length);
      preSign.set(peerIdValue, cidIdValue.length + sizeValue.length + bhValue.length + typeValue.length);
      const signature = this.accountKey.sign(preSign);
      const fileClient = new FileClient(this.connectedDc.client, this.dcNodeClient);
      const res = await fileClient.storeFile(
        fileSize,
        blockHeight ? blockHeight : 0,
        signature,
        cidStr,
        onUpdateTransmitSize,
      )
      console.log("addFile res", res);
      return [cidStr, null];
    } catch (error) {
      console.log("addFile error", error);
      throw error;
    }
  }

  // 下载文件
  

}

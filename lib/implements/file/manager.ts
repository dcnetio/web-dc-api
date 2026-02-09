import { UploadStatus, type DCConnectInfo } from "../../common/types/types";
import { FileClient } from "./client";
import type { Helia } from "helia";
import { ChainUtil } from "../../common/chain";
import { Errors as GErrors } from "../../common/error";

import {
  compareByteArrays,
  mergeUInt8Arrays,
  sleep,
  uint32ToLittleEndianBytes,
  uint64ToBigEndianBytes,
  uint64ToLittleEndianBytes,
  iterableToUint8Array,
  getPeerIdString,
} from "../../util/utils";

import { unixfs } from "@helia/unixfs";
import { SymmetricKey } from "../threaddb/common/key";
import { CID, Version } from "multiformats/cid";
import { BrowserType, DcUtil } from "../../common/dcutil";
import { decryptContent } from "../../util/dccrypt";
import { Uint8ArrayList } from "uint8arraylist";
import { Libp2p, Stream } from "@libp2p/interface";
import { cidNeedConnect } from "../../common/constants";
import { SeekableFileStream } from "./seekableFileStream";
import { AccountClient } from "../account/client";
import { DCContext } from "../../../lib/interfaces/DCContext";
import { multiaddr, Multiaddr } from "@multiformats/multiaddr";

const NonceBytes = 12;
const TagBytes = 16;
const dcFileHead = "$$dcfile$$";
const chunkSize = 3 * 1024 * 1024; // 3MB chunks
// 创建一个可以取消的信号
const controller = new AbortController();
const { signal } = controller;

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
  ErrNoNeedUpload: new FileError("no need upload"),
  ErrPublicKeyIsNull: new FileError("publickey is null"),
  ErrBuildServerConnect: new FileError("build server connect error"),
};

export interface MediaController {
  restart(): {
    videoElement: HTMLVideoElement;
    mediaUrl: string;
    controller: MediaController;
  };
  dispose(): void;
}
interface CustomMessage {
  type: number; // uint8 (1字节)
  version: number; // uint16 (2字节, 大端序)
  payload: Uint8Array; // 二进制数据
}

export class FileManager {
  dc: DcUtil;
  connectedDc: DCConnectInfo = {};
  chainUtil: ChainUtil;
  dcNodeClient: Helia<Libp2p>;
  context: DCContext;
  constructor(
    dc: DcUtil,
    connectedDc: DCConnectInfo,
    chainUtil: ChainUtil,
    dcNodeClient: Helia<Libp2p>,
    context: DCContext,
  ) {
    this.dc = dc;
    this.connectedDc = connectedDc;
    this.chainUtil = chainUtil;
    this.dcNodeClient = dcNodeClient;
    this.context = context;
  }
  // 处理文件头
  async _processHeader(
    pubkeyBytes: Uint8Array,
    fileSize: number,
    content: Uint8Array,
    isFirstChunk: boolean,
  ): Promise<Uint8Array> {
    if (isFirstChunk) {
      // 计算 pubkey 的 hash
      const pubkeyHash = await crypto.subtle.digest(
        "SHA-256",
        pubkeyBytes as any,
      );
      const pubkeyHashArray = new Uint8Array(pubkeyHash);

      // 创建文件头
      const headArray = new TextEncoder().encode(dcFileHead);
      const pubkeyHashPart = pubkeyHashArray.slice(10, 24);

      // 创建表示文件大小的字节数组
      const realSizeBuffer = uint64ToBigEndianBytes(fileSize);
      const realSizeBytes = new Uint8Array(realSizeBuffer);

      // 组合所有部分
      const result = new Uint8Array([
        ...headArray,
        ...pubkeyHashPart,
        ...realSizeBytes,
        ...content,
      ]);

      return result;
    }
    return content;
  }
  async _uploadLargeFileAdvanced(
    file: File,
    resumeState = { offset: 0, chunkHashes: [] },
    pubkeyBytes?: Uint8Array,
    symKey?: SymmetricKey | null,
  ): Promise<CID | null> {
    const fs = unixfs(this.dcNodeClient);

    let offset = resumeState.offset || 0;
    const chunkHashes = resumeState.chunkHashes || {};

    const _this = this;

    // 创建符合流式接口的内容生成器
    const contentStream = async function* () {
      while (offset < file.size) {
        // // 检查取消信号（需要补充signal参数）
        // if (_this.signal?.aborted) {
        //   throw new AbortError('Upload cancelled')
        // }

        // 读取分块
        const chunk = file.slice(offset, offset + chunkSize);
        const arrayBuffer = await chunk.arrayBuffer();
        let content = new Uint8Array(arrayBuffer);

        // 加密处理
        if (symKey) {
          content = (await symKey.encrypt(content)) as any;
        }

        // 文件头处理（仅在第一个分块添加）
        if (pubkeyBytes && offset === 0) {
          content = (await _this._processHeader(
            pubkeyBytes,
            file.size,
            content,
            true, // isFirstChunk
          )) as any;
        }

        offset += chunkSize;
        yield content;
      }
    };
    const cid = await fs.addByteStream(contentStream(), {
      rawLeaves: false,
      leafType: "file",
      shardSplitThresholdBytes: 256 * 1024,
    });
    return cid;
  }

  /**
   * 检查当前连接的节点是否已经绑定到用户账户
   * @returns 如果已绑定则返回true，否则返回false
   */
  async isAccessPeerIdBinded(): Promise<boolean> {
    const userInfo = await this.chainUtil.refreshUserInfo(
      this.context.getPubkeyRaw(),
    );

    if (userInfo.requestPeers && userInfo.requestPeers.length > 0) {
      for (const peerId of userInfo.requestPeers) {
        // 已经是绑定节点，直接返回true
        if (peerId === getPeerIdString(this.connectedDc.nodeAddr)) {
          return true;
        }
      }
    }
    return false;
  }

  // 上传文件
  async addFile(
    file: File,
    enkey: string,
    onUpdateTransmitSize: (status: UploadStatus, size: number) => void,
    vaccount?: string,
  ): Promise<[string | null, Error | null]> {
    if (!this.connectedDc?.client) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if (!this.connectedDc || !this.connectedDc.nodeAddr) {
      console.error("=========Errors.ErrNoDcPeerConnected");
      return [null, Errors.ErrNoDcPeerConnected];
    }

    // this.dcNodeClient.libp2p.dialProtocol(this.connectedDc.nodeAddr, '/ipfs/bitswap/1.2.0')
    const blockHeight = await this.chainUtil.getBlockHeight();
    const peerId = getPeerIdString(this.connectedDc.nodeAddr);
    if (!peerId) {
      return [null, Errors.ErrNoPeerIdIsNull];
    }
    let resCid = "";
    try {
      if (!(await this.isAccessPeerIdBinded())) {
        // 检查当前连接的节点是否已经绑定到用户账户,没绑定,执行绑定
        const accountClient = new AccountClient(this.connectedDc.client);
        await accountClient.bindAccessPeerToUser(
          this.context,
          blockHeight ? blockHeight : 0,
          peerId,
        );
        //等待绑定信息上链,最多等待20秒
        let waitCount = 0;
        while (true) {
          if (await this.isAccessPeerIdBinded()) {
            break;
          }
          waitCount += 1;
          if (waitCount > 30) {
            return [null, new FileError("No access auth to peer")]; // 使用正确的错误返回格式
          }
          await sleep(1000); // 使用毫秒，等同于1秒
        }
      }
    } catch (error: any) {
      return [null, error];
    }

    try {
      const fileSize = file.size;
      const symKey =
        enkey && enkey.length > 0 ? SymmetricKey.fromString(enkey) : null;
      const fs = unixfs(this.dcNodeClient);
      const pubkeyBytes = this.context.getPubkeyRaw();
      //const peerId = "12D3KooWEGzh4AcbJrfZMfQb63wncBUpscMEEyiMemSWzEnjVCPf";
      let nodeAddr = await this.dc?._getNodeAddr(peerId);
      if (!nodeAddr) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      const cid = await this._uploadLargeFileAdvanced(
        file,
        { offset: 0, chunkHashes: [] },
        pubkeyBytes,
        symKey,
      );
      if (!cid) {
        return [resCid, Errors.ErrNoFileChose];
      }
      resCid = cid.toString();

      // @ts-ignore
      const stats = await fs.stat(cid.toString());
      const filesize = stats.unixfs?.fileSize() || 0;
      // helia新版本fs.stat返回的localDagSize可能不准确或不存在，直接使用filesize
      const dagFileSize = Number(filesize);
      const fileClient = new FileClient(
        this.connectedDc.client,
        this.dcNodeClient,
        this.context,
      );
      let resStatus = 0;
      let resFlag = false;
      let resError: Error | null = null;
      fileClient.storeFile(
        dagFileSize,
        blockHeight ? blockHeight : 0,
        resCid,
        peerId,
        (status: number, size: number): void => {
          resFlag = true;
          resStatus = status;
          onUpdateTransmitSize(status, size);
        },
        async (error: Error) => {
          resFlag = true;
          resError = error;
        },
      );
      //等待storeRes 为true
      while (!resFlag) {
        await sleep(100);
      }
      if (resError) {
        return [null, resError];
      }
      if (
        resStatus === UploadStatus.ERROR ||
        resStatus === UploadStatus.ABNORMAL ||
        resStatus === UploadStatus.NOSPACE ||
        resStatus === UploadStatus.FILECOUNTERROR ||
        resStatus === UploadStatus.FILESIZEERROR ||
        resStatus === UploadStatus.PULLERROR
      ) {
        //上传失败，不需要操作
        return [null, Errors.ErrNoNeedUpload];
      }
      //创建文件主动上报流
      await this.dc.createTransferStream(
        this.dcNodeClient.libp2p,
        this.dcNodeClient.blockstore,
        nodeAddr,
        BrowserType.File,
        resCid,
      );
    } catch (error) {
      console.error("=========stream close", error);
      throw error;
    }
    return [resCid, null];
  }

  // 添加文件到本地节点
  async addFileInLocal(
    file: File,
    enkey: string,
  ): Promise<[string | null, Error | null]> {
    let resCid: CID | null = null;
    try {
      const symKey =
        enkey && enkey.length > 0 ? SymmetricKey.fromString(enkey) : null;
      const fs = unixfs(this.dcNodeClient);
      const pubkeyBytes = this.context.getPubkeyRaw();

      const cid = await this._uploadLargeFileAdvanced(
        file,
        { offset: 0, chunkHashes: [] },
        pubkeyBytes,
        symKey,
      );
      if (!cid) {
        return ["", Errors.ErrNoFileChose];
      }
      resCid = cid;
    } catch (error: any) {
      return ["", error];
    }
    return [resCid.toString(), null];
  }

  /**
   * Adds a folder to the DC network using browser FileList
   * @param folderInput - Files from a directory input element
   * @param enkey - Encryption key
   * @param updateTransmitCount - Callback for progress updates
   * @param vaccount - Optional virtual account
   * @returns Promise with CID string and error if any
   */
  async addFolder(
    fileList: FileList,
    enkey: string,
    updateTransmitCount: (
      status: UploadStatus,
      total: number,
      progress: number,
    ) => void,
    vaccount?: string,
  ): Promise<[string | null, Error | null]> {
    if (!this.connectedDc?.client) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if (!this.connectedDc || !this.connectedDc.nodeAddr) {
      console.error("=========Errors.ErrNoDcPeerConnected");
      return [null, Errors.ErrNoDcPeerConnected];
    }

    // this.dcNodeClient.libp2p.dialProtocol(this.connectedDc.nodeAddr, '/ipfs/bitswap/1.2.0')
    const blockHeight = await this.chainUtil.getBlockHeight();
    const peerId = getPeerIdString(this.connectedDc.nodeAddr);
    if (!peerId) {
      return [null, Errors.ErrNoPeerIdIsNull];
    }
    let nodeAddr = await this.dc?._getNodeAddr(peerId);
    if (!nodeAddr) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    try {
      if (!(await this.isAccessPeerIdBinded())) {
        // 检查当前连接的节点是否已经绑定到用户账户,没绑定,执行绑定
        const accountClient = new AccountClient(this.connectedDc.client);
        await accountClient.bindAccessPeerToUser(
          this.context,
          blockHeight ? blockHeight : 0,
          peerId,
        );
        //等待绑定信息上链,最多等待20秒
        let waitCount = 0;
        while (true) {
          if (await this.isAccessPeerIdBinded()) {
            break;
          }
          waitCount += 1;
          if (waitCount > 30) {
            return [null, new FileError("No access auth to peer")]; // 使用正确的错误返回格式
          }
          await sleep(1000); // 使用毫秒，等同于1秒
        }
      }
    } catch (error: any) {
      return [null, error];
    }

    try {
      // Create IPFS file system interface
      const fs = unixfs(this.dcNodeClient);

      // Generate user flag file (dc_ownuser)
      let pubkeyBytes = this.context.getPubkeyRaw();

      // Create hash of public key for owner file
      const pubkeyHash = await crypto.subtle.digest(
        "SHA-256",
        pubkeyBytes as any,
      );
      const ownerFileContent = new Uint8Array(pubkeyHash);

      // Create folder structure using MFS (memory file system)
      // Get root folder name
      const rootFolderName = this.extractRootFolderName(fileList);
      //排除掉 dc_ownuser 文件,然后又加上去,防止重复添加
      const files = Array.from(fileList).filter(
        (file) => file.name !== "dc_ownuser",
      );
      //将ownerFileContent作为文件内容,最后添加到根目录
      const ownerPath = rootFolderName + "/dc_ownuser";
      files.push(
        new File([ownerFileContent], "dc_ownuser", { type: "text/plain" }),
      );

      // 将文件路径与内容流映射
      const source = Array.from(files).map((file) => ({
        path: file.name === "dc_ownuser" ? ownerPath : file.webkitRelativePath, // 获取文件相对路径
        content: this.fileToStream(file, enkey), // 使用文件流
      }));

      const results = fs.addAll(source);
      let rootCID: CID<unknown, number, number, Version> | null = null;
      let totalSize = 0;
      //  let fileCount = 0;
      for await (const { path, size, cid } of results) {
        // The entry with path equal to the root folder name is our root
        if (path === rootFolderName) {
          rootCID = cid;
          totalSize = Number(size);
        }
      }
      if (!rootCID) {
        console.error("Failed to find root directory CID");
        return [null, new Error("Failed to find root directory CID")];
      }
      // 计算 rootCID 下的文件数量（与 Go 实现一致：按文件数量计数）
      let fileCount = 0;
      try {
        const [fileNodes, fileErr] = await this.getFolderFileList(
          rootCID.toString(),
          cidNeedConnect.NOT_NEED,
          true,
        );
        if (!fileErr && fileNodes) {
          // 排除 dc_ownuser 标志文件
          fileCount = fileNodes.filter(
            (n) => n.Type === 0 && n.Name !== "dc_ownuser",
          ).length;
        }
      } catch (e) {
        fileCount = 0;
      }
      fileCount++;

      // Get final node and CID
      const finalCid = rootCID.toString();
      const folderSize = totalSize;

      // Sign folder data
      const serverPidBytes = new TextEncoder().encode(peerId);
      const sizeValue = uint64ToLittleEndianBytes(folderSize);
      const heightValue = uint32ToLittleEndianBytes(blockHeight || 0);
      const typeValue = uint32ToLittleEndianBytes(1); // Folder type = 1

      // Create signature payload
      let preSign = new TextEncoder().encode(finalCid);
      preSign = mergeUInt8Arrays(preSign, sizeValue) as any;
      preSign = mergeUInt8Arrays(preSign, heightValue) as any;
      preSign = mergeUInt8Arrays(preSign, typeValue) as any;
      preSign = mergeUInt8Arrays(preSign, serverPidBytes) as any;

      // Sign the data
      const signature = await this.context.sign(preSign);

      // Create file options
      const fileOptions = {
        signature,
        blockHeight: blockHeight || 0,
        fileSize: folderSize,
        fileCount: fileCount,
        pubkey: this.context.getPubkeyRaw(),
        vaccount: "",
      };

      if (vaccount) {
        fileOptions.vaccount = vaccount;
      }
      let client = this.connectedDc.client;
      if (client === null) {
        return ["", new Error("ErrConnectToAccountPeersFail")];
      }

      if (client.peerAddr === null) {
        return ["", new Error("ErrConnectToAccountPeersFail")];
      }
      if (!this.context.publicKey) {
        return [null, Errors.ErrPublicKeyIsNull];
      }
      if (client.token == "") {
        await client.GetToken(
          this.context.appInfo.appId || "",
          this.context.publicKey.string(),
          this.context.sign,
        );
      }

      // Store folder on DC network
      const fileClient = new FileClient(
        this.connectedDc.client,
        this.dcNodeClient,
        this.context,
      );

      let resFlag = false;
      let resStatus = 0;
      let resError = null;
      // Create channel for async communication
      fileClient.storeFolder(
        rootCID.toString(),
        fileOptions,
        (status: UploadStatus, total: number, processed: number): void => {
          resFlag = true;
          resStatus = status;
          updateTransmitCount(status, total, processed);
        },
        async (error: Error) => {
          resFlag = true;
          resError = error;
        },
      );
      while (!resFlag) {
        await sleep(100);
      }
      if (resError) {
        updateTransmitCount(UploadStatus.ERROR, 0, 0);
        return [null, resError];
      }
      if (
        resStatus === UploadStatus.ERROR ||
        resStatus === UploadStatus.ABNORMAL ||
        resStatus === UploadStatus.NOSPACE ||
        resStatus === UploadStatus.FILECOUNTERROR ||
        resStatus === UploadStatus.FILESIZEERROR ||
        resStatus === UploadStatus.PULLERROR
      ) {
        //上传失败的时候，不需要操作
        return [null, Errors.ErrNoNeedUpload];
      }
      //创建文件主动上报流
      await this.dc.createTransferStream(
        this.dcNodeClient.libp2p,
        this.dcNodeClient.blockstore,
        nodeAddr,
        BrowserType.File,
        finalCid,
      );
      return [finalCid, null];
    } catch (error) {
      console.error("Folder upload failed:", error);
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }

  /**
   * Adds a folder to the DC network using browser FileList
   * @param folderInput - Files from a directory input element
   * @param enkey - Encryption key
   * @returns Promise with CID string and error if any
   */
  async addFolderInLocal(
    fileList: FileList,
    enkey: string,
  ): Promise<[string | null, Error | null]> {
    try {
      // Create IPFS file system interface
      const fs = unixfs(this.dcNodeClient);

      // Generate user flag file (dc_ownuser)
      let pubkeyBytes = this.context.getPubkeyRaw();

      // Create hash of public key for owner file
      const pubkeyHash = await crypto.subtle.digest(
        "SHA-256",
        pubkeyBytes as any,
      );
      const ownerFileContent = new Uint8Array(pubkeyHash);

      // Create folder structure using MFS (memory file system)
      // Get root folder name
      const rootFolderName = this.extractRootFolderName(fileList);
      //排除掉 dc_ownuser 文件,然后又加上去,防止重复添加
      const files = Array.from(fileList).filter(
        (file) => file.name !== "dc_ownuser",
      );
      //将ownerFileContent作为文件内容,最后添加到根目录
      const ownerPath = rootFolderName + "/dc_ownuser";
      files.push(
        new File([ownerFileContent], "dc_ownuser", { type: "text/plain" }),
      );

      // 将文件路径与内容流映射
      const source = Array.from(files).map((file) => ({
        path: file.name === "dc_ownuser" ? ownerPath : file.webkitRelativePath, // 获取文件相对路径
        content: this.fileToStream(file, enkey), // 使用文件流
      }));

      const results = fs.addAll(source);
      let rootCID: CID<unknown, number, number, Version> | null = null;
      let totalSize = 0;
      //  let fileCount = 0;
      for await (const { path, size, cid } of results) {
        // The entry with path equal to the root folder name is our root
        if (path === rootFolderName) {
          rootCID = cid;
          totalSize = Number(size);
        }
      }
      if (!rootCID) {
        console.error("Failed to find root directory CID");
        return [null, new Error("Failed to find root directory CID")];
      }
      return [rootCID.toString(), null];
    } catch (error) {
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }

  /**
   * Creates a custom FileList object from file paths and contents
   * @param filesMap - Map of file paths to content (string or Uint8Array)
   * @param rootFolderName - Optional root folder name (defaults to "upload")
   * @returns A FileList-like object that can be used with addFolder
   */
  createCustomFileList(
    filesMap:
      | Map<string, string | Uint8Array | ArrayBuffer>
      | Record<string, string | Uint8Array | ArrayBuffer>,
    rootFolderName: string = "upload",
  ): FileList {
    // Convert object to Map if needed
    const filesMapObj =
      filesMap instanceof Map ? filesMap : new Map(Object.entries(filesMap));

    // Create File objects with proper webkitRelativePath
    const files: File[] = [];

    filesMapObj.forEach((content, path) => {
      // Ensure path starts with rootFolderName
      const fullPath = path.startsWith(rootFolderName)
        ? path
        : `${rootFolderName}/${path}`;

      // Convert content to proper format
      let fileContent: Blob;
      if (typeof content === "string") {
        fileContent = new Blob([content], { type: "text/plain" });
      } else {
        fileContent = new Blob([content as any]);
      }

      // Create File object with webkitRelativePath
      // const file = new File([fileContent], path.split("/").pop() || "unnamed", {
      //   type: "application/octet-stream",
      // }) as File & { webkitRelativePath: string };
      const file = Object.defineProperty(
        new File([fileContent], path.split("/").pop() || "unnamed", {
          type: "application/octet-stream",
        }),
        "webkitRelativePath",
        {
          value: fullPath,
          writable: false,
        },
      );

      // Set webkitRelativePath property
      // file.webkitRelativePath = fullPath;

      files.push(file);
    });

    // Create a FileList-like object
    const fileListObj: Record<string, any> = {
      length: files.length,
      item(index: number): File {
        if (index < 0 || index >= files.length) {
          return null as any; // Return null for out-of-bounds index
        }
        return files[index]!;
      },
      [Symbol.iterator](): Iterator<File> {
        let index = 0;
        return {
          next(): IteratorResult<File> {
            if (index < files.length) {
              return { value: files[index++]!, done: false };
            } else {
              return { value: null as any, done: true };
            }
          },
        };
      },
    };

    // Add files with their indices as keys
    files.forEach((file, index) => {
      fileListObj[index] = file;
    });

    const fileList = fileListObj as unknown as FileList;

    return fileList;
  }

  private fileToStream(file: File, enkey: string): ReadableStream<Uint8Array> {
    const symKey = enkey ? SymmetricKey.fromString(enkey) : null;
    const { readable, writable } = new TransformStream<
      Uint8Array,
      Uint8Array
    >();
    const writer = writable.getWriter();
    const fileReader = new FileReader();
    const chunkSize = 3 << 20; // 3MB chunks
    let offset = 0;
    const processFile = async () => {
      try {
        while (offset < file.size) {
          // Read chunk
          const chunk = file.slice(offset, offset + chunkSize);
          const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
            fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
            fileReader.onerror = reject;
            fileReader.readAsArrayBuffer(chunk);
          });
          const content = new Uint8Array(buffer);
          // Encrypt if needed
          if (symKey && file.name !== "dc_ownuser") {
            const encrypted = await symKey.encrypt(content);
            await writer.write(encrypted);
          } else {
            await writer.write(content);
          }
          offset += chunkSize;
        }
      } catch (error) {
        console.error("Error processing file:", error);
      } finally {
        await writer.close();
      }
    };
    // Start processing the file
    processFile().catch((error) => {
      console.error("Error in file processing:", error);
    });
    return readable;
  }
  /**
   * Counts all blocks recursively in a directory structure
   * @param rootCID - The CID of the root directory
   * @returns Promise with the total block count
   */
  async countDirectoryBlocks(rootCID: CID): Promise<number> {
    try {
      const fs = unixfs(this.dcNodeClient);
      let totalBlocks = 0;

      // Get stats for the root directory itself
      // @ts-ignore
      const rootStats = await fs.stat(rootCID.toString());
      totalBlocks += this.getBlocksCountFromStats(rootStats);

      // List all entries in the directory and process them recursively
      // @ts-ignore
      for await (const entry of fs.ls(rootCID.toString())) {
        const { cid, type } = entry as any;

        // Get stats for the current entry
        // @ts-ignore
        const stats = await fs.stat(cid.toString());

        if (type === "directory") {
          // Recursively count blocks in subdirectories
          const subDirBlocks = await this.countDirectoryBlocks(cid);
          totalBlocks += subDirBlocks;
        } else {
          // For files, try to read blocks; if missing, estimate from file size
          totalBlocks += this.getBlocksCountFromStats(stats);
        }
      }

      return totalBlocks;
    } catch (error) {
      console.error("Error counting directory blocks:", error);
      throw error;
    }
  }
  /**
   * Extract the root folder name from a FileList
   */
  private extractRootFolderName(files: FileList): string {
    if (files.length === 0) return "root";

    const path = files[0]!.webkitRelativePath || files[0]!.name;
    const parts = path.split("/");

    return parts[0] || "root";
  }

  /**
   * Create a folder in IPFS
   */
  private async createFolderInIpfs(folderName: string): Promise<CID> {
    const fs = unixfs(this.dcNodeClient);
    const dirCid = await fs.addDirectory({
      path: folderName,
    });
    return dirCid;
  }

  /**
   * Calculate the size of all files in a folder
   */
  private calculateFolderSize(files: FileList): number {
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      totalSize += files[i]!.size;
    }
    return totalSize;
  }

  /**
   * Adds a file to MFS file system folder with optional encryption
   * @param parentDir - The parent directory in MFS
   * @param dirPath - The directory path
   * @param fileName - The name of the file
   * @param enkey - Optional encryption key
   * @returns Promise with result or error
   */
  async addFileToMfsFolder(
    parentDir: any, // MFS Directory type (replace with actual type)
    dirPath: string,
    fileName: File,
    enkey: string,
  ): Promise<[string | null, Error | null]> {
    let symKey: SymmetricKey | null = null;
    const readPath = `${dirPath}/${fileName}`; // Use path joining appropriate for your env

    try {
      // Open file (implementation depends on environment - browser vs Node.js)
      const fileContent = await this.readFile(readPath);
      if (!fileContent) {
        return [null, new Error("Could not open file")];
      }

      // Create encryption key if needed
      if (enkey !== "") {
        symKey = SymmetricKey.fromString(enkey);
      }

      // Create readable and writable streams for processing
      const { readable, writable } = new TransformStream<
        Uint8Array,
        Uint8Array
      >();
      const writer = writable.getWriter();

      // Process the file in a separate async function (equivalent to goroutine)
      (async () => {
        try {
          const file = await fetch(readPath).then((r) => r.blob());
          const fileReader = new FileReader();
          const chunkSize = 1024;
          let offset = 0;

          while (offset < file.size) {
            // Check for abort signal if needed
            // if (signal?.aborted) throw new Error("Operation cancelled");

            // Read chunk
            const chunk = file.slice(offset, offset + chunkSize);
            const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
              fileReader.onload = () =>
                resolve(fileReader.result as ArrayBuffer);
              fileReader.onerror = reject;
              fileReader.readAsArrayBuffer(chunk);
            });

            const content = new Uint8Array(buffer);

            // Encrypt if needed
            if (symKey) {
              const encrypted = await symKey.encrypt(content);
              await writer.write(encrypted);
            } else {
              await writer.write(content);
            }

            offset += chunkSize;
          }
        } catch (error) {
          console.error("Error processing file:", error);
        } finally {
          await writer.close();
        }
      })();

      // Add file to IPFS
      const fs = unixfs(this.dcNodeClient);
      const cid = await fs.addByteStream(this.streamToAsyncIterable(readable), {
        rawLeaves: false,
        leafType: "file",
        shardSplitThresholdBytes: 256 * 1024,
      });

      // Add to parent directory in MFS
      await parentDir.addChild(fileName, cid);
      await parentDir.flush();

      return [cid.toString(), null];
    } catch (error) {
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }

  // Helper to compute block count from fs.stat result with fallbacks
  private getBlocksCountFromStats(stats: any): number {
    // Only support latest stat shape: expect `blocks` to be provided by unixfs.stat
    try {
      const maybeBlocks = (stats as any).blocks;
      if (typeof maybeBlocks === "number") {
        return Number(maybeBlocks);
      }
      // If `blocks` is absent, return 0 (no backward compatibility logic)
      return 0;
    } catch (err) {
      console.warn("getBlocksCountFromStats error:", err);
      return 0;
    }
  }

  // Helper method to convert a ReadableStream to AsyncIterable
  private async *streamToAsyncIterable(
    stream: ReadableStream<Uint8Array>,
  ): AsyncGenerator<Uint8Array> {
    const reader = stream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
  }

  // Helper to read a file (implementation depends on environment)
  private async readFile(path: string): Promise<Blob | null> {
    try {
      // Browser implementation example - replace with appropriate method
      const response = await fetch(path);
      return await response.blob();
    } catch (error) {
      console.error("Error reading file:", error);
      return null;
    }
  }

  private async *chunkGenerator(stream: Stream): AsyncGenerator<Uint8Array> {
    // 兼容: 优先检查 .source, 否则直接迭代 stream
    const s = stream as any;
    const iteratorSrc = s.source || s;

    if (!iteratorSrc[Symbol.asyncIterator]) {
      console.warn("Stream source is not async iterable", stream);
      return;
    }

    const iterator = iteratorSrc[Symbol.asyncIterator]();
    while (true) {
      try {
        const { done, value } = await iterator.next();
        if (done) break;
        const res = value instanceof Uint8ArrayList ? value.subarray() : value;
        yield res;
      } catch (err) {
        console.error("chunkGenerator error:", err);
      }
    }
  }

  /**
   * 组装 CustomMessage 数据到 Uint8Array
   * @param message - CustomMessage 包含消息的基本结构
   * @returns Uint8Array - 序列化后的数据
   */
  assembleCustomMessage(message: CustomMessage): Uint8Array {
    // Step 1: header部分（1字节类型 + 2字节版本号 + 4字节payload长度）
    const headerLength = 7; // Header固定长度：1字节Type + 2字节Version + 4字节Payload长度
    const payloadLength = message.payload.byteLength;

    const buffer = new Uint8Array(headerLength + payloadLength);

    buffer[0] = message.type;
    buffer[1] = (message.version >> 8) & 0xff;
    buffer[2] = message.version & 0xff;
    buffer[3] = (payloadLength >> 24) & 0xff;
    buffer[4] = (payloadLength >> 16) & 0xff;
    buffer[5] = (payloadLength >> 8) & 0xff;
    buffer[6] = payloadLength & 0xff;

    // Step 5: 设置 Payload 数据
    buffer.set(message.payload, headerLength);

    return buffer;
  }
  parseMessage(
    data: Uint8Array,
  ): { type: number; version: number; payload: Uint8Array } | null {
    if (data.length < 7) {
      return null;
    }

    // 第 1 字节: 消息类型
    const type = data[0]!;

    // 第 2 和 3 字节: 版本号（大端序）
    const version = (data[1]! << 8) | data[2]!; // 手动处理大端序

    // 第 4 至 7 字节: payload 长度（大端序）
    const payloadLength =
      (data[3]! << 24) | (data[4]! << 16) | (data[5]! << 8) | data[6]!;

    // 验证数据完整性
    if (data.length < 7 + payloadLength) {
      return null;
    }

    // 提取 payload
    const payload = data.slice(7, 7 + payloadLength); // 提取负载数据

    return {
      type,
      version,
      payload,
    };
  }

  /**
   * 获取文件夹下的所有文件,包括内容（支持多级目录递归）
   * @param cid 根目录的CID
   * @param decryptKey 解密密钥
   * @param recursive 是否递归获取子目录，默认false（保持向后兼容）
   * @returns 文件列表：[{Name:文件或目录名，Type：0-文件 1-目录，Size：大小，Hash：文件或目录cid，Path：完整路径}]
   */
  async getFolderFileListWithContent(
    cid: string,
    decryptKey: string,
    recursive: boolean = true,
  ): Promise<
    [
      Array<{
        Name: string;
        Type: number;
        Size: number;
        Hash: string;
        Path: string;
        Content?: Uint8Array;
      }> | null,
      Error | null,
    ]
  > {
    const [fileList, err] = await this.getFolderFileList(
      cid,
      cidNeedConnect.NEED,
      recursive,
    );
    if (err || !fileList) return [null, err];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file?.Type === 0) {
        if (file?.Name == "dc_ownuser") {
          continue;
        }
        const content = await this.getFileFromDc(
          file.Hash,
          decryptKey,
          cidNeedConnect.NOT_NEED,
          true,
        ); //和目录同节点,无需连接
        if (!content) {
          return [null, Errors.ErrNoFileChose];
        }
        file.Content = content;
      }
    }
    return [fileList, null];
  }

  /**
   * 获取文件夹下的文件列表（支持多级目录递归）
   * @param cid 根目录的CID
   * @param flag 是否需要连接节点
   * @param recursive 是否递归获取子目录，默认false（保持向后兼容）
   * @returns 返回JSON格式的文件列表：[{Name:文件或目录名，Type：0-文件 1-目录，Size：大小，Hash：文件或目录cid，Path：完整路径}]
   */
  async getFolderFileList(
    cid: string,
    flag?: number,
    recursive: boolean = true,
  ): Promise<
    [
      Array<{
        Name: string;
        Type: number;
        Size: number;
        Hash: string;
        Path: string;
        Content?: Uint8Array;
      }> | null,
      Error | null,
    ]
  > {
    try {
      const id = CID.parse(cid);
      if (flag !== cidNeedConnect.NOT_NEED) {
        const [multiAddrs, peers] = await this.dc?._connectToObjNodes(cid);
        if (!multiAddrs && peers) {
          // 有peers但是没有multiaddrs
          return [null, Errors.ErrNoDcPeerConnected];
        }
      }

      const fs = unixfs(this.dcNodeClient);
      const fileNodes: Array<{
        Name: string;
        Type: number;
        Size: number;
        Hash: string;
        Path: string;
        Content?: Uint8Array; // 可选内容字段，用于存储文件内容
      }> = [];

      // 递归获取目录内容的内部函数
      const traverseDirectory = async (
        dirCid: CID,
        currentPath: string = "",
      ) => {
        // 遍历当前目录内容
        // @ts-ignore
        for await (const entry of fs.ls(dirCid.toString())) {
          const { name, cid, type } = entry as any;
          if (name === "." || name === ".." || name === "dc_ownuser") {
            continue; // 跳过当前目录和上级目录
          }
          // 构建完整路径
          const fullPath = currentPath ? `${currentPath}/${name}` : name;

          // 获取文件/目录的统计信息
          // @ts-ignore
          const stats = await fs.stat(cid.toString());

          // 构造文件信息对象
          const fileInfo = {
            Name: name,
            Type: type === "directory" ? 1 : 0, // 0-文件 1-目录
            Size:
              type === "directory" ? 0 : Number((stats as any).fileSize || 0),
            Hash: cid.toString(),
            Path: fullPath,
          };

          fileNodes.push(fileInfo);

          // 如果是目录且需要递归，则继续遍历子目录
          if (type === "directory" && recursive) {
            await traverseDirectory(cid, fullPath);
          }
        }
      };

      // 开始遍历
      await traverseDirectory(id);
      return [fileNodes, null];
    } catch (error) {
      console.error("获取文件夹列表失败:", error);
      return [null, error instanceof Error ? error : new Error(String(error))];
    }
  }

  // 从dc网络获取指定文件
  // flag 是否需要连接节点，0-需要，1-不需要
  getFileFromDc = async (
    cid: string,
    decryptKey: string,
    flag?: number,
    folderFlag?: boolean,
  ): Promise<Uint8Array | null> => {
    if (flag !== cidNeedConnect.NOT_NEED) {
      const [multiAddrs, peers] = await this.dc?._connectToObjNodes(cid);
      if (!multiAddrs && peers) {
        // 有peers但是没有multiaddrs
        return null;
      }
      // 没有peers
      if (!peers) {
        try {
          const timeoutPromise = new Promise((resolve) =>
            setTimeout(resolve, 5000, "Timeout"),
          );
          const getPromise = this.getFileFromDcContent(
            cid,
            decryptKey,
            folderFlag,
          );
          const result = await Promise.race([timeoutPromise, getPromise]);
          if (result === "Timeout") {
            return null;
          }
          if (result) {
            return result as Uint8Array;
          }
          return null;
        } catch (error) {
          return null;
        }
      }
    }
    return this.getFileFromDcContent(cid, decryptKey, folderFlag);
  };

  getFileFromDcWithPeerAddr = async (
    cid: string,
    decryptKey: string,
    peerAddr: string,
  ): Promise<[Uint8Array | null, Error | null]> => {
    try {
      // 建立链接
      const nodeAddr = multiaddr(peerAddr);
      const conn = await this.dcNodeClient?.libp2p.dial(nodeAddr, {
        signal: AbortSignal.timeout(1000),
      });
      if (!conn) {
        return [null, Errors.ErrBuildServerConnect];
      }
      const fileContent = await this.getFileFromDcContent(
        cid,
        decryptKey,
        false,
      );
      return [fileContent, null];
    } catch (error: any) {
      return [null, error];
    }
  };

  getFileFromDcContent = async (
    cid: string,
    decryptKey: string,
    folderFlag?: boolean,
  ): Promise<Uint8Array | null> => {
    try {
      // 1. 验证 dcNodeClient
      if (!this.dcNodeClient) {
        console.error("getFileFromDcContent: dcNodeClient is not initialized");
        return null;
      }

      // 2. 验证 cid 参数
      if (!cid) {
        console.error("getFileFromDcContent: cid is null or undefined");
        return null;
      }

      // 3. 解析 CID
      let cidObj: CID;
      try {
        // 首先检查是否已经是 CID 对象
        const asCID = CID.asCID(cid);
        if (asCID) {
          cidObj = asCID;
        } else if (typeof cid === "string") {
          // 清理字符串并解析
          const cleanCid = cid.trim();
          if (!cleanCid) {
            console.error(
              "getFileFromDcContent: cid is empty string after trim",
            );
            return null;
          }
          cidObj = CID.parse(cleanCid);
        } else {
          console.error(
            "getFileFromDcContent: invalid cid type",
            "type:",
            typeof cid,
            "value:",
            cid,
          );
          return null;
        }
      } catch (parseError) {
        console.error(
          "getFileFromDcContent: CID parse failed",
          "error:",
          parseError,
          "cid:",
          cid,
        );
        return null;
      }

      // 4. 获取文件流
      const fs = unixfs(this.dcNodeClient);
      let stream: any;
      try {
        // 兼容处理：转换为字符串传入，解决 multiformats/cid 版本不一致导致的 instanceof 检查失败问题
        // @ts-ignore
        stream = fs.cat(cidObj.toString());
      } catch (catError) {
        console.error(
          "getFileFromDcContent: fs.cat failed",
          "error:",
          catError,
          "cid:",
          cidObj.toString(),
        );
        return null;
      }

      let waitBuffer = new Uint8Array(0);
      let fileContent = new Uint8Array(0);
      let headDealed = false;

      const encryptextLen = (3 << 20) + NonceBytes + TagBytes;
      const headerLen = 32;

      for await (const chunk of stream) {
        waitBuffer = mergeUInt8Arrays(waitBuffer, chunk) as any;

        // 1. 处理头部 (仅处理一次)
        if (!headDealed && !folderFlag) {
          if (waitBuffer.length >= headerLen) {
            // 检查头部标识 $$dcfile$$
            const isDcFile = compareByteArrays(
              waitBuffer.subarray(0, 10),
              new TextEncoder().encode("$$dcfile$$"),
            );

            if (isDcFile) {
              // 是标准头部，移除32字节头部
              waitBuffer = waitBuffer.subarray(headerLen);
            }
            // 标记头部已处理
            headDealed = true;
          } else {
            // 数据不足以判断头部，继续读取下一块
            continue;
          }
        }

        // 2. 处理内容分块解密
        while (waitBuffer.length >= encryptextLen) {
          const encryptBuffer = waitBuffer.subarray(0, encryptextLen);
          waitBuffer = waitBuffer.subarray(encryptextLen);

          if (decryptKey) {
            const decrypted = await decryptContent(encryptBuffer, decryptKey);
            fileContent = mergeUInt8Arrays(fileContent, decrypted) as any;
          } else {
            fileContent = mergeUInt8Arrays(fileContent, encryptBuffer) as any;
          }
        }
      }

      // 3. 处理剩余数据
      if (waitBuffer.length > 0) {
        if (decryptKey) {
          const decrypted = await decryptContent(waitBuffer, decryptKey);
          fileContent = mergeUInt8Arrays(fileContent, decrypted) as any;
        } else {
          fileContent = mergeUInt8Arrays(fileContent, waitBuffer) as any;
        }
      }

      return fileContent;
    } catch (error) {
      console.error("getFileFromDcContent error", error);
      return null;
    }
  };
  /**
   * 创建可随机访问的文件流
   */
  async createSeekableFileStream(
    cid: string,
    decryptKey: string,
    flag?: number,
  ): Promise<SeekableFileStream | null> {
    // 连接到节点
    if (flag !== cidNeedConnect.NOT_NEED) {
      const [multiAddrs, peers] = await this.dc?._connectToObjNodes(cid);
      if (!multiAddrs && peers) {
        // 有peers但是没有multiaddrs
        return null;
      }
    }

    const fs = unixfs(this.dcNodeClient);

    try {
      // 读取头信息
      const headerData = await iterableToUint8Array(
        // @ts-ignore
        fs.cat(cid, {
          offset: 0,
          length: 32,
        }),
      );

      // 检查是否有DC文件头
      const hasHeader = compareByteArrays(
        headerData.subarray(0, 10),
        new TextEncoder().encode(dcFileHead),
      );

      // 获取文件大小
      // const stats = await fs.stat(CID.parse(cid));
      // const totalSize = Number(stats.fileSize);
      const fileSize = this.readUint64BE(headerData, 24);

      const fileInfo = {
        size: fileSize,
        hasHeader,
        headerSize: hasHeader ? 32 : 0,
      };

      // 创建并返回流对象
      return new SeekableFileStream({
        fileInfo,
        fs,
        cid: CID.parse(cid),
        decryptKey: decryptKey || "",
        encryptChunkSize: (3 << 20) + NonceBytes + TagBytes,
      });
    } catch (err) {
      console.error("Failed to create seekable file stream:", err);
      return null;
    }
  }

  /**
   * 解析路径获取CID
   */
  async resolvePath(rootCid: string, filePath: string): Promise<string | null> {
    try {
      const fs = unixfs(this.dcNodeClient);
      let currentCid = CID.parse(rootCid);
      // Normalize path: remove leading/trailing slashes, split by /
      const parts = filePath
        .replace(/^\/+|\/+$/g, "")
        .split("/")
        .filter((p) => p);

      for (const part of parts) {
        let found = false;
        // @ts-ignore
        for await (const entry of fs.ls(currentCid.toString())) {
          if (entry.name === part) {
            currentCid = entry.cid;
            found = true;
            break;
          }
        }
        if (!found) return null;
      }
      return currentCid.toString();
    } catch (error) {
      console.error("resolvePath error:", error);
      return null;
    }
  }

  /**
   * 从指定文件夹CID和路径创建可寻址文件流
   */
  async createSeekableFileStreamFromDir(
    rootCid: string,
    filePath: string,
    decryptKey: string,
  ): Promise<SeekableFileStream | null> {
    // 连接到节点
    const [multiAddrs, peers] = await this.dc?._connectToObjNodes(rootCid);
    if (!multiAddrs && peers) {
      // 有peers但是没有multiaddrs
      return null;
    }

    const fileCid = await this.resolvePath(rootCid, filePath);
    if (!fileCid) {
      return null;
    }

    return this.createSeekableFileStream(
      fileCid,
      decryptKey,
      cidNeedConnect.NOT_NEED,
    );
  }

  readUint64BE(buffer: Uint8Array, offset: number): number {
    // JavaScript中Number可以安全表示的最大整数是2^53-1
    const high =
      buffer[offset]! * 2 ** 24 +
      buffer[offset + 1]! * 2 ** 16 +
      buffer[offset + 2]! * 2 ** 8 +
      buffer[offset + 3]!;
    const low =
      buffer[offset + 4]! * 2 ** 24 +
      buffer[offset + 5]! * 2 ** 16 +
      buffer[offset + 6]! * 2 ** 8 +
      buffer[offset + 7]!;

    return high * 2 ** 32 + low;
  }

  /**
   * 判断CID是文件还是目录
   * @param cid
   * @returns 'file' | 'directory' | 'unknown'
   */
  async isFileOrDir(cid: string): Promise<"file" | "directory" | "unknown"> {
    try {
      const fs = unixfs(this.dcNodeClient);
      // @ts-ignore
      const stats = await fs.stat(cid);
      if (stats.type === "directory") {
        return "directory";
      } else if (stats.type === "file" || stats.type === "raw") {
        return "file";
      }
      return "unknown";
    } catch (error) {
      console.error("isFileOrDir error:", error);
      return "unknown";
    }
  }

  /**
   * 从指定文件夹CID和路径获取文件内容或目录列表
   */
  async getFileFromDir(
    rootCid: string,
    filePath: string,
    decryptKey: string,
  ): Promise<
    | Uint8Array
    | Array<{
        Name: string;
        Type: number;
        Size: number;
        Hash: string;
        Path: string;
        Content?: Uint8Array;
      }>
    | null
  > {
    // 连接到节点
    const [multiAddrs, peers] = await this.dc?._connectToObjNodes(rootCid);
    if (!multiAddrs && peers) {
      // 有peers但是没有multiaddrs
      return null;
    }

    const fileCid = await this.resolvePath(rootCid, filePath);
    if (!fileCid) {
      return null;
    }

    // 判断是文件还是目录
    const type = await this.isFileOrDir(fileCid);
    if (type === "directory") {
      // 如果是目录，返回目录列表 (不递归，只返回当前目录下的一级内容)
      const [list, err] = await this.getFolderFileList(
        fileCid,
        cidNeedConnect.NOT_NEED,
        false,
      );
      if (err) {
        console.error("getFileFromDir getFolderFileList error:", err);
        return null;
      }
      return list;
    }

    return this.getFileFromDc(fileCid, decryptKey, cidNeedConnect.NOT_NEED);
  }
}

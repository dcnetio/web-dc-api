
import { Ed25519PrivKey, Ed25519PubKey } from "../common/dc-key/ed25519";
import type { DCConnectInfo, APPInfo } from "../common/types/types";
import type { HeliaLibp2p } from "helia";
import { Libp2p } from "@libp2p/interface";
import { ChainUtil } from "../common/chain";
import { DcUtil } from "../common/dcutil";
import { DBManager } from "../implements/threaddb/dbmanager";
import { DCGrpcServer } from "../implements/threaddb/net/grpcserver";

/**
 * 核心系统上下文接口
 * 定义所有模块可以访问的核心系统组件
 */
export interface DCContext {
  // 核心基础设施
  dcNodeClient: HeliaLibp2p<Libp2p<any>>;
  dcChain: ChainUtil;
  dcutil: DcUtil;
  
  // 连接信息
  connectedDc: DCConnectInfo;
  // 账号信息备份连接信息
  AccountBackupDc: DCConnectInfo;
  
  // 应用信息
  appInfo: APPInfo;
  
  // 数据库管理器
  dbManager?: DBManager;
  
  // 身份相关
  publicKey: Ed25519PubKey | undefined;
  privKey: Ed25519PrivKey | undefined;

  grpcServer: DCGrpcServer;
  
  // 核心功能
  sign(payload: Uint8Array): Promise<Uint8Array> ;
  getPubkeyRaw(): Uint8Array;
  getPublicKey(): Ed25519PubKey;
}

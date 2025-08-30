import type { Multiaddr } from "@multiformats/multiaddr";
import {  AIProxyConfig, DCConnectInfo, OnStreamResponseType, ProxyCallConfig, ThemeComment, UserProxyCallConfig } from "../../common/types/types";
import { AIProxyUserPermission, cidNeedConnect, OpenFlag } from "../../common/constants";
import { CommentManager } from "../comment/manager";
import { HeliaLibp2p } from "helia";
import { ChainUtil } from "../../common/chain";
import { DcUtil } from "../../common/dcutil";
import { Ed25519PubKey } from "../../common/dc-key/ed25519";
import { sha256, uint32ToLittleEndianBytes } from "../../util/utils";
import { base32 } from "multiformats/bases/base32";
import { Client } from "../../common/dcapi";
import { CommentType, Direction } from "../../common/define";
import { DCContext } from "../../../lib/interfaces/DCContext";
import { AIProxyClient } from "./client";
import { FileManager } from "../file/manager";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { BrowserLineReader, readLine } from "../../util/BrowserLineReader";
import { dcnet } from "../../proto/dcnet_proto";
import { bytesToHex } from "@noble/curves/abstract/utils";
import { KeyValueClient } from "../keyvalue/client";
import { SymmetricKey } from "../threaddb/common/key";
import { Libp2p } from "@libp2p/interface";

// 错误定义
export class AIProxyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIProxyError";
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new AIProxyError("no dc peer connected"),
  ErrKeyNotValid: new AIProxyError("key not valid"),
  // nodeAddr is null
  ErrNodeAddrIsNull: new AIProxyError("nodeAddr is null"),
  // chainUtil is null
  ErrChainUtilIsNull: new AIProxyError("chainUtil is null"),
  // account privatekey sign is null
  ErrAccountPrivateSignIsNull: new AIProxyError("account privatekey sign is null"),
  // account publickey is null
  ErrAccountPublicKeyIsNull: new AIProxyError("account publickey is null"),
};






export class AIProxyManager {
  private dc: DcUtil;
  private dcNodeClient: HeliaLibp2p<Libp2p>;
  private chainUtil: ChainUtil;
  private context: DCContext;
  constructor(
    dc: DcUtil,
    dcNodeClient: HeliaLibp2p<Libp2p>,
    chainUtil: ChainUtil,
    context: DCContext
  ) {
    this.dc = dc;
    this.dcNodeClient = dcNodeClient;
    this.chainUtil = chainUtil;
    this.context = context;
  }

  // 创建AI调用的Proxy配置
  async createProxyConfig(
    appId: string,
    configTheme: string, 
  ): Promise<[number | null, Error | null]> {
    // Default group to "DCAPP" if empty
    if (appId === "") {
      appId = "DCAPP";
    }

    const space = 100 << 20;
    // Theme must start with "keyvalue_"
    if (!configTheme.startsWith("keyvalue_")) {
        configTheme = "keyvalue_" + configTheme;
    }
  
    try {
      // Assuming AddThemeObjDeal is implemented elsewhere
      const commentManager = new CommentManager(this.context);
      const res = await commentManager.addThemeObj(
        appId,
        configTheme,
        OpenFlag.AUTH,
        space 
      );
      return res;
    } catch (error) {
      return [null, error as Error];
    }
  }



  // 删除AI调用的Proxy配置
  async deleteProxyConfig(
    appId: string,
    configTheme: string, 
  ): Promise<[number | null, Error | null]> {
    // Default group to "DCAPP" if empty
    if (appId === "") {
      appId = "DCAPP";
    }

    // Theme must start with "keyvalue_"
    if (!configTheme.startsWith("keyvalue_")) {
        configTheme = "keyvalue_" + configTheme;
    }
  
    try {
      const commentManager = new CommentManager(this.context);
      const res = await commentManager.deleteThemeObj(
        appId,
        configTheme
      );
      return res;
    } catch (error) {
      return [null, error as Error];
    }
  }



  //配置AI代理的访问配置,如果key的值设置为空,则表示删除该key的配置
  async configAIProxy(
    appId: string,
    configAuthor: string,
    configTheme: string,
    serviceName: string,
    serviceConfig?: AIProxyConfig,
    vaccount?: string
  ): Promise<[boolean | null, Error | null]> {
    if(!this.context.publicKey) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    const blockHeight: number = await this.chainUtil.getBlockHeight() || 0;
    const userPubkey = this.context.getPublicKey();
    let userPubkeyStr = userPubkey.string();
    if (!configTheme.startsWith("keyvalue_")) {
        configTheme = "keyvalue_" + configTheme;
    }
  
    let client = this.context.AccountBackupDc?.client || null;
    if (!client){
        client = await this.dc.connectToUserDcPeer(this.context.publicKey.raw);
    }
    if (!client) {
        return [null, Errors.ErrNoDcPeerConnected];
    }
      //获取token
    await client.GetToken(
          this.context.appInfo.appId || "",
          this.context.publicKey.string(),
          this.context.sign
        );
    

    if (client === null) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    if (client.token  == "") {
       await client.GetToken(
          this.context.appInfo.appId || "",
          this.context.publicKey.string(),
          this.context.sign
        );
    }

    let content = '';
    const key = serviceName
    if (!serviceConfig) {
        content = `${key}`;
    }else{
        serviceConfig.blockheight = blockHeight;
        const value = JSON.stringify(serviceConfig)
        content = `${key}:${value}`;   
    }
    const contentUint8 = new TextEncoder().encode(content);
    const contenthash = await sha256(contentUint8);
    const contentCidBase32 = base32.encode(contenthash);

    const contentSize = contentUint8.length;

    
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
      blockHeight ? blockHeight : 0
    );
    const themeValue: Uint8Array = new TextEncoder().encode(configTheme);
    const themeAuthorValue: Uint8Array = new TextEncoder().encode(configAuthor);
    const appIdValue: Uint8Array = new TextEncoder().encode(appId);
    const contentCidValue: Uint8Array = new TextEncoder().encode(
      contentCidBase32
    );
    const typeValue: Uint8Array = uint32ToLittleEndianBytes(
      CommentType.KeyValue
    );
    const preSign = new Uint8Array([
      ...themeValue,
      ...appIdValue,
      ...themeAuthorValue,
      ...hValue,
      ...contentCidValue,
      ...typeValue,
    ]);
    const signature = await this.context.sign(preSign);
    const keyValueClient = new KeyValueClient(client, this.context);
    try {
      const res = await keyValueClient.setKeyValue(
        configTheme,
        appId,
        configAuthor,
        blockHeight,
        userPubkeyStr,
        contentCidBase32,
        content,
        contentSize,
        CommentType.KeyValue,
        signature,
        vaccount
      );

      if (res !== 0) {
        return [null, new Error(`configAIProxy fail, resFlag:${res}`)];
      }
      return [true, null];
    } catch (error) {
      return [false, error as Error];
    }
  }



  //配置用户的访问权限
  async configAuth(
    appId: string,
    configAuthor: string,
    configTheme: string,
    authPubkey: string,
    permission: AIProxyUserPermission,
    authConfig: ProxyCallConfig,
    vaccount?: string
  ): Promise<[number | null, Error | null]> {
    if(!this.context.publicKey) {
      return [null, Errors.ErrAccountPublicKeyIsNull];
    }
    if (!configTheme.startsWith("keyvalue_")) {
        configTheme = "keyvalue_" + configTheme;
    }
    if (!configTheme.endsWith("_authlist")) {
      configTheme = configTheme + "_authlist";
    }

    const userPubkey = this.context.getPublicKey();
    let userPubkeyStr = userPubkey.string();

    let client = this.context.AccountBackupDc?.client || null;
    if (!client){
        client = await this.dc.connectToUserDcPeer(this.context.publicKey.raw);
    }
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (client.token  == "") {
       await client.GetToken(
          this.context.appInfo.appId || "",
          this.context.publicKey.string(),
          this.context.sign
        );
    }

    const themeAuthorPubkey: Ed25519PubKey =
      Ed25519PubKey.edPubkeyFromStr(configAuthor);

    let pubkeyFlag = true;
    let forPubkey: Ed25519PubKey | null  = null;
    try {
      forPubkey = Ed25519PubKey.edPubkeyFromStr(authPubkey);
    } catch (error) {
      pubkeyFlag = false;
    }
    let forPubkeyHex: string;
    if (pubkeyFlag && forPubkey) {
      forPubkeyHex = forPubkey.string();
    } else {
      forPubkeyHex = authPubkey;
    }
    //将authConfig转换为字符串
    const remark = JSON.stringify(authConfig);
    const content = `${forPubkeyHex}:${permission}:${remark}`;

    // Generate contentCid (sha256 of content)
    const commentUint8 = new TextEncoder().encode(content);
    const contentHash = await sha256(commentUint8);
    const contentCid = base32.encode(contentHash);

    // Get blockchain height
    let blockHeight: number;
    try {
      blockHeight = await this.chainUtil.getBlockHeight() || 0;
    } catch (error) {
      return [null, new Error("ErrGetBlockHeightFail")];
    }

    const contentSize = commentUint8.length;

    // Create binary representation of blockHeight (little endian)
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
      blockHeight ? blockHeight : 0
    );
    // Create binary representation of type (little endian)
    const typeValue: Uint8Array = uint32ToLittleEndianBytes(
      CommentType.Comment
    );
    // sign(Theme+appId+objAuthor+blockheight+contentCid)
    const themeValue: Uint8Array = new TextEncoder().encode(configTheme);
    const appIdValue: Uint8Array = new TextEncoder().encode(appId);
    const themeAuthorValue: Uint8Array = new TextEncoder().encode(
      themeAuthorPubkey.string()
    );
    const contentCidValue: Uint8Array = new TextEncoder().encode(contentCid);
    let preSign = new Uint8Array([
      ...themeValue,
      ...appIdValue,
      ...themeAuthorValue,
      ...hValue,
      ...contentCidValue,
      ...typeValue,
    ]);

    const signature = await this.context.sign(preSign);

    const keyValueClient = new KeyValueClient(client, this.context);
    try {
      const res = await keyValueClient.configThemeObjAuth(
        configTheme,
        appId,
        configAuthor,
        blockHeight,
        userPubkeyStr,
        contentCid,
        content,
        contentSize,
        CommentType.Comment,
        signature
      );

      if (res !== 0) {
        return [null, new Error(`configThemeObjAuth fail, resFlag: ${res}`)];
      }
    } catch (error) {
      return [null, error as Error];
    }

    return [0, null];
  }

  //获取的ai代理的所有配置,包括服务与授权列表
  async GetAIProxyConfig(
    appId: string,
    themeAuthor: string,
    configTheme: string,
    vaccount?: string
  ): Promise<[UserProxyCallConfig[] | null,AIProxyConfig[] | null, Error | null]> {
    if(!this.context.publicKey) {
      return [null,null, Errors.ErrAccountPublicKeyIsNull];
    }
    if (!configTheme.startsWith("keyvalue_")) {
        configTheme = "keyvalue_" + configTheme;
    }
   

 

    let client = this.context.AccountBackupDc.client || null;
       if (themeAuthor != this.context.publicKey.string()) {//查询他人主题评论
         const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(themeAuthor);
         client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
         if (!client) {
           return [null,null, Errors.ErrNoDcPeerConnected];
         }
       }
    if (client === null) {
      return [null,null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null,null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (client.token  == "") {
       await client.GetToken(
          this.context.appInfo.appId || "",
          this.context.publicKey.string(),
          this.context.sign
        );
    }
    try {
        const aiProxyClient = new AIProxyClient(client, this.context);
        const [proxyConfigCid, aesKey, error] = await aiProxyClient.GetAIProxyConfig(
          appId,
          themeAuthor,
          configTheme
        )
        if (error) {
          return [null,null, error];
        }
        const fileManager = new FileManager(
            this.dc,
            this.context.AccountBackupDc,
            this.chainUtil,
            this.dcNodeClient,
            this.context
            );
        const cid = proxyConfigCid;
        const fileContent = await fileManager.getFileFromDc(
            cid,
            "",
            cidNeedConnect.NOT_NEED,
            false
            );
        if (!fileContent) {
        return [[],[], null];
        }
        const fileContentString = uint8ArrayToString(fileContent);
        const result = await this.handleAllConfig(fileContentString, aesKey);
        if (!result) {
          return [[], [], null];
        }
        const [allAuth, allContent] = result;
        return [allAuth, allContent, null];

    } catch (error) {
      return [null, null, error as  Error];
    }
  }


  private handleAllConfig = async (fileContentString: string,aesKey:string): Promise<[UserProxyCallConfig[],AIProxyConfig[]] | null> => {
      const reader = new BrowserLineReader(fileContentString);
      let allContent: Array<AIProxyConfig> = [];
       let allAuth: Array<UserProxyCallConfig> = [];
  
      if (!this.context.getPublicKey()) {
        return null;
      }
      const decryptKey = SymmetricKey.fromString(aesKey);
      // readLine 循环
      while (true) {
        const { line, error } = readLine(reader);
        if (error && error.message !== "EOF") {
          console.error("读取错误:", error);
          break;
        } else if (line) {
          // 将Uint8Array转回字符串
          const decoder = new TextDecoder();
          const lineString = decoder.decode(line);
          if (!lineString) {
            break;
          }
          const lineContent = base32.decode(lineString);
          const plainContent = await decryptKey.decrypt(lineContent);
          const contentStr = new TextDecoder().decode(plainContent);
          if (!contentStr) {
            continue; // 如果内容为空，跳过
          }
          if (contentStr.startsWith("$$auth$$:")) { //授权信息
            try {
              const authContent = contentStr.split("$$auth$$:")[1];
              if (!authContent ) {
                console.error("无效的授权信息格式:", contentStr);
                continue; // 如果格式不正确，跳过
              }
              const parts = authContent.split(":");
              if (parts.length < 2) {
                console.error("无效的授权信息格式:", authContent);
                continue; // 如果格式不正确，跳过
              }
              //解析出userpubkey
              const userPubkey = parts[0] || "";
              const permission = parts[1] || "";
              const authContentStr = authContent.substring(
                userPubkey.length + permission.length + 2 // +2 for the colon and the next colon
              );
              //解析到ProxyCallConfig结构
              const authConfig = JSON.parse(authContentStr);
              allAuth.push({
                UserPubkey: userPubkey,
                permission: parseInt(permission), //转成数字
                authConfig: authConfig,
              });
            } catch (error) {
              console.error("解析授权信息错误:", error);
            }
            continue;
          }
          //keyvalue中取出value
          const parts: string[] = contentStr.split(":");
          if (parts.length < 2) {
            console.error("无效的内容格式:", contentStr);
            continue; // 如果格式不正确，跳过
          }

          const value = contentStr.substring((parts[0]||"").length + 1);
          try {
            const content = JSON.parse(value);
            allContent.push(content as AIProxyConfig);
          } catch (error) {
            console.error("解析内容错误:", error);
          }
        }
      }
      return [allAuth, allContent] as [Array<UserProxyCallConfig>, Array<AIProxyConfig>];   
    };

    
  async GetUserOwnAIProxyAuth(
    appId: string,
    themeAuthor: string,
    configTheme: string,
  ): Promise<[authConfig: ProxyCallConfig | null, error: Error | null]> {
    if(!this.context.publicKey) {
        return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if( !configTheme.startsWith("keyvalue_")) {
        configTheme = "keyvalue_" + configTheme;
    }
    
     let client = this.context.AccountBackupDc?.client || null;
       if (themeAuthor != this.context.publicKey.string()) {//查询他人主题评论
         const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(themeAuthor);
         client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
         if (!client) {
           return [null, Errors.ErrNoDcPeerConnected];
         }
       }

    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (client.token  == "") {
       await client.GetToken(
          this.context.appInfo.appId || "",
          this.context.publicKey.string(),
          this.context.sign
        );
    }
    const aiProxyClient = new AIProxyClient(client, this.context);
    const [authInfo, error] = await aiProxyClient.GetUserOwnAIProxyAuth(
      appId,
      themeAuthor,
      configTheme
    );
    if (error) {
      return [null, error];
    }
    try {
      const authConfig = JSON.parse(authInfo);
      return [authConfig, error];
    }catch (error:any) {
      return [null, error];
    }
  }
    
  //AI相关代理的调用,包括代理与AI的通信或者与MCPServer的通信
 async DoAIProxyCall( 
    context: { signal?: AbortSignal },
    appId: string,
    themeAuthor: string,
    configTheme: string,
    serviceName: string,
    reqBody: string,
    forceRefresh: boolean,
    onStreamResponse: OnStreamResponseType | null = null ,
    headers?: string,
    path?: string,
    model?: string): Promise< number>
    {
       if( !configTheme.startsWith("keyvalue_")) {
            configTheme = "keyvalue_" + configTheme;
        }
        const blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
        const hValue: Uint8Array = uint32ToLittleEndianBytes(
            blockHeight ? blockHeight : 0
        );
        const forceRefreshFlag = forceRefresh ? 1 : 0;
        const forceRefreshValue: Uint8Array = uint32ToLittleEndianBytes(forceRefreshFlag);
        const themeAuthorValue: Uint8Array = new TextEncoder().encode(themeAuthor);
        const themeValue: Uint8Array = new TextEncoder().encode(configTheme);
        const appIdValue: Uint8Array = new TextEncoder().encode(appId);
        const serviceNameValue: Uint8Array = new TextEncoder().encode(serviceName);
        const pathValue: Uint8Array = new TextEncoder().encode(path);
        const headersValue: Uint8Array = new TextEncoder().encode(headers);
        const reqBodyValue: Uint8Array = new TextEncoder().encode(reqBody);
        const modelValue: Uint8Array = new TextEncoder().encode(model);
        const preSign = new Uint8Array([
            ...themeValue,
            ...appIdValue,
            ...themeAuthorValue,
            ...hValue,
            ...serviceNameValue,
            ...pathValue,
            ...reqBodyValue,
            ...forceRefreshValue,
            ...modelValue,
            ...headersValue
        ]);
        if (!this.context.AccountBackupDc.client) {
          throw new Error("ErrConnectToAccountPeersFail");
        }
        if(!this.context.publicKey){
            throw new Error("ErrConnectToAccountPeersFail");
        }

        if (this.context.AccountBackupDc.client.token == "") {
          await this.context.AccountBackupDc.client.GetToken(
              this.context.appInfo.appId || "",
              this.context.publicKey.string(),
              this.context.sign
            );
        }
        const signature = await  this.context.sign(preSign);
        const proxyClient = new AIProxyClient(
            this.context.AccountBackupDc.client,
            this.context
        );
        let res = await proxyClient.DoAIProxyCall(
            context,
            appId,
            themeAuthor,
            configTheme,
            serviceName,
            path || "",
            headers || "",
            reqBody,
            model || "",
            forceRefreshFlag,
            blockHeight ,
            signature,
            onStreamResponse
        );
       return res;
      }
}


import type { Multiaddr } from "@multiformats/multiaddr";
import { AIProxyConfig, DCConnectInfo, OnStreamResponseType, ProxyCallConfig, ThemeComment, UserProxyCallConfig } from "../../common/types/types";
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
import { dcnet } from "lib/proto/dcnet_proto";
import { bytesToHex } from "@noble/curves/abstract/utils";
import { KeyValueClient } from "../keyvalue/client";
import { SymmetricKey } from "../threaddb/common/key";
import { Errors } from "../cache/manager";







export class AIProxyManager {
  private dc: DcUtil;
  private accountBackUpDc: DCConnectInfo = {};
  private dcNodeClient: HeliaLibp2p;
  private chainUtil: ChainUtil;
  private context: DCContext;
  constructor(
    dc: DcUtil,
    accountBackUpDc: DCConnectInfo,
    dcNodeClient: HeliaLibp2p,
    chainUtil: ChainUtil,
    context: DCContext
  ) {
    this.dc = dc;
    this.accountBackUpDc = accountBackUpDc;
    this.dcNodeClient = dcNodeClient;
    this.chainUtil = chainUtil;
    this.context = context;
  }

  // 创建AI调用的Proxy配置
  async createProxyConfig(
    appId: string,
    configTheme: string, 
  ): Promise<[number, Error | null]> {
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



  //配置AI代理的访问配置,如果key的值设置为空,则表示删除该key的配置
  async configAIProxy(
    appId: string,
    configAuthor: string,
    configTheme: string,
    serviceName: string,
    serviceConfig?: AIProxyConfig,
    vaccount?: string
  ): Promise<[boolean, Error | null]> {
    
    const userPubkey = this.context.getPublicKey();
    let userPubkeyStr = userPubkey.string();

    let client = this.accountBackUpDc.client;
       if (configAuthor != this.context.publicKey.string()) {//查询他人主题评论
         const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(configAuthor);
         client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
         if (!client) {
           return [null, Errors.ErrNoDcPeerConnected];
         }
         //获取token
         await client.GetToken(this.context.publicKey.string(),this.context.sign);
       }
    let content = '';
    const key = serviceName
    if (!serviceConfig) {
        content = `${key}`;
    }else{
        const value = JSON.stringify(serviceConfig)
        content = `${key}:${value}`;   
    }
    const contentUint8 = new TextEncoder().encode(content);
    const contenthash = await sha256(contentUint8);
    const contentCidBase32 = base32.encode(contenthash);

    const contentSize = content.length;

    const blockHeight: number = await this.chainUtil.getBlockHeight();
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
      return [false, error];
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
  ): Promise<[number, Error | null]> {
    if (!configTheme.endsWith("_authlist")) {
      configTheme = configTheme + "_authlist";
    }

    const userPubkey = this.context.getPublicKey();
    let userPubkeyStr = userPubkey.string();

    let client = this.accountBackUpDc.client;
       if (configAuthor != this.context.publicKey.string()) {//查询他人主题评论
         const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(configAuthor);
         client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
         if (!client) {
           return [null, Errors.ErrNoDcPeerConnected];
         }
         //获取token
         await client.GetToken(this.context.publicKey.string(),this.context.sign);
       }
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    const themeAuthorPubkey: Ed25519PubKey =
      Ed25519PubKey.edPubkeyFromStr(configAuthor);

    let pubkeyFlag = true;
    let forPubkey: Ed25519PubKey;
    try {
      forPubkey = Ed25519PubKey.edPubkeyFromStr(authPubkey);
    } catch (error) {
      pubkeyFlag = false;
    }
    let forPubkeyHex: string;
    if (pubkeyFlag) {
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
      blockHeight = await this.chainUtil.getBlockHeight();
    } catch (error) {
      return [null, new Error("ErrGetBlockHeightFail")];
    }

    const contentSize = content.length;

    // Create binary representation of blockHeight (little endian)
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
      blockHeight ? blockHeight : 0
    );
    // Create binary representation of type (little endian)
    const typeValue: Uint8Array = uint32ToLittleEndianBytes(
      CommentType.KeyValue
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
        CommentType.KeyValue,
        signature
      );

      if (res !== 0) {
        return [null, new Error(`configThemeObjAuth fail, resFlag: ${res}`)];
      }
    } catch (error) {
      return [null, error];
    }
  }

  //获取的ai代理的所有配置,包括服务与授权列表
  async GetAIProxyConfig(
    appId: string,
    themeAuthor: string,
    configThem: string,
    vaccount?: string
  ): Promise<[UserProxyCallConfig[] | null,AIProxyConfig[] | null, Error | null]> {
    if (!configThem.endsWith("_authlist")) {
      configThem = configThem + "_authlist";
    }
    const userPubkey = this.context.getPublicKey();
    let userPubkeyStr = userPubkey.string();

    let client = this.accountBackUpDc.client;
       if (themeAuthor != this.context.publicKey.string()) {//查询他人主题评论
         const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(themeAuthor);
         client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
         if (!client) {
           return [null,null, Errors.ErrNoDcPeerConnected];
         }
         //获取token
         await client.GetToken(this.context.publicKey.string(),this.context.sign);
       }
    if (client === null) {
      return [null,null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null,null, new Error("ErrConnectToAccountPeersFail")];
    }
    try {
        const aiProxyClient = new AIProxyClient(client, this.context);
        const [proxyConfigCid, aesKey, error] = await aiProxyClient.GetAIProxyConfig(
          appId,
          themeAuthor,
          configThem
        )
        if (error) {
          return [null,null, error];
        }
        const fileManager = new FileManager(
            this.dc,
            this.accountBackUpDc,
            this.chainUtil,
            this.dcNodeClient,
            this.context
            );
        const cid = proxyConfigCid;
        const fileContent = await fileManager.getFileFromDc(
            cid,
            "",
            cidNeedConnect.NOT_NEED
            );
        console.log("getAIProxyConfig fileContent:", fileContent);
        if (!fileContent) {
        return [[],[], null];
        }
        const fileContentString = uint8ArrayToString(fileContent);
        const [allAuth,allContent] = await this.handleAllConfig(fileContentString,aesKey);
        console.log("getThemeComments allContent:", allContent);
        return [allAuth,allContent, null];

    } catch (error) {
      return [null,null, error];
    }
  }


  private handleAllConfig = async (fileContentString: string,aesKey:string) => {
      const reader = new BrowserLineReader(fileContentString);
      let allContent: Array<AIProxyConfig> = [];
       let allAuth: Array<UserProxyCallConfig> = [];
  
      if (!this.context.getPublicKey()) {
        return;
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
          if (plainContent.toString().startsWith("$$auth$$:")) { //授权信息
            try {
              const authContent = plainContent.toString().split("$$auth$$:")[1];
              //解析出userpubkey
              const userPubkey = authContent.split(":")[0];
              const permission = authContent.split(":")[1];
              const authContentStr = authContent.split(":")[2];
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
          const content = JSON.parse(plainContent.toString());
          allContent.push({
            blockheight: content.blockheight,
            isAIModel: content.isAIModel,
            apiType: content.apiType,
            authorization: content.authorization,
            endpoint: content.endpoint,
            organization: content.organization,
            apiVersion: content.apiVersion,
            model: content.model,
            remark: content.remark,
          } as AIProxyConfig);
        }
      }
      return [allAuth, allContent] as [Array<UserProxyCallConfig>, Array<AIProxyConfig>];   
    };

    
  async GetUserOwnAIProxyAuth(
    appId: string,
    themeAuthor: string,
    configThem: string,
  ): Promise<[authConfig: ProxyCallConfig, error: Error | null]> {
    
     let client = this.accountBackUpDc.client;
       if (themeAuthor != this.context.publicKey.string()) {//查询他人主题评论
         const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(themeAuthor);
         client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
         if (!client) {
           return [null, Errors.ErrNoDcPeerConnected];
         }
         //获取token
         await client.GetToken(this.context.publicKey.string(),this.context.sign);
       }

    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    const aiProxyClient = new AIProxyClient(client, this.context);
    const [authInfo, error] = await aiProxyClient.GetUserOwnAIProxyAuth(
      appId,
      themeAuthor,
      configThem
    );
    if (error) {
      return [null, error];
    }
    const authConfig = JSON.parse(authInfo);
    return [authConfig, error];
  }
    
  //AI相关代理的调用,包括代理与AI的通信或者与MCPServer的通信
 async DoAIProxyCall( 
    appId: string,
    themeAuthor: string,
    configThem: string,
    serviceName: string,
    reqBody: string,
    forceRefresh: boolean,
    onStreamResponse: OnStreamResponseType = null ,
    headers?: string,
    path?: string,
    model?: string): Promise< number>
    {
        const blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
        const hValue: Uint8Array = uint32ToLittleEndianBytes(
            blockHeight ? blockHeight : 0
        );
        const forceRefreshFlag = forceRefresh ? 1 : 0;
        const forceRefreshValue: Uint8Array = uint32ToLittleEndianBytes(forceRefreshFlag);
        const themeAuthorValue: Uint8Array = new TextEncoder().encode(themeAuthor);
        const themeValue: Uint8Array = new TextEncoder().encode(configThem);
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
            ...modelValue,
            ...forceRefreshValue,
            ...headersValue
        ]);
        const signature = await  this.context.sign(preSign);
        const proxyClient = new AIProxyClient(
            this.accountBackUpDc.client,
            this.context
        );
        let res = await proxyClient.DoAIProxyCall(
            appId,
            themeAuthor,
            configThem,
            serviceName,
            path,
            headers,
            reqBody,
            model,
            forceRefreshFlag,
            blockHeight ,
            signature,
            onStreamResponse
        );
       return res;
    } catch (err:any) {
        throw err;
    }

}


import {
  AIProxyConfig,
  AIServiceUsage,
  GetUserAIProxyAuthParams,
  OnStreamResponseType,
  ProxyCallConfig,
  UserAIProxyAuthResult,
  UserProxyCallConfig,
} from "../../common/types/types";
import {
  AIProxyUserPermission,
  OpenFlag,
} from "../../common/constants";
import { CommentManager } from "../comment/manager";
import { Helia } from "helia";
import { ChainUtil } from "../../common/chain";
import { DcUtil } from "../../common/dcutil";
import { Ed25519PubKey } from "../../common/dc-key/ed25519";
import { sha256, uint32ToLittleEndianBytes } from "../../util/utils";
import { base32 } from "multiformats/bases/base32";
import { CommentType, Direction } from "../../common/define";
import { DCContext } from "../../../lib/interfaces/DCContext";
import { AIProxyClient } from "./client";
import { BrowserLineReader, readLine } from "../../util/BrowserLineReader";
import { KeyValueClient } from "../keyvalue/client";
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
  ErrAccountPrivateSignIsNull: new AIProxyError(
    "account privatekey sign is null"
  ),
  // account publickey is null
  ErrAccountPublicKeyIsNull: new AIProxyError("account publickey is null"),
};

export class AIProxyManager {
  private dc: DcUtil;
  private dcNodeClient: Helia<Libp2p>;
  private chainUtil: ChainUtil;
  private context: DCContext;
  constructor(
    dc: DcUtil,
    dcNodeClient: Helia<Libp2p>,
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
    configTheme: string
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
    configTheme: string
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
      const res = await commentManager.deleteThemeObj(appId, configTheme);
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
    if (!this.context.publicKey) {
      return [null, Errors.ErrNoDcPeerConnected];
    }
    const blockHeight: number = (await this.chainUtil.getBlockHeight()) || 0;
    const userPubkey = this.context.getPublicKey();
    let userPubkeyStr = userPubkey.string();
    if (!configTheme.startsWith("keyvalue_")) {
      configTheme = "keyvalue_" + configTheme;
    }

    let client = this.context.AccountBackupDc?.client || null;
    if (!client) {
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
    if (client.token == "") {
      await client.GetToken(
        this.context.appInfo.appId || "",
        this.context.publicKey.string(),
        this.context.sign
      );
    }

    let content = "";
    const key = serviceName;
    if (!serviceConfig) {
      content = `${key}`;
    } else {
      serviceConfig.blockheight = blockHeight;
      const value = JSON.stringify(serviceConfig);
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
      const [resFlag, _] = await keyValueClient.setKeyValue(
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

      if (resFlag !== 0) {
        return [null, new Error(`configAIProxy fail, resFlag:${resFlag}`)];
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
    authConfig: ProxyCallConfig[],
    vaccount?: string
  ): Promise<[number | null, Error | null]> {
    if (!this.context.publicKey) {
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
    if (!client) {
      client = await this.dc.connectToUserDcPeer(this.context.publicKey.raw);
    }
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (client.token == "") {
      await client.GetToken(
        this.context.appInfo.appId || "",
        this.context.publicKey.string(),
        this.context.sign
      );
    }

    const themeAuthorPubkey: Ed25519PubKey =
      Ed25519PubKey.edPubkeyFromStr(configAuthor);

    let pubkeyFlag = true;
    let forPubkey: Ed25519PubKey | null = null;
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
      blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
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
  ): Promise<
    [UserProxyCallConfig[] | null, AIProxyConfig[] | null, number, Uint8Array | null, Error | null]
  > {
    if (!this.context.publicKey) {
      return [null, null, 0, null, Errors.ErrAccountPublicKeyIsNull];
    }
    if (!configTheme.startsWith("keyvalue_")) {
      configTheme = "keyvalue_" + configTheme;
    }

    let client = this.context.AccountBackupDc.client || null;
    if (themeAuthor != this.context.publicKey.string()) {
      //查询他人主题评论
      const authorPublicKey: Ed25519PubKey =
        Ed25519PubKey.edPubkeyFromStr(themeAuthor);
      client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
      if (!client) {
        return [null, null, 0, null, Errors.ErrNoDcPeerConnected];
      }
    }
    if (client === null) {
      return [null, null, 0, null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, null, 0, null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (client.token == "") {
      await client.GetToken(
        this.context.appInfo.appId || "",
        this.context.publicKey.string(),
        this.context.sign
      );
    }
    try {
      const aiProxyClient = new AIProxyClient(client, this.context);
      const [configData, userCount, nextSeekKey, error] = await aiProxyClient.GetAIProxyConfig(
        appId,
        themeAuthor,
        configTheme
      );
      if (error) {
        return [null, null, 0, null, error];
      }
      if (!configData) {
        return [[], [], userCount, nextSeekKey, null];
      }
      const result = await this.handleAllConfig(configData);
      if (!result) {
        return [[], [], userCount, nextSeekKey, null];
      }
      const [allAuth, allContent] = result;
      return [allAuth, allContent, userCount, nextSeekKey, null];
    } catch (error) {
      return [null, null, 0, null, error as Error];
    }
  }

  private handleAllConfig = async (
    fileContentString: string
  ): Promise<[UserProxyCallConfig[], AIProxyConfig[]] | null> => {
    const reader = new BrowserLineReader(fileContentString);
    let allContent: Array<AIProxyConfig> = [];
    let allAuth: Array<UserProxyCallConfig> = [];

    if (!this.context.getPublicKey()) {
      return null;
    }
    // readLine 循环
    while (true) {
      const { line, error } = readLine(reader);
      if (error && error.message !== "EOF") {
        console.warn("读取错误:", error);
        break;
      } else if (line) {
        // 将Uint8Array转回字符串
        const decoder = new TextDecoder();
        const lineString = decoder.decode(line);
        if (!lineString) {
          break;
        }
        const contentStr = this.decodeConfigLine(lineString);
        if (!contentStr) {
          continue; // 如果内容为空，跳过
        }
        if (contentStr.startsWith("$$auth$$:")) {
          //授权信息
          try {
            const authContent = contentStr.split("$$auth$$:")[1];
            if (!authContent) {
              console.warn("无效的授权信息格式:", contentStr);
              continue; // 如果格式不正确，跳过
            }
            // 格式: $$auth$$:<commentKey>:<userPubkey>:<authJSON>
            // commentKey = "<blockheight>/<commentCid>"，不含冒号
            // userPubkey = multibase 字符串，不含冒号
            const firstColon = authContent.indexOf(":");
            if (firstColon < 0) {
              console.warn("无效的授权信息格式(缺少userPubkey):", authContent);
              continue;
            }
            const commentKey = authContent.substring(0, firstColon);
            const rest = authContent.substring(firstColon + 1);
            const secondColon = rest.indexOf(":");
            if (secondColon < 0) {
              console.warn("无效的授权信息格式(缺少authJSON):", authContent);
              continue;
            }
            const userPubkey = rest.substring(0, secondColon);
            const authContentStr = rest.substring(secondColon + 1);
            if (!userPubkey) {
              console.warn("授权信息userPubkey为空:", commentKey);
              continue;
            }
            //解析到ProxyCallConfig结构
            const parsed = JSON.parse(authContentStr);
            const authConfig = Array.isArray(parsed) ? parsed : (parsed?.Exp ? [parsed] : parsed);
            allAuth.push({
              UserPubkey: userPubkey,
              commentKey: commentKey,
              permission: 1, // auth记录存在即表示有访问权限
              authConfig: authConfig,
            });
          } catch (error) {
            console.warn("跳过无效授权信息:", error);
          }
          continue;
        }
        //keyvalue中取出value
        const parts: string[] = contentStr.split(":");
        if (parts.length < 2) {
          console.warn("跳过无效内容格式:", contentStr);
          continue; // 如果格式不正确，跳过
        }

        const valueWithExtra = contentStr.substring(
          (parts[0] || "").length + 1
        );
        try {
          //解析出扩展信息(时间戳,用户公钥等)
          const valueParts = valueWithExtra.split("$$$dckv_extra$$$");
          const value = this.extractLikelyJSON(valueParts[0] || "{}");
          const content = JSON.parse(value);
          if (valueParts.length > 1) {
            const extraStr = this.extractLikelyJSON(valueParts[1] || "{}");
            const extra = JSON.parse(extraStr);
            if (extra) {
              if (extra.dc_timestamp) {
                content.timestamp = extra.dc_timestamp;
              }
              if (extra.dc_opuser) {
                content.userPubkey = extra.dc_opuser;
              }
            }
          }
          allContent.push(content as AIProxyConfig);
        } catch (error) {
          console.warn("解析内容错误:", error);
        }
      }
    }
    return [allAuth, allContent] as [
      Array<UserProxyCallConfig>,
      Array<AIProxyConfig>
    ];
  };

  private decodeConfigLine(lineString: string): string {
    try {
      return new TextDecoder().decode(base32.decode(lineString));
    } catch {
      return lineString;
    }
  }

  private extractLikelyJSON(raw: string): string {
    const text = String(raw || "").trim();
    if (!text) {
      return "{}";
    }

    if ((text.startsWith("{") && text.endsWith("}")) || (text.startsWith("[") && text.endsWith("]"))) {
      return text;
    }

    const objectStart = text.indexOf("{");
    const objectEnd = text.lastIndexOf("}");
    if (objectStart >= 0 && objectEnd > objectStart) {
      return text.slice(objectStart, objectEnd + 1);
    }

    const arrayStart = text.indexOf("[");
    const arrayEnd = text.lastIndexOf("]");
    if (arrayStart >= 0 && arrayEnd > arrayStart) {
      return text.slice(arrayStart, arrayEnd + 1);
    }

    return text;
  }

  async GetUserOwnAIProxyAuth(
    appId: string,
    themeAuthor: string,
    configTheme: string
  ): Promise<[authConfig: ProxyCallConfig | null, error: Error | null]> {
    if (!this.context.publicKey) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (!configTheme.startsWith("keyvalue_")) {
      configTheme = "keyvalue_" + configTheme;
    }

    let client = this.context.AccountBackupDc?.client || null;
    if (themeAuthor != this.context.publicKey.string()) {
      //查询他人主题评论
      const authorPublicKey: Ed25519PubKey =
        Ed25519PubKey.edPubkeyFromStr(themeAuthor);
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
    if (client.token == "") {
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
      const parsed = JSON.parse(this.extractLikelyJSON(authInfo));
      // 新格式：{ authConfig: string, usageServices?: Record<string, AIServiceUsage> }
      if (parsed && typeof parsed === "object" && "authConfig" in parsed) {
        const innerConfig = parsed.authConfig ? JSON.parse(parsed.authConfig) : null;
        return [innerConfig, null];
      }
      // 旧格式：直接是 ProxyCallConfig
      return [parsed, null];
    } catch (err: any) {
      return [null, err];
    }
  }

  /**
   * 获取当前用户在其备份节点上的 AI 代理使用量统计
   * 注意：该接口强制走 AccountBackupDc，不会切换到 themeAuthor 节点。
   */
  async GetUserOwnAIProxyUsage(
    appId: string,
    themeAuthor: string,
    configTheme: string
  ): Promise<[usageServices: Record<string, AIServiceUsage> | null, error: Error | null]> {
    if (!this.context.publicKey) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (!configTheme.startsWith("keyvalue_")) {
      configTheme = "keyvalue_" + configTheme;
    }

    const client = this.context.AccountBackupDc?.client || null;
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (client.token == "") {
      await client.GetToken(
        this.context.appInfo.appId || "",
        this.context.publicKey.string(),
        this.context.sign
      );
    }

    const aiProxyClient = new AIProxyClient(client, this.context);
    const [usageInfo, error] = await aiProxyClient.GetUserOwnAIProxyUsage(
      appId,
      themeAuthor,
      configTheme
    );
    if (error) {
      return [null, error];
    }

    try {
      const parsed = JSON.parse(this.extractLikelyJSON(usageInfo));
      if (parsed && typeof parsed === "object" && "usageServices" in parsed) {
        return [parsed.usageServices ?? {}, null];
      }
      if (parsed && typeof parsed === "object") {
        return [parsed as Record<string, AIServiceUsage>, null];
      }
      return [{}, null];
    } catch (err: any) {
      return [null, err];
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
    onStreamResponse: OnStreamResponseType | null = null,
    headers?: string,
    path?: string,
    model?: string
  ): Promise<number> {
    if (!configTheme.startsWith("keyvalue_")) {
      configTheme = "keyvalue_" + configTheme;
    }
    const blockHeight = (await this.chainUtil.getBlockHeight()) || 0;
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
      blockHeight || 0
    );
    const forceRefreshFlag = forceRefresh ? 1 : 0;
    const forceRefreshValue: Uint8Array =
      uint32ToLittleEndianBytes(forceRefreshFlag);
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
      ...headersValue,
    ]);
    if (!this.context.AccountBackupDc.client) {
      throw new Error("ErrConnectToAccountPeersFail");
    }
    if (!this.context.publicKey) {
      throw new Error("ErrConnectToAccountPeersFail");
    }

    if (this.context.AccountBackupDc.client.token == "") {
      await this.context.AccountBackupDc.client.GetToken(
        this.context.appInfo.appId || "",
        this.context.publicKey.string(),
        this.context.sign
      );
    }
    const signature = await this.context.sign(preSign);
    const proxyClient = new AIProxyClient(
      this.context.AccountBackupDc.client,
      this.context
    );
    let res: number;
    let callError: unknown;
    try {
      res = await proxyClient.DoAIProxyCall(
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
        blockHeight,
        signature,
        onStreamResponse
      );
    } catch (e) {
      callError = e;
      res = -1;
    }
    if (callError !== undefined) throw callError;
    return res;
  }

  async GetUserAIProxyAuth(
    params: GetUserAIProxyAuthParams
  ): Promise<[result: UserAIProxyAuthResult | null, error: Error | null]> {
    if (!this.context.publicKey) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (!params.theme.startsWith("keyvalue_")) {
      params.theme = "keyvalue_" + params.theme;
    }

    let client = this.context.AccountBackupDc?.client || null;
    if (params.themeAuthor != this.context.publicKey.string()) {
      //查询他人主题评论
      const authorPublicKey: Ed25519PubKey = Ed25519PubKey.edPubkeyFromStr(
        params.themeAuthor
      );
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
    if (client.token == "") {
      await client.GetToken(
        this.context.appInfo.appId || "",
        this.context.publicKey.string(),
        this.context.sign
      );
    }
    const aiProxyClient = new AIProxyClient(client, this.context);
    const [authInfo, error] = await aiProxyClient.GetUserAIProxyAuth(params);
    if (error) {
      return [null, error];
    }
    if (!authInfo) {
      return [{ authConfig: [] }, null];
    }
    try {
      const parsed = JSON.parse(authInfo);
      if (Array.isArray(parsed)) {
        return [{ authConfig: parsed as ProxyCallConfig[] }, null];
      }
      if (!parsed.Exp) {
        return [{ authConfig: [] }, null];
      }
      return [{ authConfig: [parsed as ProxyCallConfig] }, null];
    } catch (error: any) {
      return [null, error];
    }
  }
}

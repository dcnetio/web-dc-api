import { KeyValueClient } from "./client";
import {
  ThemeAuthInfo,
  ThemeComment,
} from "../../common/types/types";
import { OpenFlag } from "../../common/constants";
import { CommentManager } from "../comment/manager";
import { ChainUtil } from "../../common/chain";
import { DcUtil } from "../../common/dcutil";
import { Ed25519PubKey } from "../../common/dc-key/ed25519";
import { sha256, uint32ToLittleEndianBytes } from "../../util/utils";
import { base32 } from "multiformats/bases/base32";
import { CommentType, Direction } from "../../common/define";
import { DCContext } from "../../../lib/interfaces/DCContext";


//定义Key-Value存储的数据类型
export enum KeyValueStoreType { //存储主题类型 1:鉴权主题(读写都需要鉴权) 2:公共主题(默认所有用户可读,写需要鉴权)
  Auth = 1,
  Public = 2,
}

// 共享型主题前缀：主题名以此前缀开头(如 keyvalue_shared_config)时，服务端忽略写入用户的区分，
// 同一个 key 全局只保留唯一最新值(按时间戳后写覆盖)。详见 IKeyValueOperations 接口顶部说明。
export const SHARED_THEME_PREFIX = "keyvalue_shared_";

/** 判断给定主题(可不含 keyvalue_ 前缀)是否为共享型主题 */
export function isSharedTheme(theme: string): boolean {
  return theme.startsWith(SHARED_THEME_PREFIX) || theme.startsWith("shared_");
}

/**
 * 将任意主题名规范化为共享型主题名(keyvalue_shared_xxx)。
 * 兼容输入: "config" / "shared_config" / "keyvalue_config" / "keyvalue_shared_config"，
 * 统一输出为 "keyvalue_shared_config"。已是共享型主题则原样返回。
 */
export function toSharedTheme(theme: string): string {
  let t = theme;
  if (t.startsWith(SHARED_THEME_PREFIX)) {
    return t;
  }
  if (t.startsWith("keyvalue_")) {
    t = t.slice("keyvalue_".length);
  }
  if (t.startsWith("shared_")) {
    t = t.slice("shared_".length);
  }
  return SHARED_THEME_PREFIX + t;
}
// 错误定义
export class KeyValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KeyValueError";
  }
}
export const Errors = {
  ErrNoDcPeerConnected: new KeyValueError("no dc peer connected"),
  ErrPublicKeyIsNull: new KeyValueError("publickey is null"),
};

export class KeyValueDB {
  private appId: string;
  private dbname: string;
  private themeAuthor: string;
  private manager: KeyValueManager;
  constructor(
    appId: string,
    dbname: string,
    themeAuthor: string,
    manager: KeyValueManager
  ) {
    this.appId = appId;
    this.dbname = dbname;
    this.themeAuthor = themeAuthor;
    this.manager = manager;
  }

  getName() {
    return this.dbname;
  }

  getAuthor() {
    return this.themeAuthor;
  }

  getAppId() {
    return this.appId;
  }

  //设置键值对
  async set(
    key: string,
    value: any,
    indexs: string = "",
    vaccount: string = ""
  ): Promise<[boolean | null,number | null, Error | null]> {
    return this.manager.setKeyValue(
      this.appId,
      this.themeAuthor,
      this.dbname,
      key,
      value,
      indexs,
      vaccount
    );
  }



  //获取键值对
  async get(
    key: string,
    writerPubkey?: string,
    vaccount?: string
  ): Promise<[string | null, Error | null]> {
    if (!writerPubkey) {//没有指定写入者,则获取该key的最新值
      const [values, err] = await this.getWithIndex("indexkey_keyself_" + key, "", 1, "", Direction.Reverse, 0, vaccount);
      if (err) {
        return [null, err];
      }
      if (!values) {
        return [null, null];
      }
      const jsonValues = JSON.parse(values);
      if (!Array.isArray(jsonValues)) {
        return [values, null];
      }
      if (jsonValues.length == 0) {
        return [null, null];
      }
      let keyValue ="";
      try{  
        keyValue = jsonValues[0][key];
      }catch(err){
        return [null, err instanceof Error ? err : new Error(String(err))];
      }
      if (!keyValue || keyValue.length == 0) {
        keyValue = jsonValues[0];
      }
      return [keyValue, null];
    }
    return this.manager.getValueWithKey(
      this.appId,
      this.themeAuthor,
      this.dbname,
      writerPubkey,
      key,
      vaccount
    );
  }

  //批量获取键值对
  async getBatch(
    keys: string,
    writerPubkey: string,
    vaccount: string
  ): Promise<[string | null, Error | null]> {
    if (!writerPubkey) {
      writerPubkey = this.themeAuthor;
    }
    return this.manager.getValuesWithKeys(
      this.appId,
      this.themeAuthor,
      this.dbname,
      writerPubkey,
      keys,
      vaccount
    );
  }

  //通过索引获取键值对
  async getWithIndex(
    indexKey: string,
    indexValue: string,
    limit: number = 1000,
    seekKey: string = "",
    direction: Direction = Direction.Forward,
    offset: number = 0,
    vaccount: string = ""
  ): Promise<[string | null, Error | null]> {
    return this.manager.getWithIndex(
      this.appId,
      this.themeAuthor,
      this.dbname,
      indexKey,
      indexValue,
      seekKey,
      direction,
      offset,
      limit,
      vaccount
    );
  }

  //配置授权
  async configAuth(
    authPubkey: string,
    permission: number,
    remark: string,
    vaccount?: string
  ): Promise<[number | null, Error | null]> {
    return this.manager.doConfigAuth(
      this.appId,
      this.themeAuthor,
      this.dbname,
      authPubkey,
      permission,
      remark,
      vaccount
    );
  }

  //获取授权列表
  async getAuthList(
    seekKey: string = "",
    vaccount?: string
  ): Promise<[ThemeAuthInfo[] | null, ThemeComment[] | null, Error | null]> {
    return this.manager.getAuthList(
      this.appId,
      this.themeAuthor,
      this.dbname,
      seekKey,
      vaccount
    );
  }

  //获取授权列表（含用户总数和分页游标）
  async getDbAuthList(
    limit: number = 100,
    seekKey: string = "",
    vaccount?: string
  ): Promise<[ThemeAuthInfo[] | null, number, string, Error | null]> {
    return this.manager.getDbAuthList(
      this.appId,
      this.themeAuthor,
      this.dbname,
      limit,
      seekKey,
      vaccount
    );
  }
}

export class KeyValueManager {
  private dc: DcUtil;
  private chainUtil: ChainUtil;
  private context: DCContext;
  constructor(
    dc: DcUtil,
    chainUtil: ChainUtil,
    context: DCContext
  ) {
    this.dc = dc;
    this.chainUtil = chainUtil;
    this.context = context;
  }

  // 创建Key-Value存储
  async createStore(
    appId: string,
    theme: string,
    space: number,
    type: KeyValueStoreType
  ): Promise<[KeyValueDB | null, Error | null]> {
    if(!this.context.publicKey){
      return [null, Errors.ErrPublicKeyIsNull];
    }
    // Default group to "DCAPP" if empty
    if (appId === "") {
      appId = "DCAPP";
    }

    // Set minimum space (100M)
    space = Math.max(space, 100 << 20)
    // Theme must start with "keyvalue_"
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    // NOTE: There seems to be a logical error in the original code:
    // It checks if theme ends with "_pub" and returns an error if it does,
    // but the error message suggests it should end with "_pub".
    // I'm assuming the condition should check if it doesn't end with "_pub"
    if (type === KeyValueStoreType.Public) {
      // Public theme must end with "_pub"
      if (!theme.endsWith("_pub")) {
        return [
          null,
          new Error(
            "vaCreateStoreTheme failed, public theme must end with '_pub'"
          ),
        ];
      }
    }

    try {
      // Assuming AddThemeObjDeal is implemented elsewhere
      const commentManager = new CommentManager(this.context);
      const res = await commentManager.addThemeObj(
        appId,
        theme,
        OpenFlag.AUTH,
        space || 50 * 1024 * 1024 // 50M
      );
      if (res[0] !== 0 || res[1] !== null) {
        return [null, new Error(`vaCreateStoreTheme failed, resFlag: ${res}`)];
      }
      // Create KeyValueDB instance
      const keyValueDB = new KeyValueDB(
        appId,
        theme,
        this.context.publicKey.string(),
        this
      );
      return [keyValueDB, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  /**
   * 创建共享型 Key-Value 存储(同一个 key 全局只保留唯一最新值，按时间戳后写覆盖)。
   * 与 createStore 的唯一区别是内部会把主题名规范化为 keyvalue_shared_ 前缀，
   * 调用方无需关心命名约定。其余行为(鉴权/公共类型、空间限制、_pub 后缀校验)与 createStore 完全一致。
   * @param appId 应用ID
   * @param theme 主题名称(无需手动加 shared_ 前缀，内部自动处理)
   * @param space 分配的存储空间大小(字节)
   * @param type 存储主题类型 1:鉴权主题 2:公共主题(公共型需以 _pub 结尾)
   */
  async createSharedStore(
    appId: string,
    theme: string,
    space: number,
    type: KeyValueStoreType
  ): Promise<[KeyValueDB | null, Error | null]> {
    return this.createStore(appId, toSharedTheme(theme), space, type);
  }

  async getKeyValueDB(
    appId: string,
    theme: string,
    ThemeAuthor: string
  ): Promise<[KeyValueDB | null, Error | null]> {
      const commentManager = new CommentManager(this.context);
    // Ensure theme starts with "keyvalue_"
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    //先判断主题是否存在,不存在就报错
    const [flag,err] =  await commentManager.isThemeExist(appId, theme, ThemeAuthor);
    if(err){
      return [null, err];
    }
    if (!flag) {
      return [
        null,
        new Error(`Theme ${theme} does not exist for appId ${appId}`),
      ];  
    }
    const keyValueDB = new KeyValueDB(appId, theme, ThemeAuthor, this);
    return [keyValueDB, null];
  }

  async doConfigAuth(
    appId: string,
    themeAuthor: string,
    theme: string,
    authPubkey: string,
    permission: number,
    remark: string,
    vaccount?: string
  ): Promise<[number | null, Error | null]> {
    if(!this.context.publicKey){
      return [null, Errors.ErrPublicKeyIsNull];
    }
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    if (!theme.endsWith("_authlist")) {
      theme = theme + "_authlist";
    }

    const userPubkey = this.context.getPublicKey();
    let userPubkeyStr = userPubkey.string();

    let clients: any[] = [];
    let allClients = await this.dc.connectToUserAllDcPeers(this.context.publicKey.raw);
    if (allClients && allClients.length > 0) {
      clients = allClients;
    } else if (this.context.AccountBackupDc?.client) {
      clients = [this.context.AccountBackupDc.client];
    } else {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    let client = null;
    for (const c of clients) {
      if (!c || !c.peerAddr) continue;
      try {
        if (c.token == "") {
          await c.GetToken(appId, this.context.publicKey.string(), this.context.sign);
        }
        client = c;
        break; // found one working client
      } catch (err) {
         continue;
      }
    }
    
    if (!client) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    const themeAuthorPubkey: Ed25519PubKey =
      Ed25519PubKey.edPubkeyFromStr(themeAuthor);

    let pubkeyFlag = true;
    let forPubkey: Ed25519PubKey | null = null;
    try {
      forPubkey = Ed25519PubKey.edPubkeyFromStr(authPubkey);
    } catch (error) {
      pubkeyFlag = false;
    }
    let forPubkeyHex: string;
    if (pubkeyFlag && forPubkey !== null) {
      forPubkeyHex = "0x" + forPubkey.toString();
    } else {
      forPubkeyHex = authPubkey;
      if (!authPubkey.startsWith("0x") && !authPubkey.startsWith("0X") && authPubkey != "all") {
        forPubkeyHex = "0x" + authPubkey;
      }
    }

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
    const themeValue: Uint8Array = new TextEncoder().encode(theme);
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
        theme,
        appId,
        themeAuthor,
        blockHeight,
        userPubkeyStr,
        contentCid,
        content,
        contentSize,
        CommentType.Comment,
        signature,
        vaccount
      );

      if (res !== 0) {
        return [res, new Error(`configThemeObjAuth fail, resFlag: ${res}`)];
      } else {
        return [0, null];
      }
    } catch (error: any) {
      return [null, error];
    }
  }



    async GetUserOwnAuth(
      appId: string,
      themeAuthor: string,
      configTheme: string,
       vaccount?: string
    ): Promise<[themeAuthInfo: ThemeAuthInfo | null, error: Error | null]> {
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
      const keyValueClient = new KeyValueClient(client, this.context);
      const [authInfo, error] = await keyValueClient.GetUserOwnAuth(
        appId,
        themeAuthor,
        configTheme
      );
      if (error) {
        return [null, error];
      }
      if (authInfo) {
        let authFields = authInfo.split("$$$");
        if (authFields.length > 2) {
          try{
          const themeAuthInfo = {
            pubkey: authFields[0]!,
            permission: parseInt(authFields[1]!),
            remark: authFields.length >= 3 ? authFields[2]! : "",
          };
          return [themeAuthInfo, null];
        }catch(e){
          return [null, e instanceof Error ? e : new Error(String(e))];
        }
        } 
      }
      return [null, null];
    }



    async GetUserAuth(
      appId: string,
      themeAuthor: string,
      configTheme: string,
      userPubkeyStr: string,
       vaccount?: string
    ): Promise<[themeAuthInfo: ThemeAuthInfo | null, error: Error | null]> {
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
      const keyValueClient = new KeyValueClient(client, this.context);
      const [authInfo, error] = await keyValueClient.GetUserAuth(
        appId,
        themeAuthor,
        configTheme,
        userPubkeyStr,
        vaccount
      );
      if (error) {
        return [null, error];
      }
      if (authInfo) {
        let authFields = authInfo.split("$$$");
        if (authFields.length > 2) {
          try{
          const themeAuthInfo = {
            pubkey: authFields[0]!,
            permission: parseInt(authFields[1]!),
            remark: authFields.length >=3 ? authFields[2]! : "",
          };
          return [themeAuthInfo, null];
        }catch(e){
          return [null, e instanceof Error ? e : new Error(String(e))];
        }
        } 
      }
      return [null, null];
    }


  async getAuthList(
    appId: string,
    themeAuthor: string,
    theme: string,
    seekKey: string = "",
    vaccount?: string
  ): Promise<[ThemeAuthInfo[] | null, ThemeComment[] | null, Error | null]> {
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    // _authlist suffix is handled internally by getThemeAuthList
    const authList: ThemeAuthInfo[] = [];
    const originAuthList: ThemeComment[] = [];
    try {
      const commentManager = new CommentManager(this.context);
      const [themeComments, _userCount, _nextKey, err] = await commentManager.getThemeAuthList(
        appId,
        theme,
        themeAuthor,
        0,
        Direction.Forward,
        0,
        100,
        seekKey,
        vaccount
      );
      if (err) throw err;
      if (!themeComments || themeComments.length === 0) {
        return [[], [], null];
      }
      for (const item of themeComments) {
        originAuthList.push(item);
        const content = item.comment;
        const parts = content.split(":");
        if (parts.length < 2) continue;
        const authPubkey = parts[0]!;
        let forPubkey: Ed25519PubKey | null = null;
        try {
          if (authPubkey.startsWith("0x") || authPubkey.startsWith("0X")) {
            forPubkey = Ed25519PubKey.edPubkeyFromStr(authPubkey);
          }
        } catch (error) {
          continue;
        }
        const authPubkeyStr = forPubkey != null ? forPubkey.string() : authPubkey;
        const permission = parseInt(parts[1]!);
        const remarkStart = parts[0]!.length + parts[1]!.length + 2;
        const remark = content.length > remarkStart ? content.substring(remarkStart) : "";
        authList.push({
          pubkey: authPubkeyStr,
          permission,
          remark,
          key: `${item.blockheight}/${item.commentCid}`,
        });
      }
      return [authList, originAuthList, null];
    } catch (error: any) {
      return [authList, originAuthList, error];
    }
  }

  async getDbAuthList(
    appId: string,
    themeAuthor: string,
    theme: string,
    limit: number = 100,
    seekKey: string = "",
    vaccount?: string
  ): Promise<[ThemeAuthInfo[] | null, number, string, Error | null]> {
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    const authList: ThemeAuthInfo[] = [];
    try {
      const commentManager = new CommentManager(this.context);
      const [themeComments, userCount, nextSeekKey, err] = await commentManager.getThemeAuthList(
        appId,
        theme,
        themeAuthor,
        0,
        Direction.Forward,
        0,
        limit,
        seekKey,
        vaccount
      );
      if (err) throw err;
      if (!themeComments || themeComments.length === 0) {
        return [[], userCount ?? 0, nextSeekKey ?? "", null];
      }
      for (const item of themeComments) {
        const content = item.comment;
        const parts = content.split(":");
        if (parts.length < 2) continue;
        const authPubkey = parts[0]!;
        let forPubkey: Ed25519PubKey | null = null;
        try {
          if (authPubkey.startsWith("0x") || authPubkey.startsWith("0X")) {
            forPubkey = Ed25519PubKey.edPubkeyFromStr(authPubkey);
          }
        } catch (error) {
          continue;
        }
        const authPubkeyStr = forPubkey != null ? forPubkey.string() : authPubkey;
        const permission = parseInt(parts[1]!);
        const remarkStart = parts[0]!.length + parts[1]!.length + 2;
        const remark = content.length > remarkStart ? content.substring(remarkStart) : "";
        authList.push({
          pubkey: authPubkeyStr,
          permission,
          remark,
          key: `${item.blockheight}/${item.commentCid}`,
        });
      }
      return [authList, userCount ?? 0, nextSeekKey ?? "", null];
    } catch (error: any) {
      return [authList, 0, "", error];
    }
  }

  async setKeyValue(
    appId: string,
    themeAuthor: string,
    theme: string,
    key: string,
    value: string,
    indexs: string, //索引列表,格式为key1:value1$$$key2:value2
    vaccount?: string
  ): Promise<[boolean | null, number | null, Error | null]> {
    if (!this.context.publicKey) {
      return [null, null, Errors.ErrPublicKeyIsNull];
    }
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    const userPubkey = this.context.getPublicKey();
    let userPubkeyStr = userPubkey.string();
    let client = this.context.AccountBackupDc?.client || null;
    if (!client){
        client = await this.dc.connectToUserDcPeer(this.context.publicKey.raw);
    }
     
    if (client === null) {
      return [null, null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (client.token == "") {
      await client.GetToken(appId, this.context.publicKey.string(), this.context.sign);
    }
    let content = `${key}:${value}`;
    if (indexs != "") {
      content = `$$i_start$$${indexs}$$i_end$$${content}`;
    }
    const contentUint8 = new TextEncoder().encode(content);
    const contenthash = await sha256(contentUint8);
    const contentCidBase32 = base32.encode(contenthash);

    const contentSize = contentUint8.length;

    const blockHeight: number = await this.chainUtil.getBlockHeight() || 0;
    const hValue: Uint8Array = uint32ToLittleEndianBytes(
      blockHeight ? blockHeight : 0
    );
    const themeValue: Uint8Array = new TextEncoder().encode(theme);
    const themeAuthorValue: Uint8Array = new TextEncoder().encode(themeAuthor);
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
      const [resFlag,resTimestamp] = await keyValueClient.setKeyValue(
        theme,
        appId,
        themeAuthor,
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
        return [null, resTimestamp, new Error(`setKeyValue fail, resFlag:${resFlag}`)];
      }
      return [true, resTimestamp, null];
    } catch (error: any) {
      return [null, null, error];
    }
  }

  async getValueWithKey(
    appId: string,
    themeAuthor: string,
    theme: string,
    writerPubkey: string,
    key: string,
    vaccount?: string
  ): Promise<[string | null, Error | null]> {
    if(!this.context.publicKey){
      return [null, Errors.ErrPublicKeyIsNull];
    }
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    let client = this.context.AccountBackupDc.client || null;
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
      await client.GetToken(appId, this.context.publicKey.string(), this.context.sign);
    }

    const keyValueClient = new KeyValueClient(client, this.context);
    try {
      const res = await keyValueClient.getValueWithKey(
        theme,
        appId,
        themeAuthor,
        writerPubkey,
        key,
        vaccount
      );

      if (res == null) {
        return [
          null,
          new Error(`vaGetValueWithKeyForVAccount fail, resFlag:${res}`),
        ];
      }
      const keyValue = new TextDecoder().decode(res);
      return [keyValue, null];
    } catch (error: any) {
      return [null, error];
    }
  }

  async getValuesWithKeys(
    appId: string,
    themeAuthor: string,
    theme: string,
    writerPubkey: string,
    keys: string,
    vaccount?: string
  ): Promise<[string | null, Error | null]> {
    if(!this.context.publicKey){
      return [null, Errors.ErrPublicKeyIsNull];
    }
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    let client = this.context.AccountBackupDc.client || null;
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
      await client.GetToken(appId, this.context.publicKey.string(), this.context.sign);
    }

    const keyValueClient = new KeyValueClient(client, this.context);
    try {
      const res = await keyValueClient.getValuesWithKeys(
        theme,
        appId,
        themeAuthor,
        writerPubkey,
        keys,
        vaccount
      );

      if (res == null) {
        return [
          null,
          new Error(`vaGetValuesWithKeysForVAccount fail, resFlag:${res}`),
        ];
      }
      const keyValues = new TextDecoder().decode(res);
      return [keyValues, null];
    } catch (error: any) {
      return [null, error];
    }
  }

  async getWithIndex(
    appId: string,
    themeAuthor: string,
    theme: string,
    indexKey: string,
    indexValue: string,
    seekKey: string,
    direction: Direction = Direction.Forward,
    offset: number,
    limit: number,
    vaccount?: string
  ): Promise<[string | null, Error | null]> {
    if(!this.context.publicKey){
      return [null, Errors.ErrPublicKeyIsNull];
    }
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    let client = this.context.AccountBackupDc.client || null;
    if (themeAuthor != this.context.publicKey.string()) {
      //查询他人主题评论
      const authorPublicKey: Ed25519PubKey =
        Ed25519PubKey.edPubkeyFromStr(themeAuthor);
      client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
      if (!client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      //获取token
      await client.GetToken(appId, this.context.publicKey.string(), this.context.sign);
    }
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }

    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (client.token == "") {
      await client.GetToken(appId, this.context.publicKey.string(), this.context.sign);
    }

    const keyValueClient = new KeyValueClient(client, this.context);
    try {
      const res = await keyValueClient.getValuesWithIndex(
        appId,
        themeAuthor,
        theme,
        indexKey,
        indexValue,
        seekKey,
        direction,
        offset,
        limit,
        vaccount
      );

      if (res == null) {
        return [
          null,
          new Error(`vaGetValuesWithKeysForVAccount fail, resFlag:${res}`),
        ];
      }
      const keyValues = new TextDecoder().decode(res);
      return [keyValues, null];
    } catch (error: any) {
      return [null, error];
    }
  }

  async getAuthListUserCount(
    appId: string,
    themeAuthor: string,
    theme: string,
    vaccount?: string
  ): Promise<[number | null, Error | null]> {
    if (!this.context.publicKey) {
      return [null, Errors.ErrPublicKeyIsNull];
    }
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    let client = this.context.AccountBackupDc.client || null;
    if (themeAuthor != this.context.publicKey.string()) {
      const authorPublicKey = Ed25519PubKey.edPubkeyFromStr(themeAuthor);
      client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
      if (!client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      await client.GetToken(appId, this.context.publicKey.string(), this.context.sign);
    }
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (client.token == "") {
      await client.GetToken(appId, this.context.publicKey.string(), this.context.sign);
    }
    const keyValueClient = new KeyValueClient(client, this.context);
    try {
      const [count, err] = await keyValueClient.getAuthListUserCount(appId, themeAuthor, theme, vaccount);
      if (err) {
        return [null, err];
      }
      return [count, null];
    } catch (error: any) {
      return [null, error];
    }
  }

  async getKeyValueRecordCount(
    appId: string,
    themeAuthor: string,
    theme: string,
    vaccount?: string
  ): Promise<[number | null, Error | null]> {
    if (!this.context.publicKey) {
      return [null, Errors.ErrPublicKeyIsNull];
    }
    if (!theme.startsWith("keyvalue_")) {
      theme = "keyvalue_" + theme;
    }
    let client = this.context.AccountBackupDc.client || null;
    if (themeAuthor != this.context.publicKey.string()) {
      const authorPublicKey = Ed25519PubKey.edPubkeyFromStr(themeAuthor);
      client = await this.dc.connectToUserDcPeer(authorPublicKey.raw);
      if (!client) {
        return [null, Errors.ErrNoDcPeerConnected];
      }
      await client.GetToken(appId, this.context.publicKey.string(), this.context.sign);
    }
    if (client === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (client.peerAddr === null) {
      return [null, new Error("ErrConnectToAccountPeersFail")];
    }
    if (client.token == "") {
      await client.GetToken(appId, this.context.publicKey.string(), this.context.sign);
    }
    const keyValueClient = new KeyValueClient(client, this.context);
    try {
      const [count, err] = await keyValueClient.getKeyValueRecordCount(appId, themeAuthor, theme, vaccount);
      if (err) {
        return [null, err];
      }
      return [count, null];
    } catch (error: any) {
      return [null, error];
    }
  }
}

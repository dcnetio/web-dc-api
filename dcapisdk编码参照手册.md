# DCAPISDK 编码参照手册（LLM 快速检索版）

> 版本日期：2026-04-01  
> 目标：为业务开发与大模型检索提供统一、可执行、可扩展的 DCAPI 编码规范与示例。

## 概览总结：SDK 能做什么 + 开发流程

### SDK 能做什么

DCAPISDK 是一个围绕去中心化应用的综合能力 SDK，核心能力包括：

1. 身份与账户：钱包登录、账户绑定、签名与验签相关流程。
2. 数据存储：
  - ThreadDB：个人私有数据跨设备同步。
  - KeyValueDB：多人共享数据与权限控制。
  - indexDB（应用侧）：本地关系型加速查询与业务聚合。
3. 文件能力：IPFS 文件/目录上传、下载、流式读取、可寻址读取、缓存管理。
4. 评论与社交：主题评论、点赞推荐、授权访问、用户评论流查询。
5. 消息系统：用户私信收发（消息盒子模型）。
6. AI 能力：AIProxy 配置、流式调用、实时音频/语音会话。
7. 支付能力：套餐管理、订单创建、结果查询、托管支付回跳处理。
8. 基础设施能力：缓存、网络节点信息、应用信息配置、加密密钥工具。

一句话主旨：DCAPISDK 提供了从登录鉴权、去中心化存储、业务数据同步、文件与消息、AI 到支付的完整应用底座。

### 推荐开发流程（标准落地顺序）

1. 初始化 SDK
  - 创建 `DC` 实例并执行 `dc.init()`。
2. 完成登录鉴权
  - 调用 `dc.auth.accountLoginWithWallet()`。
3. 初始化用户私有库（ThreadDB）
  - 调用 `dc.initUserDB(...)` 并保存 `dc.dbThreadId`。
4. 打开共享主题（KeyValueDB）
  - 根据主题名和作者公钥 `dc.keyValue.getStore(...)`。
5. 建立三库协同
  - 首次登录/新设备：KeyValueDB 全量同步到 indexDB。
  - 老设备：按时间戳/seekKey 增量同步到 indexDB。
6. 约定读写路径
  - 读：优先 indexDB，未命中回退 KeyValueDB，再回填 indexDB。
  - 写共享数据：先写 KeyValueDB，再同步 indexDB。
  - 写个人数据：直接写 ThreadDB。
7. 接入业务模块
  - 文件、评论、消息、AI、支付按服务层封装到 `src/services`，页面层只调用服务接口。
8. 发布前校验
  - 权限、分页、增量同步、缓存、错误处理、回退逻辑全部走检查清单。

### 数据操作主旨（开发者必记）

1. 权限与真实源头由 ThreadDB/KeyValueDB 保证。
2. 性能与复杂查询由 indexDB 负责。
3. 业务系统应把“同步一致性”作为一等公民：所有共享数据改动都必须带同步动作。
4. 时效内容优先时间倒序拉取，保证用户快速看到最新数据。

### 应用开发宗旨：KeyValueDB + ThreadDB + indexDB 混合使用

1. **适用场景**：当应用涉及“需要鉴权才能访问的数据”或“需要重点保护的敏感数据”时，必须采用 ThreadDB + KeyValueDB + indexDB 混合架构。
2. **职责边界**：
  - ThreadDB：存个人私有与跨设备同步数据（用户设置、个人索引、我的主题清单）。
  - KeyValueDB：存共享与协作数据（配置、公告、群组数据、社区数据、审批数据）。
  - indexDB：存业务查询副本（加速检索、分页、筛选、统计、联表）。
3. **读写原则**：
  - 共享读：优先 indexDB，miss 回退 KeyValueDB，随后回填 indexDB。
  - 共享写：先写 KeyValueDB，再同步 indexDB。
  - 个人写：直接写 ThreadDB。
4. **安全原则**：凡是涉及“申请、授权、审批、分级访问”的业务，统一落到 KeyValueDB 鉴权主题，不得绕过权限层直接暴露数据。

### 鉴权主题开发宗旨（`_auth` / `_private`）

1. **主题命名规则**：以 `_auth` 或 `_private` 结尾的 KeyValueDB 主题，视为鉴权主题。
2. **权限控制能力**：未配置权限的用户，不能访问该主题数据，也不能读取该主题的 `authlist`。
3. **权限等级定义**：
  - `0`：无权限
  - `1`：申请中（无实际操作权，任何人可申请，供管理员审批）
  - `2`：只读权限
  - `3`：读写权限
  - `4`：管理员权限
  - `5`：受限写权限（禁止修改 remark 及 IoT 配置/需指定分组）
  - `6`：设备管理权限
  - `7`：不存在
  - `8`：条件查询（系统查全量/用户查授权数据）
4. **权限配置接口**：使用 `dc.keyValue.configAuth(kvdb, pubkeyOrAll, permission, remark)` 进行授权配置。
5. **`_auth` 与 `_private` 差异**：
  - `_auth`：适用于鉴权后“授权用户之间可互看信息”的场景（如群聊成员可互看部分资料）。
  - `_private`：适用于鉴权后“敏感信息仅管理员可看，用户仅可看自己”的场景（如商城入驻身份/联系方式,商家间不能互相查看）。
6. **业务约束**：所有涉及用户间申请、授权、审批的功能，必须使用鉴权主题进行权限管理，确保数据安全与隐私合规。

---

## 0. 数据操作主旨（必须先读）

### 0.1 核心主旨

DCAPISDK 的数据层遵循三层分工：

1. ThreadDB：个人私有、跨设备同步。
2. KeyValueDB：多人共享、按主题授权访问。
3. indexDB：本地关系型加速层，承接业务查询和联表逻辑。

可概括为：

- 权限边界由 ThreadDB 和 KeyValueDB 负责。
- 查询性能和业务聚合由 indexDB 负责。
- 业务读路径优先 indexDB，写路径根据数据归属写 ThreadDB 或 KeyValueDB。

### 0.2 三库混合使用总流程

1. 登录成功后，先初始化并加载 ThreadDB（个人配置、个人索引、可访问主题列表）。
2. 读取 KeyValueDB 共享数据（配置、公告、排行榜、目录、群组数据）。
3. 将 KeyValueDB 数据同步到 indexDB，供业务逻辑高速读取。
4. 业务运行中：
   - 共享数据变更：先写 KeyValueDB，再增量同步到 indexDB。
   - 个人数据变更：直接写 ThreadDB。
   - ThreadDB 使用规则：避免任何不必要的更新和写入, 以减少同步开销,大数据量和文件类数据应该先上传到 file 模块, ThreadDB 只存储文件 CID 和元数据。
5. 定时或手动触发增量同步：KeyValueDB -> indexDB。
6. 读取时优先 indexDB；miss 时回退到 KeyValueDB 拉取后再落 indexDB。
7. 主题权限列表：先从 KeyValueDB `getAuthList` 拉取，再落 indexDB 供业务查询。
8. 时效性新闻/动态：使用 KeyValueDB 时间倒序接口获取最新数据，驱动渲染。

### 0.3 新设备/老设备策略

- 新设备：全量拉取 KeyValueDB 数据 -> 全量构建 indexDB,适合首次安装或长期未使用的用户,建议在用户进入应用后提供加载提示。
- 老设备：按时间戳或游标增量拉取 -> 增量更新 indexDB。

### 0.4 鉴权主题落地规范（强制）

1. 需要权限控制的数据主题，必须使用 `_auth` 或 `_private` 后缀。
2. 主题初始化后，先配置管理员和默认权限，再允许业务写入。
3. 任何读取鉴权主题数据的服务，都必须先校验用户授权信息（`GetUserOwnAuth`/`GetUserAuth`）。
4. 申请流程统一使用权限级别 `1`（申请中）记录，管理员审批后再切换到 `2/3/4/5/6/8`。
5. 业务侧禁止将 `_private` 主题中的敏感字段写入公共 indexDB；如需检索，只可写入脱敏索引字段。

---

## 1. 初始化与登录（全模块前置）

### 1.1 固定初始化模板

```ts
import { DC } from 'web-dc-api';

const dcConfig = {
  wssUrl: 'wss://dcchain.baybird.cn',
  backWssUrl: 'wss://dcchain.baybird.cn',
  appInfo: {
    appId: '应用ID',
    appName: '应用名称',
    appVersion: '1.0.0',
  },
};

const dc = new DC(dcConfig);
const inited = await dc.init();
if (!inited) throw new Error('dc.init 失败');

const [accountInfo, loginErr] = await dc.auth.accountLoginWithWallet();
if (loginErr || !accountInfo) throw loginErr || new Error('登录失败');
```

### 1.2 ThreadDB 初始化（登录后）

```ts
const collections = [
  {
    name: 'user_settings',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        theme: { type: 'string' },
        updatedAt: { type: 'number' },
      },
      required: ['_id', 'theme', 'updatedAt'],
      additionalProperties: true,
    },
  },
];

const [dbInfo, dbErr] = await dc.initUserDB(collections, 1, false);
if (dbErr || !dbInfo?.id) throw dbErr || new Error('initUserDB 失败');

dc.dbThreadId = dbInfo.id;
```

---

## 2. 模块检索索引（给大模型）

- AUTH: `dc.auth.accountLoginWithWallet`, `dc.auth.getLoginInfo`, `dc.auth.sign`, `dc.auth.decrypt`
- FILE: `dc.file.addFile`, `dc.file.addFolder`, `dc.file.getFile`, `dc.file.getFileFromDir`, `dc.file.createFileStream`, `dc.file.getSeekableFileStream`
- THREADDB: `dc.initUserDB`, `dc.db.create`, `dc.db.find`, `dc.db.findByID`, `dc.db.save`, `dc.db.delete`, `dc.db.modifiedSince`
- KEYVALUE: `dc.keyValue.createStore`, `dc.keyValue.getStore`, `dc.keyValue.configAuth`, `dc.keyValue.getAuthList`, `dc.keyValue.set`, `dc.keyValue.getWithIndex`, `dc.keyValue.getWithTimeOrder`, `dc.keyValue.setWithCount`
- COMMENT: `dc.comment.addThemeObj`, `dc.comment.configAuth`, `dc.comment.publishCommentToTheme`, `dc.comment.getThemeComments`
- MESSAGE: `dc.message.sendMsgToUserBox`, `dc.message.getMsgFromUserBox`
- AIPROXY: `dc.aiproxy.SetAICallConfig`, `dc.aiproxy.DoAIProxyCall`
- CACHE: `dc.cache.getCacheValue`, `dc.cache.setCacheKey`
- CLIENT: `dc.client.getHostID`
- PAY: `dc.pay.listRenewPackages`, `dc.pay.createPayOrder`, `dc.pay.queryPaymentResult`, `dc.pay.buildHostedCheckoutUrl`
- UTIL: `dc.util.createSymmetricKey`, `dc.util.createThreadKey`, `dc.util.setAppInfo`, `dc.util.getAppInfo`, `dc.util.handleIpfsRequest`

---

## 3. auth 模块（认证与账户）

### 3.1 `accountLoginWithWallet`

用途：DApp 标准登录入口。  
场景：首次进入、重登、会话恢复前鉴权。

```ts
const [accountInfo, err] = await dc.auth.accountLoginWithWallet();
if (err || !accountInfo) throw err || new Error('钱包登录失败');
```

### 3.2 `getLoginInfo`

用途：获取当前登录态。  
场景：页面刷新后的会话恢复。

```ts
const [loginInfo, infoErr] = await dc.auth.getLoginInfo();
if (infoErr) console.error(infoErr.message);
```

### 3.3 `sign` / `decrypt`

用途：客户端签名与解密。  
场景：请求签名、防篡改、端侧密文处理。

```ts
const payload = new TextEncoder().encode('hello-dc');
const [sig, sigErr] = await dc.auth.sign(payload);
if (sigErr || !sig) throw sigErr || new Error('签名失败');

const [plain, decErr] = await dc.auth.decrypt(sig);
if (decErr) console.error(decErr.message);
```

---

## 4. file 模块（IPFS 文件能力）

### 4.1 密钥生成规范

```ts
const resSymKey = dc.util.createSymmetricKey();
const base32Key = resSymKey.toString();
```

### 4.2 `addFile`

用途：上传单文件并加密。

```ts
const [cid, err] = await dc.file.addFile(fileObj, base32Key, (status, size) => {
  console.log('upload status=', status, 'size=', size);
});
```

### 4.3 `addFolder`

用途：上传目录。

```ts
const [folderCid, folderErr] = await dc.file.addFolder(fileList, base32Key, (status, total, process) => {
  console.log(status, total, process);
});
```

### 4.4 `getFile`

用途：按 CID 读取文件。

```ts
const [bytes, getErr] = await dc.file.getFile(cid!, base32Key);
if (!getErr && bytes) {
  const text = new TextDecoder().decode(bytes);
  console.log(text);
}
```

### 4.5 `getFileFromDir`

用途：目录内按相对路径读取。

```ts
const [dataOrList, dirErr] = await dc.file.getFileFromDir(folderCid!, 'images/a.png', base32Key);
```

### 4.6 `getFolderFileList`

用途：只读目录元数据（不含内容）。

```ts
const [entries, listErr] = await dc.file.getFolderFileList(folderCid!, 0, true);
```

### 4.7 `getFolderFileListWithContent`

用途：递归读取目录及文件内容。

```ts
const [entriesWithContent, contentErr] = await dc.file.getFolderFileListWithContent(folderCid!, base32Key, true);
```

### 4.8 `createFileStream`

用途：流式读取大文件。

```ts
const stream = await dc.file.createFileStream(cid!, base32Key);
```

### 4.9 `getSeekableFileStream`

用途：可寻址流（适合视频进度拖拽）。

```ts
const seekable = await dc.file.getSeekableFileStream(cid!, base32Key);
```

### 4.10 `getSeekableFileStreamFromDir`

用途：目录内文件可寻址流。

```ts
const seekableFromDir = await dc.file.getSeekableFileStreamFromDir(folderCid!, 'video/demo.mp4', base32Key);
```

### 4.11 `isFileOrDir`

用途：判断 CID 类型。

```ts
const kind = await dc.file.isFileOrDir(cid!);
```

### 4.12 `clearFileCache` / `getCacheStats`

用途：缓存维护与观测。

```ts
dc.file.clearFileCache();
const [cacheStats, cacheErr] = dc.file.getCacheStats();
```

### 4.13 `createCustomFileList`

用途：将内存映射构造成上传目录。

```ts
const filesMap = {
  'doc/a.txt': 'hello',
  'doc/b.json': JSON.stringify({ ok: true }),
};
const [customList, customErr] = dc.file.createCustomFileList(filesMap, 'bundle-root');
```

---

## 5. ThreadDB 模块（dc.db）

> 约束：ThreadDB 前置条件是用户已登录，且 `dc.dbThreadId` 已设置。  
> 约束：存储字段禁止使用 `null`，请用空串、0、false、空数组、空对象代替。

### 5.1 `initUserDB`

用途：初始化用户私有库并返回 threadId。

```ts
const [dbInfo, dbErr] = await dc.initUserDB(collections, 2, false);
if (dbInfo) dc.dbThreadId = dbInfo.id;
```

### 5.2 `dc.db.create`

用途：新增记录。

```ts
const [id, createErr] = await dc.db.create(
  dc.dbThreadId!,
  'user_settings',
  JSON.stringify({ _id: 'settings:me', theme: 'light', updatedAt: Date.now() })
);
```

### 5.3 `dc.db.find`

用途：条件查询。

```ts
const query = {
  condition: "updatedAt > 1700000000000",
  sort: { fieldPath: 'updatedAt', desc: true },
  limit: 20,
};
const [json, findErr] = await dc.db.find(dc.dbThreadId!, 'user_settings', JSON.stringify(query));
const rows = json ? JSON.parse(json) : [];
```

### 5.4 `dc.db.findByID`

用途：按 ID 查单条。

```ts
const [oneJson, oneErr] = await dc.db.findByID(dc.dbThreadId!, 'user_settings', 'settings:me');
const setting = oneJson ? JSON.parse(oneJson) : null;
```

### 5.5 `dc.db.save`

用途：全量更新记录。

```ts
await dc.db.save(
  dc.dbThreadId!,
  'user_settings',
  JSON.stringify({ _id: 'settings:me', theme: 'dark', updatedAt: Date.now() })
);
```

### 5.6 `dc.db.delete`

用途：删除单条。

```ts
await dc.db.delete(dc.dbThreadId!, 'user_settings', 'settings:me');
```

### 5.7 `dc.db.deleteMany`

用途：批量删除。

```ts
await dc.db.deleteMany(dc.dbThreadId!, 'user_settings', JSON.stringify(['id1', 'id2']));
```

### 5.8 `dc.db.has`

用途：判断记录存在。

```ts
const exists = await dc.db.has(dc.dbThreadId!, 'user_settings', 'settings:me');
```

### 5.9 `dc.db.modifiedSince`

用途：增量同步扫描。

```ts
const [idListJson, modErr] = await dc.db.modifiedSince(dc.dbThreadId!, 'user_settings', Date.now() - 3600_000);
const idList = idListJson ? JSON.parse(idListJson) : [];
```

---

## 6. KeyValueDB 模块（dc.keyValue）

### 6.1 主题命名规则

1. 主题名必须以 `keyvalue_` 开头。
2. 公共主题必须以 `_pub` 结尾。
3. 公共主题仅主题作者可创建。

### 6.2 `createStore`

用途：创建主题存储库。

```ts
const [kvdb, createErr] = await dc.keyValue.createStore(
  dc.appInfo.appId,
  'keyvalue_app_config_pub',
  50 * 1024 * 1024,
  2
);
```

### 6.3 `getStore`

用途：打开已有主题。

```ts
const [store, getStoreErr] = await dc.keyValue.getStore(
  dc.appInfo.appId,
  'keyvalue_app_config_pub',
  APPThemeConfig.appThemeAuthor
);
```

### 6.4 `configAuth`

用途：设置主题授权。

```ts
const [status, authErr] = await dc.keyValue.configAuth(
  store!,
  'all',
  2,
  JSON.stringify({ applyer: 'system', reason: 'read for all' })
);
```

### 6.5 `getAuthList`

用途：拉取授权列表（管理员）。

```ts
const [authList, rawList, listErr] = await dc.keyValue.getAuthList(store!, '');
```

### 6.6 `GetUserOwnAuth`

用途：当前用户查看自己的授权。

```ts
const [myAuth, myAuthErr] = await dc.keyValue.GetUserOwnAuth(store!);
```

### 6.7 `GetUserAuth`

用途：查看指定用户授权。

```ts
const [userAuth, userAuthErr] = await dc.keyValue.GetUserAuth(store!, targetPubkey);
```

### 6.8 `set`

用途：写入键值，附带索引。

```ts
const indexes = JSON.stringify([
  { key: 'type', type: 'string', value: 'notice' },
  { key: 'priority', type: 'number', value: 10 },
]);

const [ok, ts, setErr] = await dc.keyValue.set(
  store!,
  'notice:20260401:001',
  JSON.stringify({ title: '公告', content: '系统升级', updatedAt: Date.now() }),
  indexes
);
```

### 6.9 `getValueSetByCurrentUser`

用途：读取当前用户写入的某 key 最新值。

```ts
const [myValue, myValueErr] = await dc.keyValue.getValueSetByCurrentUser(store!, 'notice:20260401:001');
```

### 6.10 `get`

用途：按 key 读取最新值，或指定 writer 值。

```ts
const [v, getErr] = await dc.keyValue.get(store!, 'notice:20260401:001');
```

### 6.11 `getValues`

用途：按 key 前缀/游标分页遍历。

```ts
const [valuesJson, valuesErr] = await dc.keyValue.getValues(store!, 'notice:', {
  limit: 50,
  seekKey: '',
  direction: 0,
  offset: 0,
});
```

### 6.12 `getBatch`

用途：批量读多个 key。

```ts
const [batchJson, batchErr] = await dc.keyValue.getBatch(store!, 'notice:1,notice:2,notice:3');
```

### 6.13 `getWithIndex`

用途：按索引查询（推荐用于列表页）。

```ts
const [listByIndexJson, idxErr] = await dc.keyValue.getWithIndex(
  store!,
  'type',
  'notice',
  { type: 'string', limit: 20, seekKey: '', direction: 0, offset: 0 }
);
```

### 6.14 `getWithTimeOrder`

用途：按写入时间顺序拉取（新闻/动态推荐倒序）。

```ts
const [newsJson, newsErr] = await dc.keyValue.getWithTimeOrder(
  store!,
  Date.now(),
  { limit: 30, seekKey: '', direction: 1, offset: 0 }
);
```

### 6.15 `setWithCount`

用途：写业务值并维护统计（总/日/月/年）。

```ts
const countValue = JSON.stringify({
  add: { views: 1, likes: 0 },
  allflag: true,
  countdate: '2026-04-01',
  yearflag: true,
  monthflag: true,
  valueflag: true,
  value: JSON.stringify({ title: '资讯A', views: 101 }),
});

const [countOk, countTs, countErr] = await dc.keyValue.setWithCount(
  store!,
  'news:1001',
  countValue,
  JSON.stringify([{ key: 'category', type: 'string', value: 'news' }])
);
```

### 6.16 `getDBCount`

用途：读取全局统计快照。

```ts
const [totalJson] = await dc.keyValue.getDBCount(store!, 0, '');
const [dailyJson] = await dc.keyValue.getDBCount(store!, 1, '2026-04-01');
const [monthlyJson] = await dc.keyValue.getDBCount(store!, 2, '2026-04');
const [yearlyJson] = await dc.keyValue.getDBCount(store!, 3, '2026');
```

---

## 7. comment 模块（评论系统）

### 7.1 `addThemeObj`

用途：创建评论主题。

```ts
const [ok, addErr] = await dc.comment.addThemeObj('news_comments', 0, 50 * 1024 * 1024);
```

### 7.2 `configAuth`

用途：配置评论主题权限。

```ts
const [authStatus, authErr] = await dc.comment.configAuth(
  APPThemeConfig.appThemeAuthor,
  'news_comments',
  'all',
  3,
  'allow read/write'
);
```

### 7.3 `publishCommentToTheme`

用途：发布评论/点赞/推荐/反对。

```ts
const [commentId, pubErr] = await dc.comment.publishCommentToTheme(
  'news_comments',
  APPThemeConfig.appThemeAuthor,
  0,
  JSON.stringify({ newsId: 'n100', content: '这条新闻不错' }),
  1,
  ''
);
```

### 7.4 `getThemeComments`

用途：读取主题评论流。

```ts
const [commentsJson, commentsErr] = await dc.comment.getThemeComments(
  'news_comments',
  APPThemeConfig.appThemeAuthor,
  0,
  0,
  0,
  20
);
```

---

## 8. message 模块（私信系统）

### 8.1 `sendMsgToUserBox`

用途：发送私信到用户消息箱。

```ts
const [sendStatus, sendErr] = await dc.message.sendMsgToUserBox(
  receiverPubkey,
  JSON.stringify({ type: 'notification', title: '系统通知', ts: Date.now() })
);
```

### 8.2 `getMsgFromUserBox`

用途：分页拉取收件箱。

```ts
const [msgList, msgErr] = await dc.message.getMsgFromUserBox(20);
```

---

## 9. aiproxy 模块（AI 代理）

### 9.1 `SetAICallConfig`

用途：设置默认 AI 调用配置。

```ts
const cfgErr = await dc.aiproxy.SetAICallConfig({
  appId: dc.appInfo.appId,
  themeAuthor: APPThemeConfig.appThemeAuthor,
  configTheme: 'default',
  serviceName: 'openai-gpt',
  path: '/v1/chat/completions',
  model: 'gpt-4',
});
if (cfgErr) throw cfgErr;
```

### 9.2 `DoAIProxyCall`

用途：执行流式 AI 调用。

```ts
const reqBody = JSON.stringify({
  chatMessages: [
    {
      role: 'user',
      content: [{ type: 'text', text: '请总结今天公告要点' }],
    },
  ],
});

const controller = new AbortController();
const onStreamResponse = (flag: number, content: string, error?: Error) => {
  if (flag === 0) console.log('answer chunk=', content);
  if (flag === 4) console.log('done');
  if (flag === 99 && error) console.error(error.message);
};

const [status, aiErr] = await dc.aiproxy.DoAIProxyCall(
  { signal: controller.signal },
  reqBody,
  false,
  onStreamResponse
);
```

---

## 10. 三库混合实战模板（推荐直接复用）

### 10.1 启动阶段

```ts
async function bootstrap(dc: any) {
  // 1) 登录
  const [accountInfo, loginErr] = await dc.auth.accountLoginWithWallet();
  if (loginErr || !accountInfo) throw loginErr || new Error('login failed');

  // 2) ThreadDB 初始化
  const [dbInfo, dbErr] = await dc.initUserDB(getUserCollections(), 2, false);
  if (dbErr || !dbInfo?.id) throw dbErr || new Error('init user db failed');
  dc.dbThreadId = dbInfo.id;

  // 3) 拉取个人设置
  const [settingJson] = await dc.db.find(dc.dbThreadId, 'user_settings', '{}');

  // 4) 拉取共享主题
  const [kvdb, kvErr] = await dc.keyValue.getStore(
    dc.appInfo.appId,
    'keyvalue_app_config_pub',
    APPThemeConfig.appThemeAuthor
  );
  if (kvErr || !kvdb) throw kvErr || new Error('get store failed');

  // 5) 全量或增量同步到 indexDB
  await syncKeyValueToIndexDb(dc, kvdb, { full: isNewDevice() });

  return { settingJson };
}
```

### 10.2 运行期写入策略

```ts
async function updateSharedData(dc: any, kvdb: any, key: string, value: any) {
  // 共享数据：先写 KeyValueDB
  const [ok, ts, err] = await dc.keyValue.set(kvdb, key, JSON.stringify(value), '[]');
  if (err || !ok) throw err || new Error('kv write failed');

  // 再增量写入 indexDB
  await upsertIndexDbByKey(key, value, ts || Date.now());
}

async function updatePersonalData(dc: any, collection: string, doc: any) {
  // 个人数据：直接 ThreadDB
  await dc.db.save(dc.dbThreadId, collection, JSON.stringify(doc));
}
```

### 10.3 读取回退策略

```ts
async function queryWithFallback(dc: any, kvdb: any, key: string) {
  // 1) 先查 indexDB
  const local = await findInIndexDb(key);
  if (local) return local;

  // 2) miss 则从 KeyValueDB 拉取
  const [raw, err] = await dc.keyValue.get(kvdb, key);
  if (err || !raw) return null;

  const parsed = parseKVRaw(raw);
  await upsertIndexDbByKey(key, parsed.value, parsed.timestamp);
  return parsed.value;
}
```

### 10.4 权限清单同步模板

```ts
async function syncAuthList(dc: any, kvdb: any) {
  const [authList, , err] = await dc.keyValue.getAuthList(kvdb, '');
  if (err) throw err;
  await replaceAuthListInIndexDb(authList || []);
}
```

### 10.5 新闻流倒序模板

```ts
async function loadLatestNews(dc: any, kvdb: any, seekKey = '') {
  const [json, err] = await dc.keyValue.getWithTimeOrder(kvdb, Date.now(), {
    limit: 20,
    seekKey,
    direction: 1,
    offset: 0,
  });
  if (err) throw err;
  return json ? JSON.parse(json) : [];
}
```

---

## 11. Entity + Repository 推荐封装

### 11.1 设计目标

1. 页面层不直接调用低层 keyValue API。
2. 在 `src/services` 封装仓储，收敛权限、索引、分页与统计逻辑。
3. ThreadDB 与 KeyValueDB 都暴露语义化方法，减少 JSON 字符串拼接错误。

### 11.2 仓储接口建议

```ts
type FindIndexOptions = {
  type?: 'string' | 'number' | 'boolean' | 'date' | 'json' | 'binary';
  limit?: number;
  seekKey?: string;
  direction?: 0 | 1;
  offset?: number;
  vaccount?: string;
};

type FindValuesOptions = {
  limit?: number;
  seekKey?: string;
  direction?: 0 | 1;
  offset?: number;
  vaccount?: string;
};

type Operator = '=' | '>' | '<' | '>=' | '<=' | '!=';

interface WhereCond {
  field: string;
  operator: Operator;
  value: any;
}
```

### 11.3 仓储样例（最小可用）

```ts
class AppConfigRepository {
  constructor(private dc: any, private kvdb: any) {}

  async save(entity: { _id: string; name: string; value: string; updatedAt: number }) {
    const indexs = JSON.stringify([{ key: 'name', type: 'string', value: entity.name }]);
    const [ok, ts, err] = await this.dc.keyValue.set(this.kvdb, entity._id, JSON.stringify(entity), indexs);
    if (err || !ok) throw err || new Error('save failed');
    return ts || 0;
  }

  async findById(id: string) {
    const [raw, err] = await this.dc.keyValue.get(this.kvdb, id);
    if (err || !raw) return null;
    return parseKVRaw(raw).value;
  }

  async findByIndex(name: string) {
    const [json, err] = await this.dc.keyValue.getWithIndex(this.kvdb, 'name', name, { type: 'string', limit: 50 });
    if (err || !json) return [];
    return JSON.parse(json);
  }
}
```

---

## 12. 常见错误与规避

1. 未登录就调用 `initUserDB` 或 `dc.db.*`。
2. 已初始化 ThreadDB 但未赋值 `dc.dbThreadId`。
3. ThreadDB 文档结构里使用了 `null`。
4. KeyValueDB 主题命名不符合 `keyvalue_*` 规则。
5. 列表查询不分页，导致单次拉取过大。
6. 写共享数据后未同步 indexDB，造成读到旧数据。
7. 时效内容未使用时间序查询，导致首页非最新。

---

## 13. 项目落地建议（结合现有项目经验）

1. 登录与 ThreadDB 初始化放在全局 DCContext，避免页面重复初始化。
2. KeyValueDB 访问统一收口到 services 层，并做 store 缓存。
3. 权限拉取、主题清单、增量同步做后台任务或手动刷新按钮。
4. indexDB 维护 `lastSyncTimestamp` 与 `seekKey` 两个游标，实现稳定增量拉取。
5. 读路径统一走 `indexDB -> KeyValueDB 回退 -> 回填 indexDB`。

---

## 14. 一页式检查清单（发布前）

1. 是否完成 `dc.init` + 钱包登录。
2. 是否完成 `initUserDB` 并设置 `dc.dbThreadId`。
3. 共享主题是否符合命名规则并有权限策略。
4. KeyValue 查询是否都支持分页参数。
5. 是否实现 KeyValue -> indexDB 的全量和增量同步。
6. 业务查询是否默认先走 indexDB。
7. 权限列表是否已落地到 indexDB 供业务使用。
8. 新闻/动态是否使用时间倒序查询。

---

## 15. 附：KV 原始值解析工具（建议统一）

```ts
function parseKVRaw(raw: string): { value: any; timestamp: number; operator: string } {
  const splitTag = '$$$dckv_extra$$$';
  const idx = raw.lastIndexOf(splitTag);
  if (idx < 0) {
    return { value: safeJson(raw), timestamp: 0, operator: '' };
  }

  const valuePart = raw.slice(0, idx);
  const extraPart = raw.slice(idx + splitTag.length);
  const extra = safeJson(extraPart) || {};

  return {
    value: safeJson(valuePart),
    timestamp: Number(extra.dc_timestamp || 0),
    operator: String(extra.dc_opuser || ''),
  };
}

function safeJson(input: string) {
  try {
    return JSON.parse(input);
  } catch {
    return input;
  }
}
```

---

## 16. interfaces 全量覆盖附录（与 `lib/interfaces` 对齐）

> 说明：本附录补齐你提出的“interfaces 里有的接口都加进去”。上文章节给的是高频实践，本附录给源码级全量方法清单，便于大模型精确检索。

### 16.1 `IAuthOperations` 全量方法

1. `getLoginInfo()`
2. `accountLoginWithWallet()`
3. `accountLogin(nftAccount, password, safecode)`
4. `sign(payload)`
5. `decrypt(payload)`
6. `bindNFTAccount(account, password, seccode, mnemonic)`
7. `nftAccountPasswordModify(account, password, seccode, mnemonic?)`
8. `generateAppAccount(appId, mnemonic)`
9. `isNftAccountBindSuccess(nftAccount, pubKeyStr)`
10. `isNftAccountBinded(nftAccount)`
11. `getUserInfoWithNft(nftAccount)`
12. `getUserInfoWithAccount(pubkeyAccount)`
13. `getToken(publicKeyBase32)`
14. `startDcPeerTokenKeepValidTask()`
15. `ifEnoughUserSpace(needSize?)`
16. `refreshUserInfo()`
17. `setUserDefaultDB(threadId, rk, sk, remark, vaccount?)`
18. `signMessageWithWallet(data)`
19. `signEIP712MessageWithWallet(data)`
20. `exitLogin()`

示例（EIP712 钱包签名）：

```ts
const [res, err] = await dc.auth.signEIP712MessageWithWallet({
  type: 'eip712_sign',
  origin: window.location.origin,
  data: {
    appUrl: window.location.origin,
    ethAccount: dc.ethAddress || '',
    domain: { name: 'MyApp', version: '1', chainId: 1 },
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
      ],
      Login: [{ name: 'nonce', type: 'string' }],
    },
    primaryType: 'Login',
    message: { nonce: String(Date.now()) },
  },
} as any);
```

### 16.2 `IDatabaseOperations` 全量方法

1. `initDBManager()`
2. `resetDBManager()`
3. `newDB(name, b32Rk, b32Sk, jsonCollections)`
4. `syncDbFromDC(threadid, dbname, dbAddr, b32Rk, b32Sk, block, collectionInfos)`
5. `refreshDBFromDC(threadid)`
6. `syncDBToDC(tId)`
7. `autoExpandDBSpace(threadId, expandSpace)`
8. `getDBInfo(id)`
9. `upgradeCollections(threadId, collections)`
10. `close()`
11. `create(threadId, collectionName, jsonInstance)`
12. `delete(threadId, collectionName, instanceID)`
13. `save(threadId, collectionName, instance)`
14. `deleteMany(threadId, collectionName, instanceIDs)`
15. `has(threadId, collectionName, instanceID)`
16. `find(threadId, collectionName, queryString?)`
17. `findByID(threadId, collectionName, instanceID)`
18. `modifiedSince(threadId, collectionName, time)`

示例（手动同步到 DC 网络）：

```ts
const syncErr = await dc.db.syncDBToDC(dc.dbThreadId);
if (syncErr) throw syncErr;
```

### 16.3 `IFileOperations` 全量补齐方法

除上文外，额外还有：

1. `getFileFromDcWithPeerAddr(cid, decryptKey, peerAddr)`
2. `addFileInLocal(file, enkey)`
3. `addFolderInLocal(files, enkey)`

示例（指定 peer 地址拉文件）：

```ts
const [bytes, err] = await dc.file.getFileFromDcWithPeerAddr(cid, key, peerAddr);
```

### 16.4 `IKeyValueOperations` 全量校对

当前手册 6.x 已覆盖全部方法：

1. `createStore`
2. `getStore`
3. `configAuth`
4. `getAuthList`
5. `GetUserOwnAuth`
6. `GetUserAuth`
7. `set`
8. `setWithCount`
9. `getDBCount`
10. `getValueSetByCurrentUser`
11. `get`
12. `getValues`
13. `getBatch`
14. `getWithIndex`
15. `getWithTimeOrder`

### 16.5 `ICommentOperations` 全量方法

1. `addThemeObj(theme, openFlag, commentSpace?)`
2. `addUserOffChainSpace()`
3. `addUserOffChainOpTimes(times, vaccount?)`
4. `addThemeSpace(theme, addSpace)`
5. `publishCommentToTheme(theme, themeAuthor, commentType, comment, openFlag?, refercommentkey?)`
6. `deleteSelfComment(theme, themeAuthor, commentKey)`
7. `getThemeObj(themeAuthor, startHeight?, direction?, offset?, limit?, seekKey?)`
8. `getThemeComments(theme, themeAuthor, startHeight?, direction?, offset?, limit?, seekKey?)`
9. `configAuth(themeAuthor, theme, authPubkey, permission, remark, vaccount?)`
10. `getAuthList(themeAuthor, theme, vaccount?)`
11. `getUserComments(userPubkey, startHeight?, direction?, offset?, limit?, seekKey?)`

示例（给用户补链下评论操作次数）：

```ts
const [ok, err] = await dc.comment.addUserOffChainOpTimes(200);
```

### 16.6 `IMessageOperations` 全量方法

1. `sendMsgToUserBox(receiver, msg)`
2. `getMsgFromUserBox(limit?)`

### 16.7 `IAIProxyOperations` 全量方法

1. `createProxyConfig(appId, configTheme)`
2. `deleteProxyConfig(appId, configTheme)`
3. `configAIProxy(appId, configAuthor, configTheme, serviceName, serviceConfig?, vaccount?)`
4. `configAuth(appId, configAuthor, configTheme, authPubkey, permission, authConfig, vaccount?)`
5. `GetAIProxyConfig(appId, themeAuthor, configTheme, vaccount?)`
6. `GetUserOwnAIProxyAuth(appId, themeAuthor, configTheme)`
7. `DoAIProxyCall(context, reqBody, forceRefresh, onStreamResponse, appId?, themeAuthor?, configTheme?, serviceName?, headers?, path?, model?)`
8. `SetAICallConfig(callConfig)`
9. `GetUserAIProxyAuth(params)`
10. `CreateRealtimeAudioSession(options)`
11. `CreateAliyunRealtimeAudioSession(options)`
12. `CreateRealtimeVoiceSession(options)`
13. `CreateAliyunRealtimeVoiceSession(options)`
14. `CreateOpenAIRealtimeVoiceSession(options)`

示例（读取 AI 代理配置列表）：

```ts
const [userAuthConfigs, serviceConfigs, err] = await dc.aiproxy.GetAIProxyConfig(
  dc.appInfo.appId,
  APPThemeConfig.appThemeAuthor,
  'default'
);
```

### 16.8 `ICacheOperations` 全量方法

1. `getCacheValue(key)`
2. `setCacheKey(value, expire?)`

示例：

```ts
const [cacheKey, setErr] = await dc.cache.setCacheKey(JSON.stringify({ token: 'abc' }), 3600);
if (!setErr && cacheKey) {
  const [cacheValue] = await dc.cache.getCacheValue(cacheKey);
}
```

### 16.9 `IClientOperations` 全量方法

1. `getHostID()`

示例：

```ts
const [host, hostErr] = await dc.client.getHostID();
```

### 16.10 `IPayOperations` 全量方法

1. `config(options)`
2. `listPaymentOrders(options)`
3. `createPayOrder(options)`
4. `getNativePrepayCodeUrl(outTradeNo)`
5. `queryPaymentResult(outTradeNo)`
6. `listRenewPackages(pkgType, serviceAppid?, scene?, recommender?)`

   买家套餐列表。SDK 会携带当前账号，并自动读取应用 URL 中的 `ref`、`recommender` 或 `referrer` 推荐参数；已绑定推荐人由服务端优先恢复。

7. `listPromotablePackages(pkgType, serviceAppid, scene?, recommender?)`

   推荐人可推广套餐目录。必须传 `serviceAppid`，按推荐人当前等级返回可推广套餐；不应用买家侧的自荐和首次付款历史过滤。`pkgType=0` 时返回该应用下全部类型。
8. `getPackageInfo(packageCode, pkgType, serviceAppid?, scene?)`
9. `getRenewalDays(packageCode, targetType, serviceAppid?, scene?)`
10. `applyBusinessPackage(request)`
11. `getAllPackagesConfig(filter)`
12. `deleteBusinessPackage(packageId)`
13. `markCurrentUrlAsPayReturn(scene?)`
14. `isPayReturnUrl(scene?)`
15. `clearPayReturnUrlParams()`
16. `buildHostedCheckoutUrl(options)`
17. `markPendingGatewayPayment(info)`
18. `getPendingGatewayPayment()`
19. `clearPendingGatewayPayment()`

示例（创建订单并轮询支付结果）：

```ts
const outTradeNo = await dc.pay.createPayOrder({
  account: dc.accountInfo.account,
  packageId: 'pkg_001',
  packageName: 'Pro 30D',
  amountCents: 1999,
  attach: JSON.stringify({ from: 'web' }),
  dappid: dc.appInfo.appId,
});

const paid = await dc.pay.queryPaymentResult(outTradeNo);
```

自由定价套餐（`pkgType = 5`）的 `amountCents` 是本次实际支付金额，必须大于 0 且不超过套餐配置的最高金额；还必须传入 `priceKey`。网关会从套餐绑定主题读取该键的价格，并要求它与 `amountCents` 完全一致。使用 `buildHostedCheckoutUrl()` 时也必须同时传入相同的 `amountCents` 和 `priceKey`，以便移动端收银台重建订单时继续校验。`listPaymentOrders()` 返回的订单记录也会包含 `priceKey`，可用于支付完成后的 SKU/档位发货恢复。

### 16.11 `IUtilOperations` 全量方法

1. `createSymmetricKey()`
2. `createThreadKey()`
3. `setAppInfo(appId, fid, domain, owner?, rewarder?)`
4. `getAppInfo(appId)`
5. `handleIpfsRequest(data, port, fileOps?)`

示例（写入应用信息）：

```ts
const [ok, err] = await dc.util.setAppInfo(
  dc.appInfo.appId,
  'fid-xxx',
  'https://example.com',
  'owner_pubkey'
);
```

### 16.12 `DCContext` 字段覆盖

核心字段（用于 SDK 内部上下文与调试定位）：

1. 网络与链路：`dcNodeClient`, `dcChain`, `dcutil`, `connectedDc`, `AccountBackupDc`
2. 账号身份：`accountInfo`, `userInfo`, `publicKey`, `privateKey`, `parentPublicKey`, `ethAddress`
3. 应用与数据库：`appInfo`, `dbManager`, `grpcServer`
4. 核心方法：`sign(payload)`, `getPubkeyRaw()`, `getPublicKey()`

### 16.13 interfaces 目录现状说明

1. `lib/interfaces/index.ts` 已导出上述接口。
2. `lib/interfaces/components/news-component.ts` 当前为空文件（无可补充接口）。

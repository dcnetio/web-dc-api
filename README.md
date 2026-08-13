# Web DC API

`web-dc-api` 是面向浏览器的去中心化应用 SDK。它把钱包身份、用户私有数据库、共享 KeyValue、文件、评论、消息、AI 代理、实时通信、白板和支付能力统一在一个 `DC` 实例中。

本文档对应仓库当前 SDK `0.2.72`，示例以当前 TypeScript 类型和实现为准。

## 目录

- [能力总览](#能力总览)
- [运行要求](#运行要求)
- [安装](#安装)
- [5 分钟接入](#5-分钟接入)
- [初始化配置](#初始化配置)
- [调用约定与生命周期](#调用约定与生命周期)
- [React 接入](#react-接入)
- [认证](#认证)
- [ThreadDB 用户数据库](#threaddb-用户数据库)
- [KeyValue 共享存储](#keyvalue-共享存储)
  - [主题权限设计技巧](#主题权限设计技巧)
- [文件](#文件)
  - [上传文件夹](#上传文件夹)
  - [遍历目录并按路径读取](#遍历目录并按路径读取)
  - [从代码生成目录](#从代码生成目录)
- [Service Worker 媒体访问](#service-worker-媒体访问)
- [评论](#评论)
  - [鉴权评论主题](#鉴权评论主题)
- [消息与 RTM](#消息与-rtm)
- [AI 代理](#ai-代理)
- [RTC 音视频](#rtc-音视频)
- [实时白板](#实时白板)
- [支付](#支付)
- [缓存与工具](#缓存与工具)
- [高级能力](#高级能力)
- [常见问题](#常见问题)
- [API 索引](#api-索引)

## 能力总览

| 需求 | 模块/导出 | 适合存储或处理 | 关键入口 | 额外前置条件 |
| --- | --- | --- | --- | --- |
| 钱包登录与身份 | `dc.auth` | 登录、签名、解密、用户空间 | `accountLoginWithWallet` | `dc.init()` |
| 用户私有结构化数据 | `dc.db` | 设置、笔记、草稿、个人记录 | `dc.initUserDB`、`create`、`find`、`save` | 登录后初始化数据库 |
| 多用户共享数据 | `dc.keyValue` | 配置、商品、排行榜、全局状态 | `createStore`、`createSharedStore`、`set`、`getWithIndex` | 登录；创建者公钥和权限配置 |
| 类型化 KV 仓储 | `EntityRepository` | 基于 KeyValue 的实体、索引查询 | `save`、`findById`、`findByIndex` | 已获得 `KeyValueDB` |
| 文件与目录 | `dc.file` | 加密上传、CID 下载、目录遍历、流式读取 | `addFile`、`addFolder`、`getFileFromDir`、`getSeekableFileStream` | 登录；保管好加密密钥 |
| 时间线与留言 | `dc.comment` | 动态、评论、回复、点赞/踩/转发 | `addThemeObj`、`publishCommentToTheme` | 登录；明确主题作者 |
| 离线消息箱 | `dc.message` | 通知、私信、稍后拉取的消息 | `sendMsgToUserBox`、`getMsgFromUserBox` | 登录 |
| 在线实时消息 | `dc.rtm` | 在线单聊、在线状态、信令接收 | `login`、`sendMessageToPeer` | RTM Token，或可自动取 Token 的 AI 代理配置 |
| AI 与 MCP | `dc.aiproxy` | 流式模型调用、MCP、异步资源、实时语音 | `DoAIProxyCall`、`GenerateAndPollAIResource` | 服务配置和用户授权 |
| 实时音视频 | `dc.rtc` | 通话、会议、屏幕共享、实时房间消息 | `init`、`callPeer`、`joinRoom` | RTC Token 服务；呼叫信令另需 RTM 登录 |
| 协作白板 | `dc.whiteboard` | 绘制、文档、翻页、视角同步 | `init`、`joinRoom`、`getWhiteboard` | 白板 Token 服务；邀请功能另需 RTM 登录 |
| 支付 | `dc.pay` | 套餐、订单、扫码支付、托管收银台 | `config`、`listRenewPackages`、`createPayOrder` | 支付服务地址 |
| 短期分布式缓存 | `dc.cache` | 有过期时间的临时值 | `setCacheKey`、`getCacheValue` | 登录 |
| 网络与密钥工具 | `dc.client` / `dc.util` | 节点信息、对称密钥、应用信息 | `getHostID`、`createSymmetricKey` | `dc.init()` |

### 三种数据能力怎么选

| 能力 | 数据边界 | 查询方式 | 典型场景 |
| --- | --- | --- | --- |
| ThreadDB (`dc.db`) | 当前用户专属，跨设备同步 | JSON 条件、排序、游标 | 用户设置、笔记、私有业务数据 |
| 普通 KeyValue (`createStore`) | 同一个 key 可按写入用户分别保存 | key、写入者、索引、时间 | 用户提交、排行榜、多人共享记录 |
| 共享 KeyValue (`createSharedStore`) | 同一个 key 全局只保留最新值 | key、索引、时间 | 全局配置、公告、状态标志 |

评论系统适合按时间线组织互动内容；消息箱适合发给指定用户；它们不应替代通用数据库。

## 运行要求

- SDK 的主要运行目标是现代浏览器，而不是纯 Node.js 服务端。
- 核心能力要求浏览器支持 ES2020、Web Crypto、IndexedDB 和 WebSocket。
- 文件流读取还需要 `ReadableStream`；`wrapWorker` / `exposeDC` 等 Worker 封装需要 Web Worker。只使用核心模块时不必把 Web Worker 视为强制前提。
- 钱包登录会打开钱包页面，请从用户点击等真实交互中触发，避免被浏览器拦截弹窗。
- 摄像头、麦克风、屏幕共享和 Service Worker 需要 HTTPS；本地开发可使用 `localhost`。
- 包入口包含依赖 `window` 等浏览器全局对象的 RTC/白板能力。SSR 框架中不要在服务端模块顶层导入 `web-dc-api`；应从客户端组件加载，或使用关闭 SSR 的动态导入，然后只在客户端创建 `DC`。
- `appId` 是数据命名空间的一部分。上线后不要随意修改，否则应用会访问到不同的数据空间。

## 安装

### npm / pnpm / yarn

```bash
npm install web-dc-api
```

```bash
pnpm add web-dc-api
```

```bash
yarn add web-dc-api
```

包同时提供 ESM、CommonJS 和 TypeScript 类型。应用代码应从包根入口导入：

```ts
import { DC, LogLevel, ThemePermission } from "web-dc-api";
```

不要从 `web-dc-api/lib/...` 或未声明的 `web-dc-api/dist/...` 路径深层导入；包的公开 `exports` 只保证根入口、`web-dc-api/sw.js` 和 `web-dc-api/package.json`。

### CDN

CDN 版本还需要先加载 `grpc-libp2p-client`。建议在生产环境固定版本：

```html
<script src="https://cdn.jsdelivr.net/npm/grpc-libp2p-client@0.0.43/dist/grpc.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/web-dc-api@0.2.72/dist/dc.min.js"></script>
<script>
  const { DC } = WebDcApi;
</script>
```

## 5 分钟接入

下面的示例完成 SDK 初始化、钱包登录、用户数据库初始化、写入和查询。链节点地址及应用信息应由部署配置提供。

```ts
import { DC, LogLevel } from "web-dc-api";

const dc = new DC({
  wssUrl: "wss://dcchain.baybird.cn",
  backWssUrl: "wss://dcchain.baybird.cn",
  appInfo: {
    appId: "your-stable-app-id",
    appName: "Your App Name",
    appVersion: "1.0.0",
    appIcon: "https://example.com/icon.png",
    appUrl: window.location.origin,
    themeColor: "#1677ff",
  },
  logLevel: LogLevel.WARN,
});

const initialized = await dc.init(async (step) => {
  // step: 0=模块已注册，1=链已连接，2=DC 节点已连接，3=模块已初始化，4=临时身份已创建
  console.log("DC init step:", step);
});

if (!initialized) {
  throw new Error("DC 初始化失败，请检查链节点地址和网络状态");
}

const auth = dc.auth;
if (!auth) throw new Error("Auth 模块不可用");

// 应在用户点击登录按钮后调用。
const [account, loginError] = await auth.accountLoginWithWallet();
if (loginError || !account) {
  throw loginError ?? new Error("钱包登录失败");
}

console.log("显示账号:", account.nftAccount);
console.log("应用账号:", account.account);
console.log("用户公钥:", dc.publicKey?.string());

const collections = [
  {
    name: "notes",
    schema: {
      type: "object",
      properties: {
        _id: { type: "string" },
        _mod: { type: "number" },
        title: { type: "string" },
        content: { type: "string" },
        createdAt: { type: "number" },
      },
      required: ["_id", "title", "content", "createdAt"],
      additionalProperties: true,
    },
  },
];

// schemaVersion 必须是数字。集合结构变化时递增，例如 1 -> 2。
const schemaVersion = 1;
const [dbInfo, dbError] = await dc.initUserDB(
  collections,
  schemaVersion,
  false,
);
if (dbError || !dbInfo) {
  throw dbError ?? new Error("用户数据库初始化失败");
}

const db = dc.db;
if (!db) throw new Error("Database 模块不可用");

const [noteId, createError] = await db.create(
  dbInfo.id,
  "notes",
  JSON.stringify({
    title: "第一条笔记",
    content: "Hello DC",
    createdAt: Date.now(),
  }),
);
if (createError || !noteId) {
  throw createError ?? new Error("创建笔记失败");
}

const [resultJSON, findError] = await db.find(
  dbInfo.id,
  "notes",
  JSON.stringify({
    sort: { fieldPath: "createdAt", desc: true },
  }),
);
if (findError) throw findError;

const notes = resultJSON ? JSON.parse(resultJSON) : [];
console.log(notes);
```

登录成功后，`account` 的常用字段是：

| 字段 | 类型 | 用途 |
| --- | --- | --- |
| `nftAccount` | `string` | 面向用户显示的账号 |
| `appAccount` | `Uint8Array` | 当前应用专用账号原始字节 |
| `account` | `string` | 应用账号字符串，可用于存储或业务标识 |
| `ethAccount` | `string` | EVM 兼容账号 |
| `dc.publicKey?.string()` | `string` | 当前 DC 身份公钥；钱包登录成功后才是当前用户的应用公钥 |

`dc.init()` 的第 4 步会先创建临时身份，因此不能只用 `dc.publicKey` 是否存在来判断钱包登录状态。业务模块调用前应以 `accountLoginWithWallet()` 成功返回 `Account` 为准；需要在其他代码路径校验时，同时检查 `dc.userInfo` 和 `dc.publicKey`。正常退出请使用 `await dc.exit()`，不要只调用 `auth.exitLogin()` 后继续复用旧身份字段。

## 初始化配置

```ts
new DC({
  wssUrl,
  backWssUrl,
  appInfo,
  swUrl,
  logLevel,
});
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `wssUrl` | 是 | 主链 WebSocket 地址 |
| `backWssUrl` | 是 | 主链连接失败时使用的备用地址；可以和主地址相同 |
| `appInfo.appId` | 业务上必填 | 稳定且唯一的应用 ID，也是数据命名空间的一部分 |
| `appInfo.appName` | 业务上必填 | 钱包及界面显示的应用名称 |
| `appInfo.appVersion` | 否 | 应用展示版本；它不是 ThreadDB 的 schema 版本 |
| `appInfo.appIcon` | 否 | 应用图标 URL |
| `appInfo.appUrl` | 否 | 应用 URL |
| `appInfo.themeColor` | 否 | 钱包页面使用的主题色 |
| `appInfo.rtcAppId` | 否 | RTC/RTM 服务需要的应用 ID |
| `swUrl` | 否 | 文件流 Service Worker 脚本地址；未设置时文件模块会尝试使用同源 `/sw.js` |
| `logLevel` | 否 | SDK 日志级别，例如 `LogLevel.WARN` |

`dc.init()` 可重复调用；实例已经初始化时会直接返回 `true`。应用中应复用一个实例，避免建立重复的 P2P 和数据库连接。

文件模块初始化时会自动尝试注册 Service Worker。浏览器不支持、页面不是 HTTPS/localhost 或脚本不存在时，注册失败只会记录日志，不会导致整个 `dc.init()` 失败；不需要媒体 Range 请求或 seek 时可忽略该能力。SDK 构建产物包含 `dist/sw.js`，但浏览器要求 Service Worker 与应用同源，因此接入方仍需把它部署到应用根目录。完整步骤见 [Service Worker 媒体访问](#service-worker-媒体访问)。

## 调用约定与生命周期

### 两类错误返回方式

数据、文件、认证、评论等模块通常返回元组：

```ts
const [value, error] = await operation();
if (error) throw error;
```

部分更新/删除方法直接返回 `Error | null`：

```ts
const error = await dc.db?.save(threadId, "notes", JSON.stringify(note));
if (error) throw error;
```

RTM、RTC、白板和支付的大多数方法失败时会抛异常，应使用 `try/catch`：

```ts
try {
  await dc.rtm?.sendMessageToPeer(receiverPubkey, "hello");
} catch (error) {
  console.error(error);
}
```

不要只判断返回值是否为空而忽略 `error`；空值有时表示“记录不存在”，有时表示操作失败。

### 推荐生命周期

```text
创建单例 DC
  -> dc.init()
  -> 用户手势触发 accountLoginWithWallet()
  -> 按需初始化 ThreadDB / RTM / RTC / 白板
  -> 使用业务模块
  -> dc.exit() 清理当前身份字段和钱包登录态
  -> dc.shutdown() 关闭模块、数据库、gRPC 和 P2P 连接
```

页面只是切换路由时通常不需要 `shutdown()`。只有整个应用退出或确定不再使用 SDK 时才关闭实例。

## React 接入

推荐把实例和初始化 Promise 一起做成单例，避免 React Strict Mode 或并发渲染创建多个连接。钱包登录仍应放在按钮点击事件中。

```ts
// src/lib/dc-client.ts
import { DC, LogLevel } from "web-dc-api";

let dcInstance: DC | null = null;
let initializing: Promise<DC> | null = null;

export function getDC(): Promise<DC> {
  if (dcInstance?.isInitialized()) return Promise.resolve(dcInstance);
  if (initializing) return initializing;

  initializing = (async () => {
    const dc = new DC({
      wssUrl: import.meta.env.VITE_DC_WSS_URL,
      backWssUrl: import.meta.env.VITE_DC_BACK_WSS_URL,
      appInfo: {
        appId: import.meta.env.VITE_DC_APP_ID,
        appName: "Your App",
        appVersion: "1.0.0",
        appUrl: window.location.origin,
      },
      logLevel: LogLevel.WARN,
    });

    if (!(await dc.init())) throw new Error("DC 初始化失败");
    dcInstance = dc;
    return dc;
  })().catch((error) => {
    initializing = null;
    throw error;
  });

  return initializing;
}

export async function disposeDC(): Promise<void> {
  if (dcInstance) await dcInstance.shutdown();
  dcInstance = null;
  initializing = null;
}
```

```tsx
import { getDC } from "./lib/dc-client";

export function LoginButton() {
  const login = async () => {
    const dc = await getDC();
    const auth = dc.auth;
    if (!auth) throw new Error("Auth 模块不可用");

    const [account, error] = await auth.accountLoginWithWallet();
    if (error || !account) throw error ?? new Error("登录失败");

    console.log("logged in:", account.nftAccount);
  };

  return <button onClick={login}>使用 DC 钱包登录</button>;
}
```

在 Next.js、Nuxt 等 SSR 项目中，将上述文件只从客户端组件加载，或使用关闭 SSR 的动态导入。当前包入口不是 Node.js/SSR 安全入口：即使服务端不调用 `new DC()`，顶层导入也可能访问 `window`，因此不能先在服务端静态导入再延迟初始化。

## 认证

应用开发者最常用的是以下方法：

```ts
const auth = dc.auth;
if (!auth) throw new Error("Auth 模块不可用");

const [account, loginError] = await auth.accountLoginWithWallet();
const [currentAccount, infoError] = await auth.getLoginInfo();

const payload = new TextEncoder().encode("content to sign");
const [signature, signError] = await auth.sign(payload);

// 推荐退出方式：同时退出钱包，并清理公钥、dbThreadId、EVM 地址和账号备份连接。
await dc.exit();
```

`auth.exitLogin()` 只调用钱包侧退出，不会清理 `DC` 上的身份字段。`dc.exit()` 的清理范围更完整，但当前实现不会把 `dc.userInfo` / `dc.accountInfo` 置空，也不会关闭模块和网络连接；因此登录判断应同时检查 `dc.userInfo` 和 `dc.publicKey`，彻底停止 SDK 则另行调用 `dc.shutdown()`。

其他认证能力包括钱包消息签名、EIP-712 签名、NFT 账号绑定、应用账号生成、用户空间检查和存储套餐续订。普通 DApp 不应自行实现账号密码托管流程，优先使用钱包登录。

## ThreadDB 用户数据库

ThreadDB 用于当前用户的私有结构化数据。`dc.initUserDB()` 会创建或恢复用户数据库，并设置 `dc.dbThreadId`；同步和维护任务会在后台继续运行。

### Schema 规则

- 每个 collection 必须有唯一 `name` 和 JSON Schema。
- Schema 必须声明字符串类型的 `_id`，它是记录主键。创建数据时可省略，由 SDK 在校验前生成；保存时必须带回已有 `_id`。
- Schema 还应声明可索引的 `_mod` 字段，但不要把它放进 `required`。SDK 会移除调用方传入的 `_mod`，再写入自己的修改时间标记和索引，业务代码不要覆盖它。
- `schemaVersion` 是正整数，不是 `"1.0.0"`。集合字段或索引变化时递增。
- `reset=true` 会重建数据库并导致原数据丢失，只能用于明确的开发调试场景。

### CRUD

```ts
const db = dc.db;
if (!db || !dc.dbThreadId) throw new Error("请先调用 initUserDB");

const [id, createError] = await db.create(
  dc.dbThreadId,
  "notes",
  JSON.stringify({ title: "Draft", content: "...", createdAt: Date.now() }),
);
if (createError || !id) throw createError ?? new Error("create failed");

const [oneJSON, oneError] = await db.findByID(dc.dbThreadId, "notes", id);
if (oneError) throw oneError;
const note = oneJSON ? JSON.parse(oneJSON) : null;

if (note) {
  note.title = "Published";
  const saveError = await db.save(
    dc.dbThreadId,
    "notes",
    JSON.stringify(note),
  );
  if (saveError) throw saveError;
}

const [listJSON, listError] = await db.find(
  dc.dbThreadId,
  "notes",
  JSON.stringify({
    condition: "createdAt > 1700000000000",
    ors: [{ condition: "title = 'Pinned'" }],
    sort: { fieldPath: "createdAt", desc: true },
    seek: "",
  }),
);
if (listError) throw listError;

const deleteError = await db.delete(dc.dbThreadId, "notes", id);
if (deleteError) throw deleteError;
```

常用补充接口：`has`、`deleteMany`、`modifiedSince`、`getDBRecordsCount`、`refreshDBFromDC`、`syncDBToDC`、`exportDBToFile`。

## KeyValue 共享存储

KeyValue 主题由 `(appId, theme, themeAuthor)` 唯一定位。`themeAuthor` 是创建该主题的用户公钥，必须作为应用配置长期保存；它不一定等于当前登录用户。

### 命名、类型和权限

- 普通主题会自动补 `keyvalue_` 前缀。
- `KeyValueStoreType.Public` 主题名必须以 `_pub` 结尾；具备可用 SDK 身份的用户无需额外 `READ` 授权即可读取，写入仍需授权。
- `KeyValueStoreType.Auth` 的读取和写入都需要相应授权。
- `createStore` 为每个写入用户保留同 key 的独立值。
- `createSharedStore` 自动规范化为 `keyvalue_shared_` 前缀，同 key 全局只保留时间戳最新值。
- 创建时传入的空间小于 100 MiB 会在实现中提升到 100 MiB。

权限使用 `ThemePermission` 枚举；主题创建者始终具有 `ADMIN` 权限。

### 创建或获取共享主题

```ts
import {
  Direction,
  KeyValueStoreType,
  toSharedTheme,
} from "web-dc-api";

const keyValue = dc.keyValue;
if (!keyValue || !dc.userInfo || !dc.publicKey) {
  throw new Error("请先完成钱包登录");
}

const appId = dc.appInfo.appId;
const themeAuthor = "creator-public-key-from-app-config";
const theme = toSharedTheme("global_config_pub");

let [store, storeError] = await keyValue.getStore(
  appId,
  theme,
  themeAuthor,
);

if (!store && dc.publicKey.string() === themeAuthor) {
  [store, storeError] = await keyValue.createSharedStore(
    appId,
    theme,
    100 * 1024 * 1024,
    KeyValueStoreType.Public,
  );
}

if (storeError || !store) {
  throw storeError ?? new Error("主题不存在，且当前用户不是创建者");
}

const settings = { theme: "dark", language: "zh-CN" };
const indexes = [
  { key: "kind", type: "string", value: "settings" },
  { key: "updatedAt", type: "number", value: Date.now() },
];

// 公共主题只代表“已登录用户无需额外 READ 授权”。这里仍只允许主题作者更新全局配置。
if (dc.publicKey.string() === themeAuthor) {
  const [saved, timestamp, setError] = await keyValue.set(
    store,
    "app_settings",
    JSON.stringify(settings),
    JSON.stringify(indexes),
  );
  if (setError || !saved) throw setError ?? new Error("KV 写入失败");
  console.log("server timestamp:", timestamp);
}
```

获取共享主题时，必须把 `toSharedTheme(...)` 的结果传给 `getStore`。如果用普通主题名获取，再用 `createSharedStore` 创建，两次实际访问的主题名不同。

### 主题权限设计技巧

`ThemePermission` 是互斥状态枚举，不是位掩码。不要用 `READ | WRITE` 组合，也不要用数值大小比较权限：

| 权限 | KeyValue 中的实际能力 | 建议用途 |
| --- | --- | --- |
| `NONE` | 无读写权限 | 撤销授权或用户主动退出 |
| `APPLY` | 只有申请状态，不授予数据访问 | 用户申请加入，等待管理员审批 |
| `READ` | 可读，不可写 | 观察者、审核员 |
| `WRITE` | 可读写 | 编辑者、普通成员 |
| `ADMIN` | 可读写，并可管理其他用户权限 | 主题管理员；按最小人数授予 |
| `ONLY_WRITE` | 可写，但不获得主题读取权限，也不能修改授权信息 | 匿名投稿、设备上报、只收集不公开的数据 |
| `DEVICE` | 物联网管理扩展权限 | 仅用于配套的 IoT 流程 |
| `QUERY` | 查询服务专用权限 | AI/服务查询流程，不可替代 `READ` |
| `NOT_EXIST` | 服务端表示“没有授权记录”的哨兵值 | 不要主动配置给用户 |

存储类型决定读取边界，用户权限决定写入能力：

| 存储类型 | 读取 | 写入 |
| --- | --- | --- |
| `KeyValueStoreType.Auth` | `READ`、`WRITE`、`ADMIN` | `WRITE`、`ADMIN`、`ONLY_WRITE` |
| `KeyValueStoreType.Public` | 已登录用户无需额外 `READ` 授权 | `WRITE`、`ADMIN`、`ONLY_WRITE` |

主题作者或已有 `ADMIN` 权限的用户可以配置其他用户。状态码 `0` 才表示成功：

```ts
import { ThemePermission } from "web-dc-api";

const editorPubkey = "editor-public-key";
const [authStatus, authError] = await keyValue.configAuth(
  store,
  editorPubkey,
  ThemePermission.WRITE,
  "content editor",
);
if (authError || authStatus !== 0) {
  throw authError ?? new Error(`授权失败，状态码：${authStatus}`);
}

// 撤销该用户权限，并同样检查状态码。
const [revokeStatus, revokeError] = await keyValue.configAuth(
  store,
  editorPubkey,
  ThemePermission.NONE,
  "revoked",
);
if (revokeError || revokeStatus !== 0) {
  throw revokeError ?? new Error(`撤销失败，状态码：${revokeStatus}`);
}

// 当前用户可在界面展示操作按钮前查询自身权限；服务端仍会再次鉴权。
const [ownAuth, ownAuthError] = await keyValue.GetUserOwnAuth(store);
if (ownAuthError) throw ownAuthError;
console.log("current permission:", ownAuth?.permission);
```

`authPubkey` 传 `"all"` 可设置未单独授权用户的默认权限；某个用户的单独记录优先于 `"all"`。这个能力应谨慎使用：

- 共享配置不要授予 `"all" + WRITE`，否则任何登录用户都能覆盖同一个 key。
- 收集型业务可使用 `KeyValueStoreType.Auth` 的普通存储，并授予 `"all" + ONLY_WRITE`；用户可提交数据，但不能枚举或读取其他用户数据。
- 权限初始化应放在受控的管理员/部署流程中，不要在每次客户端启动时重复执行。
- `remark` 适合角色、分组等业务元数据，不要存放密钥或其他敏感信息。
- 权限列表可用 `store.getDbAuthList(limit, seekKey)`，或 `keyValue.getDbAuthList(store, limit, seekKey)` 分页读取；把返回的 `nextSeekKey` 传入下一页，直到它为空。

### 读取值和元数据

KeyValue 的原始读取结果包含业务值和 DC 元数据：

```text
<value>$$$dckv_extra$$$<metadata-json>
```

直接 `JSON.parse(raw)` 会失败，应先拆分：

```ts
function parseKVValue<T>(raw: string): {
  value: T;
  meta: { dc_timestamp?: number; dc_opuser?: string };
} {
  const separator = "$$$dckv_extra$$$";
  const index = raw.indexOf(separator);
  const valuePart = index >= 0 ? raw.slice(0, index) : raw;
  const metaPart = index >= 0 ? raw.slice(index + separator.length) : "{}";
  return {
    value: JSON.parse(valuePart) as T,
    meta: JSON.parse(metaPart || "{}"),
  };
}

const [raw, getError] = await keyValue.get(store, "app_settings");
if (getError) throw getError;
if (raw) console.log(parseKVValue(raw));

// indexValue 传空字符串表示不限定具体值；这里按更新时间倒序读取。
const [recentJSON, recentError] = await keyValue.getWithIndex(
  store,
  "updatedAt",
  "",
  {
    type: "number",
    limit: 10,
    seekKey: "",
    direction: Direction.Reverse,
    offset: 0,
  },
);
if (recentError) throw recentError;
console.log(recentJSON ? JSON.parse(recentJSON) : []);

const [recordCount, countError] = await keyValue.getRecordCount(store);
if (countError) throw countError;
console.log("records:", recordCount);
```

常用补充接口：`getValues`、`getBatch`、`getWithTimeOrder`、`setWithCount`、`getDBCount`、`getDbAuthList`、`GetUserOwnAuth`、`GetUserAuth`。删除一个 key 时使用 `set(store, key, "", "")`。

### 类型化仓储

SDK 导出 `BaseEntity`、`EntityRepository`、`Entity`、`Column`、`Index` 和 `composeCompositeIndexValue`。它们建立在 KeyValue 之上，提供实体校验、保存、局部更新、主键查询、单字段/复合索引查询及分页读取。

```ts
import { BaseEntity, EntityRepository } from "web-dc-api";

class Product extends BaseEntity {
  id = "";
  name = "";
  category = "";
  price = 0;

  validate() {
    if (!this.id || !this.name) throw new Error("invalid product");
  }
}

const products = new EntityRepository(Product, keyValue, store);
await products.save(
  Product.from({ id: "p-1", name: "Keyboard", category: "hardware", price: 299 }),
);
const product = await products.findById("p-1");
```

仓储使用 KeyValue 的索引规则；需要 `findByIndex` 时，应通过装饰器或底层 `set` 预先建立对应索引。

## 文件

文件模块支持普通文件、目录、完整下载、流式读取、可 seek 流和本地缓存。

```ts
import { UploadStatus } from "web-dc-api";

const fileModule = dc.file;
const util = dc.util;
if (!fileModule || !util || !dc.userInfo || !dc.publicKey) {
  throw new Error("请先完成钱包登录并确认 File/Util 模块可用");
}

const input = document.querySelector<HTMLInputElement>("#file");
const file = input?.files?.[0];
if (!file) throw new Error("请选择文件");

// 空字符串表示不加密；加密时必须由业务安全保存密钥。
const encryptionKey = util.createSymmetricKey().toString();

const [cid, uploadError] = await fileModule.addFile(
  file,
  encryptionKey,
  (status, uploadedBytes) => {
    if (status === UploadStatus.UPLOADING) {
      console.log("uploaded bytes:", uploadedBytes);
    }
  },
);
if (uploadError || !cid) throw uploadError ?? new Error("上传失败");

const [bytes, downloadError] = await fileModule.getFile(cid, encryptionKey);
if (downloadError || !bytes) {
  throw downloadError ?? new Error("下载失败");
}
const blobUrl = URL.createObjectURL(new Blob([bytes as BlobPart]));

// createFileStream 返回 ReadableStream | null，不是 [stream, error] 元组。
const stream = await fileModule.createFileStream(cid, encryptionKey);

// 视频跳转或大文件分段读取。
const seekable = await fileModule.getSeekableFileStream(cid, encryptionKey);
seekable.seek(1024 * 1024);
const chunk = await seekable.read(256 * 1024);
```

可 seek 流会按“CID/目录路径 + 解密密钥”在内存中缓存约 100 秒；重复获取时可能返回同一个可变流实例。直接调用 `seek()` / `read()` 的多个消费者不要并发共享同一实例，需要重新开始时先 `seek(0)`，需要强制新建时可调用 `fileModule.clearFileCache(cid)`。`createReadableStream()` 默认从当前 `getPosition()` 开始，但之后使用独立的流位置，不会推进实例位置；必须从头读取时传 `{ start: 0 }`。

### 上传文件夹

浏览器选择文件夹时必须同时设置 `webkitdirectory` 和 `multiple`；SDK 使用每个文件的 `webkitRelativePath` 还原多级目录：

```html
<input id="folder" type="file" webkitdirectory multiple />
```

```ts
import { UploadStatus } from "web-dc-api";

const folderInput = document.querySelector<HTMLInputElement>("#folder");
const folderFiles = folderInput?.files;
if (!folderFiles?.length) throw new Error("请选择文件夹");

// 整个目录共用一个密钥；不加密时传空字符串。
const folderEncryptionKey = dc.util!.createSymmetricKey().toString();
const [folderCid, folderError] = await dc.file!.addFolder(
  folderFiles,
  folderEncryptionKey,
  (status, totalBlocks, processedBlocks) => {
    if (status === UploadStatus.UPLOADING) {
      console.log(`folder blocks: ${processedBlocks}/${totalBlocks}`);
    }
  },
);
if (folderError || !folderCid) {
  throw folderError ?? new Error("文件夹上传失败");
}
```

进度回调中的 `totalBlocks` / `processedBlocks` 是 DC 接收的数据块数量，不等同于用户选择的源文件数量。上传时 SDK 会在根目录加入内部所有者标记 `dc_ownuser`；目录列表会自动隐藏它，业务代码不要自行创建同名文件。

### 遍历目录并按路径读取

```ts
import { cidNeedConnect } from "web-dc-api";

// 首次读取一个独立根 CID 时使用 NEED，让 SDK 先连接保存该对象的节点。
const [entries, listError] = await dc.file!.getFolderFileList(
  folderCid,
  cidNeedConnect.NEED,
  true, // true=递归列出所有后代；false=只列当前层
);
if (listError || !entries) {
  throw listError ?? new Error("目录读取失败");
}

const target = entries.find(
  (entry) => entry.Type === 0 && entry.Path === "docs/readme.txt",
);
if (!target) throw new Error("目录内文件不存在");

const [result, fileError] = await dc.file!.getFileFromDir(
  folderCid,
  target.Path,
  folderEncryptionKey,
);
if (fileError || !(result instanceof Uint8Array)) {
  throw fileError ?? new Error("目标路径不是文件");
}
console.log(new TextDecoder().decode(result));

// 大文件、视频或 Range 请求优先使用可 seek 流，避免一次加载完整内容。
const folderStream = await dc.file!.getSeekableFileStreamFromDir(
  folderCid,
  target.Path,
  folderEncryptionKey,
);
folderStream.seek(1024 * 1024);
const folderChunk = await folderStream.read(256 * 1024);
console.log("file size:", folderStream.getSize(), "chunk:", folderChunk.length);
```

目录项字段含义：

| 字段 | 含义 |
| --- | --- |
| `Name` | 当前文件或目录名 |
| `Type` | `0` 为文件，`1` 为目录 |
| `Hash` | 当前项的 CID |
| `Path` | 相对根目录的路径，可直接传给 `getFileFromDir` / `getSeekableFileStreamFromDir` |
| `Size` | 文件在 UnixFS 中的存储字节数；目录为 `0`，加密文件包含分块加密开销 |
| `Content` | 仅 `getFolderFileListWithContent` 的文件项包含完整字节内容 |

`getFileFromDir` 的路径指向文件时返回 `Uint8Array`，指向目录时返回该目录的一级列表，因此必须用 `instanceof Uint8Array` 收窄类型。`getFolderFileListWithContent(cid, key, recursive, peerAddr?)` 会逐个下载并把所有文件内容放进内存，只适合小目录；大目录应先获取列表，再按路径读取单个文件或使用可 seek 流。已通过其他目录操作连接到同一根 CID 时才使用 `cidNeedConnect.NOT_NEED`，普通业务的首次读取应使用 `NEED`。

### 从代码生成目录

没有原生文件夹选择框时，可把路径和内容转换成 `FileList`，再复用 `addFolder`：

```ts
const [generatedFiles, generateError] = dc.file!.createCustomFileList(
  {
    "docs/readme.txt": "hello DC",
    "config/app.json": JSON.stringify({ language: "zh-CN" }),
    "assets/data.bin": new Uint8Array([1, 2, 3]),
  },
  "release",
);
if (generateError || !generatedFiles) {
  throw generateError ?? new Error("目录生成失败");
}

const [generatedFolderCid, generatedUploadError] = await dc.file!.addFolder(
  generatedFiles,
  "",
  (status, total, processed) => console.log(status, total, processed),
);
if (generatedUploadError || !generatedFolderCid) {
  throw generatedUploadError ?? new Error("生成目录上传失败");
}
```

`addFolderInLocal` 只把目录构建到当前浏览器节点的本地块存储，不会向 DC 注册或持久化上传，适合本地预处理和调试，不能代替正式的 `addFolder`。拿到未知 CID 时可用 `isFileOrDir(cid)` 判断 `file`、`directory` 或 `unknown`；该判断需要相关 UnixFS 数据在当前连接中可访问。

加密密钥一旦丢失，SDK 无法恢复加密文件。不要把密钥写进公开 KeyValue 或业务日志。使用下述 Service Worker URL 播放加密媒体时，协议会把密钥放在 URL 路径中；敏感内容应优先使用文件流 API，或确保网关、监控和访问日志不会记录 `/dc/ipfs/` 路径。

## Service Worker 媒体访问

SDK 提供的 [assets/sw.js](assets/sw.js) 会在构建时复制为 npm 包内的 `dist/sw.js`，并可通过包子路径 `web-dc-api/sw.js` 定位。它只拦截同源的 `GET /dc/ipfs/` 请求，把 CID、可选解密密钥和 Range 请求通过 `MessageChannel` 交给页面中的 `dc.file` 处理，适合直接为 `<video>`、`<audio>`、PDF 或其他需要 HTTP Range 的组件提供 URL。

### 1. 将脚本部署到应用根目录

Service Worker 不能从 jsDelivr 等第三方域名跨域注册，也不能直接把 `node_modules` 路径交给浏览器。安装 npm 包后，将脚本复制到框架的静态资源目录，并确保最终可通过应用同源的 `/sw.js` 访问：

```bash
# Vite、Next.js、Nuxt 等项目通常会把 public/ 映射到站点根目录。
cp node_modules/web-dc-api/dist/sw.js public/sw.js
```

建议把复制动作加入应用构建流程，避免升级 SDK 后继续使用旧脚本。CDN 接入也必须先下载再由应用域名托管，不能直接把 CDN URL 设为 `swUrl`。把下面的 `VERSION` 替换为一个实际已发布、且包内包含 `dist/sw.js` 的版本号：

```bash
VERSION="<已发布版本号>"
curl -L "https://cdn.jsdelivr.net/npm/web-dc-api@${VERSION}/dist/sw.js" \
  -o public/sw.js
```

当前仓库构建并打包 `0.2.72` 时会包含 `dist/sw.js`；是否已发布到 npm 以实际 registry 版本为准。如果项目锁定在不包含该文件的旧版本，先升级依赖再执行复制；以后升级 SDK 时也应让应用内的 `/sw.js` 与依赖版本同步。

脚本必须部署在站点根级路径，例如 `/sw.js` 或 `/dc-ipfs-sw.js`。如果放在 `/assets/sw.js`，浏览器默认只授予 `/assets/` 作用域，无法拦截 `/dc/ipfs/`。当前自动注册流程不适用于无法部署根级 Service Worker 的子路径应用；这类应用应直接使用 `getFile`、`createFileStream` 或 `getSeekableFileStream`。

### 2. 配置并检查注册状态

部署为默认 `/sw.js` 时可以省略 `swUrl`；修改文件名时必须传同源、根级 URL：

```ts
const dc = new DC({
  wssUrl,
  backWssUrl,
  appInfo,
  // 默认值就是 "/sw.js"；自定义时也要放在站点根目录。
  swUrl: "/dc-ipfs-sw.js",
});

if (!(await dc.init())) throw new Error("DC 初始化失败");

console.log("Service Worker ready:", dc.swInited);
```

`dc.swInited` 表示注册流程是否取得 `ServiceWorkerRegistration`，不保证当前页面已经被 worker 控制；首次安装后如果控制台提示尚未接管，可等待 `controllerchange` 或刷新一次页面。`dc.swInited === false` 不会阻止其他模块工作。此时依次检查：页面是否为 HTTPS/localhost、脚本 URL 是否返回 JavaScript 而不是 SPA HTML、响应是否为同源、脚本是否位于根路径，以及浏览器控制台中的注册错误。更新已部署脚本后可调用根入口导出的 `updateServiceWorker()`；`isServiceWorkerActive()` 可检查当前页面作用域内的注册是否已有 active worker。

### 3. 构造媒体 URL

未加密文件和目录内文件的 URL 格式分别为：

```text
/dc/ipfs/<cid>/<filename>
/dc/ipfs/<folder-cid>/<relative/path/to/file>
```

目录 URL 的相对路径使用 `getFolderFileList` 返回的 `Path`，不要加上传时的根文件夹名。路径含空格、中文或 `#` 等字符时，应逐段编码，Service Worker 消息处理会在查找目录项前解码：

```ts
function encodeDcFilePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

const directoryMediaUrl =
  `/dc/ipfs/${folderCid}/${encodeDcFilePath("videos/演示 01.mp4")}`;
```

例如把已上传视频交给原生播放器：

```ts
const video = document.querySelector<HTMLVideoElement>("#preview-video");
if (!video) throw new Error("缺少视频元素");

const safeName = encodeURIComponent(file.name || "video.mp4");
video.src = `/dc/ipfs/${cid}/${safeName}`;
video.controls = true;
```

加密文件使用 `/dc/ipfs/<cid>_<decryptKey>/<filename>`。密钥会出现在浏览器可见的 URL 路径中，可能被历史记录、错误上报、代理或服务器访问日志采集，因此不要把这种 URL 用于高敏感内容：

```ts
const encryptedMediaUrl =
  `/dc/ipfs/${cid}_${encryptionKey}/${encodeURIComponent(file.name)}`;
```

Service Worker 会透传 `Content-Range`、`Content-Length` 和 `Accept-Ranges`。它支持单段 `bytes=start-end`、`bytes=start-` 和 `bytes=-suffixLength`，每次响应最多读取 3 MiB；不支持多段 Range。语法错误、空文件或越界范围返回 `416`，页面中的其他文件处理失败返回 `502`，找不到可处理请求的页面客户端返回 `503`，最终响应等待超过 60 秒返回 `504`。无 Range、未加密且不超过 5 MiB 的完整响应会缓存到 IndexedDB `dc-ipfs-cache`；Range 响应和带解密密钥的响应不会持久化，避免缓存解密后的内容。

## 评论

一个评论主题由 `appId + theme + themeAuthor` 定位。创建主题的当前登录用户就是 `themeAuthor`。

```ts
import { CommentType, OpenFlag } from "web-dc-api";

const comment = dc.comment;
if (!comment || !dc.userInfo || !dc.publicKey) {
  throw new Error("请先完成钱包登录");
}

const theme = "article_42_comments";
const themeAuthor = dc.publicKey.string();

const [createStatus, createError] = await comment.addThemeObj(
  theme,
  OpenFlag.PUBLIC,
  50 * 1024 * 1024,
);
if (createError) throw createError;
console.log("theme status:", createStatus);

const [commentKey, publishError] = await comment.publishCommentToTheme(
  theme,
  themeAuthor,
  CommentType.Comment,
  JSON.stringify({ text: "这是一条评论", createdAt: Date.now() }),
  OpenFlag.PUBLIC,
  "", // refercommentkey：回复时传被引用评论的 key
);
if (publishError || !commentKey) {
  throw publishError ?? new Error("评论发布失败");
}

const [comments, listError] = await comment.getThemeComments(
  theme,
  themeAuthor,
  0,
  1,  // 0=从旧到新，1=从新到旧
  0,
  20,
  "",
);
if (listError) throw listError;
console.log(comments);
```

评论开放标志的主要模式：

下表描述普通主题名的行为。这里的“公开”指具备可用 SDK 身份的用户无需额外主题授权，并不代表匿名、无身份访问；`auth_` 前缀会额外强制读取鉴权，并使写入也进入权限检查。

| 值 | 名称 | 主题行为 |
| --- | --- | --- |
| `0` | `PUBLIC` | 已登录用户无需额外主题授权即可读写 |
| `1` | `PRIVATE` | 登录用户可评论；评论默认仅评论者和主题作者可见，作者可精选公开 |
| `2` | `AUTH` | 建立权限列表并对写入鉴权；配合 `auth_` 主题名实现读写都鉴权 |
| `3` | `AUTH_WRITE` | 写入需授权；使用非 `auth_` 主题名时已登录用户无需额外授权即可读 |
| `4` | `REPORTED` | 服务端举报/审核状态，不要用它创建主题 |

`addThemeObj` 的第二个参数是主题开放模式；`publishCommentToTheme` 的第五个参数只是当前评论的可见性，只应传 `OpenFlag.PUBLIC` 或 `OpenFlag.PRIVATE`，不要在这两个位置混用语义。点赞、踩和转发使用 `CommentType.Up`、`CommentType.Down`、`CommentType.Transfer`；私密评论精选公开使用 `setObjCommentPublic`。

### 鉴权评论主题

完全私有的成员主题应同时使用 `auth_` 前缀和 `OpenFlag.AUTH`。前缀负责触发读取鉴权，开放标志负责建立权限列表并触发写入鉴权：

```ts
import { OpenFlag, ThemePermission } from "web-dc-api";

const authTheme = "auth_project_42";
const authThemeAuthor = dc.publicKey!.string();

const [themeStatus, themeError] = await dc.comment!.addThemeObj(
  authTheme,
  OpenFlag.AUTH,
  50 * 1024 * 1024,
);
if (themeError || themeStatus !== 0) {
  throw themeError ?? new Error(`主题创建失败，状态码：${themeStatus}`);
}

const memberPubkey = "member-public-key";
const [memberStatus, memberError] = await dc.comment!.configAuth(
  authThemeAuthor,
  authTheme,
  memberPubkey,
  ThemePermission.WRITE,
  "project member",
);
if (memberError || memberStatus !== 0) {
  throw memberError ?? new Error(`成员授权失败，状态码：${memberStatus}`);
}
```

常见权限模式：

- 完全私有成员区：主题名使用 `auth_*`，开放模式使用 `OpenFlag.AUTH`；读成员授予 `READ`，可发言成员授予 `WRITE`。
- 公开浏览、成员发言：主题名不要以 `auth_` 开头，开放模式使用 `OpenFlag.AUTH_WRITE`，发言成员授予 `WRITE`。
- 只允许提交、不允许普通成员读取：使用 `auth_* + OpenFlag.AUTH`，提交者授予 `ONLY_WRITE`。
- 用户申请加入：用户只能为自己配置 `APPLY`；管理员审核后再改成 `READ` 或 `WRITE`。`APPLY` 本身没有读写能力。
- 移除成员：管理员把该用户配置为 `NONE`；普通 `READ` / `WRITE` 用户也可以把自己设为 `NONE` 退出。

`comment.configAuth` 的参数顺序是 `(themeAuthor, theme, authPubkey, permission, remark)`，与 KeyValue 的 `(store, authPubkey, permission, remark)` 不同。`authPubkey="all"` 同样表示默认权限，用户单独授权会覆盖它。授权列表使用 `getThemeAuthList` 分页读取；权限判断必须以服务端结果为准，前端隐藏按钮只能改善交互，不能替代鉴权。

平台代管多个应用命名空间时，`addThemeObj`、`publishCommentToTheme`、`getThemeComments` 和 `setObjCommentPublic` 支持可选 `appId` 覆盖当前 `dc.appInfo.appId`。普通应用不要传该参数，保持使用当前应用命名空间即可。回复评论仍使用 `CommentType.Comment`，并把被回复评论的 key 放在 `refercommentkey`。

## 消息与 RTM

### 离线消息箱 (`dc.message`)

消息箱适合通知和无需保持在线的私信：

```ts
const message = dc.message;
if (!message || !dc.userInfo || !dc.publicKey) {
  throw new Error("请先完成钱包登录并确认 Message 模块可用");
}

const [messageId, sendError] = await message.sendMsgToUserBox(
  "receiver-public-key",
  JSON.stringify({ type: "notification", text: "订单已更新" }),
);
if (sendError) throw sendError;

const [inbox, inboxError] = await message.getMsgFromUserBox(20);
if (inboxError) throw inboxError;
console.log(messageId, inbox);
```

### 在线实时消息 (`dc.rtm`)

钱包已登录时，RTM 的 `userId` 固定使用当前 `dc.publicKey.string()`，此时传入其他 `userId` 会被覆盖。接收事件依赖 `login()` 建立的长连接；主动发送默认使用独立的短连接。

```ts
const rtm = dc.rtm;
if (!rtm || !dc.userInfo || !dc.publicKey) {
  throw new Error("请先完成钱包登录并确认 RTM 模块可用");
}

const rtmConfig = {
  appId: dc.appInfo.appId,
  themeAuthor: "rtm-config-author-public-key",
  configTheme: "realtime_services",
  serviceName: "aliyun-rtm",
};

rtm.on("onMessageReceived", ({ message, userId, sessionId }) => {
  console.log("RTM message:", { message, userId, sessionId });
});

await rtm.login(rtmConfig);

const status = await rtm.sendMessageToPeer(
  "receiver-public-key",
  JSON.stringify({ type: "chat", text: "hello" }),
  true,
  true,
);
console.log("send status:", status); // success | offline | failed

const online = await rtm.queryPeerOnlineStatus("receiver-public-key");
console.log("online:", online);

// 不再接收实时消息时调用。
await rtm.logout();
```

`sendMessageToPeer` 的第四个参数为 `true` 时，实时发送或 ACK 失败会尝试转入 `dc.message` 离线消息箱；返回 `offline` 表示走了该兜底路径，不表示对方已经实时收到。

RTM 本身只提供登录、点对点发送、在线状态和事件监听。频道邀请、通话和群组会话由 RTC/白板模块提供，不存在 `rtm.createPeerChannel()` 或 `rtm.subscribeChannel()`。

## AI 代理

AI 代理把模型、MCP Server、鉴权和额度配置保存在 DC 侧。普通调用者只需要管理员提供的四元组：`appId`、`themeAuthor`、`theme`、`service`。

### 设置默认服务并调用

```ts
import { AIStreamResponseFlag } from "web-dc-api";

const ai = dc.aiproxy;
if (!ai || !dc.userInfo || !dc.publicKey) {
  throw new Error("请先完成钱包登录并确认 AIProxy 模块可用");
}

const configError = await ai.SetAICallConfig({
  appId: dc.appInfo.appId,
  themeAuthor: "ai-config-author-public-key",
  theme: "default",
  service: "openai-compatible-chat",
  path: "/v1/chat/completions",
  model: "your-model",
});
if (configError) throw configError;

const controller = new AbortController();
let answer = "";

const [status, callError] = await ai.DoAIProxyCall(
  { signal: controller.signal, streamIdleTimeoutMs: 60_000 },
  JSON.stringify({
    messages: [{ role: "user", content: "介绍一下 DC API" }],
    stream: true,
  }),
  false,
  (flag, content, errorMessage) => {
    if (
      flag === AIStreamResponseFlag.STREAMING ||
      flag === AIStreamResponseFlag.STREAMING_REASON
    ) {
      answer += content;
    } else if (flag === AIStreamResponseFlag.CONNECTION_CLOSED) {
      console.log("complete:", answer);
    } else if (errorMessage) {
      console.error("AI stream error:", flag, errorMessage);
    }
  },
);
if (callError) throw callError;
console.log("call status:", status);
```

请求体由目标服务决定，并不统一限定为 OpenAI 格式。调用 MCP 通用服务且需要流式响应时，在 `SetAICallConfig.headers` 或单次调用的 `headers` 参数中设置 `"Dc-Stream": "true"`。

### 其他 AI 能力

- `GenerateAndPollAIResource`：提交图片、视频、文档等异步生成任务，自动轮询并提取资源。
- `PollAITaskResult` / `DownloadAIResourceContent`：手动控制任务轮询和结果下载。
- `GetUserAIProxyAuth` / `GetUserOwnAIProxyUsage`：查询授权和使用量。
- `CreateSimpleRealtimeVoiceSession`：使用主题四元组快速创建实时语音会话。
- `CreateAliyunTranscriptionSession`：实时转写/翻译和多模型协议适配。
- `CreateConversationalVoiceSession`：OpenAI Realtime 协议风格的实时语音对话。
- `CreateVoiceSession` / `CreateAudioSocket`：自定义运行时、WebSocket 和音频适配器。

完整实时语音示例见 [实时语音调用.md](实时语音调用.md)。

管理员可使用 `createProxyConfig`、`configAIProxy`、`configAuth` 管理服务和额度。不要把第三方 API Key 或模型服务密钥硬编码在公开前端源码中；应由受控管理员流程写入代理配置。

## RTC 音视频

RTC 的呼叫信令依赖全局 RTM。双方都应先登录钱包、调用 `rtm.login()`，再初始化 RTC。

```ts
const rtm = dc.rtm;
const rtc = dc.rtc;
if (!rtm || !rtc || !dc.userInfo || !dc.publicKey) {
  throw new Error("请先完成钱包登录并确认 RTM/RTC 模块可用");
}

const realtimeConfig = {
  appId: dc.appInfo.appId,
  themeAuthor: "realtime-config-author-public-key",
  configTheme: "realtime_services",
  serviceName: "aliyun-rtc",
};

await rtm.login({ ...realtimeConfig, serviceName: "aliyun-rtm" });
await rtc.init({
  ...realtimeConfig,
  channelId: "rtc-bootstrap",
  enableRTM: true,
  videoProfile: "HD",
});

rtc.on("onCallRequest", async ({ callerId, channelId, mediaType }) => {
  console.log("incoming call:", callerId, mediaType);
  // 用户点击接听后执行：
  await rtc.acceptCall(callerId, channelId);
  await rtc.joinRoom(channelId, {
    audioPublish: true,
    videoPublish: true,
    screenPublish: false,
  });
});

// 主叫方：发送邀请后需要自己进入房间等待。
const channelId = await rtc.callPeer("callee-public-key", "video");
await rtc.joinRoom(channelId, {
  audioPublish: true,
  videoPublish: true,
  screenPublish: false,
});

const localVideo = document.querySelector<HTMLElement>("#local-video");
if (localVideo) await rtc.setDisplayLocalVideo(localVideo);

await rtc.muteLocalMic(true);
await rtc.muteLocalCamera(false);

// 通话结束。
await rtc.endCall("callee-public-key", channelId);
await rtc.leaveChannel();
rtc.destroy();
```

关键约束：

- `callPeer` 只发送邀请并生成频道，不会自动 `init` 或 `joinRoom`。
- 被叫方监听 `onCallRequest`，接听后调用 `acceptCall` 和 `joinRoom`。
- `joinRoom` 的 `audioPublish`、`videoPublish` 和当前实现中的 `screenPublish` 默认均为 `true`。不需要屏幕共享时应显式传 `screenPublish: false`，避免预申请该权限；纯协作会话应将三项都设为 `false`。
- `onCallAccept`、`onCallReject`、`onCallEnd` 用于同步 UI 状态。
- 屏幕共享使用 `startScreenShare` / `stopScreenShare`。
- 摄像头切换使用 `getCameras` / `switchCamera`。
- 游戏或协作会话使用 `createPersistentSession` / `acceptPersistentSession`，再以关闭音视频发布的选项进入房间。
- `fetchAuthInfo` 可让应用自行提供 Token；未提供时可通过 AI 代理配置自动获取。

## 实时白板

直接加入白板房间需要白板 Token 配置，不要求先登录 RTM；只有使用呼叫或邀请信令时才依赖全局 RTM。

```ts
const whiteboard = dc.whiteboard;
if (!whiteboard) throw new Error("Whiteboard 模块不可用");
const userId = dc.publicKey?.string();
if (!dc.userInfo || !userId) throw new Error("请先完成钱包登录");

const roomId = "design-review-room";
await whiteboard.init({
  appId: dc.appInfo.appId,
  userId,
  channelId: roomId,
  themeAuthor: "realtime-config-author-public-key",
  configTheme: "realtime_services",
  serviceName: "aliyun-whiteboard",
});

await whiteboard.joinRoom(roomId);
const board = await whiteboard.getWhiteboard(roomId);
const container = document.querySelector<HTMLElement>("#whiteboard");
if (!container) throw new Error("缺少白板容器");

await board.open(container);
board.setToolType(2); // 也可使用底层白板 SDK 的 ShapeType
board.undo();
board.redo();

await whiteboard.leaveChannel();
await whiteboard.clear();
```

白板实例支持绘图工具、图片/PDF、文档与页面、快照、上传、视角同步和事件监听。邀请能力使用 `callPeer` / `acceptCall` 或 `createWhiteboardSession` / `acceptWhiteboardInvite`；调用这些方法前应先完成 `dc.rtm.login()`。

## 支付

支付模块的方法大多直接返回结果或抛异常。使用前配置部署环境提供的地址：

```ts
import { PaymentPackageTypeValue } from "web-dc-api";

const pay = dc.pay;
const payAccount = dc.accountInfo?.account ?? dc.publicKey?.string();
if (!pay || !dc.userInfo || !payAccount) {
  throw new Error("请先完成钱包登录并确认 Pay 模块可用");
}

pay.config({
  payPeerUrl: "/dns4/pay-peer.example.com/tcp/443/wss/p2p/PEER_ID",
  hostedPayBaseUrl: "https://pay.example.com/pay",
  payApiBaseUrl: "https://pay.example.com/api/v2/payments",
});

const packages = await pay.listRenewPackages(
  PaymentPackageTypeValue.STORAGE_PURCHASE,
  dc.appInfo.appId,
);

const selected = packages[0];
if (!selected?.amountCents) throw new Error("没有可购买套餐");

const returnUrl = pay.markCurrentUrlAsPayReturn("STORAGE_PURCHASE");
const checkoutUrl = pay.buildHostedCheckoutUrl({
  account: payAccount,
  packageCode: selected.packageCode,
  packageName: selected.displayName,
  amountCents: selected.amountCents,
  returnUrl,
});

window.location.assign(checkoutUrl);
```

支付能力包括：

- 套餐读取：买家使用 `listRenewPackages`；推荐人查看自己按等级可推广的套餐使用 `listPromotablePackages`；单套餐与续期信息使用 `getPackageInfo`、`getRenewalDays`。
- 原生扫码：`createPayOrder`、`getNativePrepayCodeUrl`、`queryPaymentResult`。
- 订单列表：`listPaymentOrders`。
- 托管收银台：`buildHostedCheckoutUrl` 和支付回跳/本地待支付状态辅助方法。
- 开发者套餐管理：`applyBusinessPackage`、`getAllPackagesConfig`、`deleteBusinessPackage`。
- 套餐类型：模型调用、应用发布、存储扩容、平台 SVIP、自由定价。

金额字段统一按“分”处理。套餐返回值会保留 `theme`、`themeAuthor`、`themeAppid` 以及 AI 套餐关联字段，业务侧应原样使用服务端返回的主题归属信息。`payPeerUrl` 必须是可被 libp2p 解析的 multiaddr，不是普通 HTTPS URL。

## 缓存与工具

```ts
const cache = dc.cache;
if (!cache || !dc.userInfo || !dc.publicKey) {
  throw new Error("请先完成钱包登录并确认 Cache 模块可用");
}

// setCacheKey 接收 value 并返回生成的 key；expire 单位为秒，默认一天。
const [cacheKey, setError] = await cache.setCacheKey(
  JSON.stringify({ preview: true }),
  3600,
);
if (setError || !cacheKey) throw setError ?? new Error("缓存失败");

const [cachedValue, getError] = await cache.getCacheValue(cacheKey);
if (getError) throw getError;
console.log(cachedValue);

const [host, hostError] = await dc.client?.getHostID() ?? [null, null];
if (hostError) throw hostError;
console.log(host?.peerID, host?.reqAddr);

const symmetricKey = dc.util?.createSymmetricKey();
console.log(symmetricKey?.toString());
```

`dc.util` 还提供 Thread key 创建、链上应用信息设置/查询和 IPFS 请求处理。

## 高级能力

根入口还导出以下高级能力：

- `registerServiceWorker`、`isServiceWorkerActive`、`updateServiceWorker`：配合包内 `sw.js` 让媒体 URL 支持 Range 请求和 seek；需要 HTTPS 或 localhost。
- `exposeDC`、`wrapWorker`：通过 Comlink 在 Web Worker 中运行或访问 `DC`。
- `ModuleSystem`、`CoreModuleName`、各核心 Module 类：自定义模块集成。
- `KeyManager`、`Ed25519PrivKey`、`Ed25519PubKey`：底层密钥能力。
- `createLogger`、`configureLogger`、`LogLevel`：日志配置。
- `Errors`：SDK 公开错误集合。

这些 API 面向基础设施或高级封装。普通业务优先使用 `dc.auth`、`dc.db`、`dc.keyValue` 等模块入口。

## 常见问题

### `dc.auth`、`dc.db` 等为什么是 `null`？

模块 getter 只有在实例注册且 `dc.init()` 成功后可用。先检查 `await dc.init()` 的布尔返回值，不要继续使用初始化失败的实例。

### 钱包窗口没有打开

确保 `accountLoginWithWallet()` 由点击事件直接触发，页面允许弹窗，并检查 `appInfo.appUrl`、钱包域名和 HTTPS 配置。

### 用户数据库升级没有生效

`initUserDB` 的第二个参数必须是数字，并在 Schema 变化时递增。不要传应用版本字符串。生产环境不要通过 `reset=true` 强制升级。

### KeyValue 能写但读取后 `JSON.parse` 失败

`get` 返回的字符串尾部带 `$$$dckv_extra$$$` 元数据。先按本文的 `parseKVValue` 拆分，或使用 `EntityRepository`。

### 找不到共享主题

确认 `appId`、创建者公钥和主题名完全一致。共享主题应通过 `toSharedTheme()` 统一名称；公共主题还必须以 `_pub` 结尾。

### 权限配置成功但仍然无法读写

先确认 `configAuth` 返回状态码为 `0`，再核对 `(appId, theme, themeAuthor)` 是否与创建主题时完全一致。不要混用 `OpenFlag` 和 `ThemePermission`：前者是评论主题开放模式，后者才是用户权限。KeyValue 的 `Auth` / `Public` 类型和评论主题的 `auth_` 命名前缀还会影响读取边界，具体规则见“主题权限设计技巧”和“鉴权评论主题”。

### 目录上传后找不到文件

使用 `getFolderFileList` 返回的 `Path`，不要自行拼接上传时的根文件夹名；首次读取根 CID 使用 `cidNeedConnect.NEED`，并传回上传时相同的解密密钥。通过 Service Worker URL 访问含中文、空格或 `#` 的路径时，需要对每个路径段分别执行 `encodeURIComponent`。

### 评论列表为空

检查主题作者公钥是否为真正创建者，并确认主题/单条评论的开放标志与当前用户权限匹配。分页方向 `1` 表示从新到旧。

### RTM 能发消息但收不到

发送使用短连接不代表接收长连接已经建立。接收方必须成功执行 `rtm.login()` 并保持页面连接，同时注册 `onMessageReceived`。

### RTC 邀请发出后没有画面

`callPeer` 不会自动入房。主叫需要 `joinRoom(channelId)`；被叫需要在接听后 `acceptCall` 再 `joinRoom`，并为本地/远端视频设置 DOM 容器。

### 页面退出后仍有连接或设备占用

先执行模块级清理，例如 `rtm.logout()`、`rtc.leaveChannel()`、`rtc.destroy()`、`whiteboard.leaveChannel()`，应用彻底退出时再执行 `dc.shutdown()`。

### 可以用 `clearBrowserCache()` 修复数据问题吗？

该方法会关闭底层资源，清除 LocalStorage、SessionStorage、CacheStorage，并在浏览器支持数据库枚举时删除 IndexedDB；它还会尝试清除页面脚本可访问的 Cookie、注销当前源的全部 Service Worker，随后刷新页面。该操作不能清除 `HttpOnly` 等不可由 JavaScript 访问的 Cookie，且属于破坏性调试操作。不要作为普通登出逻辑，也不要在未向用户说明的情况下调用。

## 从旧版 README 迁移

| 旧写法/说明 | `0.2.72` 正确行为 |
| --- | --- |
| `appInfo.appDesc` | 当前 `APPInfo` 没有该字段；使用 `appName`、`appIcon`、`appUrl` 等 |
| `initUserDB(collections, "1.0.0", false)` | 第二个参数为数字 schema 版本，例如 `1` |
| 钱包登录返回 `AccountInfo` 且含 `appAccount` | `accountLoginWithWallet()` 返回 `Account`；公钥使用 `dc.publicKey` |
| `const [stream, err] = createFileStream(...)` | 返回 `ReadableStream | null`，不是元组 |
| `getFolderFileList(cid, false, true)` | 第二个参数不是布尔值；使用 `cidNeedConnect.NEED` 或 `cidNeedConnect.NOT_NEED` |
| `getWithIndex(..., null, options)` | 类型签名要求字符串；空字符串表示不限定索引值 |
| 直接 `JSON.parse(await keyValue.get(...))` | 先拆分 `$$$dckv_extra$$$` 元数据 |
| `SetAICallConfig({ configTheme, serviceName })` | 字段名为 `theme` 和 `service` |
| AI 流状态 `3=完成` | 使用 `AIStreamResponseFlag`；`CONNECTION_CLOSED=4` |
| `rtm.createPeerChannel` / `subscribeChannel` | RTM 无这些方法；实时点对点用 `sendMessageToPeer`，会话/频道用 RTC 或白板 |
| 创建公共 KV 必须是固定应用作者 | 主题作者是实际创建该主题的当前登录用户；读取时必须使用该公钥 |

## API 索引

README 负责接入路径和常用模式，完整签名以 TypeScript 声明为准：

- 主类与生命周期：[lib/dc.ts](lib/dc.ts)
- 公开入口：[lib/index.ts](lib/index.ts)
- 认证：[lib/interfaces/auth-interface.ts](lib/interfaces/auth-interface.ts)
- 文件：[lib/interfaces/file-interface.ts](lib/interfaces/file-interface.ts)
- Service Worker 脚本：[assets/sw.js](assets/sw.js)
- ThreadDB：[lib/interfaces/database-interface.ts](lib/interfaces/database-interface.ts)
- KeyValue：[lib/interfaces/keyvalue-interface.ts](lib/interfaces/keyvalue-interface.ts)
- 评论：[lib/interfaces/comment-interface.ts](lib/interfaces/comment-interface.ts)
- 消息：[lib/interfaces/message-interface.ts](lib/interfaces/message-interface.ts)
- AI 代理：[lib/interfaces/aiproxy-interface.ts](lib/interfaces/aiproxy-interface.ts)
- RTM：[lib/interfaces/rtm-interface.ts](lib/interfaces/rtm-interface.ts)
- RTC：[lib/interfaces/rtc-interface.ts](lib/interfaces/rtc-interface.ts)
- 白板：[lib/interfaces/whiteboard-interface.ts](lib/interfaces/whiteboard-interface.ts)
- 支付：[lib/interfaces/pay-interface.ts](lib/interfaces/pay-interface.ts)
- 缓存与工具：[lib/interfaces/cache-interface.ts](lib/interfaces/cache-interface.ts)、[lib/interfaces/util-interface.ts](lib/interfaces/util-interface.ts)

## 本仓库开发

`dcnode/net/pb/dcnet.proto` 是 DCNode RPC 协议的唯一来源。协议发生变化时，
在 `dcnode` 与 `dcapi` 同级目录下执行 `npm run gen:dcnet-proto`，不要直接修改
`dcapi/lib/proto/dcnet.proto` 或其生成文件。

```bash
npm install
npm run gen:dcnet-proto
npm run check:proto-sync
npm run build
bash scripts/check-browser-compat.sh
```

`npm run build` 还会把 `assets/sw.js` 复制到 `dist/sw.js`；发布前应确认二者内容一致，确保 npm/CDN 使用者能取得 Service Worker。`npm test` 当前没有自动化测试实现，会按 `package.json` 中的占位脚本退出失败；验证 SDK 请至少执行类型构建、协议同步检查和浏览器兼容检查。

GitHub 发布工作流会通过只读 Secret `DCNODE_REPOSITORY_URL` 检出 dcnode 并执行
协议同步检查。该 Secret 应配置为可读取 dcnode Codeup 仓库的克隆地址；缺失或协议
不一致都会阻止 npm 发布。

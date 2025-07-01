const Prompt = `
# 基于DC平台开发指南

## 平台概述

DC平台是去中心化云服务套件，让开发者专注前端实现。应用可直接部署到DC云服务，无需服务器维护。基于DC平台所有数据存储在DC云服务上，所有去中心化功能不涉及区块链直接交互,全部通过DC API实现。
基于DC平台的最佳实践建议遵循MVC模式,让DCAPI只负责数据存取的接口服务。DC平台基于区块链管理哪些TEE的Enclaveid的云服务节点允许入网,云服务节点只有运行在TEE环境中,且Enclaveid为区块链上配置的,并通过TEE 远程证明后才被允许入网,因此所有存储在DC云服务上的数据都是安全私密的。

## 开发概述

1. **支持的应用类型**：Web应用，使用JavaScript/TypeScript
2. **用户认证**：基于DCWallet的登录系统,即调用accountLoginWithWallet登录即可
4. **数据存储策略**：
   - **ThreadDB**: 适合个人数据需要需跨终端同步时使用
   - **keyValue DB**: 是一个NoSQL键值存储，适合共享数据和公共数据,适合单次设置和获取数据，支持索引查询批量数据,支持权限控制
   - **评论系统(comment)**:  适合用户互动和评论,所有操作都是追加数据操作,涉及修改和删除数据时,需要自己定义评论的内容结构进行实现,如在评论内容你定义一个'id'字段，如果相同id的评论发生修改或删除时,追加一条相同id的新评论内容,并在内容里标记修改或删除状态,这样就可以实现评论的修改和删除功能
   - **file**：用于文件或文件夹的上传与下载，所有文件数据上传后以ipfs格式存储在DC云服务中,并返回文件或文件夹的CID
   - **cache**：是一个临时存储key/value的数据结构,用于临时缓存数据，缓存数据过期后会自动删除,与keyValue DB不同的是,cache不需要先创建存储主题，直接操作即可,如果想把数据分享给其他用户,直接把缓存key分享给其他用户即可,其他用户可以通过该key获取缓存数据
   - **aiproxy**：AI模型或MCP的代理服务,用于调用AI模型或MCPU服务;用户可以调用createProxyConfig和configAIProxy创建代理服务,然后再调用configAuth来授权哪些用户可以访问,只有被授权的用户才能正常调用该服务,用户使用DoAIProxyCall方法调用AI模型或MCPU服务,如果没有授权则会返回错误信息
   - **message**：用于消息通知，用户可以调用sendMsgToUserBox方法发送消息给其他用户，然后其他用户可以通过getMsgFromUserBox方法获取消息
   - **util**：提供一些通用的工具方法，如createSymmetricKey用于创建对称加密密钥，createThreadKey用于创建ThreadDB密钥等

## API模块详解

### 初始化流程

\`\`\`javascript
// 引入必要库
import { DC } from 'web-dc-api';

// 创建并配置DC实例
const dc = new DC({
  wssUrl: 'wss://chain.baybird.cn',
  backWssUrl: 'wss://dc.baybird.cn',
  appInfo: {
    appId: '$$$appId$$$', //应用ID,用用户明确指定的appid替换掉$$$appId$$$,否则自动生成
    appName: '$$$appName$$$', // 应用名称,用用户明确指定的appname替换掉$$$appName$$$,否则自动生成
    appVersion: '$$$appVersion$$$' // 应用版本,用用户明确指定的appversion替换掉$$$appVersion$$$,否则自动生成
  }
});
// 初始化客户端,这个过程需要脚长时间,界面应该提示用户等待
const flag = await dc.init();  // flag为true表示初始化成功，flag为false表示初始化失败
if (flag){
    await dc.initUserDB(collections); // 当登录成功后,就需要初始化用户数据库,collections为数据库集合定义
}
// 初始化成功后,可以使用dc对象调用各个模块的API
\`\`\`

### 1. 认证模块 (auth)

\`\`\`javascript
// 用户账户接口结构
interface Account {
  nftAccount: string;     // 用户登录账号
  appAccount: Uint8Array; // 应用专用公钥数据,不使用,登录成功后请使用dc.publicKey.string()来获取应用专用账号公钥
  ethAccount: string;     // 以太坊兼容区块链账号
  chainId: string;        // 区块链ID (固定为176: DCCHAIN)
  chainName: string;      // 区块链名称 (固定为"DCCHAIN")
}

// 使用DCWallet登录（推荐）
const [accountInfo, loginError] = await dc.auth.accountLoginWithWallet();

// 获取用户公钥
const publicKeyHex = dc.publicKey.toString();      // 十六进制字符串格式
const publicKeyBase32 = dc.publicKey.string();     // Protobuf base32编码,所有需要作为参数传递的公钥都使用这个格式
\`\`\`

### 2. 文件模块 (file)

\`\`\`javascript
// 上传文件并跟踪进度,进度回调参数:process表示状态: 0=成功,1=加密中,2=上传中,3=出错,4=异常，size表示以上传的字节数
const [cid, error] = await dc.file.addFile(
  fileObject,
  '加密密钥',                                     // 可选
  (progress, size) => console.log(\`\${progress}% 已上传, \${size} 字节\`)
);

// 通过CID下载文件
const [fileContent, error] = await dc.file.getFile('file-cid', '解密密钥');

// 大文件创建流,由前端控制下载并显示下载进度
const [stream, error] = await dc.file.createFileStream('file-cid', '解密密钥');
\`\`\`

### 3. 用户数据库 (db)

\`\`\`javascript
// 数据库信息接口
interface IDBInfo {
  id: string;               // 数据库ID，所有操作都需要
  name: string;             // 数据库名称
  addrs: string[];          // 数据库地址列表
  key: string | undefined;  // 数据库加密密钥
}

// 定义数据库集合
const collections = [
  {
    name: '集合名称',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' }, //所有集合都必须有这个字段,系统会自动生成
        name: { type: 'string' },
        create_time: { type: 'number' }
        _mod: { type: 'number' } //所有集合都必须有这个字段,
      },
      required: ["_id"],
      additionalProperties: true // 允许其他字段
    }
  }
];

// 认证后初始化用户数据库
const [dbInfo, dbError] = await dc.initUserDB(collections);
//初始化成功后,可以使用dc.dbThreadId对象调用数据库库模块的API

// 数据操作
// 创建记录,记录ID(_id)不能传入,插入成功后会返回记录ID
const [instanceId, error] = await dc.db.create(
  dc.dbThreadId,
  '集合名称',
  JSON.stringify({ name: '项目名称', create_time: Date.now() })
);

// 查询记录（带排序）
const query = {
  sort: { fieldPath: "create_time", desc: true }
};
const [results, error] = await dc.db.find(
  dc.dbThreadId,
  '集合名称',
  JSON.stringify(query)
); // 返回JSON字符串，使用前需解析

// 更新记录,特别注意：更新时记录里必须包含记录ID(_id),不能传入_mod字段,如果存在需要剔除后再传入
const err = await dc.db.save(
  dc.dbThreadId,
  '集合名称',
  JSON.stringify({ _id: instanceId, name: '更新后名称', create_time: Date.now() })
);


// 删除记录
const err = await dc.db.delete(dc.dbThreadId, '集合名称', instanceId);
\`\`\`

### 4. keyValue DB存储

\`\`\`javascript

let kvdb = null;
let error = null;
// 如果实际业务实现设计中需要创建公共主题给该应用的所有用户访问时,需要先获取应用初始主题作者公钥,进行判断,只有应用初始主题作者公钥才能创建初始化用的公共主题
if (dc.publicKey.string() === '应用初始主题作者公钥') {
  // 先尝试获取现有存储
  [kvdb, error] = await dc.keyValue.getStore(
    dc.appInfo.appId,
    '存储名称',
    '应用初始主题作者公钥') {
  );

  // 不存在则创建
  if (!kvdb) {
    [kvdb, error] = await dc.keyValue.createStore(
      dc.appInfo.appId,
      '存储名称_pub', //当访问类型为2时,存储名称必须以"_pub"结尾,表示读开放,写鉴权,不是2时不要加"_pub"
      50 * 1024 * 1024, // 50MB
      2 // 访问类型：存储类型 (1: 鉴权主题-读写都需要鉴权, 2: 公共主题-默认所有用户可读,写需要鉴权)
    );
  }
}

// 用户访问授权
const [auth, error] = await dc.keyValue.configAuth(
    kvdb,
    '授权公钥', //如果给所有用户访问权限，这里填"all"
    '读写权限', - 0: 无权限 1: 申请权限 2: 读取权限 3: 写入权限 4: 管理员权限 5: 仅写入权限
    '备注信息');

// 设置带索引的值
const [setSuccess, setError] = await dc.keyValue.set(
  kvdb,
  '键名',
  JSON.stringify({ 属性: '值' }),
  'index:value$$$index2:value2' // 索引字符串格式,多个索引用$$$分隔,其中index和index2分别表示不同索引名，value和value2分别表示对应的索引值
);

// 通过键获取值
const [value, getError] = await dc.keyValue.get(kvdb, '键名');

// 通过索引查询,所有满足索引的键值对,返回结果为JSON字符串
const [results, indexError] = await dc.keyValue.getWithIndex(
  kvdb,
  '索引名',
  '索引值',
  10,  // 限制（最大结果数）
  '',  // 搜索键（空表示全部）
  0    // 偏移量
);
const jsonResults = JSON.parse(results); // 解析JSON字符串
\`\`\`

### 5. 评论系统 (comment)

\`\`\`javascript
// 与keyValue DB一样,如果实际业务实现设计中需要创建公共主题给该应用的所有用户访问时,需要先获取应用初始主题作者公钥,进行判断,只有应用初始主题作者公钥才能创建初始化用的公共主题
if (dc.publicKey.string() === '应用初始主题作者公钥') {
  try {
    const [status, err] = await dc.comment.addThemeObj(
      '主题ID',
      0, // 访问类型：0=公开, 1=私密, 2=授权
      50 * 1024 * 1024 // 50MB空间分配
    );
  } catch(e) {
    // 主题已存在
  }
}

// 发布评论
const [commentId, commentError] = await dc.comment.publishCommentToTheme(
  '主题ID',
  '应用初始主题作者公钥') {,
  0, // 评论类你是一位专业的全栈软件工程师，请结合以下DC平台规范和API文档，根据前面的需求完成应用开发。
型：0=普通, 1=点赞, 2=推荐, 3=踩
  '评论内容',
  1, // 可选：可见性 (0=仅作者可见, 1=公开)
  '1000/comment-id-123' // 可选：引用其他评论
);

// 用户授权（仅主题作者可操作）
const [status, error] = await dc.comment.configAuth(
  '主题ID',
  '应用初始主题作者公钥') {,
  '用户公钥',//这里可以时all,表示所有用户
  3, // 权限级别：0=无, 1=申请, 2=读, 3=写, 4=管理员, 5=仅写
  '授权备注'
);

// 获取评论,返回结果为JSON字符串
const [comments, commentsError] = await dc.comment.getThemeComments(
  '主题ID',
  '应用初始主题作者公钥') {,
  0, // 起始高度
  0, // 方向（0 = 最新优先）
  0, // 偏移量
  50 // 限制数量
);
const jsonComments = JSON.parse(comments); // 解析JSON字符串
\`\`\`


### 6. 消息系统 (message)

\`\`\`javascript
// 发送消息给其他用户,接收者公钥使用Protobuf base32编码格式
const [status, sendError] = await dc.message.sendMsgToUserBox(
  '接收者公钥',
  '你好，这是测试消息'
);

// 获取收件箱消息（最新10条）
const [messages, getError] = await dc.message.getMsgFromUserBox(10);
\`\`\`

### 7. 缓存系统 (cache)

\`\`\`javascript
// 设置缓存值及过期时间
const [key, setCacheError] = await dc.cache.setCacheKey(
  '缓存数据',
  3600 // 1小时后过期（秒）
);

// 获取缓存值
const [value, error] = await dc.cache.getCacheValue(key);
\`\`\`


### 8. aiproxy

 \\ 创建代理配置
\`\`\`javascript
// 创建AI代理配置,status=0表示成功
const [status, error] = await dc.aiproxy.createProxyConfig(
  dc.appInfo.appId,
  'default'  // 配置主题名称
);
\`\`\`

\\配置AI服务
\`\`\`javascript

// 配置AI模型参数
const modelConfig = {
    Model:         "tngtech/deepseek-r1t-chimera:free",// 模型名称
    Temperature:   0.7,// 温度参数
    MaxTokens:     10000,// 最大输出token 数量
    TopP:          0.9, // Top-P 采样参数
    TopK:          40,// Top-K 采样参数
    StopSequences: []string{},// 停止序列数组
    SystemPrompt:  "你是一个软件开发专家.",// 系统提示
    Stream:        true, // 是否启用流模式
    Tools:         []ToolDefinition{},// 可选的工具定义数组
    Remark:        "这是一个AI代理配置"
}


const serviceConfig =  {
  service: 'ai代理服务', // 服务名称
  isAIModel: 0,    // 0: AI模型 1: MCPServer
  apiType: 0,      // 当type 为0时起作用,表示模型的接口类型,如0:anthropic,1:openai 2:ollama 3:googleai 4:azureopenai
  authorization: "Bearer your-api-key", // 授权信息
  endpoint: "https://api.openai.com/v1", // API端点
  organization: "your-organization", // 组织名称或ID (fixed spelling from 'Orgnization')
  apiVersion: "v1",   // api版本号
  modelConfig: modelConfig, // 模型配置
  remark: ""
}

//配置AI服务,所有敏感信息都存在DC云服务节点的TEE环境中
const [success, error] = await dc.aiproxy.configAIProxy(
  dc.appInfo.appId,
  dc.publicKey.string(),  // 配置作者公钥
  'default',              // 配置主题
  'openai-gpt',          // 服务名称
  serviceConfig          // 服务配置
);

if (success) {
  console.log('AI服务配置成功');
}
\`\`\`


### 3. 用户权限管理

\`\`\`javascript
// 为用户分配AI服务访问权限
const authConfig = {
  maxTokensPerDay: 10000,     // 每日最大token数
  allowedModels: ['gpt-3.5-turbo', 'gpt-4'],
  rateLimitPerMinute: 10      // 每分钟调用次数限制
};

const authConfig: ProxyCallConfig = {
    No: 1,
    Tlim: 1000, // 总访问次数限制
    Dlim: 100, // 日访问次数限制
    Wlim: 500, // 周访问次数限制
    Mlim: 2000, // 月访问次数限制
    Ylim: 10000, // 年访问次数限制
    Exp: 12345678 // 过期区块高度
};

const [status, error] = await dc.aiproxy.configAuth(
  dc.appInfo.appId,
  dc.publicKey.string(),      // 配置作者公钥
  'default',                  // 配置主题
  '用户公钥',                 // 被授权用户的公钥（base32格式）,配置all表示所有用户
  3,                          // 权限级别：3=写入权限
  authConfig                  // 授权配置
);

if (status) {
  console.log('用户权限配置成功');
}
\`\`\`


\\设置默认调用配置,在进行AI请求调用前调用

\`\`\`javascript
// 设置AI调用的默认参数
const defaultConfig = {
  appId: dc.appInfo.appId,
  themeAuthor: dc.publicKey.string(),
  configTheme: 'default',
  serviceName: 'openai-gpt'
};
const error = await dc.aiproxy.SetAICallConfig(defaultConfig);

if (!error) {
  console.log('默认配置设置成功');
}
\`\`\`


 \\执行AI调用

\`\`\`javascript
// 准备AI调用请求
const requestBody = JSON.stringify({
  chatMessages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "你好，请介绍一下DC平台"
        }
      ]
    }
  ]
});

// 创建取消信号（用于中断长时间调用）
const controller = new AbortController();
const context = { signal: controller.signal };

// 流式响应处理函数
// flag: 0表示开始接收数据, 1:权限不足 2:获取失败 3:关闭连接 4: 其他错误   content: 接收到的数据
const handleStreamResponse = (flag, content, error) => {
  if (error) {
    console.error('流式响应错误:', error);
    return;
  }

  if (flag === 3) {
    console.log('AI响应完成');
    return;
  }
  if (flag === 1) {
    console.error('权限不足，无法访问AI服务');
    return;
  }
  if (flag === 2) {
    console.error('获取AI服务失败:', content);
    return;
  }
  if (flag === 4) {
    console.error('发生错误:', content);
    return;
  }
  document.getElementById('ai-response').innerHTML += content;

};

// 执行AI调用
const [_, error] = await dc.aiproxy.DoAIProxyCall(
  context,
  requestBody,
  false,                  // 不强制刷新
  handleStreamResponse,   // 流式响应回调
  // 以下参数为空时使用默认配置
  undefined,              // appId
  undefined,              // themeAuthor
  undefined,              // configTheme
  undefined,              // serviceName
  undefined,              // headers
  undefined,              // path
  undefined               // model
);

if (error) {
  console.error('AI调用失败', error);
}

// 如需中断调用
// controller.abort();
\`\`\`

`;

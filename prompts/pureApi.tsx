export const pureApi = `

# DC平台应用开发指南（API调用指南）

## API模块详解
### 1. 认证模块 (auth)

\`\`\`javascript

// 当应用需要用户登录时，直接调用accountLoginWithWallet完成登录
const [accountInfo, loginError] = await dc.auth.accountLoginWithWallet();
// 登录成功后,可以通过 accountInfo.nftAccount 获取当前登录的账号名

// 登录成功后通过下列方式获取用户公钥
const publicKeyStr = dc.publicKey.string();     
// 登录成功后，调用 dc.initUserDB(collections) 初始化用户数据库,详细请参考用户数据库 (db)模块的使用

\`\`\`

### 2. 文件模块 (file)

文件和文件夹上传下载功能,上传文件时可以指定加密密钥

\`\`\`javascript
// 上传文件并跟踪进度,进度回调参数:status表示状态: 0=成功,1=加密中,2=上传中,3=出错,4=异常，size表示以上传的字节数
const [cid, error] = await dc.file.addFile(
  file, //File对象或Blob对象
  '加密密钥',                                     // 不加密时直接传空字符串
  (status, size) => console.log(\`上传状态:\${status} 已上传, \${size} 字节\`)
);

// 通过CID等待下载完整文件再返回
const [fileContent, error] = await dc.file.getFile('file-cid', '解密密钥');

// 通过流式下载文件,可以显示下载进度
const [stream, error] = await dc.file.createFileStream('file-cid', '解密密钥');

// 上传文件夹,进度回调参数:status表示状态: 0=成功,1=加密中,2=上传中,3=出错,4=异常，total表示总文件数，process表示已上传的文件数
const folderInput = document.getElementById('folderInput') as HTMLInputElement;
const files = folderInput.files;
const res = await dc.file.addFolder(
    files, // 文件列表
    "加密密钥",  // 传入对32字节长度密钥进行base32加密后的字符串,不加密时直接传空字符串
    (status: number, total: number, process: number) => console.log(\`上传状态: \${status}, 总文件数: \${total}, 进度: \${process} 已上传,\`)
);
folderCID = res[0];

// 获取文件夹文件列表,返回的fileList格式为JSON对象:Array<{Name: string; Type: number; Size: number; Hash: string; Path: string}> type=0文件 type=1文件夹,每个文件内容可以将Hash字段的值作为cid通过 dc.file.getFile 获取,
const [fileList, error] = await dc.file.getFolderFileList(
    'folder-cid', // 文件夹CID
     false, // 是否重新寻址
     true // 是否递归获取所有子文件夹的文件列表
      );

\`\`\`

### 3. 用户数据库 (db)

主要用于用户自身数据的存储和操作,需要在认证后进行初始化,帮助用户跨设备同步和管理数据

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
        age: { type: 'number' }, 
        create_time: { type: 'number' }
        _mod: { type: 'number' } //所有集合都必须有这个字段,
      },
      required: ["_id"],
      additionalProperties: true // 允许其他字段
    }
  }
];

// 用户登录成功后,必须调用以下方法初始化用户数据库
const [dbInfo, dbError] = await dc.initUserDB(collections);
if (dbError) {
  console.error('用户数据库初始化失败:', dbError);
} else {//初始化成功后,可以使用"dc.dbThreadId" 作为用户数据库的ID,来调用数据库模块的各个API
  console.log('用户数据库初始化成功,数据库ID: ', dc.dbThreadId);
}

// 数据操作
// 创建记录,instanceId为返回的记录ID
const [instanceId, error] = await dc.db.create(
  dc.dbThreadId, // 数据库ID
  '集合名称',
  JSON.stringify({ name: '名称',age: 20, create_time: Date.now() }) //记录ID(_id)不能传入,插入成功后会返回记录ID
);

// 查询记录（带排序）
const query = {
  sort: { fieldPath: "create_time", desc: true }
};
// results为返回JSON字符串，使用前调用JSON.parse(results)解析
const [results, error] = await dc.db.find(
  dc.dbThreadId,
  '集合名称',
  JSON.stringify(query)
); // 
const jsonResults = JSON.parse(results); // 解析JSON字符串

//更多查询示例
// 示例1: 简单查询 - 查找年龄为28的用户
const query1 = {
  condition: "age = 28"
};
const results1 = await dc.db.find(
  'bafk3epa4rnnhworywhk6hsi7wafwgdt3fkgvpf62wqlriwpwqjwjuqbf4',
  'users',
  JSON.stringify(query1)
);
console.log('28岁的用户:', JSON.parse(results1));

// 示例2: 组合条件查询 - 查找年龄大于25且名字为John的用户
const query2 = {
  condition: "age > 25 and name = 'John Doe'"
};
const results2 = await dc.db.find(
  'bafk3epa4rnnhworywhk6hsi7wafwgdt3fkgvpf62wqlriwpwqjwjuqbf4',
  'users',
  JSON.stringify(query2)
);
console.log('年龄大于25的John:', JSON.parse(results2));

// 示例3: 使用OR条件查询 - 查找年龄为21或名字为Jane的用户
const query3 = {
  ors: [
    { condition: "age = 21" },
    { condition: "name = 'Jane Smith'" }
  ]
};
const results3 = await dc.db.find(
  'bafk3epa4rnnhworywhk6hsi7wafwgdt3fkgvpf62wqlriwpwqjwjuqbf4',
  'users',
  JSON.stringify(query3)
);
console.log('21岁或名为Jane的用户:', JSON.parse(results3));

// 示例4: 带排序和分页的复杂查询
const query4 = {
  condition: "age > 20",
  ors: [
    { condition: "name = 'John Doe'" }
  ],
  sort: {
    fieldPath: "age",
    desc: true  // 从大到小排序
  },
  seek: "01fyc691gh671nf0s8qpt0ych8"  // 分页标记
};
const results4 = await dc.db.find(
  'bafk3epa4rnnhworywhk6hsi7wafwgdt3fkgvpf62wqlriwpwqjwjuqbf4',
  'users',
  JSON.stringify(query4)
);
console.log('复杂查询结果:', JSON.parse(results4));


// 更新记录
const err = await dc.db.save(
  dc.dbThreadId,
  '集合名称',
  JSON.stringify({ _id: instanceId, name: '更新后名称', create_time: Date.now() }) //记录ID(_id)必须传入
);

// 删除记录
const err = await dc.db.delete(dc.dbThreadId, '集合名称', instanceId);
\`\`\`

### 4. keyValue DB存储

是一个key-value数据库，可以根据业务需要自定义value的结构，来达到类似nosql数据库的效果，可以通过配置授权，控制不同用户的访问权限;
与db数据库只针对个人数据的管理,"keyValue DB存储"适合需要对用户数据进行统一管理或者将数据发布给所有用户的场景;
需要特别注意的是,如果实际业务实现设计中需要创建公共主题给该应用的所有用户访问时,需要先获取应用初始主题作者公钥,进行判断,只有应用初始主题作者公钥才能创建初始化用的公共主题。

\`\`\`javascript
import { AppConfig } from '/dcapi';
let kvdb = null;
let error = null;

[kvdb, error] = await dc.keyValue.getStore(
    dc.appInfo.appId, // 应用ID
    '公共主题名称', // 
    AppConfig.appThemeAuthor); //,如果是公共主题的keyvalue数据库，需要传入应用初始主题作者公钥
if (!kvdb) {// 不存在则尝试创建
    if (dc.publicKey.string() === AppConfig.appThemeAuthor) { //确保只有应用初始主题作者公钥才能创建初始化用的公共主题
        [kvdb, error] = await dc.keyValue.createStore(
        dc.appInfo.appId,
        '公共主题名称_pub', //当访问类型为2时,存储名称必须以"_pub"结尾,表示读开放,写鉴权; 不是2时不要加"_pub"
        50 * 1024 * 1024, // 50MB
        2 // 访问类型：存储类型 (1: 鉴权主题-读写都需要鉴权, 2: 公共主题-默认所有用户可读,写需要鉴权)
        );
    } else {
        console.error('公共存储主题不存在,请联系管理员进行创建!');
        return;
    }
}


// 给指定用户配置访问授权
const [auth, error] = await dc.keyValue.configAuth(
    kvdb,
    '授权公钥', //如果给所有用户访问权限，这里填"all"
    '读写权限', - 0: 无权限 1: 申请权限 2: 读取权限 3: 写入权限 4: 管理员权限 5: 仅写入权限
    '备注信息');

// 设置带索引的值
const [setSuccess, setError] = await dc.keyValue.set(
  kvdb,
  '键名',
  '值',// 值应该是JSON字符串,根据业务需要进行自定义处理
  'index:value$$$index2:value2' // 索引字符串格式,多个索引用$$$分隔,其中index和index2分别表示不同索引名，value和value2分别表示新设置的keyvalue记录对应的索引值
);

// 通过键来获取值
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

评论系统用于用户之间的互动和讨论,支持主题创建、评论发布、授权管理等功能。
与"keyValue DB存储"可以对某一个key进行设置来达到数据共享目相比,"评论系统 (comment)"的所有评论都是按顺序保存的，可以根据时间线获取数据， 更适合微博、论坛等社交应用场景;
"评论系统 (comment)"也可以通过配置授权，控制不同用户的访问权限;
应用可以根据业务需要,对"评论系统 (comment)"中发布的评论的内容进行自定义处理,如可以在评论内容中定义一个ID来唯一标识评论,后续每次针对这个ID的评论内容调整,都可以理解为这个评论的状态更新;


\`\`\`javascript
import { AppConfig } from '/dcapi';
// 与keyValue DB一样,如果实际业务实现设计中需要创建公共主题给该应用的所有用户访问时,需要先获取应用初始主题作者公钥,进行判断,只有应用初始主题作者公钥才能创建初始化用的公共主题
if (dc.publicKey.string() === AppConfig.appThemeAuthor) {
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
  AppConfig.appThemeAuthor) {,
  0, // 评论类你是一位专业的全栈软件工程师，请结合以下DC平台规范和API文档，根据前面的需求完成应用开发。
型：0=普通, 1=点赞, 2=推荐, 3=踩
  '评论内容',
  1, // 可选：可见性 (0=仅作者可见, 1=公开)
  '1000/comment-id-123' // 可选：引用其他评论
);

// 用户授权（仅主题作者可操作）
const [status, error] = await dc.comment.configAuth(
  '主题ID',
  AppConfig.appThemeAuthor) {,
  '用户公钥',//这里可以时all,表示所有用户
  3, // 权限级别：0=无, 1=申请, 2=读, 3=写, 4=管理员, 5=仅写
  '授权备注'
);

// 获取评论,返回结果为JSON字符串
const [comments, commentsError] = await dc.comment.getThemeComments(
  '主题ID',
  AppConfig.appThemeAuthor) {,
  0, // 起始高度
  0, // 方向（0 = 最新优先）
  0, // 偏移量
  50 // 限制数量
);
const jsonComments = JSON.parse(comments); // 解析JSON字符串
\`\`\`


### 6. 消息系统 (message)

\`\`\`javascript
// 发送消息给其他用户,接收者公钥使用dc.publicKey.string()返回的值
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
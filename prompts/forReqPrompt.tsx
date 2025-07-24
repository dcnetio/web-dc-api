export const forReqDesc = `你是一位专业的软件需求分析工程师，请结合用户输入的需求，进行扩展,编写一份需求分析报告。编写过程需要遵循以下规则:
1、需求文档里面必须包含总体概述、功能需求描述、功能逻辑流程图、数据模型等内容;
2、需求文档里面不要包含测试用例和开发计划相关内容;
3、用户的需求最终交付为Web应用,由前端代码实现交互;由去中心化云服务平台DC实现数据存储和用户间的通信;
4、输出结果以 "[需求分析完成]" 结尾;
     
`


export const pureApi = `

# DC平台应用开发指南（API调用指南）

## API模块详解
### 1. 认证模块 (auth)- 用户登录验证

\`\`\`javascript

// 用户登录
const [accountInfo, loginError] = await dc.auth.accountLoginWithWallet();
const publicKeyStr = dc.publicKey.string(); // 获取用户公钥

\`\`\`

### 2. 文件模块 (file)

文件和文件夹上传下载功能,上传文件时可以指定加密密钥

\`\`\`javascript
// 上传文件并跟踪进度,进度回调参数:status表示状态: 0=成功,1=加密中,2=上传中,3=出错,4=异常，size表示已上传的字节数
const [cid, error] = await dc.file.addFile(
  file, //File对象
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

用户数据库专门用于存储个人数据，支持跨设备同步。每个用户只能访问自己的数据，适合存储用户设置、个人记录等私密信息。

\`\`\`javascript


// =====第一步：定义数据结构=====
// 定义数据集合（类似表结构）
const collections = [
  {
    name: 'user_notes',           // 集合名称（如用户笔记）
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string' },           // 必需字段，系统自动生成
        title: { type: 'string' },         // 笔记标题
        content: { type: 'string' },       // 笔记内容
        create_time: { type: 'number' },   // 创建时间
        _mod: { type: 'number' }           // 必需字段，修改时间
      },
      required: ["_id"],
      additionalProperties: true
    }
  }
];


// =====第二步：初始化数据库=====
// 初始化用户数据库

// 用户登录成功后,必须进行初始化个人数据库
const [dbInfo, dbError] = await dc.initUserDB(collections);

if (dbError) {
  console.error('初始化失败:', dbError);
  return;
}
console.log('初始化成功，ID:', dc.dbThreadId);


// =====第三步：操作数据库=====
// 创建记录
const noteData = {
  title: '第一条笔记',
  content: '笔记内容',
  create_time: Date.now()
};

const [recordId, createError] = await dc.db.create(
  dc.dbThreadId,
  'user_notes',
  JSON.stringify(noteData)    // 不需要传入_id，系统自动生成
);
console.log('记录创建成功，ID:', recordId);

// 查询记录
const [results, findError] = await dc.db.find(
  dc.dbThreadId,
  'user_notes',
  JSON.stringify({
    sort: { fieldPath: "create_time", desc: true }  // 按创建时间倒序
  })
);

if (results) {
  const noteList = JSON.parse(results);
  console.log('笔记列表:', noteList);
}

// 更新记录
const updateData = {
  _id: recordId,              // 必须包含记录ID
  title: '更新后的标题',
  content: '更新后的内容',
  create_time: Date.now()
};

await dc.db.save(
  dc.dbThreadId,
  'user_notes',
  JSON.stringify(updateData)
);

// 删除记录
await dc.db.delete(dc.dbThreadId, 'user_notes', recordId);

//=====第四步：查询举例=====

// 简单条件查询
const simpleQuery = {
  condition: "title = '我的笔记'"
};

// 复合条件查询
const complexQuery = {
  condition: "create_time > 1640995200000",
  ors: [
    { condition: "title = '重要笔记'" }
  ],
  sort: { fieldPath: "create_time", desc: true },
  seek: "分页标记"     // 用于分页
};

const [queryResults, queryError] = await dc.db.find(
  dc.dbThreadId,
  'user_notes',
  JSON.stringify(complexQuery)
);

//=====第五步：实际应用=====

// 创建用户设置管理
const saveUserSettings = async (settings) => {
  const [id, error] = await dc.db.create(
    dc.dbThreadId,
    'user_settings',
    JSON.stringify({
      ...settings,
      update_time: Date.now()
    })
  );
  return { id, error };
};

// 获取用户最新设置
const getUserSettings = async () => {
  const [results, error] = await dc.db.find(
    dc.dbThreadId,
    'user_settings',
    JSON.stringify({
      sort: { fieldPath: "update_time", desc: true }
    })
  );
  
  if (results) {
    const settings = JSON.parse(results);
    return settings[0];  // 返回最新的设置
  }
  return null;
};

// 使用示例
await saveUserSettings({ theme: 'dark', language: 'zh-CN' });
const currentSettings = await getUserSettings();
\`\`\`

### 4. keyValue DB存储

keyValue DB是一个键值对存储系统，类似于Redis或MongoDB等NoSQL数据库。它的特点是：

**功能特性：**
- 可以自定义value的数据结构（如JSON对象、字符串等）
- 支持权限控制，可以设置哪些用户能读取或修改数据
- 支持索引查询，方便批量获取数据

**使用场景对比：**
- **用户数据库(db)**：专门用于个人数据存储，每个用户只能访问自己的数据
- **keyValue DB**：适合多用户共享数据的场景，比如：
  - 应用配置信息（所有用户共享）
  - 公告通知（发布给所有用户）
  - 排行榜数据（用户之间可见）
  - 商品信息（多用户浏览）

**权限管理：**
创建公共主题时有特殊限制：
- 只有应用的初始主题作者（AppConfig.appThemeAuthor）才能创建供全体用户访问的公共主题
- 这是为了防止普通用户随意创建公共资源，确保应用数据的安全性
- 其他用户可以创建私有主题或邀请制主题

简单理解：keyValue DB = 多人共享的数据仓库，db = 个人专属的数据柜子

使用示例：

\`\`\`javascript
import { AppConfig } from '/dcapi';


//=====第一步：获取或创建数据存储空间=====

let kvdb = null;
let error = null;

// 尝试获取已存在的公共数据存储
[kvdb, error] = await dc.keyValue.getStore(
    dc.appInfo.appId,           // 应用ID
    'app_config',               // 存储主题名称（比如应用配置）
    AppConfig.appThemeAuthor    // 主题作者公钥
);

// 如果存储不存在，则创建新的
if (!kvdb) {
    // 检查权限：只有应用管理员才能创建公共存储
    if (dc.publicKey.string() === AppConfig.appThemeAuthor) {
        console.log('正在创建公共数据存储...');
        
        [kvdb, error] = await dc.keyValue.createStore(
            dc.appInfo.appId,
            'app_config_pub',       // 公共存储必须以"_pub"结尾
            50 * 1024 * 1024,       // 分配50MB存储空间
            2                       // 访问类型：2=公共（所有人可读，写入需授权）
        );
        
        if (kvdb) {
            console.log('公共数据存储创建成功！');
        }
    } else {
        console.error('权限不足：只有应用管理员可以创建公共存储');
        return;
    }
}

//=====第二步：配置用户访问权限=====

// 授权所有用户具有写入权限
const [authResult, authError] = await dc.keyValue.configAuth(
    kvdb,
    'all',          // 'all'表示所有用户，也可以填具体用户的公钥
    3,              // 权限级别：3=可读可写
    '允许所有用户访问应用配置'  // 授权说明
);

// 权限级别说明：
// 0: 无权限    1: 申请权限    2: 只读    3: 读写    4: 管理员    5: 只写


// =====第三步：存储数据（支持索引查询）=====


// 存储应用设置，并设置索引便于查询
const appSettings = {
    theme: 'dark',
    language: 'zh-CN',
    version: '1.0.0'
};

const [setSuccess, setError] = await dc.keyValue.set(
    kvdb,
    'app_settings',                     // 数据的键名
    JSON.stringify(appSettings),        // 数据内容（JSON格式）
    'type:settings$$$theme:dark$$$lang:zh-CN'  // 索引：类型=设置，主题=暗色，语言=中文
);

if (setSuccess) {
    console.log('应用设置保存成功');
}

// 存储用户偏好设置
const userPrefs = {
    notifications: true,
    autoSave: false,
    userId: 'user123'
};

await dc.keyValue.set(
    kvdb,
    'user_prefs_user123',
    JSON.stringify(userPrefs),
    'type:userprefs$$$userId:user123$$$notifications:true'
);


//=====第四步：读取数据=====

// 方式1：通过键名直接获取
const [settingsValue, getError] = await dc.keyValue.get(kvdb, 'app_settings');
if (settingsValue) {
    const settings = JSON.parse(settingsValue);
    console.log('当前应用设置:', settings);
}

// 方式2：通过索引批量查询
const [searchResults, searchError] = await dc.keyValue.getWithIndex(
    kvdb,
    'type',           // 索引名称
    'userprefs',      // 索引值（查找所有用户偏好设置）
    10,               // 最多返回10条结果
    '',               // 搜索关键字（空表示不筛选）
    0                 // 从第0条开始
);

if (searchResults) {
    const userPrefsList = JSON.parse(searchResults);
    console.log('所有用户偏好设置:', userPrefsList);
}


//=====实际应用场景示例=====

// 场景1：存储商品信息
const product = {
    id: 'prod001',
    name: 'iPhone 15',
    price: 5999,
    category: 'electronics'
};

await dc.keyValue.set(
    kvdb,
    'product_' + product.id,
    JSON.stringify(product),
    'category:' + product.category + '$$$price:' + product.price + '$$$type:product' // 索引：分类=电子产品，价格=5999，类型=商品
);

// 场景2：查询特定分类的商品
const [electronics, _] = await dc.keyValue.getWithIndex(
    kvdb,
    'category',       // 按分类查询
    'electronics',    // 查找电子产品
    20,               // 最多20个结果
    '',
    0
);

const productList = JSON.parse(electronics);
console.log('电子产品列表:', productList);
\`\`\`


### 5. 评论系统 (comment)

评论系统 (comment) 是专门为社交互动设计的功能模块，让用户可以发布、查看和管理评论内容。

**核心特点：**
- **时间线存储**：所有评论按发布时间顺序保存，可以按时间线浏览
- **权限控制**：支持设置谁能发评论、谁能查看评论
- **主题管理**：可以为不同话题创建独立的评论区

**与 keyValue DB 的区别：**
- **keyValue DB**：像一个文件柜，适合存储配置信息、商品数据等相对固定的内容
- **评论系统**：像一个留言板，适合存储用户发言、互动讨论等时序性内容

**适用场景：**
- 微博、朋友圈（用户动态和评论）
- 论坛、社区（帖子和回复）
- 商品评价（买家评论和商家回复）
- 新闻评论（读者评论和讨论）

**灵活的内容处理：**
评论内容可以根据业务需要自定义格式。比如：
- 在评论中包含特定ID，后续可以通过这个ID来更新评论状态
- 支持富文本、图片、链接等多种内容格式
- 可以实现点赞、回复、转发等社交功能

简单理解：keyValue DB = 数据存储柜，comment = 时间线留言板

\`\`\`javascript
import { AppConfig } from '/dcapi';


//=====第一步：创建评论主题（仅应用管理员可操作）=====
// 检查权限：只有应用管理员才能创建公共评论主题
if (dc.publicKey.string() === AppConfig.appThemeAuthor) {
  try {
    console.log('正在创建公共评论主题...');
    
    const [status, err] = await dc.comment.addThemeObj(
      'news_comments',        // 主题ID（比如新闻评论区）
      0,                      // 访问类型：0=公开, 1=私密, 2=授权
      50 * 1024 * 1024       // 分配50MB存储空间
    );
    if (status === 0) {
      console.log('评论主题创建成功！');
    }
  } catch(e) {
    console.log('主题已存在，无需重复创建');
  }
} else {
  console.log('权限不足：只有应用管理员可以创建公共评论主题');
}


//=====第二步：配置用户访问权限=====

// 授权所有用户具有评论权限
const [authStatus, authError] = await dc.comment.configAuth(
  'news_comments',           // 主题ID
  AppConfig.appThemeAuthor,  // 主题作者公钥
  'all',                     // 'all'表示所有用户，也可以填具体用户公钥
  3,                         // 权限级别：与keyValue DB的权限级别定义一致
  '允许所有用户参与评论讨论'   // 授权说明
);


//=====第三步：发布评论=====

// 发布普通评论
const newsContent = {
  newsId: 'news_001',
  title: 'DC平台最新功能发布',
  userComment: '这个功能很棒，期待更多更新！'
};

const [commentId, commentError] = await dc.comment.publishCommentToTheme(
  'news_comments',                    // 主题ID
  AppConfig.appThemeAuthor,           // 主题作者公钥
  0,                                  // 评论类型：0=普通评论, 1=点赞, 2=推荐, 3=踩
  JSON.stringify(newsContent),        // 评论内容
  1,                                  // 可见性：0=仅作者可见, 1=公开
  ''                                  // 引用其他评论（空表示不引用）
);

if (commentId) {
  console.log('评论发布成功，ID:', commentId);
}

// 发布点赞评论
const [likeId, likeError] = await dc.comment.publishCommentToTheme(
  'news_comments',
  AppConfig.appThemeAuthor,
  1,                                  // 评论类型：1=点赞
  JSON.stringify({ 
    action: 'like', 
    targetComment: commentId,
    userId: dc.publicKey.string()
  }),
  1,
  '1000/'+commentId               // 引用刚才的评论,格式: 原评论发布时的区块高度/评论ID
);

//=====第四步：获取评论列表=====

// 获取最新的评论列表
const [comments, commentsError] = await dc.comment.getThemeComments(
  'news_comments',           // 主题ID
  AppConfig.appThemeAuthor,  // 主题作者公钥
  0,                         // 起始高度（0表示从最新开始）
  0,                         // 方向：0=最新优先, 1=最旧优先
  0,                         // 偏移量（分页用）
  20                         // 获取数量限制
);

if (comments && !commentsError) {
  const commentList = JSON.parse(comments);
  console.log('评论列表:', commentList);
  
  // 处理评论数据
  commentList.forEach(comment => {
    const content = JSON.parse(comment.content);
    console.log('用户评论: '+ content.userComment);
    console.log('发布时间: '+ new Date(comment.timestamp).toLocaleString()});
  });
} else {
  console.error('获取评论失败:', commentsError);
}

//=====实际应用场景示例=====

// 场景1：新闻评论系统
const publishNewsComment = async (newsId, commentText) => {
  const commentData = {
    type: 'news_comment',
    newsId: newsId,
    comment: commentText,
    timestamp: Date.now(),
    author: dc.publicKey.string()
  };
  
  const [id, error] = await dc.comment.publishCommentToTheme(
    'news_comments',
    AppConfig.appThemeAuthor,
    0,
    JSON.stringify(commentData),
    1,
    ''
  );
  return { id, error };
};

// 场景2：商品评价系统
const publishProductReview = async (productId, rating, review) => {
  const reviewData = {
    type: 'product_review',
    productId: productId,
    rating: rating,        // 1-5星评分
    review: review,
    timestamp: Date.now(),
    reviewer: dc.publicKey.string()
  };
  
  const [id, error] = await dc.comment.publishCommentToTheme(
    'product_reviews',
    AppConfig.appThemeAuthor,
    0,
    JSON.stringify(reviewData),
    1,
    ''
  );
  
  return { id, error };
};

// 使用示例
await publishNewsComment('news_001', '这篇文章写得很好！');
await publishProductReview('prod_001', 5, '商品质量很棒，物流也很快！');
\`\`\`


### 6. 消息系统 (message)

消息系统 (message) 提供用户之间的私信功能，类似于邮件系统或即时通讯。

**核心特点：**
- **点对点通信**：用户可以直接给其他用户发送私信
- **收件箱模式**：所有收到的消息都存储在个人收件箱中
- **简单易用**：只需要知道对方的公钥即可发送消息

**适用场景：**
- 用户之间的私人对话
- 系统通知和提醒
- 客服消息和反馈
- 好友聊天和交流

**与其他模块的区别：**
- **消息系统**：一对一的私密通信，类似微信私聊
- **评论系统**：公开的讨论区，类似微博评论
- **用户数据库**：个人数据存储，不涉及通信

简单理解：消息系统 = 私人邮箱，comment = 公共留言板

使用示例：

\`\`\`javascript
// =====发送私信给其他用户=====

// 发送简单文本消息
const [status, sendError] = await dc.message.sendMsgToUserBox(
  'anotherUserPublicKey123',    // 接收者的公钥（可通过 dc.publicKey.string() 获取）
  '你好，这是一条测试消息！'     // 消息内容
);

if (status === 0) {
  console.log('消息发送成功');
} else {
  console.error('消息发送失败:', sendError);
}

// 发送复杂消息（JSON格式）
const messageData = {
  type: 'notification',
  title: '系统通知',
  content: '您有一个新的订单需要处理',
  timestamp: Date.now(),
  sender: dc.publicKey.string()
};

const [status2, sendError2] = await dc.message.sendMsgToUserBox(
  'receiverPublicKey',
  JSON.stringify(messageData)
);

//=====获取收件箱消息=====

// 获取最新的消息列表
const [messages, getError] = await dc.message.getMsgFromUserBox(20); // 获取最新20条消息

if (messages && !getError) {
  console.log('收到的消息:', messages);
  
  // 处理消息列表
  messages.forEach((message, index) => {
    console.log('消息 ' + (index + 1) + ': 发送者=' + message.sender + ', 内容=' + message.content + ', 时间=' + new Date(message.timestamp).toLocaleString());
  });
} else {
  console.error('获取消息失败:', getError);
}

//=====实际应用场景示例=====

// 场景1：发送系统通知
const sendSystemNotification = async (userPublicKey, title, content) => {
  const notification = {
    type: 'system_notification',
    title: title,
    content: content,
    timestamp: Date.now(),
    priority: 'normal'
  };
  
  const [status, error] = await dc.message.sendMsgToUserBox(
    userPublicKey,
    JSON.stringify(notification)
  );
  
  return { success: status === 0, error };
};

// 场景2：用户聊天功能
const sendChatMessage = async (friendPublicKey, messageText) => {
  const chatMessage = {
    type: 'chat',
    message: messageText,
    sender: dc.publicKey.string(),
    timestamp: Date.now()
  };
  
  const [status, error] = await dc.message.sendMsgToUserBox(
    friendPublicKey,
    JSON.stringify(chatMessage)
  );
  
  return { success: status === 0, error };
};

// 场景3：获取并分类处理消息
const processInboxMessages = async () => {
  const [messages, error] = await dc.message.getMsgFromUserBox(50);
  
  if (messages && !error) {
    const notifications = [];
    const chatMessages = [];
    
    messages.forEach(msg => {
      try {
        const parsed = JSON.parse(msg.content);
        if (parsed.type === 'system_notification') {
          notifications.push(parsed);
        } else if (parsed.type === 'chat') {
          chatMessages.push(parsed);
        }
      } catch (e) {
        // 处理纯文本消息
        chatMessages.push({
          type: 'text',
          message: msg.content,
          sender: msg.sender,
          timestamp: msg.timestamp
        });
      }
    });
    
    console.log('系统通知:', notifications);
    console.log('聊天消息:', chatMessages);
  }
};

// 使用示例
await sendSystemNotification('userPublicKey123', '订单更新', '您的订单已发货');
await sendChatMessage('friendPublicKey456', '你好，最近怎么样？');
await processInboxMessages();
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
    Model:         "deepseek-r1",// 模型名称
    Temperature:   0.7,
    MaxTokens:     10000,
    TopP:          0.9, 
    TopK:          40,
    StopSequences: []string{},
    SystemPrompt:  "你是一个软件开发专家.",
    Stream:        true, // 启用流模式
    Tools:         []ToolDefinition{},// 工具定义数组
    Remark:        "这是一个AI代理配置"
}


const serviceConfig =  {
  service: 'ai代理服务', // 服务名称
  isAIModel: 0,    // 0: AI模型 1: MCPServer
  apiType: 0,      // 模型接口类型
  authorization: "Bearer your-api-key", // 授权信息
  endpoint: "https://api.openai.com/v1", // API端点
  organization: "your-organization", // 组织名称或ID 
  apiVersion: "v1",   // api版本号
  modelConfig: modelConfig, // 模型配置
  remark: ""
}

//配置AI服务
const [success, error] = await dc.aiproxy.configAIProxy(
  dc.appInfo.appId,
  dc.publicKey.string(),  // 配置作者公钥
  'default',              // 主题
  'openai-gpt',          // 名称
  serviceConfig          
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
    Tlim: 1000, // 总次数限制
    Dlim: 100, // 日限制
    Wlim: 500, // 周限制
    Mlim: 2000, // 月限制
    Ylim: 10000, // 年限制
    Exp: 12345678 // 过期区块高度
};

const [status, error] = await dc.aiproxy.configAuth(
  dc.appInfo.appId,
  dc.publicKey.string(),      // 配置作者公钥
  'default',                  // 主题
  '用户',                 // 被授权的公钥,all表示所有用户
  3,                          // 权限级别：3=写入权限
  authConfig                  // 授权配置
);

if (status) {
  console.log('配置成功');
}
\`\`\`


\\默认调用配置,在AI请求调用前调用

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
  console.log('设置成功');
}
\`\`\`


 \\执行AI调用

\`\`\`javascript

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


const controller = new AbortController();
const context = { signal: controller.signal };

// 流式响应处理
// flag: 0表示开始接收数据, 1:权限不足 2:获取失败 3:关闭连接 4: 其他错误   content: 接收到的数据
const handleStreamResponse = (flag, content, error) => {
  if (error) {
    console.error('流式响应错误:', error);
    return;
  }

  if (flag === 3) {
    console.log('响应完成');
    return;
  }
  if (flag === 1) {
    console.error('权限不足');
    return;
  }
  if (flag === 2) {
    console.error('获取AI服务失败:', content);
    return;
  }
  if (flag === 4) {
    console.error('错误:', content);
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
  console.error('调用失败', error);
}
\`\`\`

## 模块选择指南
- **用户数据库(db)**: 个人数据，隐私数据，跨设备同步
- **keyValue DB**: 多用户共享数据，应用配置，商品信息，排行榜
- **评论系统**: 时间线社交互动，评论回复，点赞功能
- **消息系统**: 点对点私密通信，系统通知
- **文件模块**: 加密文件存储，支持文件夹管理
- **AI代理**: 应用中需要调用AI模型或者MCPServer时，使用AI代理模块进行配置和调用

`;
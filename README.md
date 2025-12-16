web-dc-api 是一个去中心化 Web 开发 SDK。使用逻辑如下:

## 1. 初始化与生命周期 (Lifecycle)

**应用入口 (App.tsx) 必须遵循以下严格流程**:

1.  **Login**: const [info, err] = await dc.auth.accountLoginWithWallet();
2.  **DB Init**: 登录成功后，**必须**立刻初始化 ThreadDB。
    - 定义集合: const collections = [{ name: "coll_name", schema: { type: "object", properties: { ... }, required: ["_id"] } }];
    - 调用: const [, initErr] = await dc.initUserDB(collections, "1.0.0", false);
3.  **State**: 登录成功后，调用 saveAccountInfo(info) 更新 Context 状态。
4.  **严格约束**: 在 UI 描述和文案中，**必须**将其称为 **"登录" (Login)** 或 **"进入应用"**。
5.  **禁止**: 严禁在 UI 按钮或描述中使用 "连接钱包" (Connect Wallet) 或 "钱包登录" 等字样，避免给用户造成金融操作的误解。

## 2. 基础环境

- **Hook**: 仅在 .tsx 组件中使用 import { useDC } from "/src/contexts/DCContext.tsx"。
- **Instance**: const { getDC, dcStatus, saveAccountInfo } = useDC(); const dc = await getDC();

## 3. 数据存储 (根据分析结果选择)

### A. ThreadDB (私有/同步) - 适用于: 笔记, 草稿, 设置

- **API**:
  - dc.db.create(dc.dbThreadId, "coll", jsonStr) -> [id, err]
  - dc.db.find(dc.dbThreadId, "coll", jsonQuery) -> [listJson, err] (Sort: {sort: {fieldPath: "x", desc: true}})
  - dc.db.save(dc.dbThreadId, "coll", jsonPatch) -> [err]
  - dc.db.delete(dc.dbThreadId, "coll", id)

### B. KeyValueDB (共享/Serverless) - 适用于: 社交, 电商, 公共配置

- **核心**: 基于 Entity + Repository 模式。
- **Entity**: 继承 BaseEntity。
  - @Entity({ name: "keyvalue_xxx_pub" }) (公开) 或 keyvalue_xxx (私有)。
  - @Column({ type: "..." })
  - @Index({ name: "idx_x", fields: ["f1", "f2"] }) (支持复合索引)
- **Service**: 注入 constructor(dc: DC, db: KeyValueDB)。
  - 获取 Store: dc.keyValue.getStore(appId, "topic_name", APPThemeConfig.appThemeAuthor)
  - 初始化 Repo: this.repo = new EntityRepository(EntityClass, dc.keyValue, db)
- **Repository API**: save(entity), findById(id), findByIndex(key, val), query(cond), deleteById(id)。
  - **注意**: 不支持 SQL。复合索引值必须用 composeCompositeIndexValue([v1, v2]) 生成。

## 4. 功能模块

- **File**: dc.file.addFile(file, "", onProg) -> [cid], dc.file.getFile(cid, "")
- **AI Proxy**: dc.aiproxy.DoAIProxyCall({signal}, reqBody, false, callback)
- **Message**: dc.message.sendMsgToUserBox (发), dc.message.getMsgFromUserBox (收)

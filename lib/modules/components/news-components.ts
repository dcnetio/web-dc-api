import { KeyValueModule } from "../keyvalue-module";
import { DCContext } from "../../interfaces/DCContext";
import { KeyValueDB, KeyValueStoreType } from "../../implements/keyvalue/manager";
import { Direction } from "../../common/define";

export interface NewsData {
  id: string;
  title: string;
  content: string;
  images?: string[];
  author: string;
  timestamp: number;
  category: string;
  tags: string[];
  status: 'published' | 'deleted';
  extra?: any;
}

export interface CommentData {
  id: string;
  newsId: string;
  content: string;
  author: string;
  timestamp: number;
}

export interface LikeData {
  newsId: string;
  author: string;
  timestamp: number;
}

export class NewsComponent {
  private kvModule: KeyValueModule;
  private context: DCContext;
  private kvdb: KeyValueDB | null = null;
  private appId: string;
  private theme: string;
  private themeAuthor: string;

  constructor(
    kvModule: KeyValueModule,
    context: DCContext,
    appId: string = "DCAPP",
    theme: string = "news_pub",
    themeAuthor: string
  ) {
    this.kvModule = kvModule;
    this.context = context;
    this.appId = appId;
    this.theme = theme;
    this.themeAuthor = themeAuthor;
  }

  /**
   * 初始化组件，连接数据库
   */
  async initialize(): Promise<boolean> {
    // 尝试获取存储
    let [db, err] = await this.kvModule.getStore(this.appId, this.theme, this.themeAuthor);
    
    if (!db) {
      // 如果获取失败且当前用户是主题作者，则尝试创建
      if (this.context.publicKey?.string() === this.themeAuthor) {
        [db, err] = await this.kvModule.createStore(
          this.appId,
          this.theme,
          100 * 1024 * 1024, // 100MB
          KeyValueStoreType.Public
        );
      }
    }

    if (err || !db) {
      console.error("NewsComponent initialize failed:", err);
      return false;
    }

    this.kvdb = db;
    return true;
  }

  private checkDB(): void {
    if (!this.kvdb) {
      throw new Error("NewsComponent not initialized");
    }
  }

  /**
   * 发布新闻
   */
  async publishNews(news: Omit<NewsData, 'id' | 'author' | 'timestamp' | 'status'>): Promise<string | null> {
    this.checkDB();
    if (!this.context.publicKey) throw new Error("User not logged in");

    const timestamp = Date.now();
    const id = `news_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    const author = this.context.publicKey.string();

    const newsData: NewsData = {
      ...news,
      id,
      author,
      timestamp,
      status: 'published'
    };

    const indexes = [
      { key: "type", value: "news", type: "string" },
      { key: "category", value: news.category, type: "string" },
      { key: "timestamp", value: timestamp, type: "number" },
      { key: "author", value: author, type: "string" }
    ];

    const [success, , err] = await this.kvModule.set(
      this.kvdb!,
      id,
      JSON.stringify(newsData),
      JSON.stringify(indexes)
    );

    if (err || !success) {
      console.error("Publish news failed:", err);
      return null;
    }

    return id;
  }

  /**
   * 修改新闻
   */
  async updateNews(id: string, updates: Partial<Omit<NewsData, 'id' | 'author' | 'timestamp'>>): Promise<boolean> {
    this.checkDB();
    
    // 先获取原有新闻
    const [currentDataStr, err] = await this.kvModule.get(this.kvdb!, id);
    if (err || !currentDataStr) return false;

    // 解析原有数据 (格式: value$$$dckv_extra$$$...)
    const valuePart = currentDataStr.split("$$$")[0];
    const currentData: NewsData = JSON.parse(valuePart);

    // 检查权限 (仅作者可修改)
    if (currentData.author !== this.context.publicKey?.string()) {
      throw new Error("Permission denied");
    }

    const newData: NewsData = {
      ...currentData,
      ...updates,
      timestamp: Date.now() // 更新时间戳? 或者保留原发布时间? 通常保留发布时间，增加updateTime。这里简单处理。
    };

    // 重建索引 (保持原有索引键，更新值)
    const indexes = [
      { key: "type", value: "news", type: "string" },
      { key: "category", value: newData.category, type: "string" },
      { key: "timestamp", value: newData.timestamp, type: "number" }, // 如果按更新时间排
      { key: "author", value: newData.author, type: "string" }
    ];

    const [success, , updateErr] = await this.kvModule.set(
      this.kvdb!,
      id,
      JSON.stringify(newData),
      JSON.stringify(indexes)
    );

    return !!success && !updateErr;
  }

  /**
   * 删除新闻 (软删除)
   */
  async deleteNews(id: string): Promise<boolean> {
    return this.updateNews(id, { status: 'deleted' });
  }

  /**
   * 获取新闻列表
   */
  async getNewsList(
    options: { 
      category?: string; 
      limit?: number; 
      offset?: number;
      seekKey?: string;
    } = {}
  ): Promise<NewsData[]> {
    this.checkDB();

    const limit = options.limit || 10;
    const offset = options.offset || 0;
    
    let indexKey = "type";
    let indexValue = "news";

    // 如果指定了分类，使用分类索引
    if (options.category) {
      indexKey = "category";
      indexValue = options.category;
    }

    // 默认按时间倒序 (Direction.Reverse)
    const [resultStr, err] = await this.kvModule.getWithIndex(
      this.kvdb!,
      indexKey,
      indexValue,
      {
        limit,
        offset,
        seekKey: options.seekKey,
        direction: Direction.Reverse
      }
    );

    if (err || !resultStr) return [];

    // 解析结果
    // 结果格式: JSON array of "key:value$$$dckv_extra$$$..."
    try {
      const items: any[] = JSON.parse(resultStr);
      const newsList: NewsData[] = [];

      for (const item of items) {
        // item 是一个对象 { key: "value$$$..." } 或者直接是 value 字符串?
        // 实际返回格式可能是 [{ "key": "value$$$..." }, ...]
        
        const key = Object.keys(item)[0];
        const valStr = item[key];
        const valuePart = valStr.split("$$$")[0];
        const newsData: NewsData = JSON.parse(valuePart);

        if (newsData.status !== 'deleted') {
          newsList.push(newsData);
        }
      }
      return newsList;
    } catch (e) {
      console.error("Parse news list failed", e);
      return [];
    }
  }

  /**
   * 获取新闻详情
   */
  async getNewsDetail(id: string): Promise<NewsData | null> {
    this.checkDB();
    const [dataStr, err] = await this.kvModule.get(this.kvdb!, id);
    if (err || !dataStr) return null;

    const valuePart = dataStr.split("$$$")[0];
    try {
      const data: NewsData = JSON.parse(valuePart);
      if (data.status === 'deleted') return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  /**
   * 点赞新闻
   */
  async likeNews(newsId: string): Promise<boolean> {
    this.checkDB();
    if (!this.context.publicKey) throw new Error("User not logged in");

    const author = this.context.publicKey.string();
    const id = `like_${newsId}_${author}`;
    const timestamp = Date.now();

    const likeData: LikeData = { newsId, author, timestamp };

    const indexes = [
      { key: "like_target", value: newsId, type: "string" },
      { key: "type", value: "like", type: "string" }
    ];

    const [success, , err] = await this.kvModule.set(
      this.kvdb!,
      id,
      JSON.stringify(likeData),
      JSON.stringify(indexes)
    );

    return !!success && !err;
  }

  /**
   * 评价新闻
   */
  async commentNews(newsId: string, content: string): Promise<boolean> {
    this.checkDB();
    if (!this.context.publicKey) throw new Error("User not logged in");

    const author = this.context.publicKey.string();
    const timestamp = Date.now();
    const id = `comment_${newsId}_${timestamp}_${Math.random().toString(36).substr(2, 5)}`;

    const commentData: CommentData = {
      id,
      newsId,
      content,
      author,
      timestamp
    };

    const indexes = [
      { key: "comment_target", value: newsId, type: "string" },
      { key: "type", value: "comment", type: "string" },
      { key: "timestamp", value: timestamp, type: "number" }
    ];

    const [success, , err] = await this.kvModule.set(
      this.kvdb!,
      id,
      JSON.stringify(commentData),
      JSON.stringify(indexes)
    );

    return !!success && !err;
  }

  /**
   * 获取新闻评论列表
   */
  async getNewsComments(newsId: string, limit: number = 20, offset: number = 0): Promise<CommentData[]> {
    this.checkDB();
    
    const [resultStr, err] = await this.kvModule.getWithIndex(
      this.kvdb!,
      "comment_target",
      newsId,
      {
        limit,
        offset,
        direction: Direction.Reverse // 最新评论在前
      }
    );

    if (err || !resultStr) return [];

    try {
      const items: any[] = JSON.parse(resultStr);
      const comments: CommentData[] = [];
      for (const item of items) {
        const key = Object.keys(item)[0];
        const valStr = item[key];
        const valuePart = valStr.split("$$$")[0];
        comments.push(JSON.parse(valuePart));
      }
      return comments;
    } catch (e) {
      return [];
    }
  }
  
  /**
   * 获取新闻点赞数 (估算，因为是分页获取)
   * 实际场景可能需要专门的计数器，这里仅演示获取列表
   */
  async getNewsLikes(newsId: string, limit: number = 100): Promise<LikeData[]> {
      this.checkDB();
      const [resultStr, err] = await this.kvModule.getWithIndex(
        this.kvdb!,
        "like_target",
        newsId,
        { limit }
      );
      
      if (err || !resultStr) return [];
      
      try {
        const items: any[] = JSON.parse(resultStr);
        const likes: LikeData[] = [];
        for (const item of items) {
            const key = Object.keys(item)[0];
            const valStr = item[key];
            const valuePart = valStr.split("$$$")[0];
            likes.push(JSON.parse(valuePart));
        }
        return likes;
      } catch(e) {
          return [];
      }
  }
}

import { OpenFlag, ThemePermission } from "../common/constants";
import { ThemeAuthInfo, ThemeComment, ThemeObj } from "../common/types/types";

/**
 * 评论操作接口
 * 提供评论系统的所有功能操作
 */
export interface ICommentOperations {
  /**
   * 为指定主题开通评论功能
   * @param theme 主题/对象标识符
   * @param openFlag 开放标志 0-公开(任何人可读写) 1-私密(任何登录用户都可写评论,但每条评论默认仅"评论者本人+主题作者(管理员)"可见;主题作者可 setObjCommentPublic 精选公开某条评论) 2-鉴权(需被授权才能访问)
   * @param commentSpace 可选，评论空间上限大小(字节)，默认50MB
   * @param appId 可选，覆盖当前 DC 上下文的 appId（用于在另一个应用命名空间下创建主题，如平台侧代生成应用管理其留言主题）
   * @returns 操作结果  0:成功 1:评论空间没有配置 2:评论空间不足 3:评论数据同步中
   */
  addThemeObj(theme: string, openFlag: OpenFlag, commentSpace?: number, appId?: string): Promise<[number | null, Error | null]>;
  
  /**
   * 添加用户链下评论空间,DC为了提升性能,用户发布评论等操作,无需上链,有DC节点在TEE环境维护用户的评论空间使用情况,新用户在发布评论前需要先添加评论空间,每次调用会分配50MB的链下空间,用于发布评论等链下操作
   * @returns 添加结果 true:成功  false:失败
   */
  addUserOffChainSpace(vaccount?: string): Promise<[boolean | null, Error | null]>
  
  /**
   * 为用户添加链下操作次数,DC为了提升性能,用户发布评论等操作,无需上链,用于发布评论等链下操作次数,
   * @param times 操作次数
   * @param vaccount 可选，用户的虚拟账号
   * @returns 操作结果  0:成功 1:评论空间没有配置 2:评论空间不足 3:评论数据同步中
   */
  addUserOffChainOpTimes(
  times: number,
  vaccount?: string
): Promise<[boolean | null, Error | null]>
 
  /**
   * 为已开通评论的主题增加评论空间,为了防止每个主题评论空间浪费,每个主题在创建时会分配50MB的评论空间,如果后续不够,可以通过这个接口增加
   * 本方法可以为指定主题的keyvaluedb增加空间
   * @param theme 主题/对象标识符
   * @param addSpace 要增加的空间大小(字节)
   * @returns 操作结果
   */
  addThemeSpace(theme: string, addSpace: number): Promise<[number | null, Error | null]>;
  
  /**
   * 向指定主题发布评论
   * @param theme 主题/对象标识符
   * @param themeAuthor 主题作者的公钥
   * @param commentType 评论类型
   * @param comment 评论内容
   * @param openFlag 可选，评论可见性 0-公开(所有人可见) 1-私密(仅评论者本人+主题作者可见;主题作者可 setObjCommentPublic 精选公开)
   * @param refercommentkey 可选，引用的评论键；回复仍使用 commentType=0
   * @param appId 可选，覆盖当前 DC 上下文的 appId
   * @returns 评论发布结果
   */
  publishCommentToTheme(
    theme: string,
    themeAuthor: string,
    commentType: number,
    comment: string,
    openFlag?: number,
    refercommentkey?: string,
    appId?: string
  ): Promise<[string | null, Error | null]>;
  
  /**
   * 删除自己发布的评论,只是删除了在自己列表中的评论,不能删除已经发布到主题下的评论
   * @param theme 主题/对象标识符
   * @param themeAuthor 主题作者的公钥
   * @param commentKey 评论的唯一键
   * @returns 删除操作结果
   */
  deleteSelfComment(theme: string, themeAuthor: string, commentKey: string): Promise<[number | null, Error | null]>;
  
  /**
   * 将某条评论精选公开,使其对所有人可见(仅评论对象/主题的拥有者可调用)
   * @param theme 主题/对象标识符
   * @param themeAuthor 主题作者的公钥
   * @param commentKey 评论的唯一键
   * @param appId 可选，覆盖当前 DC 上下文的 appId
   * @returns 操作结果
   */
  setObjCommentPublic(theme: string, themeAuthor: string, commentKey: string, appId?: string): Promise<[number | null, Error | null]>;
  
  /**
   * 获取指定作者的主题对象列表,无法查询作者设置为私密的主题
   * @param themeAuthor 主题作者的公钥
   * @param startHeight 可选，查询起始高度
   * @param direction 可选，查询方向 (0:正向/从旧到新, 1:逆向/从新到旧)
   * @param offset 可选，结果集偏移量
   * @param limit 可选，最大返回数量，默认100
   * @param seekKey 可选，查询的起始键,格式为返回记录的 blockheight/key
   * @returns 主题对象列表
   */
  getThemeObj(
    themeAuthor: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string
  ): Promise<[ThemeObj[] | null, Error | null]>;
  
  /**
   * 获取指定主题的评论列表,无法查询作者设置为私密的评论
   * @param theme 主题/对象标识符
   * @param themeAuthor 主题作者的公钥
   * @param startHeight 可选，查询起始高度
   * @param direction 可选，查询方向 (0:正向/从旧到新, 1:逆向/从新到旧)
   * @param offset 可选，结果集偏移量
   * @param limit 可选，最大返回数量，默认100
   * @param seekKey 可选，查询的起始键,格式为返回记录的 blockheight/key
   * @param appId 可选，覆盖当前 DC 上下文的 appId
   * @returns 主题的评论列表
   */
  getThemeComments(
    theme: string,
    themeAuthor: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string,
    appId?: string,
    vaccount?: string,
  ): Promise<[ThemeComment[] | null, Error | null]>;


  /**
   * 获取指定主题的权限列表（分页支持 seekKey / direction / limit 等）
   * @param theme 主题名称（不含 _authlist 后缀，服务端自动补充）
   * @param themeAuthor 主题作者的公钥
   * @param startHeight 可选，查询起始高度
   * @param direction 可选，查询方向 (0:正向 1:逆向)
   * @param offset 可选，结果集偏移量
   * @param limit 可选，最大返回数量，默认100
   * @param seekKey 可选，分页游标，格式为 blockheight/commentCid
   * @param vaccount 可选，虚拟账户
   * @returns [授权记录列表, 用户总数, 下一页游标, 错误信息]
   */
  getThemeAuthList(
    theme: string,
    themeAuthor: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string,
    vaccount?: string
  ): Promise<[ThemeComment[] | null, number, string, Error | null]>;

  /**
   * 配置主题的授权信息
   * @param themeAuthor 主题作者的公钥
   * @param theme 主题名称
   * @param authPubkey 被授权者的公钥
   * @param permission 权限级别
   * @param remark 备注信息
   * @param vaccount 可选的虚拟账户
   * @returns [授权状态码, 错误信息]
   */
  configAuth(
    themeAuthor: string,
      theme: string,
      authPubkey: string,
      permission: ThemePermission,
      remark: string,
      vaccount?: string
    ): Promise<[number | null, Error | null]>;
  
  
  /**
   * 获取指定主题的授权列表,
   * @param appId 应用ID
   * @param themeAuthor 主题作者的公钥
   * @param theme 主题/对象标识符
   * @param vaccount 可选，虚拟账户
   * @returns [授权列表, 评论列表, 错误信息]
   */
 getAuthList(
      themeAuthor: string,
      theme: string,
      vaccount?: string
    ): Promise<[ThemeAuthInfo[]|null,ThemeComment[] | null, Error | null]> 
     
  /**
   * 获取授权列表中的用户总数
   * @param themeAuthor 主题作者公钥
   * @param theme 主题名称
   * @param vaccount 可选的虚拟账户
   * @returns [用户总数, 错误信息]
   */
  getAuthListUserCount(
    themeAuthor: string,
    theme: string,
    vaccount?: string
  ): Promise<[number | null, Error | null]>;

  /**
   * 获取指定用户发布的评论列表,无法查询用户设置为私密的评论
   * @param userPubkey 用户公钥
   * @param startHeight 可选，查询起始高度
   * @param direction 可选，查询方向 (0:正向/从旧到新, 1:逆向/从新到旧)
   * @param offset 可选，结果集偏移量
   * @param limit 可选，最大返回数量，默认100
   * @param seekKey 可选，查询的起始键,格式为返回记录的 blockheight/key
   * @returns 用户的评论列表
   */
  getUserComments(
    userPubkey: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string
  ): Promise<[ThemeComment[] | null, Error | null]>;
}

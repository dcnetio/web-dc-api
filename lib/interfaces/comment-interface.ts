import { OpenFlag } from "../common/constants";

/**
 * 评论操作接口
 * 提供评论系统的所有功能操作
 */
export interface ICommentOperations {
  /**
   * 为指定主题开通评论功能
   * @param theme 主题/对象标识符
   * @param openFlag 开放标志 
   * @param commentSpace 可选，评论空间上限大小(字节)，默认50MB
   * @returns 操作结果  0:成功 1:评论空间没有配置 2:评论空间不足 3:评论数据同步中
   */
  addThemeObj(theme: string, openFlag: OpenFlag, commentSpace?: number): Promise<[number | null, Error | null]>;
  
  /**
   * 添加用户链下评论空间,DC为了提升性能,用户发布评论等操作,无需上链,有DC节点在TEE环境维护用户的评论空间使用情况,新用户在发布评论前需要先添加评论空间,每次调用会分配50MB的链下空间,用于发布评论等链下操作
   * @returns 添加结果 true:成功  false:失败
   */
  addUserOffChainSpace(): Promise<[boolean | null, Error | null]>
  
  /**
   * 为用户添加链下操作次数,DC为了提升性能,用户发布评论等操作,无需上链,用于发布评论等链下操作次数,
   * @param times 操作次数
   * @param vaccount 可选，用户的虚拟账号
   * @returns 操作结果  0:成功 1:评论空间没有配置 2:评论空间不足 3:评论数据同步中
   */
  addUserOffChainOpTimes(
  times: number,
  vaccount?: string
): Promise<[boolean, Error | null]>
 
  /**
   * 为已开通评论的主题增加评论空间,为了防止每个主题评论空间浪费,每个主题在创建时会分配50MB的评论空间,如果后续不够,可以通过这个接口增加
   * 本方法可以为指定主题的keyvaluedb增加空间
   * @param theme 主题/对象标识符
   * @param addSpace 要增加的空间大小(字节)
   * @returns 操作结果
   */
  addThemeSpace(theme: string, addSpace: number): Promise<any>;
  
  /**
   * 向指定主题发布评论
   * @param theme 主题/对象标识符
   * @param themeAuthor 主题作者的公钥
   * @param commentType 评论类型
   * @param comment 评论内容
   * @param refercommentkey 可选，引用的评论键
   * @param openFlag 可选，评论可见性标志
   * @returns 评论发布结果
   */
  publishCommentToTheme(
    theme: string,
    themeAuthor: string,
    commentType: number,
    comment: string,
    refercommentkey?: string,
    openFlag?: number
  ): Promise<any>;
  
  /**
   * 删除自己发布的评论,只是删除了在自己列表中的评论,不能删除已经发布到主题下的评论
   * @param theme 主题/对象标识符
   * @param themeAuthor 主题作者的公钥
   * @param commentKey 评论的唯一键
   * @returns 删除操作结果
   */
  deleteSelfComment(theme: string, themeAuthor: string, commentKey: string): Promise<any>;
  
  /**
   * 获取指定作者的主题对象列表,无法查询作者设置为私密的主题
   * @param themeAuthor 主题作者的公钥
   * @param startHeight 可选，查询起始高度
   * @param direction 可选，查询方向 (0:从新到旧, 1:从旧到新)
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
  ): Promise<any>;
  
  /**
   * 获取指定主题的评论列表,无法查询作者设置为私密的评论
   * @param theme 主题/对象标识符
   * @param themeAuthor 主题作者的公钥
   * @param startHeight 可选，查询起始高度
   * @param direction 可选，查询方向 (0:从新到旧, 1:从旧到新) 
   * @param offset 可选，结果集偏移量
   * @param limit 可选，最大返回数量，默认100
   * @param seekKey 可选，查询的起始键,格式为返回记录的 blockheight/key
   * @returns 主题的评论列表
   */
  getThemeComments(
    theme: string,
    themeAuthor: string,
    startHeight?: number,
    direction?: number,
    offset?: number,
    limit?: number,
    seekKey?: string
  ): Promise<any>;
  
  /**
   * 获取指定用户发布的评论列表,无法查询用户设置为私密的评论
   * @param userPubkey 用户公钥
   * @param startHeight 可选，查询起始高度
   * @param direction 可选，查询方向 (0:从新到旧, 1:从旧到新)
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
  ): Promise<any>;
}
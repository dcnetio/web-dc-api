/**
 * 评论操作接口
 * 提供评论系统的所有功能操作
 */
export interface ICommentOperations {
  /**
   * 添加用户链下评论空间
   * @returns 添加结果
   */
  addUserOffChainSpace(): Promise<any>;
  
  /**
   * 为指定主题开通评论功能
   * @param theme 主题/对象标识符
   * @param openFlag 开放标志 (控制谁可以评论)
   * @param commentSpace 可选，评论空间大小(字节)，默认20MB
   * @returns 操作结果
   */
  addThemeObj(theme: string, openFlag: number, commentSpace?: number): Promise<any>;
  
  /**
   * 为已开通评论的主题增加评论空间
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
   * 删除自己发布的评论
   * @param theme 主题/对象标识符
   * @param themeAuthor 主题作者的公钥
   * @param commentKey 评论的唯一键
   * @returns 删除操作结果
   */
  deleteSelfComment(theme: string, themeAuthor: string, commentKey: string): Promise<any>;
  
  /**
   * 获取指定作者的主题对象列表
   * @param themeAuthor 主题作者的公钥
   * @param startHeight 可选，查询起始高度
   * @param direction 可选，查询方向 (0:从新到旧, 1:从旧到新)
   * @param offset 可选，结果集偏移量
   * @param limit 可选，最大返回数量，默认100
   * @param seekKey 可选，查询的起始键
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
   * 获取指定主题的评论列表
   * @param theme 主题/对象标识符
   * @param themeAuthor 主题作者的公钥
   * @param startHeight 可选，查询起始高度
   * @param direction 可选，查询方向 (0:从新到旧, 1:从旧到新) 
   * @param offset 可选，结果集偏移量
   * @param limit 可选，最大返回数量，默认100
   * @param seekKey 可选，查询的起始键
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
   * 获取指定用户发布的评论列表
   * @param userPubkey 用户公钥
   * @param startHeight 可选，查询起始高度
   * @param direction 可选，查询方向 (0:从新到旧, 1:从旧到新)
   * @param offset 可选，结果集偏移量
   * @param limit 可选，最大返回数量，默认100
   * @param seekKey 可选，查询的起始键
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
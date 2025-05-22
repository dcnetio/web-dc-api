import { ThemeComment } from "lib/common/types/types";

/**
 * 键值存储操作接口
 * 提供分布式键值存储的创建、权限管理和数据操作功能
 */
export interface IKeyValueOperations {
  /**
   * 创建存储主题
   * @param theme 主题名称
   * @param space 分配的存储空间大小（字节）
   * @param type 存储类型（0: 普通存储, 1: 加密存储）
   * @returns 创建结果，包含主题信息
   * @throws 当用户空间不足或创建失败时抛出错误
   */
  createStore(theme: string, space: number, type: number): Promise<any>;

  /**
   * 配置主题的授权信息
   * @param appId 应用ID
   * @param themeAuthor 主题作者的公钥
   * @param theme 主题名称
   * @param authPubkey 被授权者的公钥
   * @param permission 权限级别（1: 只读, 3: 读写）
   * @param remark 备注信息
   * @param vaccount 可选的虚拟账户
   * @returns [授权状态码, 错误信息]
   */
  configAuth(
    appId: string,
    themeAuthor: string,
    theme: string,
    authPubkey: string,
    permission: number,
    remark: string,
    vaccount?: string
  ): Promise<[number, Error | null]>;

  /**
   * 获取主题的授权列表
   * @param appId 应用ID
   * @param themeAuthor 主题作者的公钥
   * @param theme 主题名称
   * @param vaccount 可选的虚拟账户
   * @returns [授权列表, 错误信息]
   */
  getAuthList(
    appId: string,
    themeAuthor: string,
    theme: string,
    vaccount?: string
  ): Promise<[ThemeComment[] | null, Error | null]>;

  /**
   * 设置键值对，支持索引功能
   * @param appId 应用ID
   * @param themeAuthor 主题作者的公钥
   * @param theme 主题名称
   * @param key 键名
   * @param value 值内容
   * @param indexs 索引列表，格式为"key1:value1$$$key2:value2"
   * @param vaccount 可选的虚拟账户
   * @returns [是否设置成功, 错误信息]
   */
  setKeyValue(
    appId: string,
    themeAuthor: string,
    theme: string,
    key: string,
    value: string,
    indexs: string,
    vaccount?: string
  ): Promise<[boolean, Error | null]>;

  /**
   * 获取指定键的值
   * @param appId 应用ID
   * @param themeAuthor 主题作者的公钥
   * @param theme 主题名称
   * @param writerPubkey 写入者的公钥
   * @param key 键名
   * @param vaccount 可选的虚拟账户
   * @returns [值内容, 错误信息]
   */
  getValueWithKey(
    appId: string,
    themeAuthor: string,
    theme: string,
    writerPubkey: string,
    key: string,
    vaccount?: string
  ): Promise<[string, Error | null]>;

  /**
   * 批量获取多个键的值
   * @param appId 应用ID
   * @param themeAuthor 主题作者的公钥
   * @param theme 主题名称
   * @param writerPubkey 写入者的公钥
   * @param keys 多个键名，逗号分隔
   * @param vaccount 可选的虚拟账户
   * @returns [JSON格式值内容, 错误信息]
   */
  getValuesWithKeys(
    appId: string,
    themeAuthor: string,
    theme: string,
    writerPubkey: string,
    keys: string,
    vaccount?: string
  ): Promise<[string, Error | null]>;

  /**
   * 通过索引查询键值对
   * @param appId 应用ID
   * @param themeAuthor 主题作者的公钥
   * @param theme 主题名称
   * @param indexKey 索引键名
   * @param indexValue 索引值
   * @param seekKey 查询起始键
   * @param offset 结果偏移量
   * @param limit 返回结果数量限制
   * @param vaccount 可选的虚拟账户
   * @returns [JSON格式查询结果, 错误信息]
   */
  getValuesWithIndex(
    appId: string,
    themeAuthor: string,
    theme: string,
    indexKey: string,
    indexValue: string,
    seekKey: string,
    offset: number,
    limit: number,
    vaccount?: string
  ): Promise<[string, Error | null]>;
}
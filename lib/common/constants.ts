export enum Type {
  Filetype = 1, //文件
  Threaddbtype, //数据库
}

// cid是否需要连接节点
export const cidNeedConnect = {
  NEED: 0,
  NOT_NEED: 1,
};

// openFlag 开放标志 
export enum OpenFlag {
  PUBLIC = 0, //公开 任何人可以读写,不建议使用,评论所产生的空间使用都由创建者承担
  PRIVATE = 1,//私密 只有拥有者可以读写
  AUTH = 2, //需要对评论进行鉴权，主要用于私聊群组，或者内部共享群组，对访问主题进行权限设置，有权限的用户才能访问
  AUTH_WRITE = 3, //需要对评论进行写鉴权,任何人都可以读
  REPORTED = 4, //被举报
}


export enum AIProxyUserPermission {
  QUERY = 8, //查询
  ADMIN = 4, //管理员
}


/**
 * 主题的操作权限
 */
export enum ThemePermission {
  /** 无权限 */
  NONE = 0,
  /** 申请权限 */
  APPLY,
  /** 读权限 */
  READ,
  /** 写权限 */
  WRITE,
  /** 管理员权限 */
  ADMIN,
  /** 
   * 只写权限
   * 不允许用户修改remark或者物联网设备上报数据使用
   * 权限后面跟随分组列表,以逗号分隔
   */
  ONLY_WRITE,
  /** 物联网管理人员相关权限,具体权限后续可扩展 */
  DEVICE,
  /** 不存在 */
  NOT_EXIST,
  /** 查询权限,系统可以查询数据,用户只能查询自己的授权数据 */
  QUERY
}

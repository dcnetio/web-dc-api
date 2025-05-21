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
  PUBLIC = 0,
  PRIVATE = 1,
  AUTH = 2, //需要对评论进行鉴权，主要用于私聊群组，或者内部共享群组，对访问主题进行权限设置，有权限的用户才能访问
  AUTH_WRITE = 3, //需要对评论进行写鉴权,任何人都可以读
  REPORTED = 4, //被举报

}



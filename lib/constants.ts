export enum Type {
  Filetype = 1, //文件
  Threaddbtype, //数据库
}

// cid是否需要连接节点
export const cidNeedConnect = {
  NEED: 0,
  NOT_NEED: 1,
};

// openFlag 开放标志 0-开放 1-私密
export enum OpenFlag {
  OPEN = 0,
  PRIVATE = 1,
}
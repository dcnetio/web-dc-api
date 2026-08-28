import { Libp2pGrpcClient } from "grpc-libp2p-client";
import type { Client } from "../../common/dcapi";
import { dcnet } from "../../proto/dcnet_proto";
import { DataSource } from "../../proto/datasource";
import { Helia } from "helia";
import { unixfs } from "@helia/unixfs";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { FileManager } from "../file/manager";
import { Errors } from "../../common/error";
import { DCContext } from "../../../lib/interfaces/DCContext";
import { Libp2p } from "@libp2p/interface";

export class CommentClient {
  client: Client;
  dcNodeClient: Helia<Libp2p>;
  context: DCContext;

  constructor(
    dcClient: Client,
    dcNodeClient: Helia<Libp2p>,
    context: DCContext
  ) {
    this.client = dcClient;
    this.dcNodeClient = dcNodeClient;
    this.context = context;
  }

  async addUserOffChainSpace(
    pubkey: string,
    blockheight: number,
    peerid: string,
    signature: Uint8Array,
    vaccount?: string,
  ): Promise<boolean> {
    const message = new dcnet.pb.AddUserOffChainSpaceRequest({});
    message.userPubkey = new TextEncoder().encode(pubkey);
    message.blockheight = blockheight;
    message.peerid = new TextEncoder().encode(peerid);
    message.signature = signature;
    if (vaccount) {
      message.vaccount = new TextEncoder().encode(vaccount);
    }
    const messageBytes =
      dcnet.pb.AddUserOffChainSpaceRequest.encode(message).finish();

    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/AddUserOffChainSpace",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.AddUserOffChainSpaceReply.decode(reply);
      return true;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.context.appInfo.appId || "",
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const grpcClient = new Libp2pGrpcClient(
          this.client.p2pNode,
          this.client.peerAddr,
          this.client.token,
          this.client.protocol
        );
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/AddUserOffChainSpace",
          messageBytes,
          30000
        );
        const decoded = dcnet.pb.AddUserOffChainSpaceReply.decode(reply);
        return true;
      }
      console.warn("AddUserOffChainSpace error:", error);
      throw error;
    }
  }

  async getUserOffChainUsedInfo(
    vaccount: string = ""
  ): Promise<dcnet.pb.GetUserOffChainUsedInfoReply> {
    const message = new dcnet.pb.GetUserOffChainUsedInfoRequest({});
    message.vaccount = new TextEncoder().encode(vaccount);
    const messageBytes =
      dcnet.pb.GetUserOffChainUsedInfoRequest.encode(message).finish();
    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetUserOffChainUsedInfo",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.GetUserOffChainUsedInfoReply.decode(reply);
      return decoded;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.context.appInfo.appId || "",
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const grpcClient = new Libp2pGrpcClient(
          this.client.p2pNode,
          this.client.peerAddr,
          this.client.token,
          this.client.protocol
        );
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/GetUserOffChainUsedInfo",
          messageBytes,
          30000
        );
        const decoded = dcnet.pb.GetUserOffChainUsedInfoReply.decode(reply);
        return decoded;
      }
      throw error;
    }
  }

  async addUserOffChainOpTimes(
    pubkey: string,
    blockheight: number,
    peerid: string,
    times: number,
    signature: Uint8Array,
    vaccount: string
  ): Promise<boolean> {
    const message = new dcnet.pb.AddUserOffChainOpTimesRequest({});

    message.userPubkey = new TextEncoder().encode(pubkey);
    message.blockheight = blockheight;
    message.peerid = new TextEncoder().encode(peerid);
    message.times = times;
    message.vaccount = new TextEncoder().encode(vaccount);
    message.signature = signature;
    const messageBytes =
      dcnet.pb.AddUserOffChainOpTimesRequest.encode(message).finish();

    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/AddUserOffChainOpTimes",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.AddUserOffChainOpTimesReply.decode(reply);
      return true;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.context.appInfo.appId || "",
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const grpcClient = new Libp2pGrpcClient(
          this.client.p2pNode,
          this.client.peerAddr,
          this.client.token,
          this.client.protocol
        );
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/AddUserOffChainOpTimes",
          messageBytes,
          30000
        );
        const decoded = dcnet.pb.AddUserOffChainOpTimesReply.decode(reply);
        return true;
      }
      throw error;
    }
  }

  async addThemeObj(
    appId: string,
    theme: string,
    blockheight: number,
    commentSpace: number,
    userPubkey: string,
    openFlag: number,
    signature: Uint8Array,
    vaccount?: string,
  ): Promise<number> {
    const message = new dcnet.pb.AddThemeObjRequest({});
    message.theme = new TextEncoder().encode(theme);
    message.appId = new TextEncoder().encode(appId);
    message.blockheight = blockheight;
    message.commentSpace = commentSpace;
    message.userPubkey = new TextEncoder().encode(userPubkey);
    message.openFlag = openFlag;
    message.signature = signature;
    if (vaccount) {
      message.vaccount = new TextEncoder().encode(vaccount);
    }
    const messageBytes = dcnet.pb.AddThemeObjRequest.encode(message).finish();
    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/AddThemeObj",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.AddThemeObjReply.decode(reply);
      return decoded.flag;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          appId || "",
          userPubkey,
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const grpcClient = new Libp2pGrpcClient(
          this.client.p2pNode,
          this.client.peerAddr,
          this.client.token,
          this.client.protocol
        );
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/AddThemeObj",
          messageBytes,
          30000
        );
        const decoded = dcnet.pb.AddThemeObjReply.decode(reply);
        return decoded.flag;
      }
      throw error;
    }
  }

  async deleteThemeObj(
    appId: string,
    theme: string,
    blockheight: number,
    userPubkey: string,
    signature: Uint8Array
  ): Promise<number> {
    const message = new dcnet.pb.DeleteThemeObjRequest({});
    message.theme = new TextEncoder().encode(theme);
    message.appId = new TextEncoder().encode(appId);
    message.blockheight = blockheight;
    message.userPubkey = new TextEncoder().encode(userPubkey);
    message.signature = signature;
    const messageBytes =
      dcnet.pb.DeleteThemeObjRequest.encode(message).finish();
    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/DeleteThemeObj",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.DeleteThemeObjReply.decode(reply);
      return decoded.flag;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          appId || "",
          userPubkey,
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const grpcClient = new Libp2pGrpcClient(
          this.client.p2pNode,
          this.client.peerAddr,
          this.client.token,
          this.client.protocol
        );
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/DeleteThemeObj",
          messageBytes,
          30000
        );
        console.log("DeleteThemeObj reply", reply);
        const decoded = dcnet.pb.DeleteThemeObjReply.decode(reply);
        console.log("DeleteThemeObj decoded", decoded);
        return decoded.flag;
      }
      console.warn("DeleteThemeObj error:", error);
      throw error;
    }
  }

  async addThemeSpace(
    appId: string,
    theme: string,
    blockheight: number,
    addSpace: number,
    userPubkey: string,
    signature: Uint8Array
  ): Promise<number> {
    const message = new dcnet.pb.AddThemeSpaceRequest({});
    message.theme = new TextEncoder().encode(theme);
    message.appId = new TextEncoder().encode(appId);
    message.blockheight = blockheight;
    message.addspace = addSpace;
    message.userPubkey = new TextEncoder().encode(userPubkey);
    message.signature = signature;
    const messageBytes = dcnet.pb.AddThemeSpaceRequest.encode(message).finish();
    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/AddThemeSpace",
        messageBytes,
        30000
      );
      console.log("AddThemeSpace reply", reply);
      const decoded = dcnet.pb.AddThemeSpaceReply.decode(reply);
      console.log("AddThemeSpace decoded", decoded);
      return decoded.flag;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          appId || "",
          userPubkey,
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const grpcClient = new Libp2pGrpcClient(
          this.client.p2pNode,
          this.client.peerAddr,
          this.client.token,
          this.client.protocol
        );
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/AddThemeSpace",
          messageBytes,
          30000
        );
        console.log("AddThemeSpace reply", reply);
        const decoded = dcnet.pb.AddThemeSpaceReply.decode(reply);
        console.log("AddThemeSpace decoded", decoded);
        return decoded.flag;
      }
      console.warn("AddThemeSpace error:", error);
      throw error;
    }
  }

  async publishCommentToTheme(
    appId: string,
    theme: string,
    themeAuthor: string,
    blockheight: number,
    userPubkey: string,
    commentType: number,
    commentCid: string,
    comment: string,
    refercommentkey: string,
    signature: Uint8Array,
    openFlag?: number
  ): Promise<number> {
    const message = new dcnet.pb.PublishCommentToThemeRequest({});
    message.theme = new TextEncoder().encode(theme);
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.blockheight = blockheight;
    message.userPubkey = new TextEncoder().encode(userPubkey);
    message.type = commentType;
    message.commentCid = new TextEncoder().encode(commentCid);
    message.comment = new TextEncoder().encode(comment);
    message.commentSize = message.comment.length;
    message.refercommentkey = new TextEncoder().encode(refercommentkey);
    if (openFlag !== undefined) {
      // openFlag 表示单条评论的公开/私密状态(0公开 1私密),对应 proto 的 status 字段。
      // 注意:不要写入 message.type(评论类型 0普通/1点赞/2踩/3推荐或转发),否则会破坏评论类型。
      message.status = openFlag;
    }
    message.signature = signature;
    const messageBytes =
      dcnet.pb.PublishCommentToThemeRequest.encode(message).finish();
    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/PublishCommentToTheme",
        messageBytes,
        30000
      );
      console.log("PublishCommentToTheme reply", reply);
      const decoded = dcnet.pb.PublishCommentToThemeReply.decode(reply);
      console.log("PublishCommentToTheme decoded", decoded);
      return decoded.flag;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          appId || "",
          userPubkey,
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const grpcClient = new Libp2pGrpcClient(
          this.client.p2pNode,
          this.client.peerAddr,
          this.client.token,
          this.client.protocol
        );
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/PublishCommentToTheme",
          messageBytes,
          30000
        );
        console.log("PublishCommentToTheme reply", reply);
        const decoded = dcnet.pb.PublishCommentToThemeReply.decode(reply);
        console.log("PublishCommentToTheme decoded", decoded);
        return decoded.flag;
      }
      console.warn("PublishCommentToTheme error:", error);
      throw error;
    }
  }

  async configThemeObjAuth(
    theme: string,
    appId: string,
    themeAuthor: string,
    blockHeight: number,
    userPubkeyStr: string,
    contentCid: string,
    content: string,
    contentSize: number,
    type: number,
    signature: Uint8Array,
    vAccount?: string
  ): Promise<number> {
    const message = new dcnet.pb.ConfigThemeObjAuthRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.theme = new TextEncoder().encode(theme);
    message.blockheight = blockHeight;
    message.content = new TextEncoder().encode(content);
    message.contentCid = new TextEncoder().encode(contentCid);
    message.contentSize = contentSize;
    message.signature = signature;
    message.type = type;
    message.userPubkey = new TextEncoder().encode(userPubkeyStr);
    if (vAccount) {
      message.vaccount = new TextEncoder().encode(vAccount);
    }
    const messageBytes =
      dcnet.pb.ConfigThemeObjAuthRequest.encode(message).finish();
    const grpcClient = new Libp2pGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.client.protocol
    );
    try {
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/ConfigThemeObjAuth",
        messageBytes,
        30000
      );
      console.log("ConfigThemeObjAuth reply", reply);
      const decoded = dcnet.pb.ConfigThemeObjAuthReply.decode(reply);
      console.log("ConfigThemeObjAuth decoded", decoded);
      return decoded.flag;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          appId || "",
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/ConfigThemeObjAuth",
          messageBytes,
          30000
        );
        console.log("ConfigThemeObjAuth reply", reply);
        const decoded = dcnet.pb.GetUserCommentsReply.decode(reply);
        console.log("ConfigThemeObjAuth decoded", decoded);
        return decoded.flag;
      }
      console.warn("ConfigThemeObjAuth error:", error);
      throw error;
    }
  }

  async deleteSelfComment(
    appId: string,
    theme: string,
    themeAuthor: string,
    blockheight: number,
    userPubkey: string,
    commentCid: string,
    commentBlockHeight: number,
    signature: Uint8Array
  ): Promise<number> {
    const message = new dcnet.pb.DeleteSelfCommentRequest({});
    message.theme = new TextEncoder().encode(theme);
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.blockheight = blockheight;
    message.userPubkey = new TextEncoder().encode(userPubkey);
    message.commentCid = new TextEncoder().encode(commentCid);
    message.commentBlockheight = commentBlockHeight;
    message.signature = signature;
    const messageBytes =
      dcnet.pb.DeleteSelfCommentRequest.encode(message).finish();
    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/DeleteSelfComment",
        messageBytes,
        30000
      );
      console.log("DeleteSelfComment reply", reply);
      const decoded = dcnet.pb.DeleteSelfCommentReply.decode(reply);
      console.log("DeleteSelfComment decoded", decoded);
      return decoded.flag;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          appId || "",
          userPubkey,
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const grpcClient = new Libp2pGrpcClient(
          this.client.p2pNode,
          this.client.peerAddr,
          this.client.token,
          this.client.protocol
        );
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/DeleteSelfComment",
          messageBytes,
          30000
        );
        console.log("DeleteSelfComment reply", reply);
        const decoded = dcnet.pb.DeleteSelfCommentReply.decode(reply);
        console.log("DeleteSelfComment decoded", decoded);
        return decoded.flag;
      }
      console.warn("DeleteSelfComment error:", error);
      throw error;
    }
  }

  async deleteCommentToObj(
    appId: string,
    theme: string,
    themeAuthor: string,
    blockheight: number,
    userPubkey: string,
    commentCid: string,
    commentBlockHeight: number,
    signature: Uint8Array
  ): Promise<number> {
    const message = new dcnet.pb.DeleteCommentToObjRequest({});
    message.theme = new TextEncoder().encode(theme);
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.blockheight = blockheight;
    message.userPubkey = new TextEncoder().encode(userPubkey);
    message.commentCid = new TextEncoder().encode(commentCid);
    message.commentBlockheight = commentBlockHeight;
    message.signature = signature;
    const messageBytes =
      dcnet.pb.DeleteCommentToObjRequest.encode(message).finish();
    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/DeleteCommentToObj",
        messageBytes,
        30000
      );
      console.log("DeleteCommentToObj reply", reply);
      const decoded = dcnet.pb.DeleteCommentToObjReply.decode(reply);
      console.log("DeleteCommentToObj decoded", decoded);
      return decoded.flag;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          appId || "",
          userPubkey,
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const grpcClient = new Libp2pGrpcClient(
          this.client.p2pNode,
          this.client.peerAddr,
          this.client.token,
          this.client.protocol
        );
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/DeleteCommentToObj",
          messageBytes,
          30000
        );
        console.log("DeleteCommentToObj reply", reply);
        const decoded = dcnet.pb.DeleteCommentToObjReply.decode(reply);
        console.log("DeleteCommentToObj decoded", decoded);
        return decoded.flag;
      }
      console.warn("DeleteSelfComment error:", error);
      throw error;
    }
  }

  async setObjCommentPublic(
    appId: string,
    theme: string,
    themeAuthor: string,
    blockheight: number,
    userPubkey: string,
    commentCid: string,
    commentBlockHeight: number,
    signature: Uint8Array
  ): Promise<number> {
    const message = new dcnet.pb.SetObjCommentPublicRequest({});
    message.theme = new TextEncoder().encode(theme);
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.blockheight = blockheight;
    message.commentBlockheight = commentBlockHeight;
    message.commentCid = new TextEncoder().encode(commentCid);
    message.signature = signature;
    const messageBytes =
      dcnet.pb.SetObjCommentPublicRequest.encode(message).finish();
    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/SetObjCommentPublic",
        messageBytes,
        30000
      );
      console.log("SetObjCommentPublic reply", reply);
      const decoded = dcnet.pb.SetObjCommentPublicReply.decode(reply);
      console.log("SetObjCommentPublic decoded", decoded);
      return decoded.flag;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          appId || "",
          userPubkey,
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const grpcClient = new Libp2pGrpcClient(
          this.client.p2pNode,
          this.client.peerAddr,
          this.client.token,
          this.client.protocol
        );
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/SetObjCommentPublic",
          messageBytes,
          30000
        );
        console.log("SetObjCommentPublic reply", reply);
        const decoded = dcnet.pb.SetObjCommentPublicReply.decode(reply);
        console.log("SetObjCommentPublic decoded", decoded);
        return decoded.flag;
      }
      console.warn("SetObjCommentPublic error:", error);
      throw error;
    }
  }

  //判断主题是否存在
  async isThemeExist(
    appId: string,
    theme: string,
    themeAuthor: string,
    signal?: AbortSignal,
  ): Promise<boolean> {
    const message = new dcnet.pb.IsThemeExistRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.theme = new TextEncoder().encode(theme);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    const messageBytes = dcnet.pb.IsThemeExistRequest.encode(message).finish();

    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/IsThemeExist",
        messageBytes,
        30000,
        signal,
      );
      // console.log("IsThemeExist reply", reply);
      const decoded = dcnet.pb.IsThemeExistReply.decode(reply);
      // console.log("IsThemeExist decoded", decoded);
      if (decoded.flag == 0) {
        return true;
      }
      return false;
    } catch (error: any) {
      console.warn("IsThemeExist error:", error);
      throw error;
    }
  }

  async getThemeObj(
    appId: string,
    themeAuthor: string,
    startHeight: number,
    direction: number,
    offset: number,
    limit: number,
    seekKey: string
  ): Promise<string> {
    const message = new dcnet.pb.GetThemeObjRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.startHeight = startHeight;
    message.direction = direction;
    message.offset = offset;
    message.limit = limit;
    message.seekKey = new TextEncoder().encode(seekKey);
    message.returnData = true;
    const messageBytes = dcnet.pb.GetThemeObjRequest.encode(message).finish();

    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetThemeObj",
        messageBytes,
        30000
      );
      console.log("GetThemeObj reply", reply);
      const decoded = dcnet.pb.GetThemeObjReply.decode(reply);
      console.log("GetThemeObj decoded", decoded);
      console.log("GetThemeObj decoded.toJSON()", decoded.toJSON());
      const objsData = decoded.objsData
        ? uint8ArrayToString(decoded.objsData)
        : "";
      return objsData;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          appId || "",
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const grpcClient = new Libp2pGrpcClient(
          this.client.p2pNode,
          this.client.peerAddr,
          this.client.token,
          this.client.protocol
        );
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/GetThemeObj",
          messageBytes,
          30000
        );
        console.log("GetThemeObj reply", reply);
        const decoded = dcnet.pb.GetThemeObjReply.decode(reply);
        console.log("GetThemeObj decoded", decoded);
        console.log("GetThemeObj decoded.toJSON()", decoded.toJSON());
        const objsData = decoded.objsData
          ? uint8ArrayToString(decoded.objsData)
          : "";
        return objsData;
      }
      console.warn("GetThemeObj error:", error);
      throw error;
    }
  }

  async getThemeComments(
    appId: string,
    theme: string,
    themeAuthor: string,
    startHeight: number,
    direction: number,
    offset: number,
    limit: number,
    seekKey: string,
    aesKey: string,
    vaccount?: string
  ): Promise<string> {
    const message = new dcnet.pb.GetThemeCommentsRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.theme = new TextEncoder().encode(theme);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.startHeight = startHeight;
    message.direction = direction;
    message.offset = offset;
    message.limit = limit;
    message.seekKey = new TextEncoder().encode(seekKey);
    message.aesKey = new TextEncoder().encode(aesKey);
    message.returnCommentsData = true;
    if (vaccount) {
      message.vaccount = new TextEncoder().encode(vaccount);
    }
    const messageBytes =
      dcnet.pb.GetThemeCommentsRequest.encode(message).finish();
    try {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetThemeComments",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.GetThemeCommentsReply.decode(reply);
      const commentsData = decoded.commentsData
        ? uint8ArrayToString(decoded.commentsData)
        : "";
      return commentsData;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          appId || "",
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const grpcClient = new Libp2pGrpcClient(
          this.client.p2pNode,
          this.client.peerAddr,
          this.client.token,
          this.client.protocol
        );
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/GetThemeComments",
          messageBytes,
          30000
        );
        const decoded = dcnet.pb.GetThemeCommentsReply.decode(reply);
        const commentsData = decoded.commentsData
          ? uint8ArrayToString(decoded.commentsData)
          : "";
        return commentsData;
      }
      console.warn("GetThemeComments error:", error);
      throw error;
    }
  }

  async getThemeAuthList(
    appId: string,
    theme: string,
    themeAuthor: string,
    startHeight: number,
    direction: number,
    offset: number,
    limit: number,
    seekKey: string,
    vaccount?: string
  ): Promise<[string, number, string]> {
    const message = new dcnet.pb.GetThemeAuthListRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.theme = new TextEncoder().encode(theme);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.startHeight = startHeight;
    message.direction = direction;
    message.offset = offset;
    message.limit = limit;
    message.seekKey = new TextEncoder().encode(seekKey);
    message.returnData = true;
    if (vaccount) {
      message.vaccount = new TextEncoder().encode(vaccount);
    }
    const messageBytes =
      dcnet.pb.GetThemeAuthListRequest.encode(message).finish();
    const decodeReply = (reply: Uint8Array): [string, number, string] => {
      const decoded = dcnet.pb.GetThemeAuthListReply.decode(reply);
      const authListData = decoded.authListData
        ? uint8ArrayToString(decoded.authListData)
        : "";
      const userCount = decoded.userCount ? Number(decoded.userCount) : 0;
      const nextSeekKey = decoded.nextSeekKey
        ? uint8ArrayToString(decoded.nextSeekKey)
        : "";
      return [authListData, userCount, nextSeekKey];
    };
    const callRpc = () => {
      const grpcClient = new Libp2pGrpcClient(
        this.client.p2pNode,
        this.client.peerAddr,
        this.client.token,
        this.client.protocol
      );
      return grpcClient.unaryCall(
        "/dcnet.pb.Service/GetThemeAuthList",
        messageBytes,
        30000
      );
    };
    try {
      return decodeReply(await callRpc());
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        const token = await this.client.GetToken(
          appId || "",
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        return decodeReply(await callRpc());
      }
      console.warn("GetThemeAuthList error:", error);
      throw error;
    }
  }

  async getUserComments(
    appId: string,
    userPubkey: string,
    startHeight: number,
    direction: number,
    offset: number,
    limit: number,
    seekKey: string,
    aesKey: string
  ): Promise<string> {
    const message = new dcnet.pb.GetUserCommentsRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.UserPubkey = new TextEncoder().encode(userPubkey);
    message.startHeight = startHeight;
    message.direction = direction;
    message.offset = offset;
    message.limit = limit;
    message.seekKey = new TextEncoder().encode(seekKey);
    message.aesKey = new TextEncoder().encode(aesKey);
    message.returnData = true;
    const messageBytes =
      dcnet.pb.GetUserCommentsRequest.encode(message).finish();
    const grpcClient = new Libp2pGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.client.protocol
    );
    try {
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetUserComments",
        messageBytes,
        30000
      );
      console.log("GetUserComments reply", reply);
      const decoded = dcnet.pb.GetUserCommentsReply.decode(reply);
      console.log("GetUserComments decoded", decoded);
      console.log("GetUserComments decoded.toJSON()", decoded.toJSON());
      const commentsData = decoded.commentsData
        ? uint8ArrayToString(decoded.commentsData)
        : "";
      return commentsData;
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
          this.context.appInfo.appId || "",
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/GetUserComments",
          messageBytes,
          30000
        );
        console.log("GetUserComments reply", reply);
        const decoded = dcnet.pb.GetUserCommentsReply.decode(reply);
        console.log("GetUserComments decoded", decoded);
        console.log("GetUserComments decoded.toJSON()", decoded.toJSON());
        const commentsData = decoded.commentsData
          ? uint8ArrayToString(decoded.commentsData)
          : "";
        return commentsData;
      }
      console.warn("GetUserComments error:", error);
      throw error;
    }
  }

  async getAuthListUserCount(
    appId: string,
    themeAuthor: string,
    theme: string,
    vaccount?: string
  ): Promise<[number, Error | null]> {
    const message = new dcnet.pb.GetAuthListUserCountRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.theme = new TextEncoder().encode(theme);
    if (vaccount) {
      message.vaccount = new TextEncoder().encode(vaccount);
    }
    const messageBytes = dcnet.pb.GetAuthListUserCountRequest.encode(message).finish();
    const grpcClient = new Libp2pGrpcClient(
      this.client.p2pNode,
      this.client.peerAddr,
      this.client.token,
      this.client.protocol
    );
    try {
      const reply = await grpcClient.unaryCall(
        "/dcnet.pb.Service/GetAuthListUserCount",
        messageBytes,
        30000
      );
      const decoded = dcnet.pb.GetAuthListUserCountReply.decode(reply);
      if (decoded.flag == 0) {
        return [decoded.count as number, null];
      }
      return [0, new Error("GetAuthListUserCount failed, flag: " + decoded.flag)];
    } catch (error: any) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        const token = await this.client.GetToken(
          appId,
          this.context.getPublicKey().string(),
          (payload: Uint8Array): Promise<Uint8Array> => {
            return this.context.sign(payload);
          }
        );
        if (!token) {
          throw new Error(Errors.INVALID_TOKEN.message);
        }
        const reply = await grpcClient.unaryCall(
          "/dcnet.pb.Service/GetAuthListUserCount",
          messageBytes,
          30000
        );
        const decoded = dcnet.pb.GetAuthListUserCountReply.decode(reply);
        if (decoded.flag == 0) {
          return [decoded.count as number, null];
        }
        return [0, new Error("GetAuthListUserCount failed, flag: " + decoded.flag)];
      }
      console.warn("GetAuthListUserCount error:", error);
      throw error;
    }
  }
}

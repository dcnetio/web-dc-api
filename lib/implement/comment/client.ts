import { Libp2pGrpcClient } from "grpc-libp2p-client";
import type { Client } from "../../dcapi";
import { dcnet } from "../../proto/dcnet_proto";
import { DataSource } from "../../proto/datasource";
import { HeliaLibp2p } from "helia";
import { unixfs } from "@helia/unixfs";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { FileManager } from "../file/manager";
import { Errors } from "../../error";
import { DCContext } from "../../interfaces";

export class CommentClient {
  client: Client;
  dcNodeClient: HeliaLibp2p;
  context:DCContext

  constructor(
    dcClient: Client,
    dcNodeClient: HeliaLibp2p,
    context:DCContext
  ) {
    this.client = dcClient;
    this.dcNodeClient = dcNodeClient;
    this.context = context;
  }

  async addUserOffChainSpace(
    pubkey: string,
    blockheight: number,
    peerid: string,
    signature: Uint8Array
  ): Promise<boolean> {
    console.log("AddUserOffChainSpace2 pubkey", pubkey);
    console.log("AddUserOffChainSpace2 blockheight", blockheight);
    console.log("AddUserOffChainSpace2 peerid", peerid);
    console.log("AddUserOffChainSpace2 signature", signature);
    const message = new dcnet.pb.AddUserOffChainSpaceRequest({});
    message.userPubkey = new TextEncoder().encode(pubkey);
    message.blockheight = blockheight;
    message.peerid = new TextEncoder().encode(peerid);
    message.signature = signature;
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
      console.log("AddUserOffChainSpace2 reply", reply);
      const decoded = dcnet.pb.AddUserOffChainSpaceReply.decode(reply);
      console.log("AddUserOffChainSpace2 decoded", decoded);
      return true;
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
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
        console.log("AddUserOffChainSpace2 reply", reply);
        const decoded = dcnet.pb.AddUserOffChainSpaceReply.decode(reply);
        console.log("AddUserOffChainSpace2 decoded", decoded);
        return true;
      }
      console.error("AddUserOffChainSpace error:", error);
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
    signature: Uint8Array
  ) {
    const message = new dcnet.pb.AddThemeObjRequest({});
    message.theme = new TextEncoder().encode(theme);
    message.appId = new TextEncoder().encode(appId);
    message.blockheight = blockheight;
    message.commentSpace = commentSpace;
    message.userPubkey = new TextEncoder().encode(userPubkey);
    message.openFlag = openFlag;
    message.signature = signature;
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
      console.log("AddThemeObj reply", reply);
      const decoded = dcnet.pb.AddThemeObjReply.decode(reply);
      console.log("AddThemeObj decoded", decoded);
      return decoded.flag;
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
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
        console.log("AddThemeObj reply", reply);
        const decoded = dcnet.pb.AddThemeObjReply.decode(reply);
        console.log("AddThemeObj decoded", decoded);
        return decoded.flag;
      }
      console.error("AddThemeObj error:", error);
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
  ) {
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
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
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
      console.error("AddThemeSpace error:", error);
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
  ) {
    const message = new dcnet.pb.PublishCommentToThemeRequest({});
    message.theme = new TextEncoder().encode(theme);
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.blockheight = blockheight;
    message.userPubkey = new TextEncoder().encode(userPubkey);
    message.type = commentType;
    message.commentCid = new TextEncoder().encode(commentCid);
    message.comment = new TextEncoder().encode(comment);
    message.commentSize = comment.length;
    message.refercommentkey = new TextEncoder().encode(refercommentkey);
    if (openFlag !== undefined) {
      message.type = openFlag;
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
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
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
      console.error("PublishCommentToTheme error:", error);
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
  ) {
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
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
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
      console.error("DeleteSelfComment error:", error);
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
  ) {
    const message = new dcnet.pb.GetThemeObjRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.startHeight = startHeight;
    message.direction = direction;
    message.offset = offset;
    message.limit = limit;
    message.seekKey = new TextEncoder().encode(seekKey);
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
      const objsCid = decoded.objsCid
        ? uint8ArrayToString(decoded.objsCid)
        : "";
      return objsCid;
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
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
        const objsCid = decoded.objsCid
          ? uint8ArrayToString(decoded.objsCid)
          : "";
        return objsCid;
      }
      console.error("GetThemeObj error:", error);
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
    vaccount?: string
  ) {
    const message = new dcnet.pb.GetThemeCommentsRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.theme = new TextEncoder().encode(theme);
    message.themeAuthor = new TextEncoder().encode(themeAuthor);
    message.startHeight = startHeight;
    message.direction = direction;
    message.offset = offset;
    message.limit = limit;
    message.seekKey = new TextEncoder().encode(seekKey);
    // if(vaccount){ // todo 没有vaccount
    //   message.vaccount = new TextEncoder().encode(vaccount);
    // }
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
      console.log("GetThemeComments reply", reply);
      const decoded = dcnet.pb.GetThemeCommentsReply.decode(reply);
      console.log("GetThemeComments decoded", decoded);
      console.log("GetThemeComments decoded.toJSON()", decoded.toJSON());
      const commentsCid = decoded.commentsCid
        ? uint8ArrayToString(decoded.commentsCid)
        : "";
      return commentsCid;
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
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
        console.log("GetThemeComments reply", reply);
        const decoded = dcnet.pb.GetThemeCommentsReply.decode(reply);
        console.log("GetThemeComments decoded", decoded);
        console.log("GetThemeComments decoded.toJSON()", decoded.toJSON());
        const commentsCid = decoded.commentsCid
          ? uint8ArrayToString(decoded.commentsCid)
          : "";
        return commentsCid;
      }
      console.error("GetThemeComments error:", error);
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
    seekKey: string
  ) {
    const message = new dcnet.pb.GetUserCommentsRequest({});
    message.appId = new TextEncoder().encode(appId);
    message.UserPubkey = new TextEncoder().encode(userPubkey);
    message.startHeight = startHeight;
    message.direction = direction;
    message.offset = offset;
    message.limit = limit;
    message.seekKey = new TextEncoder().encode(seekKey);
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
      const commentsCid = decoded.commentsCid
        ? uint8ArrayToString(decoded.commentsCid)
        : "";
      return commentsCid;
    } catch (error) {
      if (error.message.indexOf(Errors.INVALID_TOKEN.message) != -1) {
        // try to get token
        const token = await this.client.GetToken(
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
        const commentsCid = decoded.commentsCid
          ? uint8ArrayToString(decoded.commentsCid)
          : "";
        return commentsCid;
      }
      console.error("GetUserComments error:", error);
      throw error;
    }
  }
}

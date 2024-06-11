// source: dcnet.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

// var jspb = require('google-protobuf')
import * as jspb from 'google-protobuf'
var goog = jspb
var global = function () {
  return this || window || global || self || Function('return this')()
}.call(null)

goog.exportSymbol('proto.dcnet.pb.AccountDealBackupReply', null, global)
goog.exportSymbol('proto.dcnet.pb.AccountDealBackupRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.AccountDealReply', null, global)
goog.exportSymbol('proto.dcnet.pb.AccountDealRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.AccountInfoSyncReply', null, global)
goog.exportSymbol('proto.dcnet.pb.AccountInfoSyncRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.AccountLoginReply', null, global)
goog.exportSymbol('proto.dcnet.pb.AccountLoginRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.AddCommentableObjReply', null, global)
goog.exportSymbol('proto.dcnet.pb.AddCommentableObjRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.AddLogToThreadReply', null, global)
goog.exportSymbol('proto.dcnet.pb.AddLogToThreadRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.AddObjCommentSpaceReply', null, global)
goog.exportSymbol('proto.dcnet.pb.AddObjCommentSpaceRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.AddSubPubkeyReply', null, global)
goog.exportSymbol('proto.dcnet.pb.AddSubPubkeyRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.AddThreadSpaceReply', null, global)
goog.exportSymbol('proto.dcnet.pb.AddThreadSpaceRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.AddThreadToPeerReply', null, global)
goog.exportSymbol('proto.dcnet.pb.AddThreadToPeerRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.AddUserOffChainSpaceReply', null, global)
goog.exportSymbol('proto.dcnet.pb.AddUserOffChainSpaceRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.BindAccessPeerToUserReply', null, global)
goog.exportSymbol('proto.dcnet.pb.BindAccessPeerToUserRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.CheckPeerStatusReply', null, global)
goog.exportSymbol('proto.dcnet.pb.CheckPeerStatusReply.Body', null, global)
goog.exportSymbol('proto.dcnet.pb.CheckPeerStatusReply.PayloadCase', null, global)
goog.exportSymbol('proto.dcnet.pb.CheckPeerStatusRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.CheckPeerStatusRequest.PayloadCase', null, global)
goog.exportSymbol('proto.dcnet.pb.CheckPeerStatusRequest.Sreq', null, global)
goog.exportSymbol('proto.dcnet.pb.CommentFunOpt', null, global)
goog.exportSymbol('proto.dcnet.pb.CreateThreadRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.DeleteCommentToObjReply', null, global)
goog.exportSymbol('proto.dcnet.pb.DeleteCommentToObjRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.DeleteCommentableObjReply', null, global)
goog.exportSymbol('proto.dcnet.pb.DeleteCommentableObjRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.DeleteFileReply', null, global)
goog.exportSymbol('proto.dcnet.pb.DeleteFileRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.DeleteSelfCommentReply', null, global)
goog.exportSymbol('proto.dcnet.pb.DeleteSelfCommentRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.DeleteSubPubkeyReply', null, global)
goog.exportSymbol('proto.dcnet.pb.DeleteSubPubkeyRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.DeleteThreadReply', null, global)
goog.exportSymbol('proto.dcnet.pb.DeleteThreadRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.DownloadUserCommentsReply', null, global)
goog.exportSymbol('proto.dcnet.pb.DownloadUserCommentsRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.ExchangeCommentEdgesReply', null, global)
goog.exportSymbol('proto.dcnet.pb.ExchangeCommentEdgesRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetCacheValueReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetCacheValueRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetCommentableObjReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetCommentableObjRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetEncryptKeyReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetEncryptKeyRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetEncryptKeyWithScanReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetEncryptKeyWithScanRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetHostIDReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetHostIDRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetMsgFromUserBoxReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetMsgFromUserBoxRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetObjCommentSpaceReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetObjCommentSpaceRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetObjCommentsReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetObjCommentsRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetPeersWithAccountHashReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetPeersWithAccountHashRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetPeersWithSidReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetPeersWithSidRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetThreadRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetThreadUsedSpaceReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetThreadUsedSpaceRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetToUserBoxAuthReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetToUserBoxAuthRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetTokenReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetTokenReply.PayloadCase', null, global)
goog.exportSymbol('proto.dcnet.pb.GetTokenRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetTokenRequest.PayloadCase', null, global)
goog.exportSymbol('proto.dcnet.pb.GetUserClientPeersReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetUserClientPeersRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.GetUserCommentsReply', null, global)
goog.exportSymbol('proto.dcnet.pb.GetUserCommentsRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.Keys', null, global)
goog.exportSymbol('proto.dcnet.pb.LocalAccountInfoCheckReply', null, global)
goog.exportSymbol('proto.dcnet.pb.LocalAccountInfoCheckRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.LocalFileCheckReply', null, global)
goog.exportSymbol('proto.dcnet.pb.LocalFileCheckRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.LogInfo', null, global)
goog.exportSymbol('proto.dcnet.pb.OnlineStatusCheckReply', null, global)
goog.exportSymbol('proto.dcnet.pb.OnlineStatusCheckRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.PublishCommentToObjReply', null, global)
goog.exportSymbol('proto.dcnet.pb.PublishCommentToObjRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.PullCommentFunOptsReply', null, global)
goog.exportSymbol('proto.dcnet.pb.PullCommentFunOptsRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.PushCommentFunOptReply', null, global)
goog.exportSymbol('proto.dcnet.pb.PushCommentFunOptRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.ReportMaliciousCommentReply', null, global)
goog.exportSymbol('proto.dcnet.pb.ReportMaliciousCommentRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.ReportSpamMsgReply', null, global)
goog.exportSymbol('proto.dcnet.pb.ReportSpamMsgRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.RequestRandEncryptKeyReply', null, global)
goog.exportSymbol('proto.dcnet.pb.RequestRandEncryptKeyRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.SendMsgToUserBoxReply', null, global)
goog.exportSymbol('proto.dcnet.pb.SendMsgToUserBoxRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.SetCacheKeyReply', null, global)
goog.exportSymbol('proto.dcnet.pb.SetCacheKeyRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.SetEncryptKeyWithScanReply', null, global)
goog.exportSymbol('proto.dcnet.pb.SetEncryptKeyWithScanRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.SetObjCommentPublicReply', null, global)
goog.exportSymbol('proto.dcnet.pb.SetObjCommentPublicRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.SetUserDefaultDBReply', null, global)
goog.exportSymbol('proto.dcnet.pb.SetUserDefaultDBRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.StoreFolderReply', null, global)
goog.exportSymbol('proto.dcnet.pb.StoreFolderRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.StoreThreadReply', null, global)
goog.exportSymbol('proto.dcnet.pb.StoreThreadRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.StroeFileReply', null, global)
goog.exportSymbol('proto.dcnet.pb.StroeFileRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.StroeFileToPeerReply', null, global)
goog.exportSymbol('proto.dcnet.pb.StroeFileToPeerRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.TeeReportVerifyReply', null, global)
goog.exportSymbol('proto.dcnet.pb.TeeReportVerifyRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.ThreadIDReply', null, global)
goog.exportSymbol('proto.dcnet.pb.ThreadIDRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.ThreadInfoReply', null, global)
goog.exportSymbol('proto.dcnet.pb.TransferAccountReply', null, global)
goog.exportSymbol('proto.dcnet.pb.TransferAccountRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.UserCommentSeqEdge', null, global)
goog.exportSymbol('proto.dcnet.pb.UserCommentsDownloadReadyReply', null, global)
goog.exportSymbol('proto.dcnet.pb.UserCommentsDownloadReadyRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.UserMsg', null, global)
goog.exportSymbol('proto.dcnet.pb.ValidTokenReply', null, global)
goog.exportSymbol('proto.dcnet.pb.ValidTokenRequest', null, global)
goog.exportSymbol('proto.dcnet.pb.peerSeqno', null, global)
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.StoreThreadRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.StoreThreadRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.StoreThreadRequest.displayName = 'proto.dcnet.pb.StoreThreadRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.StoreThreadReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.StoreThreadReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.StoreThreadReply.displayName = 'proto.dcnet.pb.StoreThreadReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.StroeFileToPeerRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.StroeFileToPeerRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.StroeFileToPeerRequest.displayName = 'proto.dcnet.pb.StroeFileToPeerRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.StroeFileToPeerReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.StroeFileToPeerReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.StroeFileToPeerReply.displayName = 'proto.dcnet.pb.StroeFileToPeerReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.OnlineStatusCheckRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.OnlineStatusCheckRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.OnlineStatusCheckRequest.displayName = 'proto.dcnet.pb.OnlineStatusCheckRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.OnlineStatusCheckReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.OnlineStatusCheckReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.OnlineStatusCheckReply.displayName = 'proto.dcnet.pb.OnlineStatusCheckReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.CheckPeerStatusRequest = function (opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    null,
    proto.dcnet.pb.CheckPeerStatusRequest.oneofGroups_
  )
}
goog.inherits(proto.dcnet.pb.CheckPeerStatusRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.CheckPeerStatusRequest.displayName = 'proto.dcnet.pb.CheckPeerStatusRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.CheckPeerStatusRequest.Sreq = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.CheckPeerStatusRequest.Sreq, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.CheckPeerStatusRequest.Sreq.displayName =
    'proto.dcnet.pb.CheckPeerStatusRequest.Sreq'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.CheckPeerStatusReply = function (opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    null,
    proto.dcnet.pb.CheckPeerStatusReply.oneofGroups_
  )
}
goog.inherits(proto.dcnet.pb.CheckPeerStatusReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.CheckPeerStatusReply.displayName = 'proto.dcnet.pb.CheckPeerStatusReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.CheckPeerStatusReply.Body = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.CheckPeerStatusReply.Body, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.CheckPeerStatusReply.Body.displayName = 'proto.dcnet.pb.CheckPeerStatusReply.Body'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.LocalFileCheckRequest = function (opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    proto.dcnet.pb.LocalFileCheckRequest.repeatedFields_,
    null
  )
}
goog.inherits(proto.dcnet.pb.LocalFileCheckRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.LocalFileCheckRequest.displayName = 'proto.dcnet.pb.LocalFileCheckRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.LocalFileCheckReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.LocalFileCheckReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.LocalFileCheckReply.displayName = 'proto.dcnet.pb.LocalFileCheckReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.LocalAccountInfoCheckRequest = function (opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    proto.dcnet.pb.LocalAccountInfoCheckRequest.repeatedFields_,
    null
  )
}
goog.inherits(proto.dcnet.pb.LocalAccountInfoCheckRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.LocalAccountInfoCheckRequest.displayName =
    'proto.dcnet.pb.LocalAccountInfoCheckRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.LocalAccountInfoCheckReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.LocalAccountInfoCheckReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.LocalAccountInfoCheckReply.displayName =
    'proto.dcnet.pb.LocalAccountInfoCheckReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AccountInfoSyncRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AccountInfoSyncRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AccountInfoSyncRequest.displayName = 'proto.dcnet.pb.AccountInfoSyncRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AccountInfoSyncReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AccountInfoSyncReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AccountInfoSyncReply.displayName = 'proto.dcnet.pb.AccountInfoSyncReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.SetEncryptKeyWithScanRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.SetEncryptKeyWithScanRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.SetEncryptKeyWithScanRequest.displayName =
    'proto.dcnet.pb.SetEncryptKeyWithScanRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.SetEncryptKeyWithScanReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.SetEncryptKeyWithScanReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.SetEncryptKeyWithScanReply.displayName =
    'proto.dcnet.pb.SetEncryptKeyWithScanReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetEncryptKeyWithScanRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetEncryptKeyWithScanRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetEncryptKeyWithScanRequest.displayName =
    'proto.dcnet.pb.GetEncryptKeyWithScanRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetEncryptKeyWithScanReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetEncryptKeyWithScanReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetEncryptKeyWithScanReply.displayName =
    'proto.dcnet.pb.GetEncryptKeyWithScanReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.RequestRandEncryptKeyRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.RequestRandEncryptKeyRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.RequestRandEncryptKeyRequest.displayName =
    'proto.dcnet.pb.RequestRandEncryptKeyRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.RequestRandEncryptKeyReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.RequestRandEncryptKeyReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.RequestRandEncryptKeyReply.displayName =
    'proto.dcnet.pb.RequestRandEncryptKeyReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetEncryptKeyRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetEncryptKeyRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetEncryptKeyRequest.displayName = 'proto.dcnet.pb.GetEncryptKeyRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetEncryptKeyReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetEncryptKeyReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetEncryptKeyReply.displayName = 'proto.dcnet.pb.GetEncryptKeyReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetPeersWithSidRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetPeersWithSidRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetPeersWithSidRequest.displayName = 'proto.dcnet.pb.GetPeersWithSidRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetPeersWithSidReply = function (opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    proto.dcnet.pb.GetPeersWithSidReply.repeatedFields_,
    null
  )
}
goog.inherits(proto.dcnet.pb.GetPeersWithSidReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetPeersWithSidReply.displayName = 'proto.dcnet.pb.GetPeersWithSidReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetPeersWithAccountHashRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetPeersWithAccountHashRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetPeersWithAccountHashRequest.displayName =
    'proto.dcnet.pb.GetPeersWithAccountHashRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetPeersWithAccountHashReply = function (opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    proto.dcnet.pb.GetPeersWithAccountHashReply.repeatedFields_,
    null
  )
}
goog.inherits(proto.dcnet.pb.GetPeersWithAccountHashReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetPeersWithAccountHashReply.displayName =
    'proto.dcnet.pb.GetPeersWithAccountHashReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AccountDealBackupRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AccountDealBackupRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AccountDealBackupRequest.displayName = 'proto.dcnet.pb.AccountDealBackupRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AccountDealBackupReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AccountDealBackupReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AccountDealBackupReply.displayName = 'proto.dcnet.pb.AccountDealBackupReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetHostIDRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetHostIDRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetHostIDRequest.displayName = 'proto.dcnet.pb.GetHostIDRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetHostIDReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetHostIDReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetHostIDReply.displayName = 'proto.dcnet.pb.GetHostIDReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetTokenRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.dcnet.pb.GetTokenRequest.oneofGroups_)
}
goog.inherits(proto.dcnet.pb.GetTokenRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetTokenRequest.displayName = 'proto.dcnet.pb.GetTokenRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetTokenReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.dcnet.pb.GetTokenReply.oneofGroups_)
}
goog.inherits(proto.dcnet.pb.GetTokenReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetTokenReply.displayName = 'proto.dcnet.pb.GetTokenReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.CreateThreadRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.CreateThreadRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.CreateThreadRequest.displayName = 'proto.dcnet.pb.CreateThreadRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.Keys = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.Keys, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.Keys.displayName = 'proto.dcnet.pb.Keys'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.ThreadInfoReply = function (opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    proto.dcnet.pb.ThreadInfoReply.repeatedFields_,
    null
  )
}
goog.inherits(proto.dcnet.pb.ThreadInfoReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.ThreadInfoReply.displayName = 'proto.dcnet.pb.ThreadInfoReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.LogInfo = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dcnet.pb.LogInfo.repeatedFields_, null)
}
goog.inherits(proto.dcnet.pb.LogInfo, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.LogInfo.displayName = 'proto.dcnet.pb.LogInfo'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.ThreadIDRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.ThreadIDRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.ThreadIDRequest.displayName = 'proto.dcnet.pb.ThreadIDRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.ThreadIDReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.ThreadIDReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.ThreadIDReply.displayName = 'proto.dcnet.pb.ThreadIDReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AddThreadToPeerRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AddThreadToPeerRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AddThreadToPeerRequest.displayName = 'proto.dcnet.pb.AddThreadToPeerRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AddThreadToPeerReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AddThreadToPeerReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AddThreadToPeerReply.displayName = 'proto.dcnet.pb.AddThreadToPeerReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetThreadRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetThreadRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetThreadRequest.displayName = 'proto.dcnet.pb.GetThreadRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.DeleteThreadRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.DeleteThreadRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.DeleteThreadRequest.displayName = 'proto.dcnet.pb.DeleteThreadRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.DeleteThreadReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.DeleteThreadReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.DeleteThreadReply.displayName = 'proto.dcnet.pb.DeleteThreadReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.StroeFileRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.StroeFileRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.StroeFileRequest.displayName = 'proto.dcnet.pb.StroeFileRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.StroeFileReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.StroeFileReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.StroeFileReply.displayName = 'proto.dcnet.pb.StroeFileReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.DeleteFileRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.DeleteFileRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.DeleteFileRequest.displayName = 'proto.dcnet.pb.DeleteFileRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.DeleteFileReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.DeleteFileReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.DeleteFileReply.displayName = 'proto.dcnet.pb.DeleteFileReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.StoreFolderRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.StoreFolderRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.StoreFolderRequest.displayName = 'proto.dcnet.pb.StoreFolderRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.StoreFolderReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.StoreFolderReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.StoreFolderReply.displayName = 'proto.dcnet.pb.StoreFolderReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AccountDealRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AccountDealRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AccountDealRequest.displayName = 'proto.dcnet.pb.AccountDealRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AccountDealReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AccountDealReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AccountDealReply.displayName = 'proto.dcnet.pb.AccountDealReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AccountLoginRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AccountLoginRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AccountLoginRequest.displayName = 'proto.dcnet.pb.AccountLoginRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AccountLoginReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AccountLoginReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AccountLoginReply.displayName = 'proto.dcnet.pb.AccountLoginReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.TransferAccountRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.TransferAccountRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.TransferAccountRequest.displayName = 'proto.dcnet.pb.TransferAccountRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.TransferAccountReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.TransferAccountReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.TransferAccountReply.displayName = 'proto.dcnet.pb.TransferAccountReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.SetUserDefaultDBRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.SetUserDefaultDBRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.SetUserDefaultDBRequest.displayName = 'proto.dcnet.pb.SetUserDefaultDBRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.SetUserDefaultDBReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.SetUserDefaultDBReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.SetUserDefaultDBReply.displayName = 'proto.dcnet.pb.SetUserDefaultDBReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AddSubPubkeyRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AddSubPubkeyRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AddSubPubkeyRequest.displayName = 'proto.dcnet.pb.AddSubPubkeyRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AddSubPubkeyReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AddSubPubkeyReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AddSubPubkeyReply.displayName = 'proto.dcnet.pb.AddSubPubkeyReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.DeleteSubPubkeyRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.DeleteSubPubkeyRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.DeleteSubPubkeyRequest.displayName = 'proto.dcnet.pb.DeleteSubPubkeyRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.DeleteSubPubkeyReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.DeleteSubPubkeyReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.DeleteSubPubkeyReply.displayName = 'proto.dcnet.pb.DeleteSubPubkeyReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.BindAccessPeerToUserRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.BindAccessPeerToUserRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.BindAccessPeerToUserRequest.displayName =
    'proto.dcnet.pb.BindAccessPeerToUserRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.BindAccessPeerToUserReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.BindAccessPeerToUserReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.BindAccessPeerToUserReply.displayName = 'proto.dcnet.pb.BindAccessPeerToUserReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.ValidTokenRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.ValidTokenRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.ValidTokenRequest.displayName = 'proto.dcnet.pb.ValidTokenRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.ValidTokenReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.ValidTokenReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.ValidTokenReply.displayName = 'proto.dcnet.pb.ValidTokenReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AddLogToThreadRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AddLogToThreadRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AddLogToThreadRequest.displayName = 'proto.dcnet.pb.AddLogToThreadRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AddLogToThreadReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AddLogToThreadReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AddLogToThreadReply.displayName = 'proto.dcnet.pb.AddLogToThreadReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AddThreadSpaceRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AddThreadSpaceRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AddThreadSpaceRequest.displayName = 'proto.dcnet.pb.AddThreadSpaceRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AddThreadSpaceReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AddThreadSpaceReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AddThreadSpaceReply.displayName = 'proto.dcnet.pb.AddThreadSpaceReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetThreadUsedSpaceRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetThreadUsedSpaceRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetThreadUsedSpaceRequest.displayName = 'proto.dcnet.pb.GetThreadUsedSpaceRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetThreadUsedSpaceReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetThreadUsedSpaceReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetThreadUsedSpaceReply.displayName = 'proto.dcnet.pb.GetThreadUsedSpaceReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.TeeReportVerifyRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.TeeReportVerifyRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.TeeReportVerifyRequest.displayName = 'proto.dcnet.pb.TeeReportVerifyRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.TeeReportVerifyReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.TeeReportVerifyReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.TeeReportVerifyReply.displayName = 'proto.dcnet.pb.TeeReportVerifyReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.SendMsgToUserBoxRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.SendMsgToUserBoxRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.SendMsgToUserBoxRequest.displayName = 'proto.dcnet.pb.SendMsgToUserBoxRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.SendMsgToUserBoxReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.SendMsgToUserBoxReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.SendMsgToUserBoxReply.displayName = 'proto.dcnet.pb.SendMsgToUserBoxReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetToUserBoxAuthRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetToUserBoxAuthRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetToUserBoxAuthRequest.displayName = 'proto.dcnet.pb.GetToUserBoxAuthRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetToUserBoxAuthReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetToUserBoxAuthReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetToUserBoxAuthReply.displayName = 'proto.dcnet.pb.GetToUserBoxAuthReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetMsgFromUserBoxRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetMsgFromUserBoxRequest.displayName = 'proto.dcnet.pb.GetMsgFromUserBoxRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetMsgFromUserBoxReply = function (opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    proto.dcnet.pb.GetMsgFromUserBoxReply.repeatedFields_,
    null
  )
}
goog.inherits(proto.dcnet.pb.GetMsgFromUserBoxReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetMsgFromUserBoxReply.displayName = 'proto.dcnet.pb.GetMsgFromUserBoxReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.UserMsg = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.UserMsg, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.UserMsg.displayName = 'proto.dcnet.pb.UserMsg'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.ReportSpamMsgRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.ReportSpamMsgRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.ReportSpamMsgRequest.displayName = 'proto.dcnet.pb.ReportSpamMsgRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.ReportSpamMsgReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.ReportSpamMsgReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.ReportSpamMsgReply.displayName = 'proto.dcnet.pb.ReportSpamMsgReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetUserClientPeersRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetUserClientPeersRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetUserClientPeersRequest.displayName = 'proto.dcnet.pb.GetUserClientPeersRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetUserClientPeersReply = function (opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    proto.dcnet.pb.GetUserClientPeersReply.repeatedFields_,
    null
  )
}
goog.inherits(proto.dcnet.pb.GetUserClientPeersReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetUserClientPeersReply.displayName = 'proto.dcnet.pb.GetUserClientPeersReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AddCommentableObjRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AddCommentableObjRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AddCommentableObjRequest.displayName = 'proto.dcnet.pb.AddCommentableObjRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AddCommentableObjReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AddCommentableObjReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AddCommentableObjReply.displayName = 'proto.dcnet.pb.AddCommentableObjReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AddObjCommentSpaceRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AddObjCommentSpaceRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AddObjCommentSpaceRequest.displayName = 'proto.dcnet.pb.AddObjCommentSpaceRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AddObjCommentSpaceReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AddObjCommentSpaceReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AddObjCommentSpaceReply.displayName = 'proto.dcnet.pb.AddObjCommentSpaceReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.SetCacheKeyRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.SetCacheKeyRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.SetCacheKeyRequest.displayName = 'proto.dcnet.pb.SetCacheKeyRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.SetCacheKeyReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.SetCacheKeyReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.SetCacheKeyReply.displayName = 'proto.dcnet.pb.SetCacheKeyReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetCacheValueRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetCacheValueRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetCacheValueRequest.displayName = 'proto.dcnet.pb.GetCacheValueRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetCacheValueReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetCacheValueReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetCacheValueReply.displayName = 'proto.dcnet.pb.GetCacheValueReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetObjCommentSpaceRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetObjCommentSpaceRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetObjCommentSpaceRequest.displayName = 'proto.dcnet.pb.GetObjCommentSpaceRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetObjCommentSpaceReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetObjCommentSpaceReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetObjCommentSpaceReply.displayName = 'proto.dcnet.pb.GetObjCommentSpaceReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.DeleteCommentableObjRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.DeleteCommentableObjRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.DeleteCommentableObjRequest.displayName =
    'proto.dcnet.pb.DeleteCommentableObjRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.DeleteCommentableObjReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.DeleteCommentableObjReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.DeleteCommentableObjReply.displayName = 'proto.dcnet.pb.DeleteCommentableObjReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.PublishCommentToObjRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.PublishCommentToObjRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.PublishCommentToObjRequest.displayName =
    'proto.dcnet.pb.PublishCommentToObjRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.PublishCommentToObjReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.PublishCommentToObjReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.PublishCommentToObjReply.displayName = 'proto.dcnet.pb.PublishCommentToObjReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AddUserOffChainSpaceRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AddUserOffChainSpaceRequest.displayName =
    'proto.dcnet.pb.AddUserOffChainSpaceRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.AddUserOffChainSpaceReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.AddUserOffChainSpaceReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.AddUserOffChainSpaceReply.displayName = 'proto.dcnet.pb.AddUserOffChainSpaceReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.ReportMaliciousCommentRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.ReportMaliciousCommentRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.ReportMaliciousCommentRequest.displayName =
    'proto.dcnet.pb.ReportMaliciousCommentRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.ReportMaliciousCommentReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.ReportMaliciousCommentReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.ReportMaliciousCommentReply.displayName =
    'proto.dcnet.pb.ReportMaliciousCommentReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.SetObjCommentPublicRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.SetObjCommentPublicRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.SetObjCommentPublicRequest.displayName =
    'proto.dcnet.pb.SetObjCommentPublicRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.SetObjCommentPublicReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.SetObjCommentPublicReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.SetObjCommentPublicReply.displayName = 'proto.dcnet.pb.SetObjCommentPublicReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.DeleteSelfCommentRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.DeleteSelfCommentRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.DeleteSelfCommentRequest.displayName = 'proto.dcnet.pb.DeleteSelfCommentRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.DeleteSelfCommentReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.DeleteSelfCommentReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.DeleteSelfCommentReply.displayName = 'proto.dcnet.pb.DeleteSelfCommentReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.DeleteCommentToObjRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.DeleteCommentToObjRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.DeleteCommentToObjRequest.displayName = 'proto.dcnet.pb.DeleteCommentToObjRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.DeleteCommentToObjReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.DeleteCommentToObjReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.DeleteCommentToObjReply.displayName = 'proto.dcnet.pb.DeleteCommentToObjReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetCommentableObjRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetCommentableObjRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetCommentableObjRequest.displayName = 'proto.dcnet.pb.GetCommentableObjRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetCommentableObjReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetCommentableObjReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetCommentableObjReply.displayName = 'proto.dcnet.pb.GetCommentableObjReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetObjCommentsRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetObjCommentsRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetObjCommentsRequest.displayName = 'proto.dcnet.pb.GetObjCommentsRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetObjCommentsReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetObjCommentsReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetObjCommentsReply.displayName = 'proto.dcnet.pb.GetObjCommentsReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetUserCommentsRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetUserCommentsRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetUserCommentsRequest.displayName = 'proto.dcnet.pb.GetUserCommentsRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.GetUserCommentsReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.GetUserCommentsReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.GetUserCommentsReply.displayName = 'proto.dcnet.pb.GetUserCommentsReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.PushCommentFunOptRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.PushCommentFunOptRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.PushCommentFunOptRequest.displayName = 'proto.dcnet.pb.PushCommentFunOptRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.PushCommentFunOptReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.PushCommentFunOptReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.PushCommentFunOptReply.displayName = 'proto.dcnet.pb.PushCommentFunOptReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.PullCommentFunOptsRequest = function (opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    proto.dcnet.pb.PullCommentFunOptsRequest.repeatedFields_,
    null
  )
}
goog.inherits(proto.dcnet.pb.PullCommentFunOptsRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.PullCommentFunOptsRequest.displayName = 'proto.dcnet.pb.PullCommentFunOptsRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.peerSeqno = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.peerSeqno, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.peerSeqno.displayName = 'proto.dcnet.pb.peerSeqno'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.PullCommentFunOptsReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.PullCommentFunOptsReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.PullCommentFunOptsReply.displayName = 'proto.dcnet.pb.PullCommentFunOptsReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.CommentFunOpt = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.CommentFunOpt, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.CommentFunOpt.displayName = 'proto.dcnet.pb.CommentFunOpt'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.ExchangeCommentEdgesRequest = function (opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    proto.dcnet.pb.ExchangeCommentEdgesRequest.repeatedFields_,
    null
  )
}
goog.inherits(proto.dcnet.pb.ExchangeCommentEdgesRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.ExchangeCommentEdgesRequest.displayName =
    'proto.dcnet.pb.ExchangeCommentEdgesRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.ExchangeCommentEdgesReply = function (opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    proto.dcnet.pb.ExchangeCommentEdgesReply.repeatedFields_,
    null
  )
}
goog.inherits(proto.dcnet.pb.ExchangeCommentEdgesReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.ExchangeCommentEdgesReply.displayName = 'proto.dcnet.pb.ExchangeCommentEdgesReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.UserCommentSeqEdge = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.UserCommentSeqEdge, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.UserCommentSeqEdge.displayName = 'proto.dcnet.pb.UserCommentSeqEdge'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.DownloadUserCommentsRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.DownloadUserCommentsRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.DownloadUserCommentsRequest.displayName =
    'proto.dcnet.pb.DownloadUserCommentsRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.DownloadUserCommentsReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.DownloadUserCommentsReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.DownloadUserCommentsReply.displayName = 'proto.dcnet.pb.DownloadUserCommentsReply'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.UserCommentsDownloadReadyRequest, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.UserCommentsDownloadReadyRequest.displayName =
    'proto.dcnet.pb.UserCommentsDownloadReadyRequest'
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dcnet.pb.UserCommentsDownloadReadyReply = function (opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null)
}
goog.inherits(proto.dcnet.pb.UserCommentsDownloadReadyReply, jspb.Message)
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dcnet.pb.UserCommentsDownloadReadyReply.displayName =
    'proto.dcnet.pb.UserCommentsDownloadReadyReply'
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.StoreThreadRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.StoreThreadRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.StoreThreadRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.StoreThreadRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        threadid: msg.getThreadid_asB64(),
        userpubkey: msg.getUserpubkey_asB64(),
        servicekeyencrypt: msg.getServicekeyencrypt_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.StoreThreadRequest}
 */
proto.dcnet.pb.StoreThreadRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.StoreThreadRequest()
  return proto.dcnet.pb.StoreThreadRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.StoreThreadRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.StoreThreadRequest}
 */
proto.dcnet.pb.StoreThreadRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setThreadid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setServicekeyencrypt(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StoreThreadRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.StoreThreadRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.StoreThreadRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.StoreThreadRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getThreadid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getServicekeyencrypt_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
}

/**
 * optional bytes threadId = 1;
 * @return {string}
 */
proto.dcnet.pb.StoreThreadRequest.prototype.getThreadid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes threadId = 1;
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {string}
 */
proto.dcnet.pb.StoreThreadRequest.prototype.getThreadid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getThreadid()))
}

/**
 * optional bytes threadId = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StoreThreadRequest.prototype.getThreadid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getThreadid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.StoreThreadRequest} returns this
 */
proto.dcnet.pb.StoreThreadRequest.prototype.setThreadid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes userPubkey = 2;
 * @return {string}
 */
proto.dcnet.pb.StoreThreadRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes userPubkey = 2;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.StoreThreadRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StoreThreadRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.StoreThreadRequest} returns this
 */
proto.dcnet.pb.StoreThreadRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional bytes serviceKeyEncrypt = 3;
 * @return {string}
 */
proto.dcnet.pb.StoreThreadRequest.prototype.getServicekeyencrypt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes serviceKeyEncrypt = 3;
 * This is a type-conversion wrapper around `getServicekeyencrypt()`
 * @return {string}
 */
proto.dcnet.pb.StoreThreadRequest.prototype.getServicekeyencrypt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getServicekeyencrypt()))
}

/**
 * optional bytes serviceKeyEncrypt = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getServicekeyencrypt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StoreThreadRequest.prototype.getServicekeyencrypt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getServicekeyencrypt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.StoreThreadRequest} returns this
 */
proto.dcnet.pb.StoreThreadRequest.prototype.setServicekeyencrypt = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.StoreThreadReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.StoreThreadReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.StoreThreadReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.StoreThreadReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        status: jspb.Message.getFieldWithDefault(msg, 1, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.StoreThreadReply}
 */
proto.dcnet.pb.StoreThreadReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.StoreThreadReply()
  return proto.dcnet.pb.StoreThreadReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.StoreThreadReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.StoreThreadReply}
 */
proto.dcnet.pb.StoreThreadReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readInt32())
        msg.setStatus(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StoreThreadReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.StoreThreadReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.StoreThreadReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.StoreThreadReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getStatus()
  if (f !== 0) {
    writer.writeInt32(1, f)
  }
}

/**
 * optional int32 status = 1;
 * @return {number}
 */
proto.dcnet.pb.StoreThreadReply.prototype.getStatus = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.StoreThreadReply} returns this
 */
proto.dcnet.pb.StoreThreadReply.prototype.setStatus = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.StroeFileToPeerRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.StroeFileToPeerRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.StroeFileToPeerRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.StroeFileToPeerRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        cid: msg.getCid_asB64(),
        size: jspb.Message.getFieldWithDefault(msg, 2, 0),
        userpubkey: msg.getUserpubkey_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.StroeFileToPeerRequest}
 */
proto.dcnet.pb.StroeFileToPeerRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.StroeFileToPeerRequest()
  return proto.dcnet.pb.StroeFileToPeerRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.StroeFileToPeerRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.StroeFileToPeerRequest}
 */
proto.dcnet.pb.StroeFileToPeerRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setCid(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint64())
        msg.setSize(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StroeFileToPeerRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.StroeFileToPeerRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.StroeFileToPeerRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.StroeFileToPeerRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getCid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getSize()
  if (f !== 0) {
    writer.writeUint64(2, f)
  }
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
}

/**
 * optional bytes cid = 1;
 * @return {string}
 */
proto.dcnet.pb.StroeFileToPeerRequest.prototype.getCid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes cid = 1;
 * This is a type-conversion wrapper around `getCid()`
 * @return {string}
 */
proto.dcnet.pb.StroeFileToPeerRequest.prototype.getCid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getCid()))
}

/**
 * optional bytes cid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StroeFileToPeerRequest.prototype.getCid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getCid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.StroeFileToPeerRequest} returns this
 */
proto.dcnet.pb.StroeFileToPeerRequest.prototype.setCid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint64 size = 2;
 * @return {number}
 */
proto.dcnet.pb.StroeFileToPeerRequest.prototype.getSize = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.StroeFileToPeerRequest} returns this
 */
proto.dcnet.pb.StroeFileToPeerRequest.prototype.setSize = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional bytes userPubkey = 3;
 * @return {string}
 */
proto.dcnet.pb.StroeFileToPeerRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes userPubkey = 3;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.StroeFileToPeerRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StroeFileToPeerRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.StroeFileToPeerRequest} returns this
 */
proto.dcnet.pb.StroeFileToPeerRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.StroeFileToPeerReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.StroeFileToPeerReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.StroeFileToPeerReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.StroeFileToPeerReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        status: jspb.Message.getFieldWithDefault(msg, 1, 0),
        receivesize: jspb.Message.getFieldWithDefault(msg, 2, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.StroeFileToPeerReply}
 */
proto.dcnet.pb.StroeFileToPeerReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.StroeFileToPeerReply()
  return proto.dcnet.pb.StroeFileToPeerReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.StroeFileToPeerReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.StroeFileToPeerReply}
 */
proto.dcnet.pb.StroeFileToPeerReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readInt32())
        msg.setStatus(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readInt64())
        msg.setReceivesize(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StroeFileToPeerReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.StroeFileToPeerReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.StroeFileToPeerReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.StroeFileToPeerReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getStatus()
  if (f !== 0) {
    writer.writeInt32(1, f)
  }
  f = message.getReceivesize()
  if (f !== 0) {
    writer.writeInt64(2, f)
  }
}

/**
 * optional int32 status = 1;
 * @return {number}
 */
proto.dcnet.pb.StroeFileToPeerReply.prototype.getStatus = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.StroeFileToPeerReply} returns this
 */
proto.dcnet.pb.StroeFileToPeerReply.prototype.setStatus = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * optional int64 receivesize = 2;
 * @return {number}
 */
proto.dcnet.pb.StroeFileToPeerReply.prototype.getReceivesize = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.StroeFileToPeerReply} returns this
 */
proto.dcnet.pb.StroeFileToPeerReply.prototype.setReceivesize = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.OnlineStatusCheckRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.OnlineStatusCheckRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.OnlineStatusCheckRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.OnlineStatusCheckRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        challenge: msg.getChallenge_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.OnlineStatusCheckRequest}
 */
proto.dcnet.pb.OnlineStatusCheckRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.OnlineStatusCheckRequest()
  return proto.dcnet.pb.OnlineStatusCheckRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.OnlineStatusCheckRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.OnlineStatusCheckRequest}
 */
proto.dcnet.pb.OnlineStatusCheckRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setChallenge(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.OnlineStatusCheckRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.OnlineStatusCheckRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.OnlineStatusCheckRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.OnlineStatusCheckRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getChallenge_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}

/**
 * optional bytes challenge = 1;
 * @return {string}
 */
proto.dcnet.pb.OnlineStatusCheckRequest.prototype.getChallenge = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes challenge = 1;
 * This is a type-conversion wrapper around `getChallenge()`
 * @return {string}
 */
proto.dcnet.pb.OnlineStatusCheckRequest.prototype.getChallenge_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getChallenge()))
}

/**
 * optional bytes challenge = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getChallenge()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.OnlineStatusCheckRequest.prototype.getChallenge_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getChallenge()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.OnlineStatusCheckRequest} returns this
 */
proto.dcnet.pb.OnlineStatusCheckRequest.prototype.setChallenge = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.OnlineStatusCheckReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.OnlineStatusCheckReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.OnlineStatusCheckReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.OnlineStatusCheckReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        teereport: msg.getTeereport_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.OnlineStatusCheckReply}
 */
proto.dcnet.pb.OnlineStatusCheckReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.OnlineStatusCheckReply()
  return proto.dcnet.pb.OnlineStatusCheckReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.OnlineStatusCheckReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.OnlineStatusCheckReply}
 */
proto.dcnet.pb.OnlineStatusCheckReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setTeereport(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.OnlineStatusCheckReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.OnlineStatusCheckReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.OnlineStatusCheckReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.OnlineStatusCheckReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getTeereport_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}

/**
 * optional bytes teereport = 1;
 * @return {string}
 */
proto.dcnet.pb.OnlineStatusCheckReply.prototype.getTeereport = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes teereport = 1;
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {string}
 */
proto.dcnet.pb.OnlineStatusCheckReply.prototype.getTeereport_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getTeereport()))
}

/**
 * optional bytes teereport = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.OnlineStatusCheckReply.prototype.getTeereport_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getTeereport()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.OnlineStatusCheckReply} returns this
 */
proto.dcnet.pb.OnlineStatusCheckReply.prototype.setTeereport = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.dcnet.pb.CheckPeerStatusRequest.oneofGroups_ = [[1, 2]]

/**
 * @enum {number}
 */
proto.dcnet.pb.CheckPeerStatusRequest.PayloadCase = {
  PAYLOAD_NOT_SET: 0,
  SREQ: 1,
  TEEREPORT: 2
}

/**
 * @return {proto.dcnet.pb.CheckPeerStatusRequest.PayloadCase}
 */
proto.dcnet.pb.CheckPeerStatusRequest.prototype.getPayloadCase = function () {
  return /** @type {proto.dcnet.pb.CheckPeerStatusRequest.PayloadCase} */ (
    jspb.Message.computeOneofCase(this, proto.dcnet.pb.CheckPeerStatusRequest.oneofGroups_[0])
  )
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.CheckPeerStatusRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.CheckPeerStatusRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.CheckPeerStatusRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.CheckPeerStatusRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        sreq:
          (f = msg.getSreq()) &&
          proto.dcnet.pb.CheckPeerStatusRequest.Sreq.toObject(includeInstance, f),
        teereport: msg.getTeereport_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.CheckPeerStatusRequest}
 */
proto.dcnet.pb.CheckPeerStatusRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.CheckPeerStatusRequest()
  return proto.dcnet.pb.CheckPeerStatusRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.CheckPeerStatusRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.CheckPeerStatusRequest}
 */
proto.dcnet.pb.CheckPeerStatusRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.dcnet.pb.CheckPeerStatusRequest.Sreq()
        reader.readMessage(
          value,
          proto.dcnet.pb.CheckPeerStatusRequest.Sreq.deserializeBinaryFromReader
        )
        msg.setSreq(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setTeereport(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CheckPeerStatusRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.CheckPeerStatusRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.CheckPeerStatusRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.CheckPeerStatusRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getSreq()
  if (f != null) {
    writer.writeMessage(1, f, proto.dcnet.pb.CheckPeerStatusRequest.Sreq.serializeBinaryToWriter)
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 2))
  if (f != null) {
    writer.writeBytes(2, f)
  }
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.CheckPeerStatusRequest.Sreq.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.CheckPeerStatusRequest.Sreq.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.CheckPeerStatusRequest.Sreq} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.CheckPeerStatusRequest.Sreq.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        pubkey: msg.getPubkey_asB64(),
        peerid: msg.getPeerid_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.CheckPeerStatusRequest.Sreq}
 */
proto.dcnet.pb.CheckPeerStatusRequest.Sreq.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.CheckPeerStatusRequest.Sreq()
  return proto.dcnet.pb.CheckPeerStatusRequest.Sreq.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.CheckPeerStatusRequest.Sreq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.CheckPeerStatusRequest.Sreq}
 */
proto.dcnet.pb.CheckPeerStatusRequest.Sreq.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPubkey(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CheckPeerStatusRequest.Sreq.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.CheckPeerStatusRequest.Sreq.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.CheckPeerStatusRequest.Sreq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.CheckPeerStatusRequest.Sreq.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional bytes pubkey = 1;
 * @return {string}
 */
proto.dcnet.pb.CheckPeerStatusRequest.Sreq.prototype.getPubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes pubkey = 1;
 * This is a type-conversion wrapper around `getPubkey()`
 * @return {string}
 */
proto.dcnet.pb.CheckPeerStatusRequest.Sreq.prototype.getPubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPubkey()))
}

/**
 * optional bytes pubkey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CheckPeerStatusRequest.Sreq.prototype.getPubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.CheckPeerStatusRequest.Sreq} returns this
 */
proto.dcnet.pb.CheckPeerStatusRequest.Sreq.prototype.setPubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes peerid = 2;
 * @return {string}
 */
proto.dcnet.pb.CheckPeerStatusRequest.Sreq.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes peerid = 2;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.CheckPeerStatusRequest.Sreq.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes peerid = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CheckPeerStatusRequest.Sreq.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.CheckPeerStatusRequest.Sreq} returns this
 */
proto.dcnet.pb.CheckPeerStatusRequest.Sreq.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional Sreq sreq = 1;
 * @return {?proto.dcnet.pb.CheckPeerStatusRequest.Sreq}
 */
proto.dcnet.pb.CheckPeerStatusRequest.prototype.getSreq = function () {
  return /** @type{?proto.dcnet.pb.CheckPeerStatusRequest.Sreq} */ (
    jspb.Message.getWrapperField(this, proto.dcnet.pb.CheckPeerStatusRequest.Sreq, 1)
  )
}

/**
 * @param {?proto.dcnet.pb.CheckPeerStatusRequest.Sreq|undefined} value
 * @return {!proto.dcnet.pb.CheckPeerStatusRequest} returns this
 */
proto.dcnet.pb.CheckPeerStatusRequest.prototype.setSreq = function (value) {
  return jspb.Message.setOneofWrapperField(
    this,
    1,
    proto.dcnet.pb.CheckPeerStatusRequest.oneofGroups_[0],
    value
  )
}

/**
 * Clears the message field making it undefined.
 * @return {!proto.dcnet.pb.CheckPeerStatusRequest} returns this
 */
proto.dcnet.pb.CheckPeerStatusRequest.prototype.clearSreq = function () {
  return this.setSreq(undefined)
}

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dcnet.pb.CheckPeerStatusRequest.prototype.hasSreq = function () {
  return jspb.Message.getField(this, 1) != null
}

/**
 * optional bytes teereport = 2;
 * @return {string}
 */
proto.dcnet.pb.CheckPeerStatusRequest.prototype.getTeereport = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes teereport = 2;
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {string}
 */
proto.dcnet.pb.CheckPeerStatusRequest.prototype.getTeereport_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getTeereport()))
}

/**
 * optional bytes teereport = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CheckPeerStatusRequest.prototype.getTeereport_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getTeereport()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.CheckPeerStatusRequest} returns this
 */
proto.dcnet.pb.CheckPeerStatusRequest.prototype.setTeereport = function (value) {
  return jspb.Message.setOneofField(
    this,
    2,
    proto.dcnet.pb.CheckPeerStatusRequest.oneofGroups_[0],
    value
  )
}

/**
 * Clears the field making it undefined.
 * @return {!proto.dcnet.pb.CheckPeerStatusRequest} returns this
 */
proto.dcnet.pb.CheckPeerStatusRequest.prototype.clearTeereport = function () {
  return jspb.Message.setOneofField(
    this,
    2,
    proto.dcnet.pb.CheckPeerStatusRequest.oneofGroups_[0],
    undefined
  )
}

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dcnet.pb.CheckPeerStatusRequest.prototype.hasTeereport = function () {
  return jspb.Message.getField(this, 2) != null
}

/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.dcnet.pb.CheckPeerStatusReply.oneofGroups_ = [[1, 2]]

/**
 * @enum {number}
 */
proto.dcnet.pb.CheckPeerStatusReply.PayloadCase = {
  PAYLOAD_NOT_SET: 0,
  CHALLENGE: 1,
  BODY: 2
}

/**
 * @return {proto.dcnet.pb.CheckPeerStatusReply.PayloadCase}
 */
proto.dcnet.pb.CheckPeerStatusReply.prototype.getPayloadCase = function () {
  return /** @type {proto.dcnet.pb.CheckPeerStatusReply.PayloadCase} */ (
    jspb.Message.computeOneofCase(this, proto.dcnet.pb.CheckPeerStatusReply.oneofGroups_[0])
  )
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.CheckPeerStatusReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.CheckPeerStatusReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.CheckPeerStatusReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.CheckPeerStatusReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        challenge: msg.getChallenge_asB64(),
        body:
          (f = msg.getBody()) &&
          proto.dcnet.pb.CheckPeerStatusReply.Body.toObject(includeInstance, f)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.CheckPeerStatusReply}
 */
proto.dcnet.pb.CheckPeerStatusReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.CheckPeerStatusReply()
  return proto.dcnet.pb.CheckPeerStatusReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.CheckPeerStatusReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.CheckPeerStatusReply}
 */
proto.dcnet.pb.CheckPeerStatusReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setChallenge(value)
        break
      case 2:
        var value = new proto.dcnet.pb.CheckPeerStatusReply.Body()
        reader.readMessage(
          value,
          proto.dcnet.pb.CheckPeerStatusReply.Body.deserializeBinaryFromReader
        )
        msg.setBody(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CheckPeerStatusReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.CheckPeerStatusReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.CheckPeerStatusReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.CheckPeerStatusReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 1))
  if (f != null) {
    writer.writeBytes(1, f)
  }
  f = message.getBody()
  if (f != null) {
    writer.writeMessage(2, f, proto.dcnet.pb.CheckPeerStatusReply.Body.serializeBinaryToWriter)
  }
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.CheckPeerStatusReply.Body.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.CheckPeerStatusReply.Body.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.CheckPeerStatusReply.Body} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.CheckPeerStatusReply.Body.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        peerid: msg.getPeerid_asB64(),
        status: jspb.Message.getFieldWithDefault(msg, 2, 0),
        teereport: msg.getTeereport_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.CheckPeerStatusReply.Body}
 */
proto.dcnet.pb.CheckPeerStatusReply.Body.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.CheckPeerStatusReply.Body()
  return proto.dcnet.pb.CheckPeerStatusReply.Body.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.CheckPeerStatusReply.Body} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.CheckPeerStatusReply.Body}
 */
proto.dcnet.pb.CheckPeerStatusReply.Body.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readInt32())
        msg.setStatus(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setTeereport(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CheckPeerStatusReply.Body.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.CheckPeerStatusReply.Body.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.CheckPeerStatusReply.Body} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.CheckPeerStatusReply.Body.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getStatus()
  if (f !== 0) {
    writer.writeInt32(2, f)
  }
  f = message.getTeereport_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
}

/**
 * optional bytes peerid = 1;
 * @return {string}
 */
proto.dcnet.pb.CheckPeerStatusReply.Body.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes peerid = 1;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.CheckPeerStatusReply.Body.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes peerid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CheckPeerStatusReply.Body.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.CheckPeerStatusReply.Body} returns this
 */
proto.dcnet.pb.CheckPeerStatusReply.Body.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional int32 status = 2;
 * @return {number}
 */
proto.dcnet.pb.CheckPeerStatusReply.Body.prototype.getStatus = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.CheckPeerStatusReply.Body} returns this
 */
proto.dcnet.pb.CheckPeerStatusReply.Body.prototype.setStatus = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional bytes teereport = 3;
 * @return {string}
 */
proto.dcnet.pb.CheckPeerStatusReply.Body.prototype.getTeereport = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes teereport = 3;
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {string}
 */
proto.dcnet.pb.CheckPeerStatusReply.Body.prototype.getTeereport_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getTeereport()))
}

/**
 * optional bytes teereport = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CheckPeerStatusReply.Body.prototype.getTeereport_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getTeereport()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.CheckPeerStatusReply.Body} returns this
 */
proto.dcnet.pb.CheckPeerStatusReply.Body.prototype.setTeereport = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional bytes challenge = 1;
 * @return {string}
 */
proto.dcnet.pb.CheckPeerStatusReply.prototype.getChallenge = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes challenge = 1;
 * This is a type-conversion wrapper around `getChallenge()`
 * @return {string}
 */
proto.dcnet.pb.CheckPeerStatusReply.prototype.getChallenge_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getChallenge()))
}

/**
 * optional bytes challenge = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getChallenge()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CheckPeerStatusReply.prototype.getChallenge_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getChallenge()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.CheckPeerStatusReply} returns this
 */
proto.dcnet.pb.CheckPeerStatusReply.prototype.setChallenge = function (value) {
  return jspb.Message.setOneofField(
    this,
    1,
    proto.dcnet.pb.CheckPeerStatusReply.oneofGroups_[0],
    value
  )
}

/**
 * Clears the field making it undefined.
 * @return {!proto.dcnet.pb.CheckPeerStatusReply} returns this
 */
proto.dcnet.pb.CheckPeerStatusReply.prototype.clearChallenge = function () {
  return jspb.Message.setOneofField(
    this,
    1,
    proto.dcnet.pb.CheckPeerStatusReply.oneofGroups_[0],
    undefined
  )
}

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dcnet.pb.CheckPeerStatusReply.prototype.hasChallenge = function () {
  return jspb.Message.getField(this, 1) != null
}

/**
 * optional Body body = 2;
 * @return {?proto.dcnet.pb.CheckPeerStatusReply.Body}
 */
proto.dcnet.pb.CheckPeerStatusReply.prototype.getBody = function () {
  return /** @type{?proto.dcnet.pb.CheckPeerStatusReply.Body} */ (
    jspb.Message.getWrapperField(this, proto.dcnet.pb.CheckPeerStatusReply.Body, 2)
  )
}

/**
 * @param {?proto.dcnet.pb.CheckPeerStatusReply.Body|undefined} value
 * @return {!proto.dcnet.pb.CheckPeerStatusReply} returns this
 */
proto.dcnet.pb.CheckPeerStatusReply.prototype.setBody = function (value) {
  return jspb.Message.setOneofWrapperField(
    this,
    2,
    proto.dcnet.pb.CheckPeerStatusReply.oneofGroups_[0],
    value
  )
}

/**
 * Clears the message field making it undefined.
 * @return {!proto.dcnet.pb.CheckPeerStatusReply} returns this
 */
proto.dcnet.pb.CheckPeerStatusReply.prototype.clearBody = function () {
  return this.setBody(undefined)
}

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dcnet.pb.CheckPeerStatusReply.prototype.hasBody = function () {
  return jspb.Message.getField(this, 2) != null
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dcnet.pb.LocalFileCheckRequest.repeatedFields_ = [1]

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.LocalFileCheckRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.LocalFileCheckRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.LocalFileCheckRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.LocalFileCheckRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        keysList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.LocalFileCheckRequest}
 */
proto.dcnet.pb.LocalFileCheckRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.LocalFileCheckRequest()
  return proto.dcnet.pb.LocalFileCheckRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.LocalFileCheckRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.LocalFileCheckRequest}
 */
proto.dcnet.pb.LocalFileCheckRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {string} */ (reader.readString())
        msg.addKeys(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.LocalFileCheckRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.LocalFileCheckRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.LocalFileCheckRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.LocalFileCheckRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getKeysList()
  if (f.length > 0) {
    writer.writeRepeatedString(1, f)
  }
}

/**
 * repeated string keys = 1;
 * @return {!Array<string>}
 */
proto.dcnet.pb.LocalFileCheckRequest.prototype.getKeysList = function () {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1))
}

/**
 * @param {!Array<string>} value
 * @return {!proto.dcnet.pb.LocalFileCheckRequest} returns this
 */
proto.dcnet.pb.LocalFileCheckRequest.prototype.setKeysList = function (value) {
  return jspb.Message.setField(this, 1, value || [])
}

/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.dcnet.pb.LocalFileCheckRequest} returns this
 */
proto.dcnet.pb.LocalFileCheckRequest.prototype.addKeys = function (value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index)
}

/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dcnet.pb.LocalFileCheckRequest} returns this
 */
proto.dcnet.pb.LocalFileCheckRequest.prototype.clearKeysList = function () {
  return this.setKeysList([])
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.LocalFileCheckReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.LocalFileCheckReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.LocalFileCheckReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.LocalFileCheckReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0),
        failkey: jspb.Message.getFieldWithDefault(msg, 2, ''),
        teereport: msg.getTeereport_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.LocalFileCheckReply}
 */
proto.dcnet.pb.LocalFileCheckReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.LocalFileCheckReply()
  return proto.dcnet.pb.LocalFileCheckReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.LocalFileCheckReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.LocalFileCheckReply}
 */
proto.dcnet.pb.LocalFileCheckReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readInt32())
        msg.setFlag(value)
        break
      case 2:
        var value = /** @type {string} */ (reader.readString())
        msg.setFailkey(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setTeereport(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.LocalFileCheckReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.LocalFileCheckReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.LocalFileCheckReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.LocalFileCheckReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeInt32(1, f)
  }
  f = message.getFailkey()
  if (f.length > 0) {
    writer.writeString(2, f)
  }
  f = message.getTeereport_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
}

/**
 * optional int32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.LocalFileCheckReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.LocalFileCheckReply} returns this
 */
proto.dcnet.pb.LocalFileCheckReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * optional string failkey = 2;
 * @return {string}
 */
proto.dcnet.pb.LocalFileCheckReply.prototype.getFailkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * @param {string} value
 * @return {!proto.dcnet.pb.LocalFileCheckReply} returns this
 */
proto.dcnet.pb.LocalFileCheckReply.prototype.setFailkey = function (value) {
  return jspb.Message.setProto3StringField(this, 2, value)
}

/**
 * optional bytes teereport = 3;
 * @return {string}
 */
proto.dcnet.pb.LocalFileCheckReply.prototype.getTeereport = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes teereport = 3;
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {string}
 */
proto.dcnet.pb.LocalFileCheckReply.prototype.getTeereport_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getTeereport()))
}

/**
 * optional bytes teereport = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.LocalFileCheckReply.prototype.getTeereport_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getTeereport()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.LocalFileCheckReply} returns this
 */
proto.dcnet.pb.LocalFileCheckReply.prototype.setTeereport = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dcnet.pb.LocalAccountInfoCheckRequest.repeatedFields_ = [1]

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.LocalAccountInfoCheckRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.LocalAccountInfoCheckRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.LocalAccountInfoCheckRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.LocalAccountInfoCheckRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        accounthashsList: msg.getAccounthashsList_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.LocalAccountInfoCheckRequest}
 */
proto.dcnet.pb.LocalAccountInfoCheckRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.LocalAccountInfoCheckRequest()
  return proto.dcnet.pb.LocalAccountInfoCheckRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.LocalAccountInfoCheckRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.LocalAccountInfoCheckRequest}
 */
proto.dcnet.pb.LocalAccountInfoCheckRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.addAccounthashs(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.LocalAccountInfoCheckRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.LocalAccountInfoCheckRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.LocalAccountInfoCheckRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.LocalAccountInfoCheckRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccounthashsList_asU8()
  if (f.length > 0) {
    writer.writeRepeatedBytes(1, f)
  }
}

/**
 * repeated bytes accounthashs = 1;
 * @return {!Array<string>}
 */
proto.dcnet.pb.LocalAccountInfoCheckRequest.prototype.getAccounthashsList = function () {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1))
}

/**
 * repeated bytes accounthashs = 1;
 * This is a type-conversion wrapper around `getAccounthashsList()`
 * @return {!Array<string>}
 */
proto.dcnet.pb.LocalAccountInfoCheckRequest.prototype.getAccounthashsList_asB64 = function () {
  return /** @type {!Array<string>} */ (jspb.Message.bytesListAsB64(this.getAccounthashsList()))
}

/**
 * repeated bytes accounthashs = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAccounthashsList()`
 * @return {!Array<!Uint8Array>}
 */
proto.dcnet.pb.LocalAccountInfoCheckRequest.prototype.getAccounthashsList_asU8 = function () {
  return /** @type {!Array<!Uint8Array>} */ (jspb.Message.bytesListAsU8(this.getAccounthashsList()))
}

/**
 * @param {!(Array<!Uint8Array>|Array<string>)} value
 * @return {!proto.dcnet.pb.LocalAccountInfoCheckRequest} returns this
 */
proto.dcnet.pb.LocalAccountInfoCheckRequest.prototype.setAccounthashsList = function (value) {
  return jspb.Message.setField(this, 1, value || [])
}

/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 * @return {!proto.dcnet.pb.LocalAccountInfoCheckRequest} returns this
 */
proto.dcnet.pb.LocalAccountInfoCheckRequest.prototype.addAccounthashs = function (
  value,
  opt_index
) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index)
}

/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dcnet.pb.LocalAccountInfoCheckRequest} returns this
 */
proto.dcnet.pb.LocalAccountInfoCheckRequest.prototype.clearAccounthashsList = function () {
  return this.setAccounthashsList([])
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.LocalAccountInfoCheckReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.LocalAccountInfoCheckReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.LocalAccountInfoCheckReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.LocalAccountInfoCheckReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0),
        failkey: msg.getFailkey_asB64(),
        teereport: msg.getTeereport_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.LocalAccountInfoCheckReply}
 */
proto.dcnet.pb.LocalAccountInfoCheckReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.LocalAccountInfoCheckReply()
  return proto.dcnet.pb.LocalAccountInfoCheckReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.LocalAccountInfoCheckReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.LocalAccountInfoCheckReply}
 */
proto.dcnet.pb.LocalAccountInfoCheckReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readInt32())
        msg.setFlag(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setFailkey(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setTeereport(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.LocalAccountInfoCheckReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.LocalAccountInfoCheckReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.LocalAccountInfoCheckReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.LocalAccountInfoCheckReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeInt32(1, f)
  }
  f = message.getFailkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getTeereport_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
}

/**
 * optional int32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.LocalAccountInfoCheckReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.LocalAccountInfoCheckReply} returns this
 */
proto.dcnet.pb.LocalAccountInfoCheckReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * optional bytes failkey = 2;
 * @return {string}
 */
proto.dcnet.pb.LocalAccountInfoCheckReply.prototype.getFailkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes failkey = 2;
 * This is a type-conversion wrapper around `getFailkey()`
 * @return {string}
 */
proto.dcnet.pb.LocalAccountInfoCheckReply.prototype.getFailkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getFailkey()))
}

/**
 * optional bytes failkey = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getFailkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.LocalAccountInfoCheckReply.prototype.getFailkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getFailkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.LocalAccountInfoCheckReply} returns this
 */
proto.dcnet.pb.LocalAccountInfoCheckReply.prototype.setFailkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional bytes teereport = 3;
 * @return {string}
 */
proto.dcnet.pb.LocalAccountInfoCheckReply.prototype.getTeereport = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes teereport = 3;
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {string}
 */
proto.dcnet.pb.LocalAccountInfoCheckReply.prototype.getTeereport_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getTeereport()))
}

/**
 * optional bytes teereport = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.LocalAccountInfoCheckReply.prototype.getTeereport_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getTeereport()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.LocalAccountInfoCheckReply} returns this
 */
proto.dcnet.pb.LocalAccountInfoCheckReply.prototype.setTeereport = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AccountInfoSyncRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AccountInfoSyncRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AccountInfoSyncRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AccountInfoSyncRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        accounthash: msg.getAccounthash_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 2, 0),
        prikeyencrypthash: msg.getPrikeyencrypthash_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AccountInfoSyncRequest}
 */
proto.dcnet.pb.AccountInfoSyncRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AccountInfoSyncRequest()
  return proto.dcnet.pb.AccountInfoSyncRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AccountInfoSyncRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AccountInfoSyncRequest}
 */
proto.dcnet.pb.AccountInfoSyncRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAccounthash(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPrikeyencrypthash(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountInfoSyncRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AccountInfoSyncRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AccountInfoSyncRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AccountInfoSyncRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccounthash_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getPrikeyencrypthash_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
}

/**
 * optional bytes accounthash = 1;
 * @return {string}
 */
proto.dcnet.pb.AccountInfoSyncRequest.prototype.getAccounthash = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes accounthash = 1;
 * This is a type-conversion wrapper around `getAccounthash()`
 * @return {string}
 */
proto.dcnet.pb.AccountInfoSyncRequest.prototype.getAccounthash_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAccounthash()))
}

/**
 * optional bytes accounthash = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAccounthash()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountInfoSyncRequest.prototype.getAccounthash_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAccounthash()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountInfoSyncRequest} returns this
 */
proto.dcnet.pb.AccountInfoSyncRequest.prototype.setAccounthash = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint32 blockheight = 2;
 * @return {number}
 */
proto.dcnet.pb.AccountInfoSyncRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AccountInfoSyncRequest} returns this
 */
proto.dcnet.pb.AccountInfoSyncRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional bytes prikeyencrypthash = 3;
 * @return {string}
 */
proto.dcnet.pb.AccountInfoSyncRequest.prototype.getPrikeyencrypthash = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes prikeyencrypthash = 3;
 * This is a type-conversion wrapper around `getPrikeyencrypthash()`
 * @return {string}
 */
proto.dcnet.pb.AccountInfoSyncRequest.prototype.getPrikeyencrypthash_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPrikeyencrypthash()))
}

/**
 * optional bytes prikeyencrypthash = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPrikeyencrypthash()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountInfoSyncRequest.prototype.getPrikeyencrypthash_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPrikeyencrypthash()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountInfoSyncRequest} returns this
 */
proto.dcnet.pb.AccountInfoSyncRequest.prototype.setPrikeyencrypthash = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AccountInfoSyncReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AccountInfoSyncReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AccountInfoSyncReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AccountInfoSyncReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AccountInfoSyncReply}
 */
proto.dcnet.pb.AccountInfoSyncReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AccountInfoSyncReply()
  return proto.dcnet.pb.AccountInfoSyncReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AccountInfoSyncReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AccountInfoSyncReply}
 */
proto.dcnet.pb.AccountInfoSyncReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountInfoSyncReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AccountInfoSyncReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AccountInfoSyncReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AccountInfoSyncReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.SetEncryptKeyWithScanRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.SetEncryptKeyWithScanRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.SetEncryptKeyWithScanRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.SetEncryptKeyWithScanRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        encryptprivkey: msg.getEncryptprivkey_asB64(),
        mapkey: msg.getMapkey_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.SetEncryptKeyWithScanRequest}
 */
proto.dcnet.pb.SetEncryptKeyWithScanRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.SetEncryptKeyWithScanRequest()
  return proto.dcnet.pb.SetEncryptKeyWithScanRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.SetEncryptKeyWithScanRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.SetEncryptKeyWithScanRequest}
 */
proto.dcnet.pb.SetEncryptKeyWithScanRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setEncryptprivkey(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setMapkey(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetEncryptKeyWithScanRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.SetEncryptKeyWithScanRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.SetEncryptKeyWithScanRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.SetEncryptKeyWithScanRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getEncryptprivkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getMapkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional bytes encryptPrivkey = 1;
 * @return {string}
 */
proto.dcnet.pb.SetEncryptKeyWithScanRequest.prototype.getEncryptprivkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes encryptPrivkey = 1;
 * This is a type-conversion wrapper around `getEncryptprivkey()`
 * @return {string}
 */
proto.dcnet.pb.SetEncryptKeyWithScanRequest.prototype.getEncryptprivkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getEncryptprivkey()))
}

/**
 * optional bytes encryptPrivkey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getEncryptprivkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetEncryptKeyWithScanRequest.prototype.getEncryptprivkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getEncryptprivkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SetEncryptKeyWithScanRequest} returns this
 */
proto.dcnet.pb.SetEncryptKeyWithScanRequest.prototype.setEncryptprivkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes mapkey = 2;
 * @return {string}
 */
proto.dcnet.pb.SetEncryptKeyWithScanRequest.prototype.getMapkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes mapkey = 2;
 * This is a type-conversion wrapper around `getMapkey()`
 * @return {string}
 */
proto.dcnet.pb.SetEncryptKeyWithScanRequest.prototype.getMapkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getMapkey()))
}

/**
 * optional bytes mapkey = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getMapkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetEncryptKeyWithScanRequest.prototype.getMapkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getMapkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SetEncryptKeyWithScanRequest} returns this
 */
proto.dcnet.pb.SetEncryptKeyWithScanRequest.prototype.setMapkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.SetEncryptKeyWithScanReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.SetEncryptKeyWithScanReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.SetEncryptKeyWithScanReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.SetEncryptKeyWithScanReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.SetEncryptKeyWithScanReply}
 */
proto.dcnet.pb.SetEncryptKeyWithScanReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.SetEncryptKeyWithScanReply()
  return proto.dcnet.pb.SetEncryptKeyWithScanReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.SetEncryptKeyWithScanReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.SetEncryptKeyWithScanReply}
 */
proto.dcnet.pb.SetEncryptKeyWithScanReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetEncryptKeyWithScanReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.SetEncryptKeyWithScanReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.SetEncryptKeyWithScanReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.SetEncryptKeyWithScanReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetEncryptKeyWithScanRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetEncryptKeyWithScanRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetEncryptKeyWithScanRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetEncryptKeyWithScanRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        mapkey: msg.getMapkey_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetEncryptKeyWithScanRequest}
 */
proto.dcnet.pb.GetEncryptKeyWithScanRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetEncryptKeyWithScanRequest()
  return proto.dcnet.pb.GetEncryptKeyWithScanRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetEncryptKeyWithScanRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetEncryptKeyWithScanRequest}
 */
proto.dcnet.pb.GetEncryptKeyWithScanRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setMapkey(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetEncryptKeyWithScanRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetEncryptKeyWithScanRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetEncryptKeyWithScanRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetEncryptKeyWithScanRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getMapkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}

/**
 * optional bytes mapkey = 1;
 * @return {string}
 */
proto.dcnet.pb.GetEncryptKeyWithScanRequest.prototype.getMapkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes mapkey = 1;
 * This is a type-conversion wrapper around `getMapkey()`
 * @return {string}
 */
proto.dcnet.pb.GetEncryptKeyWithScanRequest.prototype.getMapkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getMapkey()))
}

/**
 * optional bytes mapkey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getMapkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetEncryptKeyWithScanRequest.prototype.getMapkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getMapkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetEncryptKeyWithScanRequest} returns this
 */
proto.dcnet.pb.GetEncryptKeyWithScanRequest.prototype.setMapkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetEncryptKeyWithScanReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetEncryptKeyWithScanReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetEncryptKeyWithScanReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetEncryptKeyWithScanReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        encryptprivkey: msg.getEncryptprivkey_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetEncryptKeyWithScanReply}
 */
proto.dcnet.pb.GetEncryptKeyWithScanReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetEncryptKeyWithScanReply()
  return proto.dcnet.pb.GetEncryptKeyWithScanReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetEncryptKeyWithScanReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetEncryptKeyWithScanReply}
 */
proto.dcnet.pb.GetEncryptKeyWithScanReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setEncryptprivkey(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetEncryptKeyWithScanReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetEncryptKeyWithScanReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetEncryptKeyWithScanReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetEncryptKeyWithScanReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getEncryptprivkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}

/**
 * optional bytes encryptPrivkey = 1;
 * @return {string}
 */
proto.dcnet.pb.GetEncryptKeyWithScanReply.prototype.getEncryptprivkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes encryptPrivkey = 1;
 * This is a type-conversion wrapper around `getEncryptprivkey()`
 * @return {string}
 */
proto.dcnet.pb.GetEncryptKeyWithScanReply.prototype.getEncryptprivkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getEncryptprivkey()))
}

/**
 * optional bytes encryptPrivkey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getEncryptprivkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetEncryptKeyWithScanReply.prototype.getEncryptprivkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getEncryptprivkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetEncryptKeyWithScanReply} returns this
 */
proto.dcnet.pb.GetEncryptKeyWithScanReply.prototype.setEncryptprivkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.RequestRandEncryptKeyRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.RequestRandEncryptKeyRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.RequestRandEncryptKeyRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.RequestRandEncryptKeyRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        enclaveid: msg.getEnclaveid_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.RequestRandEncryptKeyRequest}
 */
proto.dcnet.pb.RequestRandEncryptKeyRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.RequestRandEncryptKeyRequest()
  return proto.dcnet.pb.RequestRandEncryptKeyRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.RequestRandEncryptKeyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.RequestRandEncryptKeyRequest}
 */
proto.dcnet.pb.RequestRandEncryptKeyRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setEnclaveid(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.RequestRandEncryptKeyRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.RequestRandEncryptKeyRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.RequestRandEncryptKeyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.RequestRandEncryptKeyRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getEnclaveid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}

/**
 * optional bytes enclaveid = 1;
 * @return {string}
 */
proto.dcnet.pb.RequestRandEncryptKeyRequest.prototype.getEnclaveid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes enclaveid = 1;
 * This is a type-conversion wrapper around `getEnclaveid()`
 * @return {string}
 */
proto.dcnet.pb.RequestRandEncryptKeyRequest.prototype.getEnclaveid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getEnclaveid()))
}

/**
 * optional bytes enclaveid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getEnclaveid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.RequestRandEncryptKeyRequest.prototype.getEnclaveid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getEnclaveid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.RequestRandEncryptKeyRequest} returns this
 */
proto.dcnet.pb.RequestRandEncryptKeyRequest.prototype.setEnclaveid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.RequestRandEncryptKeyReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.RequestRandEncryptKeyReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.RequestRandEncryptKeyReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.RequestRandEncryptKeyReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        encryptkey: msg.getEncryptkey_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.RequestRandEncryptKeyReply}
 */
proto.dcnet.pb.RequestRandEncryptKeyReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.RequestRandEncryptKeyReply()
  return proto.dcnet.pb.RequestRandEncryptKeyReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.RequestRandEncryptKeyReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.RequestRandEncryptKeyReply}
 */
proto.dcnet.pb.RequestRandEncryptKeyReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setEncryptkey(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.RequestRandEncryptKeyReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.RequestRandEncryptKeyReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.RequestRandEncryptKeyReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.RequestRandEncryptKeyReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getEncryptkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional bytes encryptKey = 1;
 * @return {string}
 */
proto.dcnet.pb.RequestRandEncryptKeyReply.prototype.getEncryptkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes encryptKey = 1;
 * This is a type-conversion wrapper around `getEncryptkey()`
 * @return {string}
 */
proto.dcnet.pb.RequestRandEncryptKeyReply.prototype.getEncryptkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getEncryptkey()))
}

/**
 * optional bytes encryptKey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getEncryptkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.RequestRandEncryptKeyReply.prototype.getEncryptkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getEncryptkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.RequestRandEncryptKeyReply} returns this
 */
proto.dcnet.pb.RequestRandEncryptKeyReply.prototype.setEncryptkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes signature = 2;
 * @return {string}
 */
proto.dcnet.pb.RequestRandEncryptKeyReply.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes signature = 2;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.RequestRandEncryptKeyReply.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.RequestRandEncryptKeyReply.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.RequestRandEncryptKeyReply} returns this
 */
proto.dcnet.pb.RequestRandEncryptKeyReply.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetEncryptKeyRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetEncryptKeyRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetEncryptKeyRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetEncryptKeyRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        peerid: msg.getPeerid_asB64(),
        teereport: msg.getTeereport_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetEncryptKeyRequest}
 */
proto.dcnet.pb.GetEncryptKeyRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetEncryptKeyRequest()
  return proto.dcnet.pb.GetEncryptKeyRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetEncryptKeyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetEncryptKeyRequest}
 */
proto.dcnet.pb.GetEncryptKeyRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setTeereport(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetEncryptKeyRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetEncryptKeyRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetEncryptKeyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetEncryptKeyRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getTeereport_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional bytes peerId = 1;
 * @return {string}
 */
proto.dcnet.pb.GetEncryptKeyRequest.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes peerId = 1;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.GetEncryptKeyRequest.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes peerId = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetEncryptKeyRequest.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetEncryptKeyRequest} returns this
 */
proto.dcnet.pb.GetEncryptKeyRequest.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes teereport = 2;
 * @return {string}
 */
proto.dcnet.pb.GetEncryptKeyRequest.prototype.getTeereport = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes teereport = 2;
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {string}
 */
proto.dcnet.pb.GetEncryptKeyRequest.prototype.getTeereport_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getTeereport()))
}

/**
 * optional bytes teereport = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetEncryptKeyRequest.prototype.getTeereport_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getTeereport()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetEncryptKeyRequest} returns this
 */
proto.dcnet.pb.GetEncryptKeyRequest.prototype.setTeereport = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetEncryptKeyReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetEncryptKeyReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetEncryptKeyReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetEncryptKeyReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        encryptkey: msg.getEncryptkey_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetEncryptKeyReply}
 */
proto.dcnet.pb.GetEncryptKeyReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetEncryptKeyReply()
  return proto.dcnet.pb.GetEncryptKeyReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetEncryptKeyReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetEncryptKeyReply}
 */
proto.dcnet.pb.GetEncryptKeyReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setEncryptkey(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetEncryptKeyReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetEncryptKeyReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetEncryptKeyReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetEncryptKeyReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getEncryptkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional bytes encryptKey = 1;
 * @return {string}
 */
proto.dcnet.pb.GetEncryptKeyReply.prototype.getEncryptkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes encryptKey = 1;
 * This is a type-conversion wrapper around `getEncryptkey()`
 * @return {string}
 */
proto.dcnet.pb.GetEncryptKeyReply.prototype.getEncryptkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getEncryptkey()))
}

/**
 * optional bytes encryptKey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getEncryptkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetEncryptKeyReply.prototype.getEncryptkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getEncryptkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetEncryptKeyReply} returns this
 */
proto.dcnet.pb.GetEncryptKeyReply.prototype.setEncryptkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes signature = 2;
 * @return {string}
 */
proto.dcnet.pb.GetEncryptKeyReply.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes signature = 2;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.GetEncryptKeyReply.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetEncryptKeyReply.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetEncryptKeyReply} returns this
 */
proto.dcnet.pb.GetEncryptKeyReply.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetPeersWithSidRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetPeersWithSidRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetPeersWithSidRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetPeersWithSidRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        sid: jspb.Message.getFieldWithDefault(msg, 1, '')
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetPeersWithSidRequest}
 */
proto.dcnet.pb.GetPeersWithSidRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetPeersWithSidRequest()
  return proto.dcnet.pb.GetPeersWithSidRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetPeersWithSidRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetPeersWithSidRequest}
 */
proto.dcnet.pb.GetPeersWithSidRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {string} */ (reader.readString())
        msg.setSid(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetPeersWithSidRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetPeersWithSidRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetPeersWithSidRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetPeersWithSidRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getSid()
  if (f.length > 0) {
    writer.writeString(1, f)
  }
}

/**
 * optional string sid = 1;
 * @return {string}
 */
proto.dcnet.pb.GetPeersWithSidRequest.prototype.getSid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * @param {string} value
 * @return {!proto.dcnet.pb.GetPeersWithSidRequest} returns this
 */
proto.dcnet.pb.GetPeersWithSidRequest.prototype.setSid = function (value) {
  return jspb.Message.setProto3StringField(this, 1, value)
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dcnet.pb.GetPeersWithSidReply.repeatedFields_ = [1]

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetPeersWithSidReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetPeersWithSidReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetPeersWithSidReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetPeersWithSidReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        peeridsList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetPeersWithSidReply}
 */
proto.dcnet.pb.GetPeersWithSidReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetPeersWithSidReply()
  return proto.dcnet.pb.GetPeersWithSidReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetPeersWithSidReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetPeersWithSidReply}
 */
proto.dcnet.pb.GetPeersWithSidReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {string} */ (reader.readString())
        msg.addPeerids(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetPeersWithSidReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetPeersWithSidReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetPeersWithSidReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetPeersWithSidReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPeeridsList()
  if (f.length > 0) {
    writer.writeRepeatedString(1, f)
  }
}

/**
 * repeated string peerids = 1;
 * @return {!Array<string>}
 */
proto.dcnet.pb.GetPeersWithSidReply.prototype.getPeeridsList = function () {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1))
}

/**
 * @param {!Array<string>} value
 * @return {!proto.dcnet.pb.GetPeersWithSidReply} returns this
 */
proto.dcnet.pb.GetPeersWithSidReply.prototype.setPeeridsList = function (value) {
  return jspb.Message.setField(this, 1, value || [])
}

/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.dcnet.pb.GetPeersWithSidReply} returns this
 */
proto.dcnet.pb.GetPeersWithSidReply.prototype.addPeerids = function (value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index)
}

/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dcnet.pb.GetPeersWithSidReply} returns this
 */
proto.dcnet.pb.GetPeersWithSidReply.prototype.clearPeeridsList = function () {
  return this.setPeeridsList([])
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetPeersWithAccountHashRequest.prototype.toObject = function (
    opt_includeInstance
  ) {
    return proto.dcnet.pb.GetPeersWithAccountHashRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetPeersWithAccountHashRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetPeersWithAccountHashRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        accounthash: msg.getAccounthash_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetPeersWithAccountHashRequest}
 */
proto.dcnet.pb.GetPeersWithAccountHashRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetPeersWithAccountHashRequest()
  return proto.dcnet.pb.GetPeersWithAccountHashRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetPeersWithAccountHashRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetPeersWithAccountHashRequest}
 */
proto.dcnet.pb.GetPeersWithAccountHashRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAccounthash(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetPeersWithAccountHashRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetPeersWithAccountHashRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetPeersWithAccountHashRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetPeersWithAccountHashRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccounthash_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}

/**
 * optional bytes accounthash = 1;
 * @return {string}
 */
proto.dcnet.pb.GetPeersWithAccountHashRequest.prototype.getAccounthash = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes accounthash = 1;
 * This is a type-conversion wrapper around `getAccounthash()`
 * @return {string}
 */
proto.dcnet.pb.GetPeersWithAccountHashRequest.prototype.getAccounthash_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAccounthash()))
}

/**
 * optional bytes accounthash = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAccounthash()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetPeersWithAccountHashRequest.prototype.getAccounthash_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAccounthash()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetPeersWithAccountHashRequest} returns this
 */
proto.dcnet.pb.GetPeersWithAccountHashRequest.prototype.setAccounthash = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dcnet.pb.GetPeersWithAccountHashReply.repeatedFields_ = [1]

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetPeersWithAccountHashReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetPeersWithAccountHashReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetPeersWithAccountHashReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetPeersWithAccountHashReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        peeridsList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetPeersWithAccountHashReply}
 */
proto.dcnet.pb.GetPeersWithAccountHashReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetPeersWithAccountHashReply()
  return proto.dcnet.pb.GetPeersWithAccountHashReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetPeersWithAccountHashReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetPeersWithAccountHashReply}
 */
proto.dcnet.pb.GetPeersWithAccountHashReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {string} */ (reader.readString())
        msg.addPeerids(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetPeersWithAccountHashReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetPeersWithAccountHashReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetPeersWithAccountHashReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetPeersWithAccountHashReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPeeridsList()
  if (f.length > 0) {
    writer.writeRepeatedString(1, f)
  }
}

/**
 * repeated string peerids = 1;
 * @return {!Array<string>}
 */
proto.dcnet.pb.GetPeersWithAccountHashReply.prototype.getPeeridsList = function () {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1))
}

/**
 * @param {!Array<string>} value
 * @return {!proto.dcnet.pb.GetPeersWithAccountHashReply} returns this
 */
proto.dcnet.pb.GetPeersWithAccountHashReply.prototype.setPeeridsList = function (value) {
  return jspb.Message.setField(this, 1, value || [])
}

/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.dcnet.pb.GetPeersWithAccountHashReply} returns this
 */
proto.dcnet.pb.GetPeersWithAccountHashReply.prototype.addPeerids = function (value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index)
}

/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dcnet.pb.GetPeersWithAccountHashReply} returns this
 */
proto.dcnet.pb.GetPeersWithAccountHashReply.prototype.clearPeeridsList = function () {
  return this.setPeeridsList([])
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AccountDealBackupRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AccountDealBackupRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AccountDealBackupRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AccountDealBackupRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        pubkey: msg.getPubkey_asB64(),
        accountencrypt: msg.getAccountencrypt_asB64(),
        accounthashencrypt: msg.getAccounthashencrypt_asB64(),
        prikeyencrypt2: msg.getPrikeyencrypt2_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 5, 0),
        randkeyencrypt: msg.getRandkeyencrypt_asB64(),
        loginkeyrandencrypt: msg.getLoginkeyrandencrypt_asB64(),
        peerid: msg.getPeerid_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AccountDealBackupRequest}
 */
proto.dcnet.pb.AccountDealBackupRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AccountDealBackupRequest()
  return proto.dcnet.pb.AccountDealBackupRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AccountDealBackupRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AccountDealBackupRequest}
 */
proto.dcnet.pb.AccountDealBackupRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPubkey(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAccountencrypt(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAccounthashencrypt(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPrikeyencrypt2(value)
        break
      case 5:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 6:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setRandkeyencrypt(value)
        break
      case 7:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setLoginkeyrandencrypt(value)
        break
      case 8:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      case 9:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AccountDealBackupRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AccountDealBackupRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AccountDealBackupRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getAccountencrypt_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getAccounthashencrypt_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getPrikeyencrypt2_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(5, f)
  }
  f = message.getRandkeyencrypt_asU8()
  if (f.length > 0) {
    writer.writeBytes(6, f)
  }
  f = message.getLoginkeyrandencrypt_asU8()
  if (f.length > 0) {
    writer.writeBytes(7, f)
  }
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(8, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(9, f)
  }
}

/**
 * optional bytes pubkey = 1;
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getPubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes pubkey = 1;
 * This is a type-conversion wrapper around `getPubkey()`
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getPubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPubkey()))
}

/**
 * optional bytes pubkey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getPubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountDealBackupRequest} returns this
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.setPubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes accountencrypt = 2;
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getAccountencrypt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes accountencrypt = 2;
 * This is a type-conversion wrapper around `getAccountencrypt()`
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getAccountencrypt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAccountencrypt()))
}

/**
 * optional bytes accountencrypt = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAccountencrypt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getAccountencrypt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAccountencrypt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountDealBackupRequest} returns this
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.setAccountencrypt = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional bytes accounthashencrypt = 3;
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getAccounthashencrypt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes accounthashencrypt = 3;
 * This is a type-conversion wrapper around `getAccounthashencrypt()`
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getAccounthashencrypt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAccounthashencrypt()))
}

/**
 * optional bytes accounthashencrypt = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAccounthashencrypt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getAccounthashencrypt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAccounthashencrypt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountDealBackupRequest} returns this
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.setAccounthashencrypt = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional bytes prikeyencrypt2 = 4;
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getPrikeyencrypt2 = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes prikeyencrypt2 = 4;
 * This is a type-conversion wrapper around `getPrikeyencrypt2()`
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getPrikeyencrypt2_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPrikeyencrypt2()))
}

/**
 * optional bytes prikeyencrypt2 = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPrikeyencrypt2()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getPrikeyencrypt2_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPrikeyencrypt2()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountDealBackupRequest} returns this
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.setPrikeyencrypt2 = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

/**
 * optional uint32 blockheight = 5;
 * @return {number}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AccountDealBackupRequest} returns this
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 5, value)
}

/**
 * optional bytes randkeyencrypt = 6;
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getRandkeyencrypt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ''))
}

/**
 * optional bytes randkeyencrypt = 6;
 * This is a type-conversion wrapper around `getRandkeyencrypt()`
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getRandkeyencrypt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getRandkeyencrypt()))
}

/**
 * optional bytes randkeyencrypt = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getRandkeyencrypt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getRandkeyencrypt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getRandkeyencrypt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountDealBackupRequest} returns this
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.setRandkeyencrypt = function (value) {
  return jspb.Message.setProto3BytesField(this, 6, value)
}

/**
 * optional bytes loginkeyrandencrypt = 7;
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getLoginkeyrandencrypt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ''))
}

/**
 * optional bytes loginkeyrandencrypt = 7;
 * This is a type-conversion wrapper around `getLoginkeyrandencrypt()`
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getLoginkeyrandencrypt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getLoginkeyrandencrypt()))
}

/**
 * optional bytes loginkeyrandencrypt = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getLoginkeyrandencrypt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getLoginkeyrandencrypt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getLoginkeyrandencrypt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountDealBackupRequest} returns this
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.setLoginkeyrandencrypt = function (value) {
  return jspb.Message.setProto3BytesField(this, 7, value)
}

/**
 * optional bytes peerid = 8;
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ''))
}

/**
 * optional bytes peerid = 8;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes peerid = 8;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountDealBackupRequest} returns this
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 8, value)
}

/**
 * optional bytes signature = 9;
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ''))
}

/**
 * optional bytes signature = 9;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 9;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountDealBackupRequest} returns this
 */
proto.dcnet.pb.AccountDealBackupRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 9, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AccountDealBackupReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AccountDealBackupReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AccountDealBackupReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AccountDealBackupReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AccountDealBackupReply}
 */
proto.dcnet.pb.AccountDealBackupReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AccountDealBackupReply()
  return proto.dcnet.pb.AccountDealBackupReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AccountDealBackupReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AccountDealBackupReply}
 */
proto.dcnet.pb.AccountDealBackupReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealBackupReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AccountDealBackupReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AccountDealBackupReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AccountDealBackupReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetHostIDRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetHostIDRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetHostIDRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetHostIDRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetHostIDRequest}
 */
proto.dcnet.pb.GetHostIDRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetHostIDRequest()
  return proto.dcnet.pb.GetHostIDRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetHostIDRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetHostIDRequest}
 */
proto.dcnet.pb.GetHostIDRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetHostIDRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetHostIDRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetHostIDRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetHostIDRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetHostIDReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetHostIDReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetHostIDReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetHostIDReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        peerid: msg.getPeerid_asB64(),
        reqaddr: msg.getReqaddr_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetHostIDReply}
 */
proto.dcnet.pb.GetHostIDReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetHostIDReply()
  return proto.dcnet.pb.GetHostIDReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetHostIDReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetHostIDReply}
 */
proto.dcnet.pb.GetHostIDReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setReqaddr(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetHostIDReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetHostIDReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetHostIDReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetHostIDReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getReqaddr_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional bytes peerID = 1;
 * @return {string}
 */
proto.dcnet.pb.GetHostIDReply.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes peerID = 1;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.GetHostIDReply.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes peerID = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetHostIDReply.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetHostIDReply} returns this
 */
proto.dcnet.pb.GetHostIDReply.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes reqAddr = 2;
 * @return {string}
 */
proto.dcnet.pb.GetHostIDReply.prototype.getReqaddr = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes reqAddr = 2;
 * This is a type-conversion wrapper around `getReqaddr()`
 * @return {string}
 */
proto.dcnet.pb.GetHostIDReply.prototype.getReqaddr_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getReqaddr()))
}

/**
 * optional bytes reqAddr = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getReqaddr()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetHostIDReply.prototype.getReqaddr_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getReqaddr()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetHostIDReply} returns this
 */
proto.dcnet.pb.GetHostIDReply.prototype.setReqaddr = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.dcnet.pb.GetTokenRequest.oneofGroups_ = [[1, 2]]

/**
 * @enum {number}
 */
proto.dcnet.pb.GetTokenRequest.PayloadCase = {
  PAYLOAD_NOT_SET: 0,
  KEY: 1,
  SIGNATURE: 2
}

/**
 * @return {proto.dcnet.pb.GetTokenRequest.PayloadCase}
 */
proto.dcnet.pb.GetTokenRequest.prototype.getPayloadCase = function () {
  return /** @type {proto.dcnet.pb.GetTokenRequest.PayloadCase} */ (
    jspb.Message.computeOneofCase(this, proto.dcnet.pb.GetTokenRequest.oneofGroups_[0])
  )
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetTokenRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetTokenRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetTokenRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetTokenRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        key: jspb.Message.getFieldWithDefault(msg, 1, ''),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetTokenRequest}
 */
proto.dcnet.pb.GetTokenRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetTokenRequest()
  return proto.dcnet.pb.GetTokenRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetTokenRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetTokenRequest}
 */
proto.dcnet.pb.GetTokenRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {string} */ (reader.readString())
        msg.setKey(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetTokenRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetTokenRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetTokenRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetTokenRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = /** @type {string} */ (jspb.Message.getField(message, 1))
  if (f != null) {
    writer.writeString(1, f)
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 2))
  if (f != null) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional string key = 1;
 * @return {string}
 */
proto.dcnet.pb.GetTokenRequest.prototype.getKey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * @param {string} value
 * @return {!proto.dcnet.pb.GetTokenRequest} returns this
 */
proto.dcnet.pb.GetTokenRequest.prototype.setKey = function (value) {
  return jspb.Message.setOneofField(this, 1, proto.dcnet.pb.GetTokenRequest.oneofGroups_[0], value)
}

/**
 * Clears the field making it undefined.
 * @return {!proto.dcnet.pb.GetTokenRequest} returns this
 */
proto.dcnet.pb.GetTokenRequest.prototype.clearKey = function () {
  return jspb.Message.setOneofField(
    this,
    1,
    proto.dcnet.pb.GetTokenRequest.oneofGroups_[0],
    undefined
  )
}

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dcnet.pb.GetTokenRequest.prototype.hasKey = function () {
  return jspb.Message.getField(this, 1) != null
}

/**
 * optional bytes signature = 2;
 * @return {string}
 */
proto.dcnet.pb.GetTokenRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes signature = 2;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.GetTokenRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetTokenRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetTokenRequest} returns this
 */
proto.dcnet.pb.GetTokenRequest.prototype.setSignature = function (value) {
  return jspb.Message.setOneofField(this, 2, proto.dcnet.pb.GetTokenRequest.oneofGroups_[0], value)
}

/**
 * Clears the field making it undefined.
 * @return {!proto.dcnet.pb.GetTokenRequest} returns this
 */
proto.dcnet.pb.GetTokenRequest.prototype.clearSignature = function () {
  return jspb.Message.setOneofField(
    this,
    2,
    proto.dcnet.pb.GetTokenRequest.oneofGroups_[0],
    undefined
  )
}

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dcnet.pb.GetTokenRequest.prototype.hasSignature = function () {
  return jspb.Message.getField(this, 2) != null
}

/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.dcnet.pb.GetTokenReply.oneofGroups_ = [[1, 2]]

/**
 * @enum {number}
 */
proto.dcnet.pb.GetTokenReply.PayloadCase = {
  PAYLOAD_NOT_SET: 0,
  CHALLENGE: 1,
  TOKEN: 2
}

/**
 * @return {proto.dcnet.pb.GetTokenReply.PayloadCase}
 */
proto.dcnet.pb.GetTokenReply.prototype.getPayloadCase = function () {
  return /** @type {proto.dcnet.pb.GetTokenReply.PayloadCase} */ (
    jspb.Message.computeOneofCase(this, proto.dcnet.pb.GetTokenReply.oneofGroups_[0])
  )
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetTokenReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetTokenReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetTokenReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetTokenReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        challenge: msg.getChallenge_asB64(),
        token: jspb.Message.getFieldWithDefault(msg, 2, '')
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetTokenReply}
 */
proto.dcnet.pb.GetTokenReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetTokenReply()
  return proto.dcnet.pb.GetTokenReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetTokenReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetTokenReply}
 */
proto.dcnet.pb.GetTokenReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setChallenge(value)
        break
      case 2:
        var value = /** @type {string} */ (reader.readString())
        msg.setToken(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetTokenReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetTokenReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetTokenReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetTokenReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 1))
  if (f != null) {
    writer.writeBytes(1, f)
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 2))
  if (f != null) {
    writer.writeString(2, f)
  }
}

/**
 * optional bytes challenge = 1;
 * @return {string}
 */
proto.dcnet.pb.GetTokenReply.prototype.getChallenge = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes challenge = 1;
 * This is a type-conversion wrapper around `getChallenge()`
 * @return {string}
 */
proto.dcnet.pb.GetTokenReply.prototype.getChallenge_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getChallenge()))
}

/**
 * optional bytes challenge = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getChallenge()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetTokenReply.prototype.getChallenge_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getChallenge()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetTokenReply} returns this
 */
proto.dcnet.pb.GetTokenReply.prototype.setChallenge = function (value) {
  return jspb.Message.setOneofField(this, 1, proto.dcnet.pb.GetTokenReply.oneofGroups_[0], value)
}

/**
 * Clears the field making it undefined.
 * @return {!proto.dcnet.pb.GetTokenReply} returns this
 */
proto.dcnet.pb.GetTokenReply.prototype.clearChallenge = function () {
  return jspb.Message.setOneofField(
    this,
    1,
    proto.dcnet.pb.GetTokenReply.oneofGroups_[0],
    undefined
  )
}

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dcnet.pb.GetTokenReply.prototype.hasChallenge = function () {
  return jspb.Message.getField(this, 1) != null
}

/**
 * optional string token = 2;
 * @return {string}
 */
proto.dcnet.pb.GetTokenReply.prototype.getToken = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * @param {string} value
 * @return {!proto.dcnet.pb.GetTokenReply} returns this
 */
proto.dcnet.pb.GetTokenReply.prototype.setToken = function (value) {
  return jspb.Message.setOneofField(this, 2, proto.dcnet.pb.GetTokenReply.oneofGroups_[0], value)
}

/**
 * Clears the field making it undefined.
 * @return {!proto.dcnet.pb.GetTokenReply} returns this
 */
proto.dcnet.pb.GetTokenReply.prototype.clearToken = function () {
  return jspb.Message.setOneofField(
    this,
    2,
    proto.dcnet.pb.GetTokenReply.oneofGroups_[0],
    undefined
  )
}

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dcnet.pb.GetTokenReply.prototype.hasToken = function () {
  return jspb.Message.getField(this, 2) != null
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.CreateThreadRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.CreateThreadRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.CreateThreadRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.CreateThreadRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        threadid: msg.getThreadid_asB64(),
        keys: (f = msg.getKeys()) && proto.dcnet.pb.Keys.toObject(includeInstance, f),
        blockheight: jspb.Message.getFieldWithDefault(msg, 3, 0),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.CreateThreadRequest}
 */
proto.dcnet.pb.CreateThreadRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.CreateThreadRequest()
  return proto.dcnet.pb.CreateThreadRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.CreateThreadRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.CreateThreadRequest}
 */
proto.dcnet.pb.CreateThreadRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setThreadid(value)
        break
      case 2:
        var value = new proto.dcnet.pb.Keys()
        reader.readMessage(value, proto.dcnet.pb.Keys.deserializeBinaryFromReader)
        msg.setKeys(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CreateThreadRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.CreateThreadRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.CreateThreadRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.CreateThreadRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getThreadid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getKeys()
  if (f != null) {
    writer.writeMessage(2, f, proto.dcnet.pb.Keys.serializeBinaryToWriter)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
}

/**
 * optional bytes threadID = 1;
 * @return {string}
 */
proto.dcnet.pb.CreateThreadRequest.prototype.getThreadid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes threadID = 1;
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {string}
 */
proto.dcnet.pb.CreateThreadRequest.prototype.getThreadid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getThreadid()))
}

/**
 * optional bytes threadID = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CreateThreadRequest.prototype.getThreadid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getThreadid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.CreateThreadRequest} returns this
 */
proto.dcnet.pb.CreateThreadRequest.prototype.setThreadid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional Keys keys = 2;
 * @return {?proto.dcnet.pb.Keys}
 */
proto.dcnet.pb.CreateThreadRequest.prototype.getKeys = function () {
  return /** @type{?proto.dcnet.pb.Keys} */ (
    jspb.Message.getWrapperField(this, proto.dcnet.pb.Keys, 2)
  )
}

/**
 * @param {?proto.dcnet.pb.Keys|undefined} value
 * @return {!proto.dcnet.pb.CreateThreadRequest} returns this
 */
proto.dcnet.pb.CreateThreadRequest.prototype.setKeys = function (value) {
  return jspb.Message.setWrapperField(this, 2, value)
}

/**
 * Clears the message field making it undefined.
 * @return {!proto.dcnet.pb.CreateThreadRequest} returns this
 */
proto.dcnet.pb.CreateThreadRequest.prototype.clearKeys = function () {
  return this.setKeys(undefined)
}

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dcnet.pb.CreateThreadRequest.prototype.hasKeys = function () {
  return jspb.Message.getField(this, 2) != null
}

/**
 * optional uint32 blockheight = 3;
 * @return {number}
 */
proto.dcnet.pb.CreateThreadRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.CreateThreadRequest} returns this
 */
proto.dcnet.pb.CreateThreadRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 3, value)
}

/**
 * optional bytes signature = 4;
 * @return {string}
 */
proto.dcnet.pb.CreateThreadRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes signature = 4;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.CreateThreadRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CreateThreadRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.CreateThreadRequest} returns this
 */
proto.dcnet.pb.CreateThreadRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.Keys.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.Keys.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.Keys} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.Keys.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        threadkeyencrpt: msg.getThreadkeyencrpt_asB64(),
        logkeyencrpt: msg.getLogkeyencrpt_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.Keys}
 */
proto.dcnet.pb.Keys.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.Keys()
  return proto.dcnet.pb.Keys.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.Keys} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.Keys}
 */
proto.dcnet.pb.Keys.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setThreadkeyencrpt(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setLogkeyencrpt(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.Keys.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.Keys.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.Keys} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.Keys.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getThreadkeyencrpt_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getLogkeyencrpt_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional bytes threadKeyEncrpt = 1;
 * @return {string}
 */
proto.dcnet.pb.Keys.prototype.getThreadkeyencrpt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes threadKeyEncrpt = 1;
 * This is a type-conversion wrapper around `getThreadkeyencrpt()`
 * @return {string}
 */
proto.dcnet.pb.Keys.prototype.getThreadkeyencrpt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getThreadkeyencrpt()))
}

/**
 * optional bytes threadKeyEncrpt = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getThreadkeyencrpt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.Keys.prototype.getThreadkeyencrpt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getThreadkeyencrpt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.Keys} returns this
 */
proto.dcnet.pb.Keys.prototype.setThreadkeyencrpt = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes logKeyEncrpt = 2;
 * @return {string}
 */
proto.dcnet.pb.Keys.prototype.getLogkeyencrpt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes logKeyEncrpt = 2;
 * This is a type-conversion wrapper around `getLogkeyencrpt()`
 * @return {string}
 */
proto.dcnet.pb.Keys.prototype.getLogkeyencrpt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getLogkeyencrpt()))
}

/**
 * optional bytes logKeyEncrpt = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getLogkeyencrpt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.Keys.prototype.getLogkeyencrpt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getLogkeyencrpt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.Keys} returns this
 */
proto.dcnet.pb.Keys.prototype.setLogkeyencrpt = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dcnet.pb.ThreadInfoReply.repeatedFields_ = [3, 4]

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.ThreadInfoReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.ThreadInfoReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.ThreadInfoReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.ThreadInfoReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        threadid: msg.getThreadid_asB64(),
        logsList: jspb.Message.toObjectList(
          msg.getLogsList(),
          proto.dcnet.pb.LogInfo.toObject,
          includeInstance
        ),
        addrsList: msg.getAddrsList_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.ThreadInfoReply}
 */
proto.dcnet.pb.ThreadInfoReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.ThreadInfoReply()
  return proto.dcnet.pb.ThreadInfoReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.ThreadInfoReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.ThreadInfoReply}
 */
proto.dcnet.pb.ThreadInfoReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setThreadid(value)
        break
      case 3:
        var value = new proto.dcnet.pb.LogInfo()
        reader.readMessage(value, proto.dcnet.pb.LogInfo.deserializeBinaryFromReader)
        msg.addLogs(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.addAddrs(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ThreadInfoReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.ThreadInfoReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.ThreadInfoReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.ThreadInfoReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getThreadid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getLogsList()
  if (f.length > 0) {
    writer.writeRepeatedMessage(3, f, proto.dcnet.pb.LogInfo.serializeBinaryToWriter)
  }
  f = message.getAddrsList_asU8()
  if (f.length > 0) {
    writer.writeRepeatedBytes(4, f)
  }
}

/**
 * optional bytes threadID = 1;
 * @return {string}
 */
proto.dcnet.pb.ThreadInfoReply.prototype.getThreadid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes threadID = 1;
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {string}
 */
proto.dcnet.pb.ThreadInfoReply.prototype.getThreadid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getThreadid()))
}

/**
 * optional bytes threadID = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ThreadInfoReply.prototype.getThreadid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getThreadid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.ThreadInfoReply} returns this
 */
proto.dcnet.pb.ThreadInfoReply.prototype.setThreadid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * repeated LogInfo logs = 3;
 * @return {!Array<!proto.dcnet.pb.LogInfo>}
 */
proto.dcnet.pb.ThreadInfoReply.prototype.getLogsList = function () {
  return /** @type{!Array<!proto.dcnet.pb.LogInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dcnet.pb.LogInfo, 3)
  )
}

/**
 * @param {!Array<!proto.dcnet.pb.LogInfo>} value
 * @return {!proto.dcnet.pb.ThreadInfoReply} returns this
 */
proto.dcnet.pb.ThreadInfoReply.prototype.setLogsList = function (value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value)
}

/**
 * @param {!proto.dcnet.pb.LogInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dcnet.pb.LogInfo}
 */
proto.dcnet.pb.ThreadInfoReply.prototype.addLogs = function (opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(
    this,
    3,
    opt_value,
    proto.dcnet.pb.LogInfo,
    opt_index
  )
}

/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dcnet.pb.ThreadInfoReply} returns this
 */
proto.dcnet.pb.ThreadInfoReply.prototype.clearLogsList = function () {
  return this.setLogsList([])
}

/**
 * repeated bytes addrs = 4;
 * @return {!Array<string>}
 */
proto.dcnet.pb.ThreadInfoReply.prototype.getAddrsList = function () {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4))
}

/**
 * repeated bytes addrs = 4;
 * This is a type-conversion wrapper around `getAddrsList()`
 * @return {!Array<string>}
 */
proto.dcnet.pb.ThreadInfoReply.prototype.getAddrsList_asB64 = function () {
  return /** @type {!Array<string>} */ (jspb.Message.bytesListAsB64(this.getAddrsList()))
}

/**
 * repeated bytes addrs = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAddrsList()`
 * @return {!Array<!Uint8Array>}
 */
proto.dcnet.pb.ThreadInfoReply.prototype.getAddrsList_asU8 = function () {
  return /** @type {!Array<!Uint8Array>} */ (jspb.Message.bytesListAsU8(this.getAddrsList()))
}

/**
 * @param {!(Array<!Uint8Array>|Array<string>)} value
 * @return {!proto.dcnet.pb.ThreadInfoReply} returns this
 */
proto.dcnet.pb.ThreadInfoReply.prototype.setAddrsList = function (value) {
  return jspb.Message.setField(this, 4, value || [])
}

/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 * @return {!proto.dcnet.pb.ThreadInfoReply} returns this
 */
proto.dcnet.pb.ThreadInfoReply.prototype.addAddrs = function (value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index)
}

/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dcnet.pb.ThreadInfoReply} returns this
 */
proto.dcnet.pb.ThreadInfoReply.prototype.clearAddrsList = function () {
  return this.setAddrsList([])
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dcnet.pb.LogInfo.repeatedFields_ = [4]

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.LogInfo.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.LogInfo.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.LogInfo} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.LogInfo.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        id: msg.getId_asB64(),
        pubkey: msg.getPubkey_asB64(),
        privkey: msg.getPrivkey_asB64(),
        addrsList: msg.getAddrsList_asB64(),
        head: msg.getHead_asB64(),
        counter: msg.getCounter_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.LogInfo}
 */
proto.dcnet.pb.LogInfo.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.LogInfo()
  return proto.dcnet.pb.LogInfo.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.LogInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.LogInfo}
 */
proto.dcnet.pb.LogInfo.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setId(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPubkey(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPrivkey(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.addAddrs(value)
        break
      case 5:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setHead(value)
        break
      case 6:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setCounter(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.LogInfo.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.LogInfo.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.LogInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.LogInfo.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getId_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getPubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getPrivkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getAddrsList_asU8()
  if (f.length > 0) {
    writer.writeRepeatedBytes(4, f)
  }
  f = message.getHead_asU8()
  if (f.length > 0) {
    writer.writeBytes(5, f)
  }
  f = message.getCounter_asU8()
  if (f.length > 0) {
    writer.writeBytes(6, f)
  }
}

/**
 * optional bytes ID = 1;
 * @return {string}
 */
proto.dcnet.pb.LogInfo.prototype.getId = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes ID = 1;
 * This is a type-conversion wrapper around `getId()`
 * @return {string}
 */
proto.dcnet.pb.LogInfo.prototype.getId_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getId()))
}

/**
 * optional bytes ID = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getId()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.LogInfo.prototype.getId_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getId()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.LogInfo} returns this
 */
proto.dcnet.pb.LogInfo.prototype.setId = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes pubKey = 2;
 * @return {string}
 */
proto.dcnet.pb.LogInfo.prototype.getPubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes pubKey = 2;
 * This is a type-conversion wrapper around `getPubkey()`
 * @return {string}
 */
proto.dcnet.pb.LogInfo.prototype.getPubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPubkey()))
}

/**
 * optional bytes pubKey = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.LogInfo.prototype.getPubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.LogInfo} returns this
 */
proto.dcnet.pb.LogInfo.prototype.setPubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional bytes privKey = 3;
 * @return {string}
 */
proto.dcnet.pb.LogInfo.prototype.getPrivkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes privKey = 3;
 * This is a type-conversion wrapper around `getPrivkey()`
 * @return {string}
 */
proto.dcnet.pb.LogInfo.prototype.getPrivkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPrivkey()))
}

/**
 * optional bytes privKey = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPrivkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.LogInfo.prototype.getPrivkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPrivkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.LogInfo} returns this
 */
proto.dcnet.pb.LogInfo.prototype.setPrivkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * repeated bytes addrs = 4;
 * @return {!Array<string>}
 */
proto.dcnet.pb.LogInfo.prototype.getAddrsList = function () {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4))
}

/**
 * repeated bytes addrs = 4;
 * This is a type-conversion wrapper around `getAddrsList()`
 * @return {!Array<string>}
 */
proto.dcnet.pb.LogInfo.prototype.getAddrsList_asB64 = function () {
  return /** @type {!Array<string>} */ (jspb.Message.bytesListAsB64(this.getAddrsList()))
}

/**
 * repeated bytes addrs = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAddrsList()`
 * @return {!Array<!Uint8Array>}
 */
proto.dcnet.pb.LogInfo.prototype.getAddrsList_asU8 = function () {
  return /** @type {!Array<!Uint8Array>} */ (jspb.Message.bytesListAsU8(this.getAddrsList()))
}

/**
 * @param {!(Array<!Uint8Array>|Array<string>)} value
 * @return {!proto.dcnet.pb.LogInfo} returns this
 */
proto.dcnet.pb.LogInfo.prototype.setAddrsList = function (value) {
  return jspb.Message.setField(this, 4, value || [])
}

/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 * @return {!proto.dcnet.pb.LogInfo} returns this
 */
proto.dcnet.pb.LogInfo.prototype.addAddrs = function (value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index)
}

/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dcnet.pb.LogInfo} returns this
 */
proto.dcnet.pb.LogInfo.prototype.clearAddrsList = function () {
  return this.setAddrsList([])
}

/**
 * optional bytes head = 5;
 * @return {string}
 */
proto.dcnet.pb.LogInfo.prototype.getHead = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ''))
}

/**
 * optional bytes head = 5;
 * This is a type-conversion wrapper around `getHead()`
 * @return {string}
 */
proto.dcnet.pb.LogInfo.prototype.getHead_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getHead()))
}

/**
 * optional bytes head = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getHead()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.LogInfo.prototype.getHead_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getHead()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.LogInfo} returns this
 */
proto.dcnet.pb.LogInfo.prototype.setHead = function (value) {
  return jspb.Message.setProto3BytesField(this, 5, value)
}

/**
 * optional bytes counter = 6;
 * @return {string}
 */
proto.dcnet.pb.LogInfo.prototype.getCounter = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ''))
}

/**
 * optional bytes counter = 6;
 * This is a type-conversion wrapper around `getCounter()`
 * @return {string}
 */
proto.dcnet.pb.LogInfo.prototype.getCounter_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getCounter()))
}

/**
 * optional bytes counter = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCounter()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.LogInfo.prototype.getCounter_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getCounter()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.LogInfo} returns this
 */
proto.dcnet.pb.LogInfo.prototype.setCounter = function (value) {
  return jspb.Message.setProto3BytesField(this, 6, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.ThreadIDRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.ThreadIDRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.ThreadIDRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.ThreadIDRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.ThreadIDRequest}
 */
proto.dcnet.pb.ThreadIDRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.ThreadIDRequest()
  return proto.dcnet.pb.ThreadIDRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.ThreadIDRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.ThreadIDRequest}
 */
proto.dcnet.pb.ThreadIDRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ThreadIDRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.ThreadIDRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.ThreadIDRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.ThreadIDRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.ThreadIDReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.ThreadIDReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.ThreadIDReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.ThreadIDReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        threadid: msg.getThreadid_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.ThreadIDReply}
 */
proto.dcnet.pb.ThreadIDReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.ThreadIDReply()
  return proto.dcnet.pb.ThreadIDReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.ThreadIDReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.ThreadIDReply}
 */
proto.dcnet.pb.ThreadIDReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setThreadid(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ThreadIDReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.ThreadIDReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.ThreadIDReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.ThreadIDReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getThreadid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}

/**
 * optional bytes threadID = 1;
 * @return {string}
 */
proto.dcnet.pb.ThreadIDReply.prototype.getThreadid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes threadID = 1;
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {string}
 */
proto.dcnet.pb.ThreadIDReply.prototype.getThreadid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getThreadid()))
}

/**
 * optional bytes threadID = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ThreadIDReply.prototype.getThreadid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getThreadid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.ThreadIDReply} returns this
 */
proto.dcnet.pb.ThreadIDReply.prototype.setThreadid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AddThreadToPeerRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AddThreadToPeerRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AddThreadToPeerRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AddThreadToPeerRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        threadid: msg.getThreadid_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 2, 0),
        keys: (f = msg.getKeys()) && proto.dcnet.pb.Keys.toObject(includeInstance, f),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AddThreadToPeerRequest}
 */
proto.dcnet.pb.AddThreadToPeerRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AddThreadToPeerRequest()
  return proto.dcnet.pb.AddThreadToPeerRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AddThreadToPeerRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AddThreadToPeerRequest}
 */
proto.dcnet.pb.AddThreadToPeerRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setThreadid(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 3:
        var value = new proto.dcnet.pb.Keys()
        reader.readMessage(value, proto.dcnet.pb.Keys.deserializeBinaryFromReader)
        msg.setKeys(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AddThreadToPeerRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AddThreadToPeerRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AddThreadToPeerRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getThreadid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getKeys()
  if (f != null) {
    writer.writeMessage(3, f, proto.dcnet.pb.Keys.serializeBinaryToWriter)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
}

/**
 * optional bytes threadID = 1;
 * @return {string}
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.getThreadid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes threadID = 1;
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {string}
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.getThreadid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getThreadid()))
}

/**
 * optional bytes threadID = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.getThreadid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getThreadid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddThreadToPeerRequest} returns this
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.setThreadid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint32 blockheight = 2;
 * @return {number}
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddThreadToPeerRequest} returns this
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional Keys keys = 3;
 * @return {?proto.dcnet.pb.Keys}
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.getKeys = function () {
  return /** @type{?proto.dcnet.pb.Keys} */ (
    jspb.Message.getWrapperField(this, proto.dcnet.pb.Keys, 3)
  )
}

/**
 * @param {?proto.dcnet.pb.Keys|undefined} value
 * @return {!proto.dcnet.pb.AddThreadToPeerRequest} returns this
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.setKeys = function (value) {
  return jspb.Message.setWrapperField(this, 3, value)
}

/**
 * Clears the message field making it undefined.
 * @return {!proto.dcnet.pb.AddThreadToPeerRequest} returns this
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.clearKeys = function () {
  return this.setKeys(undefined)
}

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.hasKeys = function () {
  return jspb.Message.getField(this, 3) != null
}

/**
 * optional bytes signature = 4;
 * @return {string}
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes signature = 4;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddThreadToPeerRequest} returns this
 */
proto.dcnet.pb.AddThreadToPeerRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AddThreadToPeerReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AddThreadToPeerReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AddThreadToPeerReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AddThreadToPeerReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        status: jspb.Message.getFieldWithDefault(msg, 1, 0),
        count: jspb.Message.getFieldWithDefault(msg, 2, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AddThreadToPeerReply}
 */
proto.dcnet.pb.AddThreadToPeerReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AddThreadToPeerReply()
  return proto.dcnet.pb.AddThreadToPeerReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AddThreadToPeerReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AddThreadToPeerReply}
 */
proto.dcnet.pb.AddThreadToPeerReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readInt32())
        msg.setStatus(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readInt64())
        msg.setCount(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddThreadToPeerReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AddThreadToPeerReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AddThreadToPeerReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AddThreadToPeerReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getStatus()
  if (f !== 0) {
    writer.writeInt32(1, f)
  }
  f = message.getCount()
  if (f !== 0) {
    writer.writeInt64(2, f)
  }
}

/**
 * optional int32 status = 1;
 * @return {number}
 */
proto.dcnet.pb.AddThreadToPeerReply.prototype.getStatus = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddThreadToPeerReply} returns this
 */
proto.dcnet.pb.AddThreadToPeerReply.prototype.setStatus = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * optional int64 count = 2;
 * @return {number}
 */
proto.dcnet.pb.AddThreadToPeerReply.prototype.getCount = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddThreadToPeerReply} returns this
 */
proto.dcnet.pb.AddThreadToPeerReply.prototype.setCount = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetThreadRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetThreadRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetThreadRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetThreadRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        threadid: msg.getThreadid_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetThreadRequest}
 */
proto.dcnet.pb.GetThreadRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetThreadRequest()
  return proto.dcnet.pb.GetThreadRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetThreadRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetThreadRequest}
 */
proto.dcnet.pb.GetThreadRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setThreadid(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetThreadRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetThreadRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetThreadRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetThreadRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getThreadid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}

/**
 * optional bytes threadID = 1;
 * @return {string}
 */
proto.dcnet.pb.GetThreadRequest.prototype.getThreadid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes threadID = 1;
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {string}
 */
proto.dcnet.pb.GetThreadRequest.prototype.getThreadid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getThreadid()))
}

/**
 * optional bytes threadID = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetThreadRequest.prototype.getThreadid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getThreadid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetThreadRequest} returns this
 */
proto.dcnet.pb.GetThreadRequest.prototype.setThreadid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.DeleteThreadRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.DeleteThreadRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.DeleteThreadRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.DeleteThreadRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        threadid: msg.getThreadid_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 2, 0),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.DeleteThreadRequest}
 */
proto.dcnet.pb.DeleteThreadRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.DeleteThreadRequest()
  return proto.dcnet.pb.DeleteThreadRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.DeleteThreadRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.DeleteThreadRequest}
 */
proto.dcnet.pb.DeleteThreadRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setThreadid(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteThreadRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.DeleteThreadRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.DeleteThreadRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.DeleteThreadRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getThreadid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
}

/**
 * optional bytes threadID = 1;
 * @return {string}
 */
proto.dcnet.pb.DeleteThreadRequest.prototype.getThreadid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes threadID = 1;
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {string}
 */
proto.dcnet.pb.DeleteThreadRequest.prototype.getThreadid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getThreadid()))
}

/**
 * optional bytes threadID = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteThreadRequest.prototype.getThreadid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getThreadid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteThreadRequest} returns this
 */
proto.dcnet.pb.DeleteThreadRequest.prototype.setThreadid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint32 blockheight = 2;
 * @return {number}
 */
proto.dcnet.pb.DeleteThreadRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.DeleteThreadRequest} returns this
 */
proto.dcnet.pb.DeleteThreadRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional bytes signature = 3;
 * @return {string}
 */
proto.dcnet.pb.DeleteThreadRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes signature = 3;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.DeleteThreadRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteThreadRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteThreadRequest} returns this
 */
proto.dcnet.pb.DeleteThreadRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.DeleteThreadReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.DeleteThreadReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.DeleteThreadReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.DeleteThreadReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.DeleteThreadReply}
 */
proto.dcnet.pb.DeleteThreadReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.DeleteThreadReply()
  return proto.dcnet.pb.DeleteThreadReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.DeleteThreadReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.DeleteThreadReply}
 */
proto.dcnet.pb.DeleteThreadReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteThreadReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.DeleteThreadReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.DeleteThreadReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.DeleteThreadReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.StroeFileRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.StroeFileRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.StroeFileRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.StroeFileRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        cid: msg.getCid_asB64(),
        filesize: jspb.Message.getFieldWithDefault(msg, 2, 0),
        blockheight: jspb.Message.getFieldWithDefault(msg, 3, 0),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.StroeFileRequest}
 */
proto.dcnet.pb.StroeFileRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.StroeFileRequest()
  return proto.dcnet.pb.StroeFileRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.StroeFileRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.StroeFileRequest}
 */
proto.dcnet.pb.StroeFileRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setCid(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint64())
        msg.setFilesize(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StroeFileRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.StroeFileRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.StroeFileRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.StroeFileRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getCid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getFilesize()
  if (f !== 0) {
    writer.writeUint64(2, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
}

/**
 * optional bytes cid = 1;
 * @return {string}
 */
proto.dcnet.pb.StroeFileRequest.prototype.getCid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes cid = 1;
 * This is a type-conversion wrapper around `getCid()`
 * @return {string}
 */
proto.dcnet.pb.StroeFileRequest.prototype.getCid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getCid()))
}

/**
 * optional bytes cid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StroeFileRequest.prototype.getCid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getCid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.StroeFileRequest} returns this
 */
proto.dcnet.pb.StroeFileRequest.prototype.setCid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint64 filesize = 2;
 * @return {number}
 */
proto.dcnet.pb.StroeFileRequest.prototype.getFilesize = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.StroeFileRequest} returns this
 */
proto.dcnet.pb.StroeFileRequest.prototype.setFilesize = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional uint32 blockheight = 3;
 * @return {number}
 */
proto.dcnet.pb.StroeFileRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.StroeFileRequest} returns this
 */
proto.dcnet.pb.StroeFileRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 3, value)
}

/**
 * optional bytes signature = 4;
 * @return {string}
 */
proto.dcnet.pb.StroeFileRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes signature = 4;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.StroeFileRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StroeFileRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.StroeFileRequest} returns this
 */
proto.dcnet.pb.StroeFileRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.StroeFileReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.StroeFileReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.StroeFileReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.StroeFileReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        status: jspb.Message.getFieldWithDefault(msg, 1, 0),
        receivesize: jspb.Message.getFieldWithDefault(msg, 2, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.StroeFileReply}
 */
proto.dcnet.pb.StroeFileReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.StroeFileReply()
  return proto.dcnet.pb.StroeFileReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.StroeFileReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.StroeFileReply}
 */
proto.dcnet.pb.StroeFileReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readInt32())
        msg.setStatus(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint64())
        msg.setReceivesize(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StroeFileReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.StroeFileReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.StroeFileReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.StroeFileReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getStatus()
  if (f !== 0) {
    writer.writeInt32(1, f)
  }
  f = message.getReceivesize()
  if (f !== 0) {
    writer.writeUint64(2, f)
  }
}

/**
 * optional int32 status = 1;
 * @return {number}
 */
proto.dcnet.pb.StroeFileReply.prototype.getStatus = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.StroeFileReply} returns this
 */
proto.dcnet.pb.StroeFileReply.prototype.setStatus = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * optional uint64 receivesize = 2;
 * @return {number}
 */
proto.dcnet.pb.StroeFileReply.prototype.getReceivesize = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.StroeFileReply} returns this
 */
proto.dcnet.pb.StroeFileReply.prototype.setReceivesize = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.DeleteFileRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.DeleteFileRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.DeleteFileRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.DeleteFileRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        cid: msg.getCid_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 2, 0),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.DeleteFileRequest}
 */
proto.dcnet.pb.DeleteFileRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.DeleteFileRequest()
  return proto.dcnet.pb.DeleteFileRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.DeleteFileRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.DeleteFileRequest}
 */
proto.dcnet.pb.DeleteFileRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setCid(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteFileRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.DeleteFileRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.DeleteFileRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.DeleteFileRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getCid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
}

/**
 * optional bytes cid = 1;
 * @return {string}
 */
proto.dcnet.pb.DeleteFileRequest.prototype.getCid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes cid = 1;
 * This is a type-conversion wrapper around `getCid()`
 * @return {string}
 */
proto.dcnet.pb.DeleteFileRequest.prototype.getCid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getCid()))
}

/**
 * optional bytes cid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteFileRequest.prototype.getCid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getCid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteFileRequest} returns this
 */
proto.dcnet.pb.DeleteFileRequest.prototype.setCid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint32 blockheight = 2;
 * @return {number}
 */
proto.dcnet.pb.DeleteFileRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.DeleteFileRequest} returns this
 */
proto.dcnet.pb.DeleteFileRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional bytes signature = 3;
 * @return {string}
 */
proto.dcnet.pb.DeleteFileRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes signature = 3;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.DeleteFileRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteFileRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteFileRequest} returns this
 */
proto.dcnet.pb.DeleteFileRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.DeleteFileReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.DeleteFileReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.DeleteFileReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.DeleteFileReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.DeleteFileReply}
 */
proto.dcnet.pb.DeleteFileReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.DeleteFileReply()
  return proto.dcnet.pb.DeleteFileReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.DeleteFileReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.DeleteFileReply}
 */
proto.dcnet.pb.DeleteFileReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {boolean} */ (reader.readBool())
        msg.setFlag(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteFileReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.DeleteFileReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.DeleteFileReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.DeleteFileReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f) {
    writer.writeBool(1, f)
  }
}

/**
 * optional bool flag = 1;
 * @return {boolean}
 */
proto.dcnet.pb.DeleteFileReply.prototype.getFlag = function () {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false))
}

/**
 * @param {boolean} value
 * @return {!proto.dcnet.pb.DeleteFileReply} returns this
 */
proto.dcnet.pb.DeleteFileReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3BooleanField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.StoreFolderRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.StoreFolderRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.StoreFolderRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.StoreFolderRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        cid: msg.getCid_asB64(),
        foldersize: jspb.Message.getFieldWithDefault(msg, 2, 0),
        filecount: jspb.Message.getFieldWithDefault(msg, 3, 0),
        blockheight: jspb.Message.getFieldWithDefault(msg, 4, 0),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.StoreFolderRequest}
 */
proto.dcnet.pb.StoreFolderRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.StoreFolderRequest()
  return proto.dcnet.pb.StoreFolderRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.StoreFolderRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.StoreFolderRequest}
 */
proto.dcnet.pb.StoreFolderRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setCid(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint64())
        msg.setFoldersize(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFilecount(value)
        break
      case 4:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 5:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StoreFolderRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.StoreFolderRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.StoreFolderRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.StoreFolderRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getCid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getFoldersize()
  if (f !== 0) {
    writer.writeUint64(2, f)
  }
  f = message.getFilecount()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(4, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(5, f)
  }
}

/**
 * optional bytes cid = 1;
 * @return {string}
 */
proto.dcnet.pb.StoreFolderRequest.prototype.getCid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes cid = 1;
 * This is a type-conversion wrapper around `getCid()`
 * @return {string}
 */
proto.dcnet.pb.StoreFolderRequest.prototype.getCid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getCid()))
}

/**
 * optional bytes cid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StoreFolderRequest.prototype.getCid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getCid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.StoreFolderRequest} returns this
 */
proto.dcnet.pb.StoreFolderRequest.prototype.setCid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint64 foldersize = 2;
 * @return {number}
 */
proto.dcnet.pb.StoreFolderRequest.prototype.getFoldersize = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.StoreFolderRequest} returns this
 */
proto.dcnet.pb.StoreFolderRequest.prototype.setFoldersize = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional uint32 filecount = 3;
 * @return {number}
 */
proto.dcnet.pb.StoreFolderRequest.prototype.getFilecount = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.StoreFolderRequest} returns this
 */
proto.dcnet.pb.StoreFolderRequest.prototype.setFilecount = function (value) {
  return jspb.Message.setProto3IntField(this, 3, value)
}

/**
 * optional uint32 blockheight = 4;
 * @return {number}
 */
proto.dcnet.pb.StoreFolderRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.StoreFolderRequest} returns this
 */
proto.dcnet.pb.StoreFolderRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 4, value)
}

/**
 * optional bytes signature = 5;
 * @return {string}
 */
proto.dcnet.pb.StoreFolderRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ''))
}

/**
 * optional bytes signature = 5;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.StoreFolderRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StoreFolderRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.StoreFolderRequest} returns this
 */
proto.dcnet.pb.StoreFolderRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 5, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.StoreFolderReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.StoreFolderReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.StoreFolderReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.StoreFolderReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        status: jspb.Message.getFieldWithDefault(msg, 1, 0),
        receivecount: jspb.Message.getFieldWithDefault(msg, 2, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.StoreFolderReply}
 */
proto.dcnet.pb.StoreFolderReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.StoreFolderReply()
  return proto.dcnet.pb.StoreFolderReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.StoreFolderReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.StoreFolderReply}
 */
proto.dcnet.pb.StoreFolderReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readInt32())
        msg.setStatus(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setReceivecount(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.StoreFolderReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.StoreFolderReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.StoreFolderReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.StoreFolderReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getStatus()
  if (f !== 0) {
    writer.writeInt32(1, f)
  }
  f = message.getReceivecount()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
}

/**
 * optional int32 status = 1;
 * @return {number}
 */
proto.dcnet.pb.StoreFolderReply.prototype.getStatus = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.StoreFolderReply} returns this
 */
proto.dcnet.pb.StoreFolderReply.prototype.setStatus = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * optional uint32 receivecount = 2;
 * @return {number}
 */
proto.dcnet.pb.StoreFolderReply.prototype.getReceivecount = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.StoreFolderReply} returns this
 */
proto.dcnet.pb.StoreFolderReply.prototype.setReceivecount = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AccountDealRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AccountDealRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AccountDealRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AccountDealRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        accountencrypt: msg.getAccountencrypt_asB64(),
        accounthashencrypt: msg.getAccounthashencrypt_asB64(),
        prikeyencrypt2: msg.getPrikeyencrypt2_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 4, 0),
        loginkeyrandencrypt: msg.getLoginkeyrandencrypt_asB64(),
        peerid: msg.getPeerid_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AccountDealRequest}
 */
proto.dcnet.pb.AccountDealRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AccountDealRequest()
  return proto.dcnet.pb.AccountDealRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AccountDealRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AccountDealRequest}
 */
proto.dcnet.pb.AccountDealRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAccountencrypt(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAccounthashencrypt(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPrikeyencrypt2(value)
        break
      case 4:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 5:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setLoginkeyrandencrypt(value)
        break
      case 6:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      case 7:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AccountDealRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AccountDealRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AccountDealRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccountencrypt_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getAccounthashencrypt_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getPrikeyencrypt2_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(4, f)
  }
  f = message.getLoginkeyrandencrypt_asU8()
  if (f.length > 0) {
    writer.writeBytes(5, f)
  }
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(6, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(7, f)
  }
}

/**
 * optional bytes accountencrypt = 1;
 * @return {string}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getAccountencrypt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes accountencrypt = 1;
 * This is a type-conversion wrapper around `getAccountencrypt()`
 * @return {string}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getAccountencrypt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAccountencrypt()))
}

/**
 * optional bytes accountencrypt = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAccountencrypt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getAccountencrypt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAccountencrypt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountDealRequest} returns this
 */
proto.dcnet.pb.AccountDealRequest.prototype.setAccountencrypt = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes accounthashencrypt = 2;
 * @return {string}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getAccounthashencrypt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes accounthashencrypt = 2;
 * This is a type-conversion wrapper around `getAccounthashencrypt()`
 * @return {string}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getAccounthashencrypt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAccounthashencrypt()))
}

/**
 * optional bytes accounthashencrypt = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAccounthashencrypt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getAccounthashencrypt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAccounthashencrypt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountDealRequest} returns this
 */
proto.dcnet.pb.AccountDealRequest.prototype.setAccounthashencrypt = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional bytes prikeyencrypt2 = 3;
 * @return {string}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getPrikeyencrypt2 = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes prikeyencrypt2 = 3;
 * This is a type-conversion wrapper around `getPrikeyencrypt2()`
 * @return {string}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getPrikeyencrypt2_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPrikeyencrypt2()))
}

/**
 * optional bytes prikeyencrypt2 = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPrikeyencrypt2()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getPrikeyencrypt2_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPrikeyencrypt2()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountDealRequest} returns this
 */
proto.dcnet.pb.AccountDealRequest.prototype.setPrikeyencrypt2 = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional uint32 blockheight = 4;
 * @return {number}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AccountDealRequest} returns this
 */
proto.dcnet.pb.AccountDealRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 4, value)
}

/**
 * optional bytes loginkeyrandencrypt = 5;
 * @return {string}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getLoginkeyrandencrypt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ''))
}

/**
 * optional bytes loginkeyrandencrypt = 5;
 * This is a type-conversion wrapper around `getLoginkeyrandencrypt()`
 * @return {string}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getLoginkeyrandencrypt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getLoginkeyrandencrypt()))
}

/**
 * optional bytes loginkeyrandencrypt = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getLoginkeyrandencrypt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getLoginkeyrandencrypt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getLoginkeyrandencrypt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountDealRequest} returns this
 */
proto.dcnet.pb.AccountDealRequest.prototype.setLoginkeyrandencrypt = function (value) {
  return jspb.Message.setProto3BytesField(this, 5, value)
}

/**
 * optional bytes peerid = 6;
 * @return {string}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ''))
}

/**
 * optional bytes peerid = 6;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes peerid = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountDealRequest} returns this
 */
proto.dcnet.pb.AccountDealRequest.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 6, value)
}

/**
 * optional bytes signature = 7;
 * @return {string}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ''))
}

/**
 * optional bytes signature = 7;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountDealRequest} returns this
 */
proto.dcnet.pb.AccountDealRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 7, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AccountDealReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AccountDealReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AccountDealReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AccountDealReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AccountDealReply}
 */
proto.dcnet.pb.AccountDealReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AccountDealReply()
  return proto.dcnet.pb.AccountDealReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AccountDealReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AccountDealReply}
 */
proto.dcnet.pb.AccountDealReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountDealReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AccountDealReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AccountDealReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AccountDealReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AccountLoginRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AccountLoginRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AccountLoginRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AccountLoginRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        accounthashencrypt: msg.getAccounthashencrypt_asB64(),
        pubkeyencrypt: msg.getPubkeyencrypt_asB64(),
        loginkeyrandencrypt: msg.getLoginkeyrandencrypt_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AccountLoginRequest}
 */
proto.dcnet.pb.AccountLoginRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AccountLoginRequest()
  return proto.dcnet.pb.AccountLoginRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AccountLoginRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AccountLoginRequest}
 */
proto.dcnet.pb.AccountLoginRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAccounthashencrypt(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPubkeyencrypt(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setLoginkeyrandencrypt(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountLoginRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AccountLoginRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AccountLoginRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AccountLoginRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccounthashencrypt_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getPubkeyencrypt_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getLoginkeyrandencrypt_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
}

/**
 * optional bytes accounthashencrypt = 1;
 * @return {string}
 */
proto.dcnet.pb.AccountLoginRequest.prototype.getAccounthashencrypt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes accounthashencrypt = 1;
 * This is a type-conversion wrapper around `getAccounthashencrypt()`
 * @return {string}
 */
proto.dcnet.pb.AccountLoginRequest.prototype.getAccounthashencrypt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAccounthashencrypt()))
}

/**
 * optional bytes accounthashencrypt = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAccounthashencrypt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountLoginRequest.prototype.getAccounthashencrypt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAccounthashencrypt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountLoginRequest} returns this
 */
proto.dcnet.pb.AccountLoginRequest.prototype.setAccounthashencrypt = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes pubkeyencrypt = 2;
 * @return {string}
 */
proto.dcnet.pb.AccountLoginRequest.prototype.getPubkeyencrypt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes pubkeyencrypt = 2;
 * This is a type-conversion wrapper around `getPubkeyencrypt()`
 * @return {string}
 */
proto.dcnet.pb.AccountLoginRequest.prototype.getPubkeyencrypt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPubkeyencrypt()))
}

/**
 * optional bytes pubkeyencrypt = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPubkeyencrypt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountLoginRequest.prototype.getPubkeyencrypt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPubkeyencrypt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountLoginRequest} returns this
 */
proto.dcnet.pb.AccountLoginRequest.prototype.setPubkeyencrypt = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional bytes loginkeyrandencrypt = 3;
 * @return {string}
 */
proto.dcnet.pb.AccountLoginRequest.prototype.getLoginkeyrandencrypt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes loginkeyrandencrypt = 3;
 * This is a type-conversion wrapper around `getLoginkeyrandencrypt()`
 * @return {string}
 */
proto.dcnet.pb.AccountLoginRequest.prototype.getLoginkeyrandencrypt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getLoginkeyrandencrypt()))
}

/**
 * optional bytes loginkeyrandencrypt = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getLoginkeyrandencrypt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountLoginRequest.prototype.getLoginkeyrandencrypt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getLoginkeyrandencrypt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountLoginRequest} returns this
 */
proto.dcnet.pb.AccountLoginRequest.prototype.setLoginkeyrandencrypt = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AccountLoginReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AccountLoginReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AccountLoginReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AccountLoginReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        prikeyencrypt2: msg.getPrikeyencrypt2_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AccountLoginReply}
 */
proto.dcnet.pb.AccountLoginReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AccountLoginReply()
  return proto.dcnet.pb.AccountLoginReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AccountLoginReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AccountLoginReply}
 */
proto.dcnet.pb.AccountLoginReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPrikeyencrypt2(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountLoginReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AccountLoginReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AccountLoginReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AccountLoginReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPrikeyencrypt2_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}

/**
 * optional bytes prikeyencrypt2 = 1;
 * @return {string}
 */
proto.dcnet.pb.AccountLoginReply.prototype.getPrikeyencrypt2 = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes prikeyencrypt2 = 1;
 * This is a type-conversion wrapper around `getPrikeyencrypt2()`
 * @return {string}
 */
proto.dcnet.pb.AccountLoginReply.prototype.getPrikeyencrypt2_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPrikeyencrypt2()))
}

/**
 * optional bytes prikeyencrypt2 = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPrikeyencrypt2()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AccountLoginReply.prototype.getPrikeyencrypt2_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPrikeyencrypt2()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AccountLoginReply} returns this
 */
proto.dcnet.pb.AccountLoginReply.prototype.setPrikeyencrypt2 = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.TransferAccountRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.TransferAccountRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.TransferAccountRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.TransferAccountRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        accounthashencrypt: msg.getAccounthashencrypt_asB64(),
        recvpubkey: msg.getRecvpubkey_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 3, 0),
        peerid: msg.getPeerid_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.TransferAccountRequest}
 */
proto.dcnet.pb.TransferAccountRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.TransferAccountRequest()
  return proto.dcnet.pb.TransferAccountRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.TransferAccountRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.TransferAccountRequest}
 */
proto.dcnet.pb.TransferAccountRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAccounthashencrypt(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setRecvpubkey(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      case 5:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.TransferAccountRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.TransferAccountRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.TransferAccountRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.TransferAccountRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAccounthashencrypt_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getRecvpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(5, f)
  }
}

/**
 * optional bytes accounthashencrypt = 1;
 * @return {string}
 */
proto.dcnet.pb.TransferAccountRequest.prototype.getAccounthashencrypt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes accounthashencrypt = 1;
 * This is a type-conversion wrapper around `getAccounthashencrypt()`
 * @return {string}
 */
proto.dcnet.pb.TransferAccountRequest.prototype.getAccounthashencrypt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAccounthashencrypt()))
}

/**
 * optional bytes accounthashencrypt = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAccounthashencrypt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.TransferAccountRequest.prototype.getAccounthashencrypt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAccounthashencrypt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.TransferAccountRequest} returns this
 */
proto.dcnet.pb.TransferAccountRequest.prototype.setAccounthashencrypt = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes recvpubkey = 2;
 * @return {string}
 */
proto.dcnet.pb.TransferAccountRequest.prototype.getRecvpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes recvpubkey = 2;
 * This is a type-conversion wrapper around `getRecvpubkey()`
 * @return {string}
 */
proto.dcnet.pb.TransferAccountRequest.prototype.getRecvpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getRecvpubkey()))
}

/**
 * optional bytes recvpubkey = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getRecvpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.TransferAccountRequest.prototype.getRecvpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getRecvpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.TransferAccountRequest} returns this
 */
proto.dcnet.pb.TransferAccountRequest.prototype.setRecvpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional uint32 blockheight = 3;
 * @return {number}
 */
proto.dcnet.pb.TransferAccountRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.TransferAccountRequest} returns this
 */
proto.dcnet.pb.TransferAccountRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 3, value)
}

/**
 * optional bytes peerid = 4;
 * @return {string}
 */
proto.dcnet.pb.TransferAccountRequest.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes peerid = 4;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.TransferAccountRequest.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes peerid = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.TransferAccountRequest.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.TransferAccountRequest} returns this
 */
proto.dcnet.pb.TransferAccountRequest.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

/**
 * optional bytes signature = 5;
 * @return {string}
 */
proto.dcnet.pb.TransferAccountRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ''))
}

/**
 * optional bytes signature = 5;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.TransferAccountRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.TransferAccountRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.TransferAccountRequest} returns this
 */
proto.dcnet.pb.TransferAccountRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 5, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.TransferAccountReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.TransferAccountReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.TransferAccountReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.TransferAccountReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.TransferAccountReply}
 */
proto.dcnet.pb.TransferAccountReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.TransferAccountReply()
  return proto.dcnet.pb.TransferAccountReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.TransferAccountReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.TransferAccountReply}
 */
proto.dcnet.pb.TransferAccountReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.TransferAccountReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.TransferAccountReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.TransferAccountReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.TransferAccountReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.SetUserDefaultDBRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.SetUserDefaultDBRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.SetUserDefaultDBRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.SetUserDefaultDBRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        dbinfocrypt: msg.getDbinfocrypt_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 2, 0),
        peerid: msg.getPeerid_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.SetUserDefaultDBRequest}
 */
proto.dcnet.pb.SetUserDefaultDBRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.SetUserDefaultDBRequest()
  return proto.dcnet.pb.SetUserDefaultDBRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.SetUserDefaultDBRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.SetUserDefaultDBRequest}
 */
proto.dcnet.pb.SetUserDefaultDBRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setDbinfocrypt(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.SetUserDefaultDBRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.SetUserDefaultDBRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.SetUserDefaultDBRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getDbinfocrypt_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
}

/**
 * optional bytes dbinfocrypt = 1;
 * @return {string}
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.getDbinfocrypt = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes dbinfocrypt = 1;
 * This is a type-conversion wrapper around `getDbinfocrypt()`
 * @return {string}
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.getDbinfocrypt_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getDbinfocrypt()))
}

/**
 * optional bytes dbinfocrypt = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getDbinfocrypt()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.getDbinfocrypt_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getDbinfocrypt()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SetUserDefaultDBRequest} returns this
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.setDbinfocrypt = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint32 blockheight = 2;
 * @return {number}
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.SetUserDefaultDBRequest} returns this
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional bytes peerid = 3;
 * @return {string}
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes peerid = 3;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes peerid = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SetUserDefaultDBRequest} returns this
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional bytes signature = 4;
 * @return {string}
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes signature = 4;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SetUserDefaultDBRequest} returns this
 */
proto.dcnet.pb.SetUserDefaultDBRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.SetUserDefaultDBReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.SetUserDefaultDBReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.SetUserDefaultDBReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.SetUserDefaultDBReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.SetUserDefaultDBReply}
 */
proto.dcnet.pb.SetUserDefaultDBReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.SetUserDefaultDBReply()
  return proto.dcnet.pb.SetUserDefaultDBReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.SetUserDefaultDBReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.SetUserDefaultDBReply}
 */
proto.dcnet.pb.SetUserDefaultDBReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetUserDefaultDBReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.SetUserDefaultDBReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.SetUserDefaultDBReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.SetUserDefaultDBReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AddSubPubkeyRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AddSubPubkeyRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AddSubPubkeyRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AddSubPubkeyRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        subpubkey: msg.getSubpubkey_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 2, 0),
        peerid: msg.getPeerid_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AddSubPubkeyRequest}
 */
proto.dcnet.pb.AddSubPubkeyRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AddSubPubkeyRequest()
  return proto.dcnet.pb.AddSubPubkeyRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AddSubPubkeyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AddSubPubkeyRequest}
 */
proto.dcnet.pb.AddSubPubkeyRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSubpubkey(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AddSubPubkeyRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AddSubPubkeyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AddSubPubkeyRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getSubpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
}

/**
 * optional bytes subpubkey = 1;
 * @return {string}
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.getSubpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes subpubkey = 1;
 * This is a type-conversion wrapper around `getSubpubkey()`
 * @return {string}
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.getSubpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSubpubkey()))
}

/**
 * optional bytes subpubkey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSubpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.getSubpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSubpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddSubPubkeyRequest} returns this
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.setSubpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint32 blockheight = 2;
 * @return {number}
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddSubPubkeyRequest} returns this
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional bytes peerid = 3;
 * @return {string}
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes peerid = 3;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes peerid = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddSubPubkeyRequest} returns this
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional bytes signature = 4;
 * @return {string}
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes signature = 4;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddSubPubkeyRequest} returns this
 */
proto.dcnet.pb.AddSubPubkeyRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AddSubPubkeyReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AddSubPubkeyReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AddSubPubkeyReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AddSubPubkeyReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AddSubPubkeyReply}
 */
proto.dcnet.pb.AddSubPubkeyReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AddSubPubkeyReply()
  return proto.dcnet.pb.AddSubPubkeyReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AddSubPubkeyReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AddSubPubkeyReply}
 */
proto.dcnet.pb.AddSubPubkeyReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddSubPubkeyReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AddSubPubkeyReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AddSubPubkeyReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AddSubPubkeyReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.DeleteSubPubkeyRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.DeleteSubPubkeyRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.DeleteSubPubkeyRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        subpubkey: msg.getSubpubkey_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 2, 0),
        peerid: msg.getPeerid_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.DeleteSubPubkeyRequest}
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.DeleteSubPubkeyRequest()
  return proto.dcnet.pb.DeleteSubPubkeyRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.DeleteSubPubkeyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.DeleteSubPubkeyRequest}
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSubpubkey(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.DeleteSubPubkeyRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.DeleteSubPubkeyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getSubpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
}

/**
 * optional bytes subpubkey = 1;
 * @return {string}
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.getSubpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes subpubkey = 1;
 * This is a type-conversion wrapper around `getSubpubkey()`
 * @return {string}
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.getSubpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSubpubkey()))
}

/**
 * optional bytes subpubkey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSubpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.getSubpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSubpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteSubPubkeyRequest} returns this
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.setSubpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint32 blockheight = 2;
 * @return {number}
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.DeleteSubPubkeyRequest} returns this
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional bytes peerid = 3;
 * @return {string}
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes peerid = 3;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes peerid = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteSubPubkeyRequest} returns this
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional bytes signature = 4;
 * @return {string}
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes signature = 4;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteSubPubkeyRequest} returns this
 */
proto.dcnet.pb.DeleteSubPubkeyRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.DeleteSubPubkeyReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.DeleteSubPubkeyReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.DeleteSubPubkeyReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.DeleteSubPubkeyReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.DeleteSubPubkeyReply}
 */
proto.dcnet.pb.DeleteSubPubkeyReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.DeleteSubPubkeyReply()
  return proto.dcnet.pb.DeleteSubPubkeyReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.DeleteSubPubkeyReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.DeleteSubPubkeyReply}
 */
proto.dcnet.pb.DeleteSubPubkeyReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteSubPubkeyReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.DeleteSubPubkeyReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.DeleteSubPubkeyReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.DeleteSubPubkeyReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.BindAccessPeerToUserRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.BindAccessPeerToUserRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.BindAccessPeerToUserRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.BindAccessPeerToUserRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        blockheight: jspb.Message.getFieldWithDefault(msg, 1, 0),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.BindAccessPeerToUserRequest}
 */
proto.dcnet.pb.BindAccessPeerToUserRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.BindAccessPeerToUserRequest()
  return proto.dcnet.pb.BindAccessPeerToUserRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.BindAccessPeerToUserRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.BindAccessPeerToUserRequest}
 */
proto.dcnet.pb.BindAccessPeerToUserRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.BindAccessPeerToUserRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.BindAccessPeerToUserRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.BindAccessPeerToUserRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.BindAccessPeerToUserRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional uint32 blockheight = 1;
 * @return {number}
 */
proto.dcnet.pb.BindAccessPeerToUserRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.BindAccessPeerToUserRequest} returns this
 */
proto.dcnet.pb.BindAccessPeerToUserRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * optional bytes signature = 2;
 * @return {string}
 */
proto.dcnet.pb.BindAccessPeerToUserRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes signature = 2;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.BindAccessPeerToUserRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.BindAccessPeerToUserRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.BindAccessPeerToUserRequest} returns this
 */
proto.dcnet.pb.BindAccessPeerToUserRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.BindAccessPeerToUserReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.BindAccessPeerToUserReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.BindAccessPeerToUserReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.BindAccessPeerToUserReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.BindAccessPeerToUserReply}
 */
proto.dcnet.pb.BindAccessPeerToUserReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.BindAccessPeerToUserReply()
  return proto.dcnet.pb.BindAccessPeerToUserReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.BindAccessPeerToUserReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.BindAccessPeerToUserReply}
 */
proto.dcnet.pb.BindAccessPeerToUserReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.BindAccessPeerToUserReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.BindAccessPeerToUserReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.BindAccessPeerToUserReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.BindAccessPeerToUserReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.ValidTokenRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.ValidTokenRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.ValidTokenRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.ValidTokenRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.ValidTokenRequest}
 */
proto.dcnet.pb.ValidTokenRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.ValidTokenRequest()
  return proto.dcnet.pb.ValidTokenRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.ValidTokenRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.ValidTokenRequest}
 */
proto.dcnet.pb.ValidTokenRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ValidTokenRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.ValidTokenRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.ValidTokenRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.ValidTokenRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.ValidTokenReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.ValidTokenReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.ValidTokenReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.ValidTokenReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.ValidTokenReply}
 */
proto.dcnet.pb.ValidTokenReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.ValidTokenReply()
  return proto.dcnet.pb.ValidTokenReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.ValidTokenReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.ValidTokenReply}
 */
proto.dcnet.pb.ValidTokenReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ValidTokenReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.ValidTokenReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.ValidTokenReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.ValidTokenReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AddLogToThreadRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AddLogToThreadRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AddLogToThreadRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AddLogToThreadRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        threadid: msg.getThreadid_asB64(),
        logid: msg.getLogid_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 3, 0),
        peerid: msg.getPeerid_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AddLogToThreadRequest}
 */
proto.dcnet.pb.AddLogToThreadRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AddLogToThreadRequest()
  return proto.dcnet.pb.AddLogToThreadRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AddLogToThreadRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AddLogToThreadRequest}
 */
proto.dcnet.pb.AddLogToThreadRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setThreadid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setLogid(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      case 5:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AddLogToThreadRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AddLogToThreadRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AddLogToThreadRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getThreadid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getLogid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(5, f)
  }
}

/**
 * optional bytes threadID = 1;
 * @return {string}
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.getThreadid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes threadID = 1;
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {string}
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.getThreadid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getThreadid()))
}

/**
 * optional bytes threadID = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.getThreadid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getThreadid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddLogToThreadRequest} returns this
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.setThreadid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes logID = 2;
 * @return {string}
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.getLogid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes logID = 2;
 * This is a type-conversion wrapper around `getLogid()`
 * @return {string}
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.getLogid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getLogid()))
}

/**
 * optional bytes logID = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getLogid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.getLogid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getLogid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddLogToThreadRequest} returns this
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.setLogid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional uint32 blockheight = 3;
 * @return {number}
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddLogToThreadRequest} returns this
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 3, value)
}

/**
 * optional bytes peerid = 4;
 * @return {string}
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes peerid = 4;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes peerid = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddLogToThreadRequest} returns this
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

/**
 * optional bytes signature = 5;
 * @return {string}
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ''))
}

/**
 * optional bytes signature = 5;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddLogToThreadRequest} returns this
 */
proto.dcnet.pb.AddLogToThreadRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 5, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AddLogToThreadReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AddLogToThreadReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AddLogToThreadReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AddLogToThreadReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AddLogToThreadReply}
 */
proto.dcnet.pb.AddLogToThreadReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AddLogToThreadReply()
  return proto.dcnet.pb.AddLogToThreadReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AddLogToThreadReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AddLogToThreadReply}
 */
proto.dcnet.pb.AddLogToThreadReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddLogToThreadReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AddLogToThreadReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AddLogToThreadReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AddLogToThreadReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AddThreadSpaceRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AddThreadSpaceRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AddThreadSpaceRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AddThreadSpaceRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        threadid: msg.getThreadid_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 2, 0),
        space: jspb.Message.getFieldWithDefault(msg, 3, 0),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AddThreadSpaceRequest}
 */
proto.dcnet.pb.AddThreadSpaceRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AddThreadSpaceRequest()
  return proto.dcnet.pb.AddThreadSpaceRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AddThreadSpaceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AddThreadSpaceRequest}
 */
proto.dcnet.pb.AddThreadSpaceRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setThreadid(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setSpace(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddThreadSpaceRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AddThreadSpaceRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AddThreadSpaceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AddThreadSpaceRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getThreadid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getSpace()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
}

/**
 * optional bytes threadID = 1;
 * @return {string}
 */
proto.dcnet.pb.AddThreadSpaceRequest.prototype.getThreadid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes threadID = 1;
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {string}
 */
proto.dcnet.pb.AddThreadSpaceRequest.prototype.getThreadid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getThreadid()))
}

/**
 * optional bytes threadID = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddThreadSpaceRequest.prototype.getThreadid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getThreadid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddThreadSpaceRequest} returns this
 */
proto.dcnet.pb.AddThreadSpaceRequest.prototype.setThreadid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint32 blockheight = 2;
 * @return {number}
 */
proto.dcnet.pb.AddThreadSpaceRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddThreadSpaceRequest} returns this
 */
proto.dcnet.pb.AddThreadSpaceRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional uint32 space = 3;
 * @return {number}
 */
proto.dcnet.pb.AddThreadSpaceRequest.prototype.getSpace = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddThreadSpaceRequest} returns this
 */
proto.dcnet.pb.AddThreadSpaceRequest.prototype.setSpace = function (value) {
  return jspb.Message.setProto3IntField(this, 3, value)
}

/**
 * optional bytes signature = 4;
 * @return {string}
 */
proto.dcnet.pb.AddThreadSpaceRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes signature = 4;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.AddThreadSpaceRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddThreadSpaceRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddThreadSpaceRequest} returns this
 */
proto.dcnet.pb.AddThreadSpaceRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AddThreadSpaceReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AddThreadSpaceReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AddThreadSpaceReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AddThreadSpaceReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AddThreadSpaceReply}
 */
proto.dcnet.pb.AddThreadSpaceReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AddThreadSpaceReply()
  return proto.dcnet.pb.AddThreadSpaceReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AddThreadSpaceReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AddThreadSpaceReply}
 */
proto.dcnet.pb.AddThreadSpaceReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddThreadSpaceReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AddThreadSpaceReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AddThreadSpaceReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AddThreadSpaceReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetThreadUsedSpaceRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetThreadUsedSpaceRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetThreadUsedSpaceRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetThreadUsedSpaceRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        threadid: msg.getThreadid_asB64(),
        randnum: jspb.Message.getFieldWithDefault(msg, 2, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetThreadUsedSpaceRequest}
 */
proto.dcnet.pb.GetThreadUsedSpaceRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetThreadUsedSpaceRequest()
  return proto.dcnet.pb.GetThreadUsedSpaceRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetThreadUsedSpaceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetThreadUsedSpaceRequest}
 */
proto.dcnet.pb.GetThreadUsedSpaceRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setThreadid(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readInt64())
        msg.setRandnum(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetThreadUsedSpaceRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetThreadUsedSpaceRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetThreadUsedSpaceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetThreadUsedSpaceRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getThreadid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getRandnum()
  if (f !== 0) {
    writer.writeInt64(2, f)
  }
}

/**
 * optional bytes threadID = 1;
 * @return {string}
 */
proto.dcnet.pb.GetThreadUsedSpaceRequest.prototype.getThreadid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes threadID = 1;
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {string}
 */
proto.dcnet.pb.GetThreadUsedSpaceRequest.prototype.getThreadid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getThreadid()))
}

/**
 * optional bytes threadID = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getThreadid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetThreadUsedSpaceRequest.prototype.getThreadid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getThreadid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetThreadUsedSpaceRequest} returns this
 */
proto.dcnet.pb.GetThreadUsedSpaceRequest.prototype.setThreadid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional int64 randnum = 2;
 * @return {number}
 */
proto.dcnet.pb.GetThreadUsedSpaceRequest.prototype.getRandnum = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetThreadUsedSpaceRequest} returns this
 */
proto.dcnet.pb.GetThreadUsedSpaceRequest.prototype.setRandnum = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetThreadUsedSpaceReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetThreadUsedSpaceReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetThreadUsedSpaceReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetThreadUsedSpaceReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        usedsize: jspb.Message.getFieldWithDefault(msg, 1, 0),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetThreadUsedSpaceReply}
 */
proto.dcnet.pb.GetThreadUsedSpaceReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetThreadUsedSpaceReply()
  return proto.dcnet.pb.GetThreadUsedSpaceReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetThreadUsedSpaceReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetThreadUsedSpaceReply}
 */
proto.dcnet.pb.GetThreadUsedSpaceReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setUsedsize(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetThreadUsedSpaceReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetThreadUsedSpaceReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetThreadUsedSpaceReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetThreadUsedSpaceReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getUsedsize()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional uint32 usedsize = 1;
 * @return {number}
 */
proto.dcnet.pb.GetThreadUsedSpaceReply.prototype.getUsedsize = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetThreadUsedSpaceReply} returns this
 */
proto.dcnet.pb.GetThreadUsedSpaceReply.prototype.setUsedsize = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * optional bytes signature = 2;
 * @return {string}
 */
proto.dcnet.pb.GetThreadUsedSpaceReply.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes signature = 2;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.GetThreadUsedSpaceReply.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetThreadUsedSpaceReply.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetThreadUsedSpaceReply} returns this
 */
proto.dcnet.pb.GetThreadUsedSpaceReply.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.TeeReportVerifyRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.TeeReportVerifyRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.TeeReportVerifyRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.TeeReportVerifyRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        teereport: msg.getTeereport_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.TeeReportVerifyRequest}
 */
proto.dcnet.pb.TeeReportVerifyRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.TeeReportVerifyRequest()
  return proto.dcnet.pb.TeeReportVerifyRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.TeeReportVerifyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.TeeReportVerifyRequest}
 */
proto.dcnet.pb.TeeReportVerifyRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setTeereport(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.TeeReportVerifyRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.TeeReportVerifyRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.TeeReportVerifyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.TeeReportVerifyRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getTeereport_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}

/**
 * optional bytes teereport = 1;
 * @return {string}
 */
proto.dcnet.pb.TeeReportVerifyRequest.prototype.getTeereport = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes teereport = 1;
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {string}
 */
proto.dcnet.pb.TeeReportVerifyRequest.prototype.getTeereport_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getTeereport()))
}

/**
 * optional bytes teereport = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.TeeReportVerifyRequest.prototype.getTeereport_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getTeereport()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.TeeReportVerifyRequest} returns this
 */
proto.dcnet.pb.TeeReportVerifyRequest.prototype.setTeereport = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.TeeReportVerifyReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.TeeReportVerifyReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.TeeReportVerifyReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.TeeReportVerifyReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        report: msg.getReport_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.TeeReportVerifyReply}
 */
proto.dcnet.pb.TeeReportVerifyReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.TeeReportVerifyReply()
  return proto.dcnet.pb.TeeReportVerifyReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.TeeReportVerifyReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.TeeReportVerifyReply}
 */
proto.dcnet.pb.TeeReportVerifyReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setReport(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.TeeReportVerifyReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.TeeReportVerifyReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.TeeReportVerifyReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.TeeReportVerifyReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getReport_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional bytes report = 1;
 * @return {string}
 */
proto.dcnet.pb.TeeReportVerifyReply.prototype.getReport = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes report = 1;
 * This is a type-conversion wrapper around `getReport()`
 * @return {string}
 */
proto.dcnet.pb.TeeReportVerifyReply.prototype.getReport_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getReport()))
}

/**
 * optional bytes report = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getReport()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.TeeReportVerifyReply.prototype.getReport_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getReport()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.TeeReportVerifyReply} returns this
 */
proto.dcnet.pb.TeeReportVerifyReply.prototype.setReport = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes signature = 2;
 * @return {string}
 */
proto.dcnet.pb.TeeReportVerifyReply.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes signature = 2;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.TeeReportVerifyReply.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.TeeReportVerifyReply.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.TeeReportVerifyReply} returns this
 */
proto.dcnet.pb.TeeReportVerifyReply.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.SendMsgToUserBoxRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.SendMsgToUserBoxRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.SendMsgToUserBoxRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.SendMsgToUserBoxRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        msg: (f = msg.getMsg()) && proto.dcnet.pb.UserMsg.toObject(includeInstance, f),
        authsignature: msg.getAuthsignature_asB64(),
        peerid: msg.getPeerid_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.SendMsgToUserBoxRequest}
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.SendMsgToUserBoxRequest()
  return proto.dcnet.pb.SendMsgToUserBoxRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.SendMsgToUserBoxRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.SendMsgToUserBoxRequest}
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.dcnet.pb.UserMsg()
        reader.readMessage(value, proto.dcnet.pb.UserMsg.deserializeBinaryFromReader)
        msg.setMsg(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAuthsignature(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.SendMsgToUserBoxRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.SendMsgToUserBoxRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getMsg()
  if (f != null) {
    writer.writeMessage(1, f, proto.dcnet.pb.UserMsg.serializeBinaryToWriter)
  }
  f = message.getAuthsignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
}

/**
 * optional UserMsg msg = 1;
 * @return {?proto.dcnet.pb.UserMsg}
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.prototype.getMsg = function () {
  return /** @type{?proto.dcnet.pb.UserMsg} */ (
    jspb.Message.getWrapperField(this, proto.dcnet.pb.UserMsg, 1)
  )
}

/**
 * @param {?proto.dcnet.pb.UserMsg|undefined} value
 * @return {!proto.dcnet.pb.SendMsgToUserBoxRequest} returns this
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.prototype.setMsg = function (value) {
  return jspb.Message.setWrapperField(this, 1, value)
}

/**
 * Clears the message field making it undefined.
 * @return {!proto.dcnet.pb.SendMsgToUserBoxRequest} returns this
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.prototype.clearMsg = function () {
  return this.setMsg(undefined)
}

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.prototype.hasMsg = function () {
  return jspb.Message.getField(this, 1) != null
}

/**
 * optional bytes AuthSignature = 2;
 * @return {string}
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.prototype.getAuthsignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes AuthSignature = 2;
 * This is a type-conversion wrapper around `getAuthsignature()`
 * @return {string}
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.prototype.getAuthsignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAuthsignature()))
}

/**
 * optional bytes AuthSignature = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAuthsignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.prototype.getAuthsignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAuthsignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SendMsgToUserBoxRequest} returns this
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.prototype.setAuthsignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional bytes PeerId = 3;
 * @return {string}
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes PeerId = 3;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes PeerId = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SendMsgToUserBoxRequest} returns this
 */
proto.dcnet.pb.SendMsgToUserBoxRequest.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.SendMsgToUserBoxReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.SendMsgToUserBoxReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.SendMsgToUserBoxReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.SendMsgToUserBoxReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.SendMsgToUserBoxReply}
 */
proto.dcnet.pb.SendMsgToUserBoxReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.SendMsgToUserBoxReply()
  return proto.dcnet.pb.SendMsgToUserBoxReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.SendMsgToUserBoxReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.SendMsgToUserBoxReply}
 */
proto.dcnet.pb.SendMsgToUserBoxReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SendMsgToUserBoxReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.SendMsgToUserBoxReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.SendMsgToUserBoxReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.SendMsgToUserBoxReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.SendMsgToUserBoxReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.SendMsgToUserBoxReply} returns this
 */
proto.dcnet.pb.SendMsgToUserBoxReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetToUserBoxAuthRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetToUserBoxAuthRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetToUserBoxAuthRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetToUserBoxAuthRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        msgsignature: msg.getMsgsignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetToUserBoxAuthRequest}
 */
proto.dcnet.pb.GetToUserBoxAuthRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetToUserBoxAuthRequest()
  return proto.dcnet.pb.GetToUserBoxAuthRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetToUserBoxAuthRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetToUserBoxAuthRequest}
 */
proto.dcnet.pb.GetToUserBoxAuthRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setMsgsignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetToUserBoxAuthRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetToUserBoxAuthRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetToUserBoxAuthRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetToUserBoxAuthRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getMsgsignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}

/**
 * optional bytes msgSignature = 1;
 * @return {string}
 */
proto.dcnet.pb.GetToUserBoxAuthRequest.prototype.getMsgsignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes msgSignature = 1;
 * This is a type-conversion wrapper around `getMsgsignature()`
 * @return {string}
 */
proto.dcnet.pb.GetToUserBoxAuthRequest.prototype.getMsgsignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getMsgsignature()))
}

/**
 * optional bytes msgSignature = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getMsgsignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetToUserBoxAuthRequest.prototype.getMsgsignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getMsgsignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetToUserBoxAuthRequest} returns this
 */
proto.dcnet.pb.GetToUserBoxAuthRequest.prototype.setMsgsignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetToUserBoxAuthReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetToUserBoxAuthReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetToUserBoxAuthReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetToUserBoxAuthReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetToUserBoxAuthReply}
 */
proto.dcnet.pb.GetToUserBoxAuthReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetToUserBoxAuthReply()
  return proto.dcnet.pb.GetToUserBoxAuthReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetToUserBoxAuthReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetToUserBoxAuthReply}
 */
proto.dcnet.pb.GetToUserBoxAuthReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetToUserBoxAuthReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetToUserBoxAuthReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetToUserBoxAuthReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetToUserBoxAuthReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}

/**
 * optional bytes signature = 1;
 * @return {string}
 */
proto.dcnet.pb.GetToUserBoxAuthReply.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes signature = 1;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.GetToUserBoxAuthReply.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetToUserBoxAuthReply.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetToUserBoxAuthReply} returns this
 */
proto.dcnet.pb.GetToUserBoxAuthReply.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetMsgFromUserBoxRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetMsgFromUserBoxRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetMsgFromUserBoxRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetMsgFromUserBoxRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        appid: msg.getAppid_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 2, 0),
        seekkey: msg.getSeekkey_asB64(),
        limit: jspb.Message.getFieldWithDefault(msg, 4, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetMsgFromUserBoxRequest}
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetMsgFromUserBoxRequest()
  return proto.dcnet.pb.GetMsgFromUserBoxRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetMsgFromUserBoxRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetMsgFromUserBoxRequest}
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAppid(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSeekkey(value)
        break
      case 4:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setLimit(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetMsgFromUserBoxRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetMsgFromUserBoxRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAppid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getSeekkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getLimit()
  if (f !== 0) {
    writer.writeUint32(4, f)
  }
}

/**
 * optional bytes appId = 1;
 * @return {string}
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.prototype.getAppid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes appId = 1;
 * This is a type-conversion wrapper around `getAppid()`
 * @return {string}
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.prototype.getAppid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAppid()))
}

/**
 * optional bytes appId = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAppid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.prototype.getAppid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAppid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetMsgFromUserBoxRequest} returns this
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.prototype.setAppid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint32 blockheight = 2;
 * @return {number}
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetMsgFromUserBoxRequest} returns this
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional bytes seekKey = 3;
 * @return {string}
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.prototype.getSeekkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes seekKey = 3;
 * This is a type-conversion wrapper around `getSeekkey()`
 * @return {string}
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.prototype.getSeekkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSeekkey()))
}

/**
 * optional bytes seekKey = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSeekkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.prototype.getSeekkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSeekkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetMsgFromUserBoxRequest} returns this
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.prototype.setSeekkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional uint32 limit = 4;
 * @return {number}
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.prototype.getLimit = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetMsgFromUserBoxRequest} returns this
 */
proto.dcnet.pb.GetMsgFromUserBoxRequest.prototype.setLimit = function (value) {
  return jspb.Message.setProto3IntField(this, 4, value)
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dcnet.pb.GetMsgFromUserBoxReply.repeatedFields_ = [1]

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetMsgFromUserBoxReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetMsgFromUserBoxReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetMsgFromUserBoxReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetMsgFromUserBoxReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        msgsList: jspb.Message.toObjectList(
          msg.getMsgsList(),
          proto.dcnet.pb.UserMsg.toObject,
          includeInstance
        )
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetMsgFromUserBoxReply}
 */
proto.dcnet.pb.GetMsgFromUserBoxReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetMsgFromUserBoxReply()
  return proto.dcnet.pb.GetMsgFromUserBoxReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetMsgFromUserBoxReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetMsgFromUserBoxReply}
 */
proto.dcnet.pb.GetMsgFromUserBoxReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.dcnet.pb.UserMsg()
        reader.readMessage(value, proto.dcnet.pb.UserMsg.deserializeBinaryFromReader)
        msg.addMsgs(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetMsgFromUserBoxReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetMsgFromUserBoxReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetMsgFromUserBoxReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetMsgFromUserBoxReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getMsgsList()
  if (f.length > 0) {
    writer.writeRepeatedMessage(1, f, proto.dcnet.pb.UserMsg.serializeBinaryToWriter)
  }
}

/**
 * repeated UserMsg msgs = 1;
 * @return {!Array<!proto.dcnet.pb.UserMsg>}
 */
proto.dcnet.pb.GetMsgFromUserBoxReply.prototype.getMsgsList = function () {
  return /** @type{!Array<!proto.dcnet.pb.UserMsg>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dcnet.pb.UserMsg, 1)
  )
}

/**
 * @param {!Array<!proto.dcnet.pb.UserMsg>} value
 * @return {!proto.dcnet.pb.GetMsgFromUserBoxReply} returns this
 */
proto.dcnet.pb.GetMsgFromUserBoxReply.prototype.setMsgsList = function (value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value)
}

/**
 * @param {!proto.dcnet.pb.UserMsg=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dcnet.pb.UserMsg}
 */
proto.dcnet.pb.GetMsgFromUserBoxReply.prototype.addMsgs = function (opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(
    this,
    1,
    opt_value,
    proto.dcnet.pb.UserMsg,
    opt_index
  )
}

/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dcnet.pb.GetMsgFromUserBoxReply} returns this
 */
proto.dcnet.pb.GetMsgFromUserBoxReply.prototype.clearMsgsList = function () {
  return this.setMsgsList([])
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.UserMsg.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.UserMsg.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.UserMsg} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.UserMsg.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        messageid: msg.getMessageid_asB64(),
        senderpubkey: msg.getSenderpubkey_asB64(),
        receiverpubkey: msg.getReceiverpubkey_asB64(),
        appid: msg.getAppid_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 5, 0),
        encryptmsg: msg.getEncryptmsg_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.UserMsg}
 */
proto.dcnet.pb.UserMsg.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.UserMsg()
  return proto.dcnet.pb.UserMsg.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.UserMsg} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.UserMsg}
 */
proto.dcnet.pb.UserMsg.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setMessageid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSenderpubkey(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setReceiverpubkey(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAppid(value)
        break
      case 5:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 6:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setEncryptmsg(value)
        break
      case 7:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.UserMsg.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.UserMsg.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.UserMsg} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.UserMsg.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getMessageid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getSenderpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getReceiverpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getAppid_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(5, f)
  }
  f = message.getEncryptmsg_asU8()
  if (f.length > 0) {
    writer.writeBytes(6, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(7, f)
  }
}

/**
 * optional bytes messageId = 1;
 * @return {string}
 */
proto.dcnet.pb.UserMsg.prototype.getMessageid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes messageId = 1;
 * This is a type-conversion wrapper around `getMessageid()`
 * @return {string}
 */
proto.dcnet.pb.UserMsg.prototype.getMessageid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getMessageid()))
}

/**
 * optional bytes messageId = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getMessageid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.UserMsg.prototype.getMessageid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getMessageid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.UserMsg} returns this
 */
proto.dcnet.pb.UserMsg.prototype.setMessageid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes senderPubkey = 2;
 * @return {string}
 */
proto.dcnet.pb.UserMsg.prototype.getSenderpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes senderPubkey = 2;
 * This is a type-conversion wrapper around `getSenderpubkey()`
 * @return {string}
 */
proto.dcnet.pb.UserMsg.prototype.getSenderpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSenderpubkey()))
}

/**
 * optional bytes senderPubkey = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSenderpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.UserMsg.prototype.getSenderpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSenderpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.UserMsg} returns this
 */
proto.dcnet.pb.UserMsg.prototype.setSenderpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional bytes receiverPubkey = 3;
 * @return {string}
 */
proto.dcnet.pb.UserMsg.prototype.getReceiverpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes receiverPubkey = 3;
 * This is a type-conversion wrapper around `getReceiverpubkey()`
 * @return {string}
 */
proto.dcnet.pb.UserMsg.prototype.getReceiverpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getReceiverpubkey()))
}

/**
 * optional bytes receiverPubkey = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getReceiverpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.UserMsg.prototype.getReceiverpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getReceiverpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.UserMsg} returns this
 */
proto.dcnet.pb.UserMsg.prototype.setReceiverpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional bytes appId = 4;
 * @return {string}
 */
proto.dcnet.pb.UserMsg.prototype.getAppid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes appId = 4;
 * This is a type-conversion wrapper around `getAppid()`
 * @return {string}
 */
proto.dcnet.pb.UserMsg.prototype.getAppid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAppid()))
}

/**
 * optional bytes appId = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAppid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.UserMsg.prototype.getAppid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAppid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.UserMsg} returns this
 */
proto.dcnet.pb.UserMsg.prototype.setAppid = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

/**
 * optional uint32 blockheight = 5;
 * @return {number}
 */
proto.dcnet.pb.UserMsg.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.UserMsg} returns this
 */
proto.dcnet.pb.UserMsg.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 5, value)
}

/**
 * optional bytes encryptMsg = 6;
 * @return {string}
 */
proto.dcnet.pb.UserMsg.prototype.getEncryptmsg = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ''))
}

/**
 * optional bytes encryptMsg = 6;
 * This is a type-conversion wrapper around `getEncryptmsg()`
 * @return {string}
 */
proto.dcnet.pb.UserMsg.prototype.getEncryptmsg_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getEncryptmsg()))
}

/**
 * optional bytes encryptMsg = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getEncryptmsg()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.UserMsg.prototype.getEncryptmsg_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getEncryptmsg()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.UserMsg} returns this
 */
proto.dcnet.pb.UserMsg.prototype.setEncryptmsg = function (value) {
  return jspb.Message.setProto3BytesField(this, 6, value)
}

/**
 * optional bytes signature = 7;
 * @return {string}
 */
proto.dcnet.pb.UserMsg.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ''))
}

/**
 * optional bytes signature = 7;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.UserMsg.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.UserMsg.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.UserMsg} returns this
 */
proto.dcnet.pb.UserMsg.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 7, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.ReportSpamMsgRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.ReportSpamMsgRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.ReportSpamMsgRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.ReportSpamMsgRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        msg: (f = msg.getMsg()) && proto.dcnet.pb.UserMsg.toObject(includeInstance, f),
        blockheight: jspb.Message.getFieldWithDefault(msg, 2, 0),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.ReportSpamMsgRequest}
 */
proto.dcnet.pb.ReportSpamMsgRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.ReportSpamMsgRequest()
  return proto.dcnet.pb.ReportSpamMsgRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.ReportSpamMsgRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.ReportSpamMsgRequest}
 */
proto.dcnet.pb.ReportSpamMsgRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.dcnet.pb.UserMsg()
        reader.readMessage(value, proto.dcnet.pb.UserMsg.deserializeBinaryFromReader)
        msg.setMsg(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ReportSpamMsgRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.ReportSpamMsgRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.ReportSpamMsgRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.ReportSpamMsgRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getMsg()
  if (f != null) {
    writer.writeMessage(1, f, proto.dcnet.pb.UserMsg.serializeBinaryToWriter)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
}

/**
 * optional UserMsg msg = 1;
 * @return {?proto.dcnet.pb.UserMsg}
 */
proto.dcnet.pb.ReportSpamMsgRequest.prototype.getMsg = function () {
  return /** @type{?proto.dcnet.pb.UserMsg} */ (
    jspb.Message.getWrapperField(this, proto.dcnet.pb.UserMsg, 1)
  )
}

/**
 * @param {?proto.dcnet.pb.UserMsg|undefined} value
 * @return {!proto.dcnet.pb.ReportSpamMsgRequest} returns this
 */
proto.dcnet.pb.ReportSpamMsgRequest.prototype.setMsg = function (value) {
  return jspb.Message.setWrapperField(this, 1, value)
}

/**
 * Clears the message field making it undefined.
 * @return {!proto.dcnet.pb.ReportSpamMsgRequest} returns this
 */
proto.dcnet.pb.ReportSpamMsgRequest.prototype.clearMsg = function () {
  return this.setMsg(undefined)
}

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dcnet.pb.ReportSpamMsgRequest.prototype.hasMsg = function () {
  return jspb.Message.getField(this, 1) != null
}

/**
 * optional uint32 blockheight = 2;
 * @return {number}
 */
proto.dcnet.pb.ReportSpamMsgRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.ReportSpamMsgRequest} returns this
 */
proto.dcnet.pb.ReportSpamMsgRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional bytes signature = 3;
 * @return {string}
 */
proto.dcnet.pb.ReportSpamMsgRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes signature = 3;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.ReportSpamMsgRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ReportSpamMsgRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.ReportSpamMsgRequest} returns this
 */
proto.dcnet.pb.ReportSpamMsgRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.ReportSpamMsgReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.ReportSpamMsgReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.ReportSpamMsgReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.ReportSpamMsgReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.ReportSpamMsgReply}
 */
proto.dcnet.pb.ReportSpamMsgReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.ReportSpamMsgReply()
  return proto.dcnet.pb.ReportSpamMsgReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.ReportSpamMsgReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.ReportSpamMsgReply}
 */
proto.dcnet.pb.ReportSpamMsgReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ReportSpamMsgReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.ReportSpamMsgReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.ReportSpamMsgReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.ReportSpamMsgReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetUserClientPeersRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetUserClientPeersRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetUserClientPeersRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetUserClientPeersRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        userpubkey: msg.getUserpubkey_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetUserClientPeersRequest}
 */
proto.dcnet.pb.GetUserClientPeersRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetUserClientPeersRequest()
  return proto.dcnet.pb.GetUserClientPeersRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetUserClientPeersRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetUserClientPeersRequest}
 */
proto.dcnet.pb.GetUserClientPeersRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetUserClientPeersRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetUserClientPeersRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetUserClientPeersRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetUserClientPeersRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}

/**
 * optional bytes userPubkey = 1;
 * @return {string}
 */
proto.dcnet.pb.GetUserClientPeersRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes userPubkey = 1;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.GetUserClientPeersRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetUserClientPeersRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetUserClientPeersRequest} returns this
 */
proto.dcnet.pb.GetUserClientPeersRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dcnet.pb.GetUserClientPeersReply.repeatedFields_ = [1]

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetUserClientPeersReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetUserClientPeersReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetUserClientPeersReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetUserClientPeersReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        peeridsList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetUserClientPeersReply}
 */
proto.dcnet.pb.GetUserClientPeersReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetUserClientPeersReply()
  return proto.dcnet.pb.GetUserClientPeersReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetUserClientPeersReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetUserClientPeersReply}
 */
proto.dcnet.pb.GetUserClientPeersReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {string} */ (reader.readString())
        msg.addPeerids(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetUserClientPeersReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetUserClientPeersReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetUserClientPeersReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetUserClientPeersReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPeeridsList()
  if (f.length > 0) {
    writer.writeRepeatedString(1, f)
  }
}

/**
 * repeated string peerids = 1;
 * @return {!Array<string>}
 */
proto.dcnet.pb.GetUserClientPeersReply.prototype.getPeeridsList = function () {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1))
}

/**
 * @param {!Array<string>} value
 * @return {!proto.dcnet.pb.GetUserClientPeersReply} returns this
 */
proto.dcnet.pb.GetUserClientPeersReply.prototype.setPeeridsList = function (value) {
  return jspb.Message.setField(this, 1, value || [])
}

/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.dcnet.pb.GetUserClientPeersReply} returns this
 */
proto.dcnet.pb.GetUserClientPeersReply.prototype.addPeerids = function (value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index)
}

/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dcnet.pb.GetUserClientPeersReply} returns this
 */
proto.dcnet.pb.GetUserClientPeersReply.prototype.clearPeeridsList = function () {
  return this.setPeeridsList([])
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AddCommentableObjRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AddCommentableObjRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AddCommentableObjRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AddCommentableObjRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        objcid: msg.getObjcid_asB64(),
        appid: msg.getAppid_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 3, 0),
        commentspace: jspb.Message.getFieldWithDefault(msg, 4, 0),
        allowspace: jspb.Message.getFieldWithDefault(msg, 5, 0),
        userpubkey: msg.getUserpubkey_asB64(),
        openflag: jspb.Message.getFieldWithDefault(msg, 7, 0),
        signature: msg.getSignature_asB64(),
        ccount: jspb.Message.getFieldWithDefault(msg, 9, 0),
        upcount: jspb.Message.getFieldWithDefault(msg, 10, 0),
        downcount: jspb.Message.getFieldWithDefault(msg, 11, 0),
        tcount: jspb.Message.getFieldWithDefault(msg, 12, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AddCommentableObjRequest}
 */
proto.dcnet.pb.AddCommentableObjRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AddCommentableObjRequest()
  return proto.dcnet.pb.AddCommentableObjRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AddCommentableObjRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AddCommentableObjRequest}
 */
proto.dcnet.pb.AddCommentableObjRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjcid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAppid(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 4:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setCommentspace(value)
        break
      case 5:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setAllowspace(value)
        break
      case 6:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 7:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setOpenflag(value)
        break
      case 8:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      case 9:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setCcount(value)
        break
      case 10:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setUpcount(value)
        break
      case 11:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setDowncount(value)
        break
      case 12:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setTcount(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AddCommentableObjRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AddCommentableObjRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AddCommentableObjRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getObjcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getAppid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
  f = message.getCommentspace()
  if (f !== 0) {
    writer.writeUint32(4, f)
  }
  f = message.getAllowspace()
  if (f !== 0) {
    writer.writeUint32(5, f)
  }
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(6, f)
  }
  f = message.getOpenflag()
  if (f !== 0) {
    writer.writeUint32(7, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(8, f)
  }
  f = message.getCcount()
  if (f !== 0) {
    writer.writeUint32(9, f)
  }
  f = message.getUpcount()
  if (f !== 0) {
    writer.writeUint32(10, f)
  }
  f = message.getDowncount()
  if (f !== 0) {
    writer.writeUint32(11, f)
  }
  f = message.getTcount()
  if (f !== 0) {
    writer.writeUint32(12, f)
  }
}

/**
 * optional bytes objCid = 1;
 * @return {string}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getObjcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes objCid = 1;
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {string}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getObjcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjcid()))
}

/**
 * optional bytes objCid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getObjcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddCommentableObjRequest} returns this
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.setObjcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes appId = 2;
 * @return {string}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getAppid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes appId = 2;
 * This is a type-conversion wrapper around `getAppid()`
 * @return {string}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getAppid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAppid()))
}

/**
 * optional bytes appId = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAppid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getAppid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAppid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddCommentableObjRequest} returns this
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.setAppid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional uint32 blockheight = 3;
 * @return {number}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddCommentableObjRequest} returns this
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 3, value)
}

/**
 * optional uint32 commentSpace = 4;
 * @return {number}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getCommentspace = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddCommentableObjRequest} returns this
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.setCommentspace = function (value) {
  return jspb.Message.setProto3IntField(this, 4, value)
}

/**
 * optional uint32 allowSpace = 5;
 * @return {number}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getAllowspace = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddCommentableObjRequest} returns this
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.setAllowspace = function (value) {
  return jspb.Message.setProto3IntField(this, 5, value)
}

/**
 * optional bytes userPubkey = 6;
 * @return {string}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ''))
}

/**
 * optional bytes userPubkey = 6;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddCommentableObjRequest} returns this
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 6, value)
}

/**
 * optional uint32 openFlag = 7;
 * @return {number}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getOpenflag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddCommentableObjRequest} returns this
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.setOpenflag = function (value) {
  return jspb.Message.setProto3IntField(this, 7, value)
}

/**
 * optional bytes signature = 8;
 * @return {string}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ''))
}

/**
 * optional bytes signature = 8;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 8;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddCommentableObjRequest} returns this
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 8, value)
}

/**
 * optional uint32 CCount = 9;
 * @return {number}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getCcount = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 9, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddCommentableObjRequest} returns this
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.setCcount = function (value) {
  return jspb.Message.setProto3IntField(this, 9, value)
}

/**
 * optional uint32 UpCount = 10;
 * @return {number}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getUpcount = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 10, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddCommentableObjRequest} returns this
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.setUpcount = function (value) {
  return jspb.Message.setProto3IntField(this, 10, value)
}

/**
 * optional uint32 DownCount = 11;
 * @return {number}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getDowncount = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 11, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddCommentableObjRequest} returns this
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.setDowncount = function (value) {
  return jspb.Message.setProto3IntField(this, 11, value)
}

/**
 * optional uint32 TCount = 12;
 * @return {number}
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.getTcount = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 12, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddCommentableObjRequest} returns this
 */
proto.dcnet.pb.AddCommentableObjRequest.prototype.setTcount = function (value) {
  return jspb.Message.setProto3IntField(this, 12, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AddCommentableObjReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AddCommentableObjReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AddCommentableObjReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AddCommentableObjReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AddCommentableObjReply}
 */
proto.dcnet.pb.AddCommentableObjReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AddCommentableObjReply()
  return proto.dcnet.pb.AddCommentableObjReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AddCommentableObjReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AddCommentableObjReply}
 */
proto.dcnet.pb.AddCommentableObjReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddCommentableObjReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AddCommentableObjReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AddCommentableObjReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AddCommentableObjReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.AddCommentableObjReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddCommentableObjReply} returns this
 */
proto.dcnet.pb.AddCommentableObjReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AddObjCommentSpaceRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AddObjCommentSpaceRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AddObjCommentSpaceRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        objcid: msg.getObjcid_asB64(),
        appid: msg.getAppid_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 3, 0),
        addspace: jspb.Message.getFieldWithDefault(msg, 4, 0),
        userpubkey: msg.getUserpubkey_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AddObjCommentSpaceRequest}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AddObjCommentSpaceRequest()
  return proto.dcnet.pb.AddObjCommentSpaceRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AddObjCommentSpaceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AddObjCommentSpaceRequest}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjcid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAppid(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 4:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setAddspace(value)
        break
      case 5:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 6:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AddObjCommentSpaceRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AddObjCommentSpaceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getObjcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getAppid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
  f = message.getAddspace()
  if (f !== 0) {
    writer.writeUint32(4, f)
  }
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(5, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(6, f)
  }
}

/**
 * optional bytes objCid = 1;
 * @return {string}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.getObjcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes objCid = 1;
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {string}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.getObjcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjcid()))
}

/**
 * optional bytes objCid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.getObjcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddObjCommentSpaceRequest} returns this
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.setObjcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes appId = 2;
 * @return {string}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.getAppid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes appId = 2;
 * This is a type-conversion wrapper around `getAppid()`
 * @return {string}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.getAppid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAppid()))
}

/**
 * optional bytes appId = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAppid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.getAppid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAppid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddObjCommentSpaceRequest} returns this
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.setAppid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional uint32 blockheight = 3;
 * @return {number}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddObjCommentSpaceRequest} returns this
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 3, value)
}

/**
 * optional uint32 addspace = 4;
 * @return {number}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.getAddspace = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddObjCommentSpaceRequest} returns this
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.setAddspace = function (value) {
  return jspb.Message.setProto3IntField(this, 4, value)
}

/**
 * optional bytes userPubkey = 5;
 * @return {string}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ''))
}

/**
 * optional bytes userPubkey = 5;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddObjCommentSpaceRequest} returns this
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 5, value)
}

/**
 * optional bytes signature = 6;
 * @return {string}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ''))
}

/**
 * optional bytes signature = 6;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddObjCommentSpaceRequest} returns this
 */
proto.dcnet.pb.AddObjCommentSpaceRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 6, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AddObjCommentSpaceReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AddObjCommentSpaceReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AddObjCommentSpaceReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AddObjCommentSpaceReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AddObjCommentSpaceReply}
 */
proto.dcnet.pb.AddObjCommentSpaceReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AddObjCommentSpaceReply()
  return proto.dcnet.pb.AddObjCommentSpaceReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AddObjCommentSpaceReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AddObjCommentSpaceReply}
 */
proto.dcnet.pb.AddObjCommentSpaceReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddObjCommentSpaceReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AddObjCommentSpaceReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AddObjCommentSpaceReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AddObjCommentSpaceReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.AddObjCommentSpaceReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddObjCommentSpaceReply} returns this
 */
proto.dcnet.pb.AddObjCommentSpaceReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.SetCacheKeyRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.SetCacheKeyRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.SetCacheKeyRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.SetCacheKeyRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        expire: jspb.Message.getFieldWithDefault(msg, 1, 0),
        blockheight: jspb.Message.getFieldWithDefault(msg, 2, 0),
        value: msg.getValue_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.SetCacheKeyRequest}
 */
proto.dcnet.pb.SetCacheKeyRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.SetCacheKeyRequest()
  return proto.dcnet.pb.SetCacheKeyRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.SetCacheKeyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.SetCacheKeyRequest}
 */
proto.dcnet.pb.SetCacheKeyRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setExpire(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setValue(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetCacheKeyRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.SetCacheKeyRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.SetCacheKeyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.SetCacheKeyRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getExpire()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getValue_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
}

/**
 * optional uint32 expire = 1;
 * @return {number}
 */
proto.dcnet.pb.SetCacheKeyRequest.prototype.getExpire = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.SetCacheKeyRequest} returns this
 */
proto.dcnet.pb.SetCacheKeyRequest.prototype.setExpire = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * optional uint32 blockheight = 2;
 * @return {number}
 */
proto.dcnet.pb.SetCacheKeyRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.SetCacheKeyRequest} returns this
 */
proto.dcnet.pb.SetCacheKeyRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional bytes value = 3;
 * @return {string}
 */
proto.dcnet.pb.SetCacheKeyRequest.prototype.getValue = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes value = 3;
 * This is a type-conversion wrapper around `getValue()`
 * @return {string}
 */
proto.dcnet.pb.SetCacheKeyRequest.prototype.getValue_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getValue()))
}

/**
 * optional bytes value = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getValue()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetCacheKeyRequest.prototype.getValue_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getValue()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SetCacheKeyRequest} returns this
 */
proto.dcnet.pb.SetCacheKeyRequest.prototype.setValue = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional bytes signature = 4;
 * @return {string}
 */
proto.dcnet.pb.SetCacheKeyRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes signature = 4;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.SetCacheKeyRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetCacheKeyRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SetCacheKeyRequest} returns this
 */
proto.dcnet.pb.SetCacheKeyRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.SetCacheKeyReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.SetCacheKeyReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.SetCacheKeyReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.SetCacheKeyReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0),
        cachekey: msg.getCachekey_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.SetCacheKeyReply}
 */
proto.dcnet.pb.SetCacheKeyReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.SetCacheKeyReply()
  return proto.dcnet.pb.SetCacheKeyReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.SetCacheKeyReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.SetCacheKeyReply}
 */
proto.dcnet.pb.SetCacheKeyReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setCachekey(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetCacheKeyReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.SetCacheKeyReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.SetCacheKeyReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.SetCacheKeyReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
  f = message.getCachekey_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.SetCacheKeyReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.SetCacheKeyReply} returns this
 */
proto.dcnet.pb.SetCacheKeyReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * optional bytes cacheKey = 2;
 * @return {string}
 */
proto.dcnet.pb.SetCacheKeyReply.prototype.getCachekey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes cacheKey = 2;
 * This is a type-conversion wrapper around `getCachekey()`
 * @return {string}
 */
proto.dcnet.pb.SetCacheKeyReply.prototype.getCachekey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getCachekey()))
}

/**
 * optional bytes cacheKey = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCachekey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetCacheKeyReply.prototype.getCachekey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getCachekey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SetCacheKeyReply} returns this
 */
proto.dcnet.pb.SetCacheKeyReply.prototype.setCachekey = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetCacheValueRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetCacheValueRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetCacheValueRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetCacheValueRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        key: msg.getKey_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetCacheValueRequest}
 */
proto.dcnet.pb.GetCacheValueRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetCacheValueRequest()
  return proto.dcnet.pb.GetCacheValueRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetCacheValueRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetCacheValueRequest}
 */
proto.dcnet.pb.GetCacheValueRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setKey(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetCacheValueRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetCacheValueRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetCacheValueRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetCacheValueRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getKey_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional bytes key = 2;
 * @return {string}
 */
proto.dcnet.pb.GetCacheValueRequest.prototype.getKey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes key = 2;
 * This is a type-conversion wrapper around `getKey()`
 * @return {string}
 */
proto.dcnet.pb.GetCacheValueRequest.prototype.getKey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getKey()))
}

/**
 * optional bytes key = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getKey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetCacheValueRequest.prototype.getKey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getKey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetCacheValueRequest} returns this
 */
proto.dcnet.pb.GetCacheValueRequest.prototype.setKey = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetCacheValueReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetCacheValueReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetCacheValueReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetCacheValueReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        value: msg.getValue_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetCacheValueReply}
 */
proto.dcnet.pb.GetCacheValueReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetCacheValueReply()
  return proto.dcnet.pb.GetCacheValueReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetCacheValueReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetCacheValueReply}
 */
proto.dcnet.pb.GetCacheValueReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setValue(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetCacheValueReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetCacheValueReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetCacheValueReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetCacheValueReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getValue_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
}

/**
 * optional bytes value = 1;
 * @return {string}
 */
proto.dcnet.pb.GetCacheValueReply.prototype.getValue = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes value = 1;
 * This is a type-conversion wrapper around `getValue()`
 * @return {string}
 */
proto.dcnet.pb.GetCacheValueReply.prototype.getValue_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getValue()))
}

/**
 * optional bytes value = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getValue()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetCacheValueReply.prototype.getValue_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getValue()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetCacheValueReply} returns this
 */
proto.dcnet.pb.GetCacheValueReply.prototype.setValue = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetObjCommentSpaceRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetObjCommentSpaceRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetObjCommentSpaceRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        objcid: msg.getObjcid_asB64(),
        appid: msg.getAppid_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 3, 0),
        userpubkey: msg.getUserpubkey_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetObjCommentSpaceRequest}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetObjCommentSpaceRequest()
  return proto.dcnet.pb.GetObjCommentSpaceRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetObjCommentSpaceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetObjCommentSpaceRequest}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjcid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAppid(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 5:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetObjCommentSpaceRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetObjCommentSpaceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getObjcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getAppid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(5, f)
  }
}

/**
 * optional bytes objCid = 1;
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.getObjcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes objCid = 1;
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.getObjcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjcid()))
}

/**
 * optional bytes objCid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.getObjcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetObjCommentSpaceRequest} returns this
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.setObjcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes appId = 2;
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.getAppid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes appId = 2;
 * This is a type-conversion wrapper around `getAppid()`
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.getAppid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAppid()))
}

/**
 * optional bytes appId = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAppid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.getAppid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAppid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetObjCommentSpaceRequest} returns this
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.setAppid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional uint32 blockheight = 3;
 * @return {number}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetObjCommentSpaceRequest} returns this
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 3, value)
}

/**
 * optional bytes userPubkey = 4;
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes userPubkey = 4;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetObjCommentSpaceRequest} returns this
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

/**
 * optional bytes signature = 5;
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ''))
}

/**
 * optional bytes signature = 5;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetObjCommentSpaceRequest} returns this
 */
proto.dcnet.pb.GetObjCommentSpaceRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 5, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetObjCommentSpaceReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetObjCommentSpaceReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetObjCommentSpaceReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetObjCommentSpaceReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        space: jspb.Message.getFieldWithDefault(msg, 1, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetObjCommentSpaceReply}
 */
proto.dcnet.pb.GetObjCommentSpaceReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetObjCommentSpaceReply()
  return proto.dcnet.pb.GetObjCommentSpaceReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetObjCommentSpaceReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetObjCommentSpaceReply}
 */
proto.dcnet.pb.GetObjCommentSpaceReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setSpace(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetObjCommentSpaceReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetObjCommentSpaceReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetObjCommentSpaceReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetObjCommentSpaceReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getSpace()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
}

/**
 * optional uint32 space = 1;
 * @return {number}
 */
proto.dcnet.pb.GetObjCommentSpaceReply.prototype.getSpace = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetObjCommentSpaceReply} returns this
 */
proto.dcnet.pb.GetObjCommentSpaceReply.prototype.setSpace = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.DeleteCommentableObjRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.DeleteCommentableObjRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.DeleteCommentableObjRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.DeleteCommentableObjRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        objcid: msg.getObjcid_asB64(),
        appid: msg.getAppid_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 3, 0),
        userpubkey: msg.getUserpubkey_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.DeleteCommentableObjRequest}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.DeleteCommentableObjRequest()
  return proto.dcnet.pb.DeleteCommentableObjRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.DeleteCommentableObjRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.DeleteCommentableObjRequest}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjcid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAppid(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 5:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.DeleteCommentableObjRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.DeleteCommentableObjRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.DeleteCommentableObjRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getObjcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getAppid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(5, f)
  }
}

/**
 * optional bytes objCid = 1;
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.getObjcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes objCid = 1;
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.getObjcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjcid()))
}

/**
 * optional bytes objCid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.getObjcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteCommentableObjRequest} returns this
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.setObjcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes appId = 2;
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.getAppid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes appId = 2;
 * This is a type-conversion wrapper around `getAppid()`
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.getAppid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAppid()))
}

/**
 * optional bytes appId = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAppid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.getAppid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAppid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteCommentableObjRequest} returns this
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.setAppid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional uint32 blockheight = 3;
 * @return {number}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.DeleteCommentableObjRequest} returns this
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 3, value)
}

/**
 * optional bytes userPubkey = 4;
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes userPubkey = 4;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteCommentableObjRequest} returns this
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

/**
 * optional bytes signature = 5;
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ''))
}

/**
 * optional bytes signature = 5;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteCommentableObjRequest} returns this
 */
proto.dcnet.pb.DeleteCommentableObjRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 5, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.DeleteCommentableObjReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.DeleteCommentableObjReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.DeleteCommentableObjReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.DeleteCommentableObjReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.DeleteCommentableObjReply}
 */
proto.dcnet.pb.DeleteCommentableObjReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.DeleteCommentableObjReply()
  return proto.dcnet.pb.DeleteCommentableObjReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.DeleteCommentableObjReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.DeleteCommentableObjReply}
 */
proto.dcnet.pb.DeleteCommentableObjReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteCommentableObjReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.DeleteCommentableObjReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.DeleteCommentableObjReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.DeleteCommentableObjReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.DeleteCommentableObjReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.DeleteCommentableObjReply} returns this
 */
proto.dcnet.pb.DeleteCommentableObjReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.PublishCommentToObjRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.PublishCommentToObjRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.PublishCommentToObjRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.PublishCommentToObjRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        objcid: msg.getObjcid_asB64(),
        appid: msg.getAppid_asB64(),
        objauthor: msg.getObjauthor_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 4, 0),
        userpubkey: msg.getUserpubkey_asB64(),
        commentcid: msg.getCommentcid_asB64(),
        comment: msg.getComment_asB64(),
        commentsize: jspb.Message.getFieldWithDefault(msg, 8, 0),
        status: jspb.Message.getFieldWithDefault(msg, 9, 0),
        refercommentkey: msg.getRefercommentkey_asB64(),
        ccount: jspb.Message.getFieldWithDefault(msg, 11, 0),
        upcount: jspb.Message.getFieldWithDefault(msg, 12, 0),
        downcount: jspb.Message.getFieldWithDefault(msg, 13, 0),
        tcount: jspb.Message.getFieldWithDefault(msg, 14, 0),
        type: jspb.Message.getFieldWithDefault(msg, 15, 0),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest}
 */
proto.dcnet.pb.PublishCommentToObjRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.PublishCommentToObjRequest()
  return proto.dcnet.pb.PublishCommentToObjRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.PublishCommentToObjRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest}
 */
proto.dcnet.pb.PublishCommentToObjRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjcid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAppid(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjauthor(value)
        break
      case 4:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 5:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 6:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setCommentcid(value)
        break
      case 7:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setComment(value)
        break
      case 8:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setCommentsize(value)
        break
      case 9:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setStatus(value)
        break
      case 10:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setRefercommentkey(value)
        break
      case 11:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setCcount(value)
        break
      case 12:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setUpcount(value)
        break
      case 13:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setDowncount(value)
        break
      case 14:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setTcount(value)
        break
      case 15:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setType(value)
        break
      case 16:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.PublishCommentToObjRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.PublishCommentToObjRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.PublishCommentToObjRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getObjcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getAppid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getObjauthor_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(4, f)
  }
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(5, f)
  }
  f = message.getCommentcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(6, f)
  }
  f = message.getComment_asU8()
  if (f.length > 0) {
    writer.writeBytes(7, f)
  }
  f = message.getCommentsize()
  if (f !== 0) {
    writer.writeUint32(8, f)
  }
  f = message.getStatus()
  if (f !== 0) {
    writer.writeUint32(9, f)
  }
  f = message.getRefercommentkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(10, f)
  }
  f = message.getCcount()
  if (f !== 0) {
    writer.writeUint32(11, f)
  }
  f = message.getUpcount()
  if (f !== 0) {
    writer.writeUint32(12, f)
  }
  f = message.getDowncount()
  if (f !== 0) {
    writer.writeUint32(13, f)
  }
  f = message.getTcount()
  if (f !== 0) {
    writer.writeUint32(14, f)
  }
  f = message.getType()
  if (f !== 0) {
    writer.writeUint32(15, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(16, f)
  }
}

/**
 * optional bytes objCid = 1;
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getObjcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes objCid = 1;
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getObjcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjcid()))
}

/**
 * optional bytes objCid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getObjcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setObjcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes appId = 2;
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getAppid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes appId = 2;
 * This is a type-conversion wrapper around `getAppid()`
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getAppid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAppid()))
}

/**
 * optional bytes appId = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAppid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getAppid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAppid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setAppid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional bytes objAuthor = 3;
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getObjauthor = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes objAuthor = 3;
 * This is a type-conversion wrapper around `getObjauthor()`
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getObjauthor_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjauthor()))
}

/**
 * optional bytes objAuthor = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjauthor()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getObjauthor_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjauthor()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setObjauthor = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional uint32 blockheight = 4;
 * @return {number}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 4, value)
}

/**
 * optional bytes userPubkey = 5;
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ''))
}

/**
 * optional bytes userPubkey = 5;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 5, value)
}

/**
 * optional bytes commentCid = 6;
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getCommentcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ''))
}

/**
 * optional bytes commentCid = 6;
 * This is a type-conversion wrapper around `getCommentcid()`
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getCommentcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getCommentcid()))
}

/**
 * optional bytes commentCid = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCommentcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getCommentcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getCommentcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setCommentcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 6, value)
}

/**
 * optional bytes comment = 7;
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getComment = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ''))
}

/**
 * optional bytes comment = 7;
 * This is a type-conversion wrapper around `getComment()`
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getComment_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getComment()))
}

/**
 * optional bytes comment = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getComment()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getComment_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getComment()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setComment = function (value) {
  return jspb.Message.setProto3BytesField(this, 7, value)
}

/**
 * optional uint32 commentSize = 8;
 * @return {number}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getCommentsize = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setCommentsize = function (value) {
  return jspb.Message.setProto3IntField(this, 8, value)
}

/**
 * optional uint32 status = 9;
 * @return {number}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getStatus = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 9, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setStatus = function (value) {
  return jspb.Message.setProto3IntField(this, 9, value)
}

/**
 * optional bytes refercommentkey = 10;
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getRefercommentkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ''))
}

/**
 * optional bytes refercommentkey = 10;
 * This is a type-conversion wrapper around `getRefercommentkey()`
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getRefercommentkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getRefercommentkey()))
}

/**
 * optional bytes refercommentkey = 10;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getRefercommentkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getRefercommentkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getRefercommentkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setRefercommentkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 10, value)
}

/**
 * optional uint32 CCount = 11;
 * @return {number}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getCcount = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 11, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setCcount = function (value) {
  return jspb.Message.setProto3IntField(this, 11, value)
}

/**
 * optional uint32 UpCount = 12;
 * @return {number}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getUpcount = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 12, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setUpcount = function (value) {
  return jspb.Message.setProto3IntField(this, 12, value)
}

/**
 * optional uint32 DownCount = 13;
 * @return {number}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getDowncount = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 13, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setDowncount = function (value) {
  return jspb.Message.setProto3IntField(this, 13, value)
}

/**
 * optional uint32 TCount = 14;
 * @return {number}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getTcount = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 14, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setTcount = function (value) {
  return jspb.Message.setProto3IntField(this, 14, value)
}

/**
 * optional uint32 type = 15;
 * @return {number}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getType = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 15, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setType = function (value) {
  return jspb.Message.setProto3IntField(this, 15, value)
}

/**
 * optional bytes signature = 16;
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 16, ''))
}

/**
 * optional bytes signature = 16;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 16;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.PublishCommentToObjRequest} returns this
 */
proto.dcnet.pb.PublishCommentToObjRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 16, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.PublishCommentToObjReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.PublishCommentToObjReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.PublishCommentToObjReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.PublishCommentToObjReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.PublishCommentToObjReply}
 */
proto.dcnet.pb.PublishCommentToObjReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.PublishCommentToObjReply()
  return proto.dcnet.pb.PublishCommentToObjReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.PublishCommentToObjReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.PublishCommentToObjReply}
 */
proto.dcnet.pb.PublishCommentToObjReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PublishCommentToObjReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.PublishCommentToObjReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.PublishCommentToObjReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.PublishCommentToObjReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.PublishCommentToObjReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.PublishCommentToObjReply} returns this
 */
proto.dcnet.pb.PublishCommentToObjReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AddUserOffChainSpaceRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AddUserOffChainSpaceRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AddUserOffChainSpaceRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        userpubkey: msg.getUserpubkey_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 2, 0),
        peerid: msg.getPeerid_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AddUserOffChainSpaceRequest}
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AddUserOffChainSpaceRequest()
  return proto.dcnet.pb.AddUserOffChainSpaceRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AddUserOffChainSpaceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AddUserOffChainSpaceRequest}
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AddUserOffChainSpaceRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AddUserOffChainSpaceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
}

/**
 * optional bytes userPubkey = 1;
 * @return {string}
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes userPubkey = 1;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddUserOffChainSpaceRequest} returns this
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint32 blockheight = 2;
 * @return {number}
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.AddUserOffChainSpaceRequest} returns this
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional bytes peerid = 3;
 * @return {string}
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes peerid = 3;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes peerid = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddUserOffChainSpaceRequest} returns this
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional bytes signature = 4;
 * @return {string}
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes signature = 4;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.AddUserOffChainSpaceRequest} returns this
 */
proto.dcnet.pb.AddUserOffChainSpaceRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.AddUserOffChainSpaceReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.AddUserOffChainSpaceReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.AddUserOffChainSpaceReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.AddUserOffChainSpaceReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.AddUserOffChainSpaceReply}
 */
proto.dcnet.pb.AddUserOffChainSpaceReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.AddUserOffChainSpaceReply()
  return proto.dcnet.pb.AddUserOffChainSpaceReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.AddUserOffChainSpaceReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.AddUserOffChainSpaceReply}
 */
proto.dcnet.pb.AddUserOffChainSpaceReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.AddUserOffChainSpaceReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.AddUserOffChainSpaceReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.AddUserOffChainSpaceReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.AddUserOffChainSpaceReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.ReportMaliciousCommentRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.ReportMaliciousCommentRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.ReportMaliciousCommentRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        objcid: msg.getObjcid_asB64(),
        appid: msg.getAppid_asB64(),
        objauthor: msg.getObjauthor_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 4, 0),
        commentblockheight: jspb.Message.getFieldWithDefault(msg, 5, 0),
        commentcid: msg.getCommentcid_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.ReportMaliciousCommentRequest}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.ReportMaliciousCommentRequest()
  return proto.dcnet.pb.ReportMaliciousCommentRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.ReportMaliciousCommentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.ReportMaliciousCommentRequest}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjcid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAppid(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjauthor(value)
        break
      case 4:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 5:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setCommentblockheight(value)
        break
      case 6:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setCommentcid(value)
        break
      case 7:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.ReportMaliciousCommentRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.ReportMaliciousCommentRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getObjcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getAppid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getObjauthor_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(4, f)
  }
  f = message.getCommentblockheight()
  if (f !== 0) {
    writer.writeUint32(5, f)
  }
  f = message.getCommentcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(6, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(7, f)
  }
}

/**
 * optional bytes objCid = 1;
 * @return {string}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getObjcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes objCid = 1;
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {string}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getObjcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjcid()))
}

/**
 * optional bytes objCid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getObjcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.ReportMaliciousCommentRequest} returns this
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.setObjcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes appId = 2;
 * @return {string}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getAppid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes appId = 2;
 * This is a type-conversion wrapper around `getAppid()`
 * @return {string}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getAppid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAppid()))
}

/**
 * optional bytes appId = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAppid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getAppid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAppid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.ReportMaliciousCommentRequest} returns this
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.setAppid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional bytes objAuthor = 3;
 * @return {string}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getObjauthor = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes objAuthor = 3;
 * This is a type-conversion wrapper around `getObjauthor()`
 * @return {string}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getObjauthor_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjauthor()))
}

/**
 * optional bytes objAuthor = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjauthor()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getObjauthor_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjauthor()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.ReportMaliciousCommentRequest} returns this
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.setObjauthor = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional uint32 blockheight = 4;
 * @return {number}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.ReportMaliciousCommentRequest} returns this
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 4, value)
}

/**
 * optional uint32 commentBlockheight = 5;
 * @return {number}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getCommentblockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.ReportMaliciousCommentRequest} returns this
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.setCommentblockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 5, value)
}

/**
 * optional bytes commentCid = 6;
 * @return {string}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getCommentcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ''))
}

/**
 * optional bytes commentCid = 6;
 * This is a type-conversion wrapper around `getCommentcid()`
 * @return {string}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getCommentcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getCommentcid()))
}

/**
 * optional bytes commentCid = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCommentcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getCommentcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getCommentcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.ReportMaliciousCommentRequest} returns this
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.setCommentcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 6, value)
}

/**
 * optional bytes signature = 7;
 * @return {string}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ''))
}

/**
 * optional bytes signature = 7;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.ReportMaliciousCommentRequest} returns this
 */
proto.dcnet.pb.ReportMaliciousCommentRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 7, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.ReportMaliciousCommentReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.ReportMaliciousCommentReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.ReportMaliciousCommentReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.ReportMaliciousCommentReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.ReportMaliciousCommentReply}
 */
proto.dcnet.pb.ReportMaliciousCommentReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.ReportMaliciousCommentReply()
  return proto.dcnet.pb.ReportMaliciousCommentReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.ReportMaliciousCommentReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.ReportMaliciousCommentReply}
 */
proto.dcnet.pb.ReportMaliciousCommentReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ReportMaliciousCommentReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.ReportMaliciousCommentReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.ReportMaliciousCommentReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.ReportMaliciousCommentReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.ReportMaliciousCommentReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.ReportMaliciousCommentReply} returns this
 */
proto.dcnet.pb.ReportMaliciousCommentReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.SetObjCommentPublicRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.SetObjCommentPublicRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.SetObjCommentPublicRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.SetObjCommentPublicRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        objcid: msg.getObjcid_asB64(),
        appid: msg.getAppid_asB64(),
        objauthor: msg.getObjauthor_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 4, 0),
        commentblockheight: jspb.Message.getFieldWithDefault(msg, 5, 0),
        commentcid: msg.getCommentcid_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.SetObjCommentPublicRequest}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.SetObjCommentPublicRequest()
  return proto.dcnet.pb.SetObjCommentPublicRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.SetObjCommentPublicRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.SetObjCommentPublicRequest}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjcid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAppid(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjauthor(value)
        break
      case 4:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 5:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setCommentblockheight(value)
        break
      case 6:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setCommentcid(value)
        break
      case 7:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.SetObjCommentPublicRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.SetObjCommentPublicRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.SetObjCommentPublicRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getObjcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getAppid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getObjauthor_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(4, f)
  }
  f = message.getCommentblockheight()
  if (f !== 0) {
    writer.writeUint32(5, f)
  }
  f = message.getCommentcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(6, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(7, f)
  }
}

/**
 * optional bytes objCid = 1;
 * @return {string}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getObjcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes objCid = 1;
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {string}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getObjcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjcid()))
}

/**
 * optional bytes objCid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getObjcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SetObjCommentPublicRequest} returns this
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.setObjcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes appId = 2;
 * @return {string}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getAppid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes appId = 2;
 * This is a type-conversion wrapper around `getAppid()`
 * @return {string}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getAppid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAppid()))
}

/**
 * optional bytes appId = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAppid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getAppid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAppid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SetObjCommentPublicRequest} returns this
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.setAppid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional bytes objAuthor = 3;
 * @return {string}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getObjauthor = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes objAuthor = 3;
 * This is a type-conversion wrapper around `getObjauthor()`
 * @return {string}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getObjauthor_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjauthor()))
}

/**
 * optional bytes objAuthor = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjauthor()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getObjauthor_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjauthor()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SetObjCommentPublicRequest} returns this
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.setObjauthor = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional uint32 blockheight = 4;
 * @return {number}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.SetObjCommentPublicRequest} returns this
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 4, value)
}

/**
 * optional uint32 commentBlockheight = 5;
 * @return {number}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getCommentblockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.SetObjCommentPublicRequest} returns this
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.setCommentblockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 5, value)
}

/**
 * optional bytes commentCid = 6;
 * @return {string}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getCommentcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ''))
}

/**
 * optional bytes commentCid = 6;
 * This is a type-conversion wrapper around `getCommentcid()`
 * @return {string}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getCommentcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getCommentcid()))
}

/**
 * optional bytes commentCid = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCommentcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getCommentcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getCommentcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SetObjCommentPublicRequest} returns this
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.setCommentcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 6, value)
}

/**
 * optional bytes signature = 7;
 * @return {string}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ''))
}

/**
 * optional bytes signature = 7;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.SetObjCommentPublicRequest} returns this
 */
proto.dcnet.pb.SetObjCommentPublicRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 7, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.SetObjCommentPublicReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.SetObjCommentPublicReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.SetObjCommentPublicReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.SetObjCommentPublicReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.SetObjCommentPublicReply}
 */
proto.dcnet.pb.SetObjCommentPublicReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.SetObjCommentPublicReply()
  return proto.dcnet.pb.SetObjCommentPublicReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.SetObjCommentPublicReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.SetObjCommentPublicReply}
 */
proto.dcnet.pb.SetObjCommentPublicReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.SetObjCommentPublicReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.SetObjCommentPublicReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.SetObjCommentPublicReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.SetObjCommentPublicReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.SetObjCommentPublicReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.SetObjCommentPublicReply} returns this
 */
proto.dcnet.pb.SetObjCommentPublicReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.DeleteSelfCommentRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.DeleteSelfCommentRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.DeleteSelfCommentRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.DeleteSelfCommentRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        objcid: msg.getObjcid_asB64(),
        appid: msg.getAppid_asB64(),
        userpubkey: msg.getUserpubkey_asB64(),
        objauthor: msg.getObjauthor_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 5, 0),
        commentblockheight: jspb.Message.getFieldWithDefault(msg, 6, 0),
        commentcid: msg.getCommentcid_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.DeleteSelfCommentRequest}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.DeleteSelfCommentRequest()
  return proto.dcnet.pb.DeleteSelfCommentRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.DeleteSelfCommentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.DeleteSelfCommentRequest}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjcid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAppid(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjauthor(value)
        break
      case 5:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 6:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setCommentblockheight(value)
        break
      case 7:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setCommentcid(value)
        break
      case 8:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.DeleteSelfCommentRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.DeleteSelfCommentRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.DeleteSelfCommentRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getObjcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getAppid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getObjauthor_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(5, f)
  }
  f = message.getCommentblockheight()
  if (f !== 0) {
    writer.writeUint32(6, f)
  }
  f = message.getCommentcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(7, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(8, f)
  }
}

/**
 * optional bytes objCid = 1;
 * @return {string}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getObjcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes objCid = 1;
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {string}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getObjcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjcid()))
}

/**
 * optional bytes objCid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getObjcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteSelfCommentRequest} returns this
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.setObjcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes appId = 2;
 * @return {string}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getAppid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes appId = 2;
 * This is a type-conversion wrapper around `getAppid()`
 * @return {string}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getAppid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAppid()))
}

/**
 * optional bytes appId = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAppid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getAppid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAppid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteSelfCommentRequest} returns this
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.setAppid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional bytes userPubkey = 3;
 * @return {string}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes userPubkey = 3;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteSelfCommentRequest} returns this
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional bytes objAuthor = 4;
 * @return {string}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getObjauthor = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes objAuthor = 4;
 * This is a type-conversion wrapper around `getObjauthor()`
 * @return {string}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getObjauthor_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjauthor()))
}

/**
 * optional bytes objAuthor = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjauthor()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getObjauthor_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjauthor()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteSelfCommentRequest} returns this
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.setObjauthor = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

/**
 * optional uint32 blockheight = 5;
 * @return {number}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.DeleteSelfCommentRequest} returns this
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 5, value)
}

/**
 * optional uint32 commentBlockheight = 6;
 * @return {number}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getCommentblockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.DeleteSelfCommentRequest} returns this
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.setCommentblockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 6, value)
}

/**
 * optional bytes commentCid = 7;
 * @return {string}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getCommentcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ''))
}

/**
 * optional bytes commentCid = 7;
 * This is a type-conversion wrapper around `getCommentcid()`
 * @return {string}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getCommentcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getCommentcid()))
}

/**
 * optional bytes commentCid = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCommentcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getCommentcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getCommentcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteSelfCommentRequest} returns this
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.setCommentcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 7, value)
}

/**
 * optional bytes signature = 8;
 * @return {string}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ''))
}

/**
 * optional bytes signature = 8;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 8;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteSelfCommentRequest} returns this
 */
proto.dcnet.pb.DeleteSelfCommentRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 8, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.DeleteSelfCommentReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.DeleteSelfCommentReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.DeleteSelfCommentReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.DeleteSelfCommentReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.DeleteSelfCommentReply}
 */
proto.dcnet.pb.DeleteSelfCommentReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.DeleteSelfCommentReply()
  return proto.dcnet.pb.DeleteSelfCommentReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.DeleteSelfCommentReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.DeleteSelfCommentReply}
 */
proto.dcnet.pb.DeleteSelfCommentReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteSelfCommentReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.DeleteSelfCommentReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.DeleteSelfCommentReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.DeleteSelfCommentReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.DeleteSelfCommentReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.DeleteSelfCommentReply} returns this
 */
proto.dcnet.pb.DeleteSelfCommentReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.DeleteCommentToObjRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.DeleteCommentToObjRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.DeleteCommentToObjRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.DeleteCommentToObjRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        objcid: msg.getObjcid_asB64(),
        appid: msg.getAppid_asB64(),
        userpubkey: msg.getUserpubkey_asB64(),
        objauthor: msg.getObjauthor_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 5, 0),
        commentblockheight: jspb.Message.getFieldWithDefault(msg, 6, 0),
        commentcid: msg.getCommentcid_asB64(),
        signature: msg.getSignature_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.DeleteCommentToObjRequest}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.DeleteCommentToObjRequest()
  return proto.dcnet.pb.DeleteCommentToObjRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.DeleteCommentToObjRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.DeleteCommentToObjRequest}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjcid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAppid(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjauthor(value)
        break
      case 5:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 6:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setCommentblockheight(value)
        break
      case 7:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setCommentcid(value)
        break
      case 8:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSignature(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.DeleteCommentToObjRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.DeleteCommentToObjRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.DeleteCommentToObjRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getObjcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getAppid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getObjauthor_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(5, f)
  }
  f = message.getCommentblockheight()
  if (f !== 0) {
    writer.writeUint32(6, f)
  }
  f = message.getCommentcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(7, f)
  }
  f = message.getSignature_asU8()
  if (f.length > 0) {
    writer.writeBytes(8, f)
  }
}

/**
 * optional bytes objCid = 1;
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getObjcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes objCid = 1;
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getObjcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjcid()))
}

/**
 * optional bytes objCid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getObjcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteCommentToObjRequest} returns this
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.setObjcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes appId = 2;
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getAppid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes appId = 2;
 * This is a type-conversion wrapper around `getAppid()`
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getAppid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAppid()))
}

/**
 * optional bytes appId = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAppid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getAppid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAppid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteCommentToObjRequest} returns this
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.setAppid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional bytes userPubkey = 3;
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes userPubkey = 3;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteCommentToObjRequest} returns this
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional bytes objAuthor = 4;
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getObjauthor = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes objAuthor = 4;
 * This is a type-conversion wrapper around `getObjauthor()`
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getObjauthor_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjauthor()))
}

/**
 * optional bytes objAuthor = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjauthor()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getObjauthor_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjauthor()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteCommentToObjRequest} returns this
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.setObjauthor = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

/**
 * optional uint32 blockheight = 5;
 * @return {number}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.DeleteCommentToObjRequest} returns this
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 5, value)
}

/**
 * optional uint32 commentBlockheight = 6;
 * @return {number}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getCommentblockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.DeleteCommentToObjRequest} returns this
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.setCommentblockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 6, value)
}

/**
 * optional bytes commentCid = 7;
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getCommentcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ''))
}

/**
 * optional bytes commentCid = 7;
 * This is a type-conversion wrapper around `getCommentcid()`
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getCommentcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getCommentcid()))
}

/**
 * optional bytes commentCid = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCommentcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getCommentcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getCommentcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteCommentToObjRequest} returns this
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.setCommentcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 7, value)
}

/**
 * optional bytes signature = 8;
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getSignature = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ''))
}

/**
 * optional bytes signature = 8;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getSignature_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSignature()))
}

/**
 * optional bytes signature = 8;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.getSignature_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSignature()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DeleteCommentToObjRequest} returns this
 */
proto.dcnet.pb.DeleteCommentToObjRequest.prototype.setSignature = function (value) {
  return jspb.Message.setProto3BytesField(this, 8, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.DeleteCommentToObjReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.DeleteCommentToObjReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.DeleteCommentToObjReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.DeleteCommentToObjReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.DeleteCommentToObjReply}
 */
proto.dcnet.pb.DeleteCommentToObjReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.DeleteCommentToObjReply()
  return proto.dcnet.pb.DeleteCommentToObjReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.DeleteCommentToObjReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.DeleteCommentToObjReply}
 */
proto.dcnet.pb.DeleteCommentToObjReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DeleteCommentToObjReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.DeleteCommentToObjReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.DeleteCommentToObjReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.DeleteCommentToObjReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.DeleteCommentToObjReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.DeleteCommentToObjReply} returns this
 */
proto.dcnet.pb.DeleteCommentToObjReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetCommentableObjRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetCommentableObjRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetCommentableObjRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetCommentableObjRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        appid: msg.getAppid_asB64(),
        objauthor: msg.getObjauthor_asB64(),
        startheight: jspb.Message.getFieldWithDefault(msg, 3, 0),
        direction: jspb.Message.getFieldWithDefault(msg, 4, 0),
        offset: jspb.Message.getFieldWithDefault(msg, 5, 0),
        limit: jspb.Message.getFieldWithDefault(msg, 6, 0),
        seekkey: msg.getSeekkey_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetCommentableObjRequest}
 */
proto.dcnet.pb.GetCommentableObjRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetCommentableObjRequest()
  return proto.dcnet.pb.GetCommentableObjRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetCommentableObjRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetCommentableObjRequest}
 */
proto.dcnet.pb.GetCommentableObjRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAppid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjauthor(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setStartheight(value)
        break
      case 4:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setDirection(value)
        break
      case 5:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setOffset(value)
        break
      case 6:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setLimit(value)
        break
      case 7:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSeekkey(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetCommentableObjRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetCommentableObjRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetCommentableObjRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAppid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getObjauthor_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getStartheight()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
  f = message.getDirection()
  if (f !== 0) {
    writer.writeUint32(4, f)
  }
  f = message.getOffset()
  if (f !== 0) {
    writer.writeUint32(5, f)
  }
  f = message.getLimit()
  if (f !== 0) {
    writer.writeUint32(6, f)
  }
  f = message.getSeekkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(7, f)
  }
}

/**
 * optional bytes appId = 1;
 * @return {string}
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.getAppid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes appId = 1;
 * This is a type-conversion wrapper around `getAppid()`
 * @return {string}
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.getAppid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAppid()))
}

/**
 * optional bytes appId = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAppid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.getAppid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAppid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetCommentableObjRequest} returns this
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.setAppid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes objAuthor = 2;
 * @return {string}
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.getObjauthor = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes objAuthor = 2;
 * This is a type-conversion wrapper around `getObjauthor()`
 * @return {string}
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.getObjauthor_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjauthor()))
}

/**
 * optional bytes objAuthor = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjauthor()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.getObjauthor_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjauthor()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetCommentableObjRequest} returns this
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.setObjauthor = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional uint32 startHeight = 3;
 * @return {number}
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.getStartheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetCommentableObjRequest} returns this
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.setStartheight = function (value) {
  return jspb.Message.setProto3IntField(this, 3, value)
}

/**
 * optional uint32 direction = 4;
 * @return {number}
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.getDirection = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetCommentableObjRequest} returns this
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.setDirection = function (value) {
  return jspb.Message.setProto3IntField(this, 4, value)
}

/**
 * optional uint32 offset = 5;
 * @return {number}
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.getOffset = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetCommentableObjRequest} returns this
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.setOffset = function (value) {
  return jspb.Message.setProto3IntField(this, 5, value)
}

/**
 * optional uint32 limit = 6;
 * @return {number}
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.getLimit = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetCommentableObjRequest} returns this
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.setLimit = function (value) {
  return jspb.Message.setProto3IntField(this, 6, value)
}

/**
 * optional bytes seekKey = 7;
 * @return {string}
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.getSeekkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ''))
}

/**
 * optional bytes seekKey = 7;
 * This is a type-conversion wrapper around `getSeekkey()`
 * @return {string}
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.getSeekkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSeekkey()))
}

/**
 * optional bytes seekKey = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSeekkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.getSeekkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSeekkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetCommentableObjRequest} returns this
 */
proto.dcnet.pb.GetCommentableObjRequest.prototype.setSeekkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 7, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetCommentableObjReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetCommentableObjReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetCommentableObjReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetCommentableObjReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0),
        objscid: msg.getObjscid_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetCommentableObjReply}
 */
proto.dcnet.pb.GetCommentableObjReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetCommentableObjReply()
  return proto.dcnet.pb.GetCommentableObjReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetCommentableObjReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetCommentableObjReply}
 */
proto.dcnet.pb.GetCommentableObjReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjscid(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetCommentableObjReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetCommentableObjReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetCommentableObjReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetCommentableObjReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
  f = message.getObjscid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.GetCommentableObjReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetCommentableObjReply} returns this
 */
proto.dcnet.pb.GetCommentableObjReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * optional bytes objsCid = 2;
 * @return {string}
 */
proto.dcnet.pb.GetCommentableObjReply.prototype.getObjscid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes objsCid = 2;
 * This is a type-conversion wrapper around `getObjscid()`
 * @return {string}
 */
proto.dcnet.pb.GetCommentableObjReply.prototype.getObjscid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjscid()))
}

/**
 * optional bytes objsCid = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjscid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetCommentableObjReply.prototype.getObjscid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjscid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetCommentableObjReply} returns this
 */
proto.dcnet.pb.GetCommentableObjReply.prototype.setObjscid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetObjCommentsRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetObjCommentsRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetObjCommentsRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetObjCommentsRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        objcid: msg.getObjcid_asB64(),
        appid: msg.getAppid_asB64(),
        objauthor: msg.getObjauthor_asB64(),
        startheight: jspb.Message.getFieldWithDefault(msg, 4, 0),
        direction: jspb.Message.getFieldWithDefault(msg, 5, 0),
        offset: jspb.Message.getFieldWithDefault(msg, 6, 0),
        limit: jspb.Message.getFieldWithDefault(msg, 7, 0),
        seekkey: msg.getSeekkey_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetObjCommentsRequest}
 */
proto.dcnet.pb.GetObjCommentsRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetObjCommentsRequest()
  return proto.dcnet.pb.GetObjCommentsRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetObjCommentsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetObjCommentsRequest}
 */
proto.dcnet.pb.GetObjCommentsRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjcid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAppid(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setObjauthor(value)
        break
      case 4:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setStartheight(value)
        break
      case 5:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setDirection(value)
        break
      case 6:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setOffset(value)
        break
      case 7:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setLimit(value)
        break
      case 8:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSeekkey(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetObjCommentsRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetObjCommentsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetObjCommentsRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getObjcid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getAppid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getObjauthor_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getStartheight()
  if (f !== 0) {
    writer.writeUint32(4, f)
  }
  f = message.getDirection()
  if (f !== 0) {
    writer.writeUint32(5, f)
  }
  f = message.getOffset()
  if (f !== 0) {
    writer.writeUint32(6, f)
  }
  f = message.getLimit()
  if (f !== 0) {
    writer.writeUint32(7, f)
  }
  f = message.getSeekkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(8, f)
  }
}

/**
 * optional bytes objCid = 1;
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getObjcid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes objCid = 1;
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getObjcid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjcid()))
}

/**
 * optional bytes objCid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjcid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getObjcid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjcid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetObjCommentsRequest} returns this
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.setObjcid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes appId = 2;
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getAppid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes appId = 2;
 * This is a type-conversion wrapper around `getAppid()`
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getAppid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAppid()))
}

/**
 * optional bytes appId = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAppid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getAppid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAppid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetObjCommentsRequest} returns this
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.setAppid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional bytes objAuthor = 3;
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getObjauthor = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes objAuthor = 3;
 * This is a type-conversion wrapper around `getObjauthor()`
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getObjauthor_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getObjauthor()))
}

/**
 * optional bytes objAuthor = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getObjauthor()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getObjauthor_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getObjauthor()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetObjCommentsRequest} returns this
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.setObjauthor = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional uint32 startHeight = 4;
 * @return {number}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getStartheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetObjCommentsRequest} returns this
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.setStartheight = function (value) {
  return jspb.Message.setProto3IntField(this, 4, value)
}

/**
 * optional uint32 direction = 5;
 * @return {number}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getDirection = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetObjCommentsRequest} returns this
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.setDirection = function (value) {
  return jspb.Message.setProto3IntField(this, 5, value)
}

/**
 * optional uint32 offset = 6;
 * @return {number}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getOffset = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetObjCommentsRequest} returns this
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.setOffset = function (value) {
  return jspb.Message.setProto3IntField(this, 6, value)
}

/**
 * optional uint32 limit = 7;
 * @return {number}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getLimit = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetObjCommentsRequest} returns this
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.setLimit = function (value) {
  return jspb.Message.setProto3IntField(this, 7, value)
}

/**
 * optional bytes seekKey = 8;
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getSeekkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ''))
}

/**
 * optional bytes seekKey = 8;
 * This is a type-conversion wrapper around `getSeekkey()`
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getSeekkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSeekkey()))
}

/**
 * optional bytes seekKey = 8;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSeekkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.getSeekkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSeekkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetObjCommentsRequest} returns this
 */
proto.dcnet.pb.GetObjCommentsRequest.prototype.setSeekkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 8, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetObjCommentsReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetObjCommentsReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetObjCommentsReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetObjCommentsReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0),
        commentscid: msg.getCommentscid_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetObjCommentsReply}
 */
proto.dcnet.pb.GetObjCommentsReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetObjCommentsReply()
  return proto.dcnet.pb.GetObjCommentsReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetObjCommentsReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetObjCommentsReply}
 */
proto.dcnet.pb.GetObjCommentsReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setCommentscid(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetObjCommentsReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetObjCommentsReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetObjCommentsReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetObjCommentsReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
  f = message.getCommentscid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.GetObjCommentsReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetObjCommentsReply} returns this
 */
proto.dcnet.pb.GetObjCommentsReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * optional bytes commentsCid = 2;
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentsReply.prototype.getCommentscid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes commentsCid = 2;
 * This is a type-conversion wrapper around `getCommentscid()`
 * @return {string}
 */
proto.dcnet.pb.GetObjCommentsReply.prototype.getCommentscid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getCommentscid()))
}

/**
 * optional bytes commentsCid = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCommentscid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetObjCommentsReply.prototype.getCommentscid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getCommentscid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetObjCommentsReply} returns this
 */
proto.dcnet.pb.GetObjCommentsReply.prototype.setCommentscid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetUserCommentsRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetUserCommentsRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetUserCommentsRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetUserCommentsRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        appid: msg.getAppid_asB64(),
        userpubkey: msg.getUserpubkey_asB64(),
        startheight: jspb.Message.getFieldWithDefault(msg, 3, 0),
        direction: jspb.Message.getFieldWithDefault(msg, 4, 0),
        offset: jspb.Message.getFieldWithDefault(msg, 5, 0),
        limit: jspb.Message.getFieldWithDefault(msg, 6, 0),
        seekkey: msg.getSeekkey_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetUserCommentsRequest}
 */
proto.dcnet.pb.GetUserCommentsRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetUserCommentsRequest()
  return proto.dcnet.pb.GetUserCommentsRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetUserCommentsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetUserCommentsRequest}
 */
proto.dcnet.pb.GetUserCommentsRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setAppid(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setStartheight(value)
        break
      case 4:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setDirection(value)
        break
      case 5:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setOffset(value)
        break
      case 6:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setLimit(value)
        break
      case 7:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setSeekkey(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetUserCommentsRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetUserCommentsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetUserCommentsRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getAppid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getStartheight()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
  f = message.getDirection()
  if (f !== 0) {
    writer.writeUint32(4, f)
  }
  f = message.getOffset()
  if (f !== 0) {
    writer.writeUint32(5, f)
  }
  f = message.getLimit()
  if (f !== 0) {
    writer.writeUint32(6, f)
  }
  f = message.getSeekkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(7, f)
  }
}

/**
 * optional bytes appId = 1;
 * @return {string}
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.getAppid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes appId = 1;
 * This is a type-conversion wrapper around `getAppid()`
 * @return {string}
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.getAppid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getAppid()))
}

/**
 * optional bytes appId = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAppid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.getAppid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getAppid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetUserCommentsRequest} returns this
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.setAppid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes UserPubkey = 2;
 * @return {string}
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes UserPubkey = 2;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes UserPubkey = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetUserCommentsRequest} returns this
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional uint32 startHeight = 3;
 * @return {number}
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.getStartheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetUserCommentsRequest} returns this
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.setStartheight = function (value) {
  return jspb.Message.setProto3IntField(this, 3, value)
}

/**
 * optional uint32 direction = 4;
 * @return {number}
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.getDirection = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetUserCommentsRequest} returns this
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.setDirection = function (value) {
  return jspb.Message.setProto3IntField(this, 4, value)
}

/**
 * optional uint32 offset = 5;
 * @return {number}
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.getOffset = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetUserCommentsRequest} returns this
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.setOffset = function (value) {
  return jspb.Message.setProto3IntField(this, 5, value)
}

/**
 * optional uint32 limit = 6;
 * @return {number}
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.getLimit = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetUserCommentsRequest} returns this
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.setLimit = function (value) {
  return jspb.Message.setProto3IntField(this, 6, value)
}

/**
 * optional bytes seekKey = 7;
 * @return {string}
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.getSeekkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ''))
}

/**
 * optional bytes seekKey = 7;
 * This is a type-conversion wrapper around `getSeekkey()`
 * @return {string}
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.getSeekkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getSeekkey()))
}

/**
 * optional bytes seekKey = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSeekkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.getSeekkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getSeekkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetUserCommentsRequest} returns this
 */
proto.dcnet.pb.GetUserCommentsRequest.prototype.setSeekkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 7, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.GetUserCommentsReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.GetUserCommentsReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.GetUserCommentsReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.GetUserCommentsReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0),
        commentscid: msg.getCommentscid_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.GetUserCommentsReply}
 */
proto.dcnet.pb.GetUserCommentsReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.GetUserCommentsReply()
  return proto.dcnet.pb.GetUserCommentsReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.GetUserCommentsReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.GetUserCommentsReply}
 */
proto.dcnet.pb.GetUserCommentsReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setCommentscid(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetUserCommentsReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.GetUserCommentsReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.GetUserCommentsReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.GetUserCommentsReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
  f = message.getCommentscid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.GetUserCommentsReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.GetUserCommentsReply} returns this
 */
proto.dcnet.pb.GetUserCommentsReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * optional bytes commentsCid = 2;
 * @return {string}
 */
proto.dcnet.pb.GetUserCommentsReply.prototype.getCommentscid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes commentsCid = 2;
 * This is a type-conversion wrapper around `getCommentscid()`
 * @return {string}
 */
proto.dcnet.pb.GetUserCommentsReply.prototype.getCommentscid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getCommentscid()))
}

/**
 * optional bytes commentsCid = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCommentscid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.GetUserCommentsReply.prototype.getCommentscid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getCommentscid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.GetUserCommentsReply} returns this
 */
proto.dcnet.pb.GetUserCommentsReply.prototype.setCommentscid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.PushCommentFunOptRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.PushCommentFunOptRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.PushCommentFunOptRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.PushCommentFunOptRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        opt: (f = msg.getOpt()) && proto.dcnet.pb.CommentFunOpt.toObject(includeInstance, f)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.PushCommentFunOptRequest}
 */
proto.dcnet.pb.PushCommentFunOptRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.PushCommentFunOptRequest()
  return proto.dcnet.pb.PushCommentFunOptRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.PushCommentFunOptRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.PushCommentFunOptRequest}
 */
proto.dcnet.pb.PushCommentFunOptRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.dcnet.pb.CommentFunOpt()
        reader.readMessage(value, proto.dcnet.pb.CommentFunOpt.deserializeBinaryFromReader)
        msg.setOpt(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PushCommentFunOptRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.PushCommentFunOptRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.PushCommentFunOptRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.PushCommentFunOptRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getOpt()
  if (f != null) {
    writer.writeMessage(1, f, proto.dcnet.pb.CommentFunOpt.serializeBinaryToWriter)
  }
}

/**
 * optional CommentFunOpt opt = 1;
 * @return {?proto.dcnet.pb.CommentFunOpt}
 */
proto.dcnet.pb.PushCommentFunOptRequest.prototype.getOpt = function () {
  return /** @type{?proto.dcnet.pb.CommentFunOpt} */ (
    jspb.Message.getWrapperField(this, proto.dcnet.pb.CommentFunOpt, 1)
  )
}

/**
 * @param {?proto.dcnet.pb.CommentFunOpt|undefined} value
 * @return {!proto.dcnet.pb.PushCommentFunOptRequest} returns this
 */
proto.dcnet.pb.PushCommentFunOptRequest.prototype.setOpt = function (value) {
  return jspb.Message.setWrapperField(this, 1, value)
}

/**
 * Clears the message field making it undefined.
 * @return {!proto.dcnet.pb.PushCommentFunOptRequest} returns this
 */
proto.dcnet.pb.PushCommentFunOptRequest.prototype.clearOpt = function () {
  return this.setOpt(undefined)
}

/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dcnet.pb.PushCommentFunOptRequest.prototype.hasOpt = function () {
  return jspb.Message.getField(this, 1) != null
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.PushCommentFunOptReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.PushCommentFunOptReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.PushCommentFunOptReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.PushCommentFunOptReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.PushCommentFunOptReply}
 */
proto.dcnet.pb.PushCommentFunOptReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.PushCommentFunOptReply()
  return proto.dcnet.pb.PushCommentFunOptReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.PushCommentFunOptReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.PushCommentFunOptReply}
 */
proto.dcnet.pb.PushCommentFunOptReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PushCommentFunOptReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.PushCommentFunOptReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.PushCommentFunOptReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.PushCommentFunOptReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dcnet.pb.PullCommentFunOptsRequest.repeatedFields_ = [3]

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.PullCommentFunOptsRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.PullCommentFunOptsRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.PullCommentFunOptsRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.PullCommentFunOptsRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        userpubkey: msg.getUserpubkey_asB64(),
        limit: jspb.Message.getFieldWithDefault(msg, 2, 0),
        seqsList: jspb.Message.toObjectList(
          msg.getSeqsList(),
          proto.dcnet.pb.peerSeqno.toObject,
          includeInstance
        )
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.PullCommentFunOptsRequest}
 */
proto.dcnet.pb.PullCommentFunOptsRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.PullCommentFunOptsRequest()
  return proto.dcnet.pb.PullCommentFunOptsRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.PullCommentFunOptsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.PullCommentFunOptsRequest}
 */
proto.dcnet.pb.PullCommentFunOptsRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setLimit(value)
        break
      case 3:
        var value = new proto.dcnet.pb.peerSeqno()
        reader.readMessage(value, proto.dcnet.pb.peerSeqno.deserializeBinaryFromReader)
        msg.addSeqs(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PullCommentFunOptsRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.PullCommentFunOptsRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.PullCommentFunOptsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.PullCommentFunOptsRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getLimit()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getSeqsList()
  if (f.length > 0) {
    writer.writeRepeatedMessage(3, f, proto.dcnet.pb.peerSeqno.serializeBinaryToWriter)
  }
}

/**
 * optional bytes userPubkey = 1;
 * @return {string}
 */
proto.dcnet.pb.PullCommentFunOptsRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes userPubkey = 1;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.PullCommentFunOptsRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PullCommentFunOptsRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.PullCommentFunOptsRequest} returns this
 */
proto.dcnet.pb.PullCommentFunOptsRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint32 limit = 2;
 * @return {number}
 */
proto.dcnet.pb.PullCommentFunOptsRequest.prototype.getLimit = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.PullCommentFunOptsRequest} returns this
 */
proto.dcnet.pb.PullCommentFunOptsRequest.prototype.setLimit = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * repeated peerSeqno seqs = 3;
 * @return {!Array<!proto.dcnet.pb.peerSeqno>}
 */
proto.dcnet.pb.PullCommentFunOptsRequest.prototype.getSeqsList = function () {
  return /** @type{!Array<!proto.dcnet.pb.peerSeqno>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dcnet.pb.peerSeqno, 3)
  )
}

/**
 * @param {!Array<!proto.dcnet.pb.peerSeqno>} value
 * @return {!proto.dcnet.pb.PullCommentFunOptsRequest} returns this
 */
proto.dcnet.pb.PullCommentFunOptsRequest.prototype.setSeqsList = function (value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value)
}

/**
 * @param {!proto.dcnet.pb.peerSeqno=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dcnet.pb.peerSeqno}
 */
proto.dcnet.pb.PullCommentFunOptsRequest.prototype.addSeqs = function (opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(
    this,
    3,
    opt_value,
    proto.dcnet.pb.peerSeqno,
    opt_index
  )
}

/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dcnet.pb.PullCommentFunOptsRequest} returns this
 */
proto.dcnet.pb.PullCommentFunOptsRequest.prototype.clearSeqsList = function () {
  return this.setSeqsList([])
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.peerSeqno.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.peerSeqno.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.peerSeqno} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.peerSeqno.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        peerid: msg.getPeerid_asB64(),
        seqno: jspb.Message.getFieldWithDefault(msg, 2, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.peerSeqno}
 */
proto.dcnet.pb.peerSeqno.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.peerSeqno()
  return proto.dcnet.pb.peerSeqno.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.peerSeqno} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.peerSeqno}
 */
proto.dcnet.pb.peerSeqno.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint64())
        msg.setSeqno(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.peerSeqno.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.peerSeqno.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.peerSeqno} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.peerSeqno.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getSeqno()
  if (f !== 0) {
    writer.writeUint64(2, f)
  }
}

/**
 * optional bytes peerid = 1;
 * @return {string}
 */
proto.dcnet.pb.peerSeqno.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes peerid = 1;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.peerSeqno.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes peerid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.peerSeqno.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.peerSeqno} returns this
 */
proto.dcnet.pb.peerSeqno.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint64 seqno = 2;
 * @return {number}
 */
proto.dcnet.pb.peerSeqno.prototype.getSeqno = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.peerSeqno} returns this
 */
proto.dcnet.pb.peerSeqno.prototype.setSeqno = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.PullCommentFunOptsReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.PullCommentFunOptsReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.PullCommentFunOptsReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.PullCommentFunOptsReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0),
        funcoptscid: msg.getFuncoptscid_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.PullCommentFunOptsReply}
 */
proto.dcnet.pb.PullCommentFunOptsReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.PullCommentFunOptsReply()
  return proto.dcnet.pb.PullCommentFunOptsReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.PullCommentFunOptsReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.PullCommentFunOptsReply}
 */
proto.dcnet.pb.PullCommentFunOptsReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setFuncoptscid(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PullCommentFunOptsReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.PullCommentFunOptsReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.PullCommentFunOptsReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.PullCommentFunOptsReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
  f = message.getFuncoptscid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.PullCommentFunOptsReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.PullCommentFunOptsReply} returns this
 */
proto.dcnet.pb.PullCommentFunOptsReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

/**
 * optional bytes funcOptsCid = 2;
 * @return {string}
 */
proto.dcnet.pb.PullCommentFunOptsReply.prototype.getFuncoptscid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes funcOptsCid = 2;
 * This is a type-conversion wrapper around `getFuncoptscid()`
 * @return {string}
 */
proto.dcnet.pb.PullCommentFunOptsReply.prototype.getFuncoptscid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getFuncoptscid()))
}

/**
 * optional bytes funcOptsCid = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getFuncoptscid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.PullCommentFunOptsReply.prototype.getFuncoptscid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getFuncoptscid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.PullCommentFunOptsReply} returns this
 */
proto.dcnet.pb.PullCommentFunOptsReply.prototype.setFuncoptscid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.CommentFunOpt.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.CommentFunOpt.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.CommentFunOpt} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.CommentFunOpt.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        userpubkey: msg.getUserpubkey_asB64(),
        seqno: jspb.Message.getFieldWithDefault(msg, 2, 0),
        peerid: msg.getPeerid_asB64(),
        optype: jspb.Message.getFieldWithDefault(msg, 4, 0),
        opreq: msg.getOpreq_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.CommentFunOpt}
 */
proto.dcnet.pb.CommentFunOpt.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.CommentFunOpt()
  return proto.dcnet.pb.CommentFunOpt.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.CommentFunOpt} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.CommentFunOpt}
 */
proto.dcnet.pb.CommentFunOpt.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint64())
        msg.setSeqno(value)
        break
      case 3:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setPeerid(value)
        break
      case 4:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setOptype(value)
        break
      case 5:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setOpreq(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CommentFunOpt.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.CommentFunOpt.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.CommentFunOpt} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.CommentFunOpt.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getSeqno()
  if (f !== 0) {
    writer.writeUint64(2, f)
  }
  f = message.getPeerid_asU8()
  if (f.length > 0) {
    writer.writeBytes(3, f)
  }
  f = message.getOptype()
  if (f !== 0) {
    writer.writeUint32(4, f)
  }
  f = message.getOpreq_asU8()
  if (f.length > 0) {
    writer.writeBytes(5, f)
  }
}

/**
 * optional bytes userPubkey = 1;
 * @return {string}
 */
proto.dcnet.pb.CommentFunOpt.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes userPubkey = 1;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.CommentFunOpt.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CommentFunOpt.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.CommentFunOpt} returns this
 */
proto.dcnet.pb.CommentFunOpt.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint64 seqno = 2;
 * @return {number}
 */
proto.dcnet.pb.CommentFunOpt.prototype.getSeqno = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.CommentFunOpt} returns this
 */
proto.dcnet.pb.CommentFunOpt.prototype.setSeqno = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional bytes peerid = 3;
 * @return {string}
 */
proto.dcnet.pb.CommentFunOpt.prototype.getPeerid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ''))
}

/**
 * optional bytes peerid = 3;
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {string}
 */
proto.dcnet.pb.CommentFunOpt.prototype.getPeerid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getPeerid()))
}

/**
 * optional bytes peerid = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPeerid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CommentFunOpt.prototype.getPeerid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getPeerid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.CommentFunOpt} returns this
 */
proto.dcnet.pb.CommentFunOpt.prototype.setPeerid = function (value) {
  return jspb.Message.setProto3BytesField(this, 3, value)
}

/**
 * optional uint32 opType = 4;
 * @return {number}
 */
proto.dcnet.pb.CommentFunOpt.prototype.getOptype = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.CommentFunOpt} returns this
 */
proto.dcnet.pb.CommentFunOpt.prototype.setOptype = function (value) {
  return jspb.Message.setProto3IntField(this, 4, value)
}

/**
 * optional bytes opReq = 5;
 * @return {string}
 */
proto.dcnet.pb.CommentFunOpt.prototype.getOpreq = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ''))
}

/**
 * optional bytes opReq = 5;
 * This is a type-conversion wrapper around `getOpreq()`
 * @return {string}
 */
proto.dcnet.pb.CommentFunOpt.prototype.getOpreq_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getOpreq()))
}

/**
 * optional bytes opReq = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getOpreq()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.CommentFunOpt.prototype.getOpreq_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getOpreq()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.CommentFunOpt} returns this
 */
proto.dcnet.pb.CommentFunOpt.prototype.setOpreq = function (value) {
  return jspb.Message.setProto3BytesField(this, 5, value)
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dcnet.pb.ExchangeCommentEdgesRequest.repeatedFields_ = [1]

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.ExchangeCommentEdgesRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.ExchangeCommentEdgesRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.ExchangeCommentEdgesRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.ExchangeCommentEdgesRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        userseqedgesList: jspb.Message.toObjectList(
          msg.getUserseqedgesList(),
          proto.dcnet.pb.UserCommentSeqEdge.toObject,
          includeInstance
        )
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.ExchangeCommentEdgesRequest}
 */
proto.dcnet.pb.ExchangeCommentEdgesRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.ExchangeCommentEdgesRequest()
  return proto.dcnet.pb.ExchangeCommentEdgesRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.ExchangeCommentEdgesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.ExchangeCommentEdgesRequest}
 */
proto.dcnet.pb.ExchangeCommentEdgesRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.dcnet.pb.UserCommentSeqEdge()
        reader.readMessage(value, proto.dcnet.pb.UserCommentSeqEdge.deserializeBinaryFromReader)
        msg.addUserseqedges(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ExchangeCommentEdgesRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.ExchangeCommentEdgesRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.ExchangeCommentEdgesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.ExchangeCommentEdgesRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getUserseqedgesList()
  if (f.length > 0) {
    writer.writeRepeatedMessage(1, f, proto.dcnet.pb.UserCommentSeqEdge.serializeBinaryToWriter)
  }
}

/**
 * repeated UserCommentSeqEdge userSeqEdges = 1;
 * @return {!Array<!proto.dcnet.pb.UserCommentSeqEdge>}
 */
proto.dcnet.pb.ExchangeCommentEdgesRequest.prototype.getUserseqedgesList = function () {
  return /** @type{!Array<!proto.dcnet.pb.UserCommentSeqEdge>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dcnet.pb.UserCommentSeqEdge, 1)
  )
}

/**
 * @param {!Array<!proto.dcnet.pb.UserCommentSeqEdge>} value
 * @return {!proto.dcnet.pb.ExchangeCommentEdgesRequest} returns this
 */
proto.dcnet.pb.ExchangeCommentEdgesRequest.prototype.setUserseqedgesList = function (value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value)
}

/**
 * @param {!proto.dcnet.pb.UserCommentSeqEdge=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dcnet.pb.UserCommentSeqEdge}
 */
proto.dcnet.pb.ExchangeCommentEdgesRequest.prototype.addUserseqedges = function (
  opt_value,
  opt_index
) {
  return jspb.Message.addToRepeatedWrapperField(
    this,
    1,
    opt_value,
    proto.dcnet.pb.UserCommentSeqEdge,
    opt_index
  )
}

/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dcnet.pb.ExchangeCommentEdgesRequest} returns this
 */
proto.dcnet.pb.ExchangeCommentEdgesRequest.prototype.clearUserseqedgesList = function () {
  return this.setUserseqedgesList([])
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dcnet.pb.ExchangeCommentEdgesReply.repeatedFields_ = [1]

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.ExchangeCommentEdgesReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.ExchangeCommentEdgesReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.ExchangeCommentEdgesReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.ExchangeCommentEdgesReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        userseqedgesList: jspb.Message.toObjectList(
          msg.getUserseqedgesList(),
          proto.dcnet.pb.UserCommentSeqEdge.toObject,
          includeInstance
        )
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.ExchangeCommentEdgesReply}
 */
proto.dcnet.pb.ExchangeCommentEdgesReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.ExchangeCommentEdgesReply()
  return proto.dcnet.pb.ExchangeCommentEdgesReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.ExchangeCommentEdgesReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.ExchangeCommentEdgesReply}
 */
proto.dcnet.pb.ExchangeCommentEdgesReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = new proto.dcnet.pb.UserCommentSeqEdge()
        reader.readMessage(value, proto.dcnet.pb.UserCommentSeqEdge.deserializeBinaryFromReader)
        msg.addUserseqedges(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.ExchangeCommentEdgesReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.ExchangeCommentEdgesReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.ExchangeCommentEdgesReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.ExchangeCommentEdgesReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getUserseqedgesList()
  if (f.length > 0) {
    writer.writeRepeatedMessage(1, f, proto.dcnet.pb.UserCommentSeqEdge.serializeBinaryToWriter)
  }
}

/**
 * repeated UserCommentSeqEdge userSeqEdges = 1;
 * @return {!Array<!proto.dcnet.pb.UserCommentSeqEdge>}
 */
proto.dcnet.pb.ExchangeCommentEdgesReply.prototype.getUserseqedgesList = function () {
  return /** @type{!Array<!proto.dcnet.pb.UserCommentSeqEdge>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dcnet.pb.UserCommentSeqEdge, 1)
  )
}

/**
 * @param {!Array<!proto.dcnet.pb.UserCommentSeqEdge>} value
 * @return {!proto.dcnet.pb.ExchangeCommentEdgesReply} returns this
 */
proto.dcnet.pb.ExchangeCommentEdgesReply.prototype.setUserseqedgesList = function (value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value)
}

/**
 * @param {!proto.dcnet.pb.UserCommentSeqEdge=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dcnet.pb.UserCommentSeqEdge}
 */
proto.dcnet.pb.ExchangeCommentEdgesReply.prototype.addUserseqedges = function (
  opt_value,
  opt_index
) {
  return jspb.Message.addToRepeatedWrapperField(
    this,
    1,
    opt_value,
    proto.dcnet.pb.UserCommentSeqEdge,
    opt_index
  )
}

/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dcnet.pb.ExchangeCommentEdgesReply} returns this
 */
proto.dcnet.pb.ExchangeCommentEdgesReply.prototype.clearUserseqedgesList = function () {
  return this.setUserseqedgesList([])
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.UserCommentSeqEdge.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.UserCommentSeqEdge.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.UserCommentSeqEdge} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.UserCommentSeqEdge.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        userpubkey: msg.getUserpubkey_asB64(),
        seqedge: jspb.Message.getFieldWithDefault(msg, 2, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.UserCommentSeqEdge}
 */
proto.dcnet.pb.UserCommentSeqEdge.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.UserCommentSeqEdge()
  return proto.dcnet.pb.UserCommentSeqEdge.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.UserCommentSeqEdge} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.UserCommentSeqEdge}
 */
proto.dcnet.pb.UserCommentSeqEdge.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint64())
        msg.setSeqedge(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.UserCommentSeqEdge.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.UserCommentSeqEdge.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.UserCommentSeqEdge} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.UserCommentSeqEdge.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getSeqedge()
  if (f !== 0) {
    writer.writeUint64(2, f)
  }
}

/**
 * optional bytes userPubkey = 1;
 * @return {string}
 */
proto.dcnet.pb.UserCommentSeqEdge.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes userPubkey = 1;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.UserCommentSeqEdge.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.UserCommentSeqEdge.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.UserCommentSeqEdge} returns this
 */
proto.dcnet.pb.UserCommentSeqEdge.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint64 seqedge = 2;
 * @return {number}
 */
proto.dcnet.pb.UserCommentSeqEdge.prototype.getSeqedge = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.UserCommentSeqEdge} returns this
 */
proto.dcnet.pb.UserCommentSeqEdge.prototype.setSeqedge = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.DownloadUserCommentsRequest.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.DownloadUserCommentsRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.DownloadUserCommentsRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.DownloadUserCommentsRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        userpubkey: msg.getUserpubkey_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 2, 0),
        teereport: msg.getTeereport_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.DownloadUserCommentsRequest}
 */
proto.dcnet.pb.DownloadUserCommentsRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.DownloadUserCommentsRequest()
  return proto.dcnet.pb.DownloadUserCommentsRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.DownloadUserCommentsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.DownloadUserCommentsRequest}
 */
proto.dcnet.pb.DownloadUserCommentsRequest.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 2:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setTeereport(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DownloadUserCommentsRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.DownloadUserCommentsRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.DownloadUserCommentsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.DownloadUserCommentsRequest.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(2, f)
  }
  f = message.getTeereport_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
}

/**
 * optional bytes userPubkey = 1;
 * @return {string}
 */
proto.dcnet.pb.DownloadUserCommentsRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes userPubkey = 1;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.DownloadUserCommentsRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DownloadUserCommentsRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DownloadUserCommentsRequest} returns this
 */
proto.dcnet.pb.DownloadUserCommentsRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional uint32 blockheight = 2;
 * @return {number}
 */
proto.dcnet.pb.DownloadUserCommentsRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.DownloadUserCommentsRequest} returns this
 */
proto.dcnet.pb.DownloadUserCommentsRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 2, value)
}

/**
 * optional bytes teereport = 4;
 * @return {string}
 */
proto.dcnet.pb.DownloadUserCommentsRequest.prototype.getTeereport = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes teereport = 4;
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {string}
 */
proto.dcnet.pb.DownloadUserCommentsRequest.prototype.getTeereport_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getTeereport()))
}

/**
 * optional bytes teereport = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DownloadUserCommentsRequest.prototype.getTeereport_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getTeereport()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.DownloadUserCommentsRequest} returns this
 */
proto.dcnet.pb.DownloadUserCommentsRequest.prototype.setTeereport = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.DownloadUserCommentsReply.prototype.toObject = function (opt_includeInstance) {
    return proto.dcnet.pb.DownloadUserCommentsReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.DownloadUserCommentsReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.DownloadUserCommentsReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        flag: jspb.Message.getFieldWithDefault(msg, 1, 0)
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.DownloadUserCommentsReply}
 */
proto.dcnet.pb.DownloadUserCommentsReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.DownloadUserCommentsReply()
  return proto.dcnet.pb.DownloadUserCommentsReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.DownloadUserCommentsReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.DownloadUserCommentsReply}
 */
proto.dcnet.pb.DownloadUserCommentsReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setFlag(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.DownloadUserCommentsReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.DownloadUserCommentsReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.DownloadUserCommentsReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.DownloadUserCommentsReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
  f = message.getFlag()
  if (f !== 0) {
    writer.writeUint32(1, f)
  }
}

/**
 * optional uint32 flag = 1;
 * @return {number}
 */
proto.dcnet.pb.DownloadUserCommentsReply.prototype.getFlag = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.DownloadUserCommentsReply} returns this
 */
proto.dcnet.pb.DownloadUserCommentsReply.prototype.setFlag = function (value) {
  return jspb.Message.setProto3IntField(this, 1, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.toObject = function (
    opt_includeInstance
  ) {
    return proto.dcnet.pb.UserCommentsDownloadReadyRequest.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.UserCommentsDownloadReadyRequest} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.UserCommentsDownloadReadyRequest.toObject = function (includeInstance, msg) {
    var f,
      obj = {
        userpubkey: msg.getUserpubkey_asB64(),
        commentscid: msg.getCommentscid_asB64(),
        blockheight: jspb.Message.getFieldWithDefault(msg, 3, 0),
        teereport: msg.getTeereport_asB64()
      }

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.UserCommentsDownloadReadyRequest}
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.UserCommentsDownloadReadyRequest()
  return proto.dcnet.pb.UserCommentsDownloadReadyRequest.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.UserCommentsDownloadReadyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.UserCommentsDownloadReadyRequest}
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.deserializeBinaryFromReader = function (
  msg,
  reader
) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      case 1:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setUserpubkey(value)
        break
      case 2:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setCommentscid(value)
        break
      case 3:
        var value = /** @type {number} */ (reader.readUint32())
        msg.setBlockheight(value)
        break
      case 4:
        var value = /** @type {!Uint8Array} */ (reader.readBytes())
        msg.setTeereport(value)
        break
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.UserCommentsDownloadReadyRequest.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.UserCommentsDownloadReadyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.serializeBinaryToWriter = function (
  message,
  writer
) {
  var f = undefined
  f = message.getUserpubkey_asU8()
  if (f.length > 0) {
    writer.writeBytes(1, f)
  }
  f = message.getCommentscid_asU8()
  if (f.length > 0) {
    writer.writeBytes(2, f)
  }
  f = message.getBlockheight()
  if (f !== 0) {
    writer.writeUint32(3, f)
  }
  f = message.getTeereport_asU8()
  if (f.length > 0) {
    writer.writeBytes(4, f)
  }
}

/**
 * optional bytes userPubkey = 1;
 * @return {string}
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.getUserpubkey = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ''))
}

/**
 * optional bytes userPubkey = 1;
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {string}
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.getUserpubkey_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getUserpubkey()))
}

/**
 * optional bytes userPubkey = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getUserpubkey()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.getUserpubkey_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getUserpubkey()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.UserCommentsDownloadReadyRequest} returns this
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.setUserpubkey = function (value) {
  return jspb.Message.setProto3BytesField(this, 1, value)
}

/**
 * optional bytes commentsCid = 2;
 * @return {string}
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.getCommentscid = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ''))
}

/**
 * optional bytes commentsCid = 2;
 * This is a type-conversion wrapper around `getCommentscid()`
 * @return {string}
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.getCommentscid_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getCommentscid()))
}

/**
 * optional bytes commentsCid = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCommentscid()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.getCommentscid_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getCommentscid()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.UserCommentsDownloadReadyRequest} returns this
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.setCommentscid = function (value) {
  return jspb.Message.setProto3BytesField(this, 2, value)
}

/**
 * optional uint32 blockheight = 3;
 * @return {number}
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.getBlockheight = function () {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0))
}

/**
 * @param {number} value
 * @return {!proto.dcnet.pb.UserCommentsDownloadReadyRequest} returns this
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.setBlockheight = function (value) {
  return jspb.Message.setProto3IntField(this, 3, value)
}

/**
 * optional bytes teereport = 4;
 * @return {string}
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.getTeereport = function () {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ''))
}

/**
 * optional bytes teereport = 4;
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {string}
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.getTeereport_asB64 = function () {
  return /** @type {string} */ (jspb.Message.bytesAsB64(this.getTeereport()))
}

/**
 * optional bytes teereport = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTeereport()`
 * @return {!Uint8Array}
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.getTeereport_asU8 = function () {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(this.getTeereport()))
}

/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dcnet.pb.UserCommentsDownloadReadyRequest} returns this
 */
proto.dcnet.pb.UserCommentsDownloadReadyRequest.prototype.setTeereport = function (value) {
  return jspb.Message.setProto3BytesField(this, 4, value)
}

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * Optional fields that are not set will be set to undefined.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
   * @param {boolean=} opt_includeInstance Deprecated. whether to include the
   *     JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.dcnet.pb.UserCommentsDownloadReadyReply.prototype.toObject = function (
    opt_includeInstance
  ) {
    return proto.dcnet.pb.UserCommentsDownloadReadyReply.toObject(opt_includeInstance, this)
  }

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Deprecated. Whether to include
   *     the JSPB instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.dcnet.pb.UserCommentsDownloadReadyReply} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.dcnet.pb.UserCommentsDownloadReadyReply.toObject = function (includeInstance, msg) {
    var f,
      obj = {}

    if (includeInstance) {
      obj.$jspbMessageInstance = msg
    }
    return obj
  }
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dcnet.pb.UserCommentsDownloadReadyReply}
 */
proto.dcnet.pb.UserCommentsDownloadReadyReply.deserializeBinary = function (bytes) {
  var reader = new jspb.BinaryReader(bytes)
  var msg = new proto.dcnet.pb.UserCommentsDownloadReadyReply()
  return proto.dcnet.pb.UserCommentsDownloadReadyReply.deserializeBinaryFromReader(msg, reader)
}

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dcnet.pb.UserCommentsDownloadReadyReply} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dcnet.pb.UserCommentsDownloadReadyReply}
 */
proto.dcnet.pb.UserCommentsDownloadReadyReply.deserializeBinaryFromReader = function (msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break
    }
    var field = reader.getFieldNumber()
    switch (field) {
      default:
        reader.skipField()
        break
    }
  }
  return msg
}

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dcnet.pb.UserCommentsDownloadReadyReply.prototype.serializeBinary = function () {
  var writer = new jspb.BinaryWriter()
  proto.dcnet.pb.UserCommentsDownloadReadyReply.serializeBinaryToWriter(this, writer)
  return writer.getResultBuffer()
}

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dcnet.pb.UserCommentsDownloadReadyReply} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dcnet.pb.UserCommentsDownloadReadyReply.serializeBinaryToWriter = function (message, writer) {
  var f = undefined
}
// goog.object.extend(exports, proto.dcnet.pb) GetCacheValueRequest
export default {...proto.dcnet.pb};
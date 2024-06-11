import * as jspb from 'google-protobuf'

export class StoreThreadRequest extends jspb.Message {
  getThreadid(): Uint8Array | string
  getThreadid_asU8(): Uint8Array
  getThreadid_asB64(): string
  setThreadid(value: Uint8Array | string): StoreThreadRequest

  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): StoreThreadRequest

  getServicekeyencrypt(): Uint8Array | string
  getServicekeyencrypt_asU8(): Uint8Array
  getServicekeyencrypt_asB64(): string
  setServicekeyencrypt(value: Uint8Array | string): StoreThreadRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): StoreThreadRequest.AsObject
  static toObject(includeInstance: boolean, msg: StoreThreadRequest): StoreThreadRequest.AsObject
  static serializeBinaryToWriter(message: StoreThreadRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): StoreThreadRequest
  static deserializeBinaryFromReader(
    message: StoreThreadRequest,
    reader: jspb.BinaryReader
  ): StoreThreadRequest
}

export namespace StoreThreadRequest {
  export type AsObject = {
    threadid: Uint8Array | string
    userpubkey: Uint8Array | string
    servicekeyencrypt: Uint8Array | string
  }
}

export class StoreThreadReply extends jspb.Message {
  getStatus(): number
  setStatus(value: number): StoreThreadReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): StoreThreadReply.AsObject
  static toObject(includeInstance: boolean, msg: StoreThreadReply): StoreThreadReply.AsObject
  static serializeBinaryToWriter(message: StoreThreadReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): StoreThreadReply
  static deserializeBinaryFromReader(
    message: StoreThreadReply,
    reader: jspb.BinaryReader
  ): StoreThreadReply
}

export namespace StoreThreadReply {
  export type AsObject = {
    status: number
  }
}

export class StroeFileToPeerRequest extends jspb.Message {
  getCid(): Uint8Array | string
  getCid_asU8(): Uint8Array
  getCid_asB64(): string
  setCid(value: Uint8Array | string): StroeFileToPeerRequest

  getSize(): number
  setSize(value: number): StroeFileToPeerRequest

  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): StroeFileToPeerRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): StroeFileToPeerRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: StroeFileToPeerRequest
  ): StroeFileToPeerRequest.AsObject
  static serializeBinaryToWriter(message: StroeFileToPeerRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): StroeFileToPeerRequest
  static deserializeBinaryFromReader(
    message: StroeFileToPeerRequest,
    reader: jspb.BinaryReader
  ): StroeFileToPeerRequest
}

export namespace StroeFileToPeerRequest {
  export type AsObject = {
    cid: Uint8Array | string
    size: number
    userpubkey: Uint8Array | string
  }
}

export class StroeFileToPeerReply extends jspb.Message {
  getStatus(): number
  setStatus(value: number): StroeFileToPeerReply

  getReceivesize(): number
  setReceivesize(value: number): StroeFileToPeerReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): StroeFileToPeerReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: StroeFileToPeerReply
  ): StroeFileToPeerReply.AsObject
  static serializeBinaryToWriter(message: StroeFileToPeerReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): StroeFileToPeerReply
  static deserializeBinaryFromReader(
    message: StroeFileToPeerReply,
    reader: jspb.BinaryReader
  ): StroeFileToPeerReply
}

export namespace StroeFileToPeerReply {
  export type AsObject = {
    status: number
    receivesize: number
  }
}

export class OnlineStatusCheckRequest extends jspb.Message {
  getChallenge(): Uint8Array | string
  getChallenge_asU8(): Uint8Array
  getChallenge_asB64(): string
  setChallenge(value: Uint8Array | string): OnlineStatusCheckRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): OnlineStatusCheckRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: OnlineStatusCheckRequest
  ): OnlineStatusCheckRequest.AsObject
  static serializeBinaryToWriter(message: OnlineStatusCheckRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): OnlineStatusCheckRequest
  static deserializeBinaryFromReader(
    message: OnlineStatusCheckRequest,
    reader: jspb.BinaryReader
  ): OnlineStatusCheckRequest
}

export namespace OnlineStatusCheckRequest {
  export type AsObject = {
    challenge: Uint8Array | string
  }
}

export class OnlineStatusCheckReply extends jspb.Message {
  getTeereport(): Uint8Array | string
  getTeereport_asU8(): Uint8Array
  getTeereport_asB64(): string
  setTeereport(value: Uint8Array | string): OnlineStatusCheckReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): OnlineStatusCheckReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: OnlineStatusCheckReply
  ): OnlineStatusCheckReply.AsObject
  static serializeBinaryToWriter(message: OnlineStatusCheckReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): OnlineStatusCheckReply
  static deserializeBinaryFromReader(
    message: OnlineStatusCheckReply,
    reader: jspb.BinaryReader
  ): OnlineStatusCheckReply
}

export namespace OnlineStatusCheckReply {
  export type AsObject = {
    teereport: Uint8Array | string
  }
}

export class CheckPeerStatusRequest extends jspb.Message {
  getSreq(): CheckPeerStatusRequest.Sreq | undefined
  setSreq(value?: CheckPeerStatusRequest.Sreq): CheckPeerStatusRequest
  hasSreq(): boolean
  clearSreq(): CheckPeerStatusRequest

  getTeereport(): Uint8Array | string
  getTeereport_asU8(): Uint8Array
  getTeereport_asB64(): string
  setTeereport(value: Uint8Array | string): CheckPeerStatusRequest

  getPayloadCase(): CheckPeerStatusRequest.PayloadCase

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): CheckPeerStatusRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: CheckPeerStatusRequest
  ): CheckPeerStatusRequest.AsObject
  static serializeBinaryToWriter(message: CheckPeerStatusRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): CheckPeerStatusRequest
  static deserializeBinaryFromReader(
    message: CheckPeerStatusRequest,
    reader: jspb.BinaryReader
  ): CheckPeerStatusRequest
}

export namespace CheckPeerStatusRequest {
  export type AsObject = {
    sreq?: CheckPeerStatusRequest.Sreq.AsObject
    teereport: Uint8Array | string
  }

  export class Sreq extends jspb.Message {
    getPubkey(): Uint8Array | string
    getPubkey_asU8(): Uint8Array
    getPubkey_asB64(): string
    setPubkey(value: Uint8Array | string): Sreq

    getPeerid(): Uint8Array | string
    getPeerid_asU8(): Uint8Array
    getPeerid_asB64(): string
    setPeerid(value: Uint8Array | string): Sreq

    serializeBinary(): Uint8Array
    toObject(includeInstance?: boolean): Sreq.AsObject
    static toObject(includeInstance: boolean, msg: Sreq): Sreq.AsObject
    static serializeBinaryToWriter(message: Sreq, writer: jspb.BinaryWriter): void
    static deserializeBinary(bytes: Uint8Array): Sreq
    static deserializeBinaryFromReader(message: Sreq, reader: jspb.BinaryReader): Sreq
  }

  export namespace Sreq {
    export type AsObject = {
      pubkey: Uint8Array | string
      peerid: Uint8Array | string
    }
  }

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    SREQ = 1,
    TEEREPORT = 2
  }
}

export class CheckPeerStatusReply extends jspb.Message {
  getChallenge(): Uint8Array | string
  getChallenge_asU8(): Uint8Array
  getChallenge_asB64(): string
  setChallenge(value: Uint8Array | string): CheckPeerStatusReply

  getBody(): CheckPeerStatusReply.Body | undefined
  setBody(value?: CheckPeerStatusReply.Body): CheckPeerStatusReply
  hasBody(): boolean
  clearBody(): CheckPeerStatusReply

  getPayloadCase(): CheckPeerStatusReply.PayloadCase

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): CheckPeerStatusReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: CheckPeerStatusReply
  ): CheckPeerStatusReply.AsObject
  static serializeBinaryToWriter(message: CheckPeerStatusReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): CheckPeerStatusReply
  static deserializeBinaryFromReader(
    message: CheckPeerStatusReply,
    reader: jspb.BinaryReader
  ): CheckPeerStatusReply
}

export namespace CheckPeerStatusReply {
  export type AsObject = {
    challenge: Uint8Array | string
    body?: CheckPeerStatusReply.Body.AsObject
  }

  export class Body extends jspb.Message {
    getPeerid(): Uint8Array | string
    getPeerid_asU8(): Uint8Array
    getPeerid_asB64(): string
    setPeerid(value: Uint8Array | string): Body

    getStatus(): number
    setStatus(value: number): Body

    getTeereport(): Uint8Array | string
    getTeereport_asU8(): Uint8Array
    getTeereport_asB64(): string
    setTeereport(value: Uint8Array | string): Body

    serializeBinary(): Uint8Array
    toObject(includeInstance?: boolean): Body.AsObject
    static toObject(includeInstance: boolean, msg: Body): Body.AsObject
    static serializeBinaryToWriter(message: Body, writer: jspb.BinaryWriter): void
    static deserializeBinary(bytes: Uint8Array): Body
    static deserializeBinaryFromReader(message: Body, reader: jspb.BinaryReader): Body
  }

  export namespace Body {
    export type AsObject = {
      peerid: Uint8Array | string
      status: number
      teereport: Uint8Array | string
    }
  }

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    CHALLENGE = 1,
    BODY = 2
  }
}

export class LocalFileCheckRequest extends jspb.Message {
  getKeysList(): Array<string>
  setKeysList(value: Array<string>): LocalFileCheckRequest
  clearKeysList(): LocalFileCheckRequest
  addKeys(value: string, index?: number): LocalFileCheckRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): LocalFileCheckRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: LocalFileCheckRequest
  ): LocalFileCheckRequest.AsObject
  static serializeBinaryToWriter(message: LocalFileCheckRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): LocalFileCheckRequest
  static deserializeBinaryFromReader(
    message: LocalFileCheckRequest,
    reader: jspb.BinaryReader
  ): LocalFileCheckRequest
}

export namespace LocalFileCheckRequest {
  export type AsObject = {
    keysList: Array<string>
  }
}

export class LocalFileCheckReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): LocalFileCheckReply

  getFailkey(): string
  setFailkey(value: string): LocalFileCheckReply

  getTeereport(): Uint8Array | string
  getTeereport_asU8(): Uint8Array
  getTeereport_asB64(): string
  setTeereport(value: Uint8Array | string): LocalFileCheckReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): LocalFileCheckReply.AsObject
  static toObject(includeInstance: boolean, msg: LocalFileCheckReply): LocalFileCheckReply.AsObject
  static serializeBinaryToWriter(message: LocalFileCheckReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): LocalFileCheckReply
  static deserializeBinaryFromReader(
    message: LocalFileCheckReply,
    reader: jspb.BinaryReader
  ): LocalFileCheckReply
}

export namespace LocalFileCheckReply {
  export type AsObject = {
    flag: number
    failkey: string
    teereport: Uint8Array | string
  }
}

export class LocalAccountInfoCheckRequest extends jspb.Message {
  getAccounthashsList(): Array<Uint8Array | string>
  setAccounthashsList(value: Array<Uint8Array | string>): LocalAccountInfoCheckRequest
  clearAccounthashsList(): LocalAccountInfoCheckRequest
  addAccounthashs(value: Uint8Array | string, index?: number): LocalAccountInfoCheckRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): LocalAccountInfoCheckRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: LocalAccountInfoCheckRequest
  ): LocalAccountInfoCheckRequest.AsObject
  static serializeBinaryToWriter(
    message: LocalAccountInfoCheckRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): LocalAccountInfoCheckRequest
  static deserializeBinaryFromReader(
    message: LocalAccountInfoCheckRequest,
    reader: jspb.BinaryReader
  ): LocalAccountInfoCheckRequest
}

export namespace LocalAccountInfoCheckRequest {
  export type AsObject = {
    accounthashsList: Array<Uint8Array | string>
  }
}

export class LocalAccountInfoCheckReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): LocalAccountInfoCheckReply

  getFailkey(): Uint8Array | string
  getFailkey_asU8(): Uint8Array
  getFailkey_asB64(): string
  setFailkey(value: Uint8Array | string): LocalAccountInfoCheckReply

  getTeereport(): Uint8Array | string
  getTeereport_asU8(): Uint8Array
  getTeereport_asB64(): string
  setTeereport(value: Uint8Array | string): LocalAccountInfoCheckReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): LocalAccountInfoCheckReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: LocalAccountInfoCheckReply
  ): LocalAccountInfoCheckReply.AsObject
  static serializeBinaryToWriter(
    message: LocalAccountInfoCheckReply,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): LocalAccountInfoCheckReply
  static deserializeBinaryFromReader(
    message: LocalAccountInfoCheckReply,
    reader: jspb.BinaryReader
  ): LocalAccountInfoCheckReply
}

export namespace LocalAccountInfoCheckReply {
  export type AsObject = {
    flag: number
    failkey: Uint8Array | string
    teereport: Uint8Array | string
  }
}

export class AccountInfoSyncRequest extends jspb.Message {
  getAccounthash(): Uint8Array | string
  getAccounthash_asU8(): Uint8Array
  getAccounthash_asB64(): string
  setAccounthash(value: Uint8Array | string): AccountInfoSyncRequest

  getBlockheight(): number
  setBlockheight(value: number): AccountInfoSyncRequest

  getPrikeyencrypthash(): Uint8Array | string
  getPrikeyencrypthash_asU8(): Uint8Array
  getPrikeyencrypthash_asB64(): string
  setPrikeyencrypthash(value: Uint8Array | string): AccountInfoSyncRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AccountInfoSyncRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: AccountInfoSyncRequest
  ): AccountInfoSyncRequest.AsObject
  static serializeBinaryToWriter(message: AccountInfoSyncRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AccountInfoSyncRequest
  static deserializeBinaryFromReader(
    message: AccountInfoSyncRequest,
    reader: jspb.BinaryReader
  ): AccountInfoSyncRequest
}

export namespace AccountInfoSyncRequest {
  export type AsObject = {
    accounthash: Uint8Array | string
    blockheight: number
    prikeyencrypthash: Uint8Array | string
  }
}

export class AccountInfoSyncReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AccountInfoSyncReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: AccountInfoSyncReply
  ): AccountInfoSyncReply.AsObject
  static serializeBinaryToWriter(message: AccountInfoSyncReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AccountInfoSyncReply
  static deserializeBinaryFromReader(
    message: AccountInfoSyncReply,
    reader: jspb.BinaryReader
  ): AccountInfoSyncReply
}

export namespace AccountInfoSyncReply {
  export type AsObject = {}
}

export class SetEncryptKeyWithScanRequest extends jspb.Message {
  getEncryptprivkey(): Uint8Array | string
  getEncryptprivkey_asU8(): Uint8Array
  getEncryptprivkey_asB64(): string
  setEncryptprivkey(value: Uint8Array | string): SetEncryptKeyWithScanRequest

  getMapkey(): Uint8Array | string
  getMapkey_asU8(): Uint8Array
  getMapkey_asB64(): string
  setMapkey(value: Uint8Array | string): SetEncryptKeyWithScanRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): SetEncryptKeyWithScanRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: SetEncryptKeyWithScanRequest
  ): SetEncryptKeyWithScanRequest.AsObject
  static serializeBinaryToWriter(
    message: SetEncryptKeyWithScanRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): SetEncryptKeyWithScanRequest
  static deserializeBinaryFromReader(
    message: SetEncryptKeyWithScanRequest,
    reader: jspb.BinaryReader
  ): SetEncryptKeyWithScanRequest
}

export namespace SetEncryptKeyWithScanRequest {
  export type AsObject = {
    encryptprivkey: Uint8Array | string
    mapkey: Uint8Array | string
  }
}

export class SetEncryptKeyWithScanReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): SetEncryptKeyWithScanReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: SetEncryptKeyWithScanReply
  ): SetEncryptKeyWithScanReply.AsObject
  static serializeBinaryToWriter(
    message: SetEncryptKeyWithScanReply,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): SetEncryptKeyWithScanReply
  static deserializeBinaryFromReader(
    message: SetEncryptKeyWithScanReply,
    reader: jspb.BinaryReader
  ): SetEncryptKeyWithScanReply
}

export namespace SetEncryptKeyWithScanReply {
  export type AsObject = {}
}

export class GetEncryptKeyWithScanRequest extends jspb.Message {
  getMapkey(): Uint8Array | string
  getMapkey_asU8(): Uint8Array
  getMapkey_asB64(): string
  setMapkey(value: Uint8Array | string): GetEncryptKeyWithScanRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetEncryptKeyWithScanRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetEncryptKeyWithScanRequest
  ): GetEncryptKeyWithScanRequest.AsObject
  static serializeBinaryToWriter(
    message: GetEncryptKeyWithScanRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): GetEncryptKeyWithScanRequest
  static deserializeBinaryFromReader(
    message: GetEncryptKeyWithScanRequest,
    reader: jspb.BinaryReader
  ): GetEncryptKeyWithScanRequest
}

export namespace GetEncryptKeyWithScanRequest {
  export type AsObject = {
    mapkey: Uint8Array | string
  }
}

export class GetEncryptKeyWithScanReply extends jspb.Message {
  getEncryptprivkey(): Uint8Array | string
  getEncryptprivkey_asU8(): Uint8Array
  getEncryptprivkey_asB64(): string
  setEncryptprivkey(value: Uint8Array | string): GetEncryptKeyWithScanReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetEncryptKeyWithScanReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetEncryptKeyWithScanReply
  ): GetEncryptKeyWithScanReply.AsObject
  static serializeBinaryToWriter(
    message: GetEncryptKeyWithScanReply,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): GetEncryptKeyWithScanReply
  static deserializeBinaryFromReader(
    message: GetEncryptKeyWithScanReply,
    reader: jspb.BinaryReader
  ): GetEncryptKeyWithScanReply
}

export namespace GetEncryptKeyWithScanReply {
  export type AsObject = {
    encryptprivkey: Uint8Array | string
  }
}

export class RequestRandEncryptKeyRequest extends jspb.Message {
  getEnclaveid(): Uint8Array | string
  getEnclaveid_asU8(): Uint8Array
  getEnclaveid_asB64(): string
  setEnclaveid(value: Uint8Array | string): RequestRandEncryptKeyRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): RequestRandEncryptKeyRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: RequestRandEncryptKeyRequest
  ): RequestRandEncryptKeyRequest.AsObject
  static serializeBinaryToWriter(
    message: RequestRandEncryptKeyRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): RequestRandEncryptKeyRequest
  static deserializeBinaryFromReader(
    message: RequestRandEncryptKeyRequest,
    reader: jspb.BinaryReader
  ): RequestRandEncryptKeyRequest
}

export namespace RequestRandEncryptKeyRequest {
  export type AsObject = {
    enclaveid: Uint8Array | string
  }
}

export class RequestRandEncryptKeyReply extends jspb.Message {
  getEncryptkey(): Uint8Array | string
  getEncryptkey_asU8(): Uint8Array
  getEncryptkey_asB64(): string
  setEncryptkey(value: Uint8Array | string): RequestRandEncryptKeyReply

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): RequestRandEncryptKeyReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): RequestRandEncryptKeyReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: RequestRandEncryptKeyReply
  ): RequestRandEncryptKeyReply.AsObject
  static serializeBinaryToWriter(
    message: RequestRandEncryptKeyReply,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): RequestRandEncryptKeyReply
  static deserializeBinaryFromReader(
    message: RequestRandEncryptKeyReply,
    reader: jspb.BinaryReader
  ): RequestRandEncryptKeyReply
}

export namespace RequestRandEncryptKeyReply {
  export type AsObject = {
    encryptkey: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class GetEncryptKeyRequest extends jspb.Message {
  getPeerid(): Uint8Array | string
  getPeerid_asU8(): Uint8Array
  getPeerid_asB64(): string
  setPeerid(value: Uint8Array | string): GetEncryptKeyRequest

  getTeereport(): Uint8Array | string
  getTeereport_asU8(): Uint8Array
  getTeereport_asB64(): string
  setTeereport(value: Uint8Array | string): GetEncryptKeyRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetEncryptKeyRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetEncryptKeyRequest
  ): GetEncryptKeyRequest.AsObject
  static serializeBinaryToWriter(message: GetEncryptKeyRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetEncryptKeyRequest
  static deserializeBinaryFromReader(
    message: GetEncryptKeyRequest,
    reader: jspb.BinaryReader
  ): GetEncryptKeyRequest
}

export namespace GetEncryptKeyRequest {
  export type AsObject = {
    peerid: Uint8Array | string
    teereport: Uint8Array | string
  }
}

export class GetEncryptKeyReply extends jspb.Message {
  getEncryptkey(): Uint8Array | string
  getEncryptkey_asU8(): Uint8Array
  getEncryptkey_asB64(): string
  setEncryptkey(value: Uint8Array | string): GetEncryptKeyReply

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): GetEncryptKeyReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetEncryptKeyReply.AsObject
  static toObject(includeInstance: boolean, msg: GetEncryptKeyReply): GetEncryptKeyReply.AsObject
  static serializeBinaryToWriter(message: GetEncryptKeyReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetEncryptKeyReply
  static deserializeBinaryFromReader(
    message: GetEncryptKeyReply,
    reader: jspb.BinaryReader
  ): GetEncryptKeyReply
}

export namespace GetEncryptKeyReply {
  export type AsObject = {
    encryptkey: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class GetPeersWithSidRequest extends jspb.Message {
  getSid(): string
  setSid(value: string): GetPeersWithSidRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetPeersWithSidRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetPeersWithSidRequest
  ): GetPeersWithSidRequest.AsObject
  static serializeBinaryToWriter(message: GetPeersWithSidRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetPeersWithSidRequest
  static deserializeBinaryFromReader(
    message: GetPeersWithSidRequest,
    reader: jspb.BinaryReader
  ): GetPeersWithSidRequest
}

export namespace GetPeersWithSidRequest {
  export type AsObject = {
    sid: string
  }
}

export class GetPeersWithSidReply extends jspb.Message {
  getPeeridsList(): Array<string>
  setPeeridsList(value: Array<string>): GetPeersWithSidReply
  clearPeeridsList(): GetPeersWithSidReply
  addPeerids(value: string, index?: number): GetPeersWithSidReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetPeersWithSidReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetPeersWithSidReply
  ): GetPeersWithSidReply.AsObject
  static serializeBinaryToWriter(message: GetPeersWithSidReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetPeersWithSidReply
  static deserializeBinaryFromReader(
    message: GetPeersWithSidReply,
    reader: jspb.BinaryReader
  ): GetPeersWithSidReply
}

export namespace GetPeersWithSidReply {
  export type AsObject = {
    peeridsList: Array<string>
  }
}

export class GetPeersWithAccountHashRequest extends jspb.Message {
  getAccounthash(): Uint8Array | string
  getAccounthash_asU8(): Uint8Array
  getAccounthash_asB64(): string
  setAccounthash(value: Uint8Array | string): GetPeersWithAccountHashRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetPeersWithAccountHashRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetPeersWithAccountHashRequest
  ): GetPeersWithAccountHashRequest.AsObject
  static serializeBinaryToWriter(
    message: GetPeersWithAccountHashRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): GetPeersWithAccountHashRequest
  static deserializeBinaryFromReader(
    message: GetPeersWithAccountHashRequest,
    reader: jspb.BinaryReader
  ): GetPeersWithAccountHashRequest
}

export namespace GetPeersWithAccountHashRequest {
  export type AsObject = {
    accounthash: Uint8Array | string
  }
}

export class GetPeersWithAccountHashReply extends jspb.Message {
  getPeeridsList(): Array<string>
  setPeeridsList(value: Array<string>): GetPeersWithAccountHashReply
  clearPeeridsList(): GetPeersWithAccountHashReply
  addPeerids(value: string, index?: number): GetPeersWithAccountHashReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetPeersWithAccountHashReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetPeersWithAccountHashReply
  ): GetPeersWithAccountHashReply.AsObject
  static serializeBinaryToWriter(
    message: GetPeersWithAccountHashReply,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): GetPeersWithAccountHashReply
  static deserializeBinaryFromReader(
    message: GetPeersWithAccountHashReply,
    reader: jspb.BinaryReader
  ): GetPeersWithAccountHashReply
}

export namespace GetPeersWithAccountHashReply {
  export type AsObject = {
    peeridsList: Array<string>
  }
}

export class AccountDealBackupRequest extends jspb.Message {
  getPubkey(): Uint8Array | string
  getPubkey_asU8(): Uint8Array
  getPubkey_asB64(): string
  setPubkey(value: Uint8Array | string): AccountDealBackupRequest

  getAccountencrypt(): Uint8Array | string
  getAccountencrypt_asU8(): Uint8Array
  getAccountencrypt_asB64(): string
  setAccountencrypt(value: Uint8Array | string): AccountDealBackupRequest

  getAccounthashencrypt(): Uint8Array | string
  getAccounthashencrypt_asU8(): Uint8Array
  getAccounthashencrypt_asB64(): string
  setAccounthashencrypt(value: Uint8Array | string): AccountDealBackupRequest

  getPrikeyencrypt2(): Uint8Array | string
  getPrikeyencrypt2_asU8(): Uint8Array
  getPrikeyencrypt2_asB64(): string
  setPrikeyencrypt2(value: Uint8Array | string): AccountDealBackupRequest

  getBlockheight(): number
  setBlockheight(value: number): AccountDealBackupRequest

  getRandkeyencrypt(): Uint8Array | string
  getRandkeyencrypt_asU8(): Uint8Array
  getRandkeyencrypt_asB64(): string
  setRandkeyencrypt(value: Uint8Array | string): AccountDealBackupRequest

  getLoginkeyrandencrypt(): Uint8Array | string
  getLoginkeyrandencrypt_asU8(): Uint8Array
  getLoginkeyrandencrypt_asB64(): string
  setLoginkeyrandencrypt(value: Uint8Array | string): AccountDealBackupRequest

  getPeerid(): Uint8Array | string
  getPeerid_asU8(): Uint8Array
  getPeerid_asB64(): string
  setPeerid(value: Uint8Array | string): AccountDealBackupRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): AccountDealBackupRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AccountDealBackupRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: AccountDealBackupRequest
  ): AccountDealBackupRequest.AsObject
  static serializeBinaryToWriter(message: AccountDealBackupRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AccountDealBackupRequest
  static deserializeBinaryFromReader(
    message: AccountDealBackupRequest,
    reader: jspb.BinaryReader
  ): AccountDealBackupRequest
}

export namespace AccountDealBackupRequest {
  export type AsObject = {
    pubkey: Uint8Array | string
    accountencrypt: Uint8Array | string
    accounthashencrypt: Uint8Array | string
    prikeyencrypt2: Uint8Array | string
    blockheight: number
    randkeyencrypt: Uint8Array | string
    loginkeyrandencrypt: Uint8Array | string
    peerid: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class AccountDealBackupReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AccountDealBackupReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: AccountDealBackupReply
  ): AccountDealBackupReply.AsObject
  static serializeBinaryToWriter(message: AccountDealBackupReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AccountDealBackupReply
  static deserializeBinaryFromReader(
    message: AccountDealBackupReply,
    reader: jspb.BinaryReader
  ): AccountDealBackupReply
}

export namespace AccountDealBackupReply {
  export type AsObject = {}
}

export class GetHostIDRequest extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetHostIDRequest.AsObject
  static toObject(includeInstance: boolean, msg: GetHostIDRequest): GetHostIDRequest.AsObject
  static serializeBinaryToWriter(message: GetHostIDRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetHostIDRequest
  static deserializeBinaryFromReader(
    message: GetHostIDRequest,
    reader: jspb.BinaryReader
  ): GetHostIDRequest
}

export namespace GetHostIDRequest {
  export type AsObject = {}
}

export class GetHostIDReply extends jspb.Message {
  getPeerid(): Uint8Array | string
  getPeerid_asU8(): Uint8Array
  getPeerid_asB64(): string
  setPeerid(value: Uint8Array | string): GetHostIDReply

  getReqaddr(): Uint8Array | string
  getReqaddr_asU8(): Uint8Array
  getReqaddr_asB64(): string
  setReqaddr(value: Uint8Array | string): GetHostIDReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetHostIDReply.AsObject
  static toObject(includeInstance: boolean, msg: GetHostIDReply): GetHostIDReply.AsObject
  static serializeBinaryToWriter(message: GetHostIDReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetHostIDReply
  static deserializeBinaryFromReader(
    message: GetHostIDReply,
    reader: jspb.BinaryReader
  ): GetHostIDReply
}

export namespace GetHostIDReply {
  export type AsObject = {
    peerid: Uint8Array | string
    reqaddr: Uint8Array | string
  }
}

export class GetTokenRequest extends jspb.Message {
  getKey(): string
  setKey(value: string): GetTokenRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): GetTokenRequest

  getPayloadCase(): GetTokenRequest.PayloadCase

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetTokenRequest.AsObject
  static toObject(includeInstance: boolean, msg: GetTokenRequest): GetTokenRequest.AsObject
  static serializeBinaryToWriter(message: GetTokenRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetTokenRequest
  static deserializeBinaryFromReader(
    message: GetTokenRequest,
    reader: jspb.BinaryReader
  ): GetTokenRequest
}

export namespace GetTokenRequest {
  export type AsObject = {
    key: string
    signature: Uint8Array | string
  }

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    KEY = 1,
    SIGNATURE = 2
  }
}

export class GetTokenReply extends jspb.Message {
  getChallenge(): Uint8Array | string
  getChallenge_asU8(): Uint8Array
  getChallenge_asB64(): string
  setChallenge(value: Uint8Array | string): GetTokenReply

  getToken(): string
  setToken(value: string): GetTokenReply

  getPayloadCase(): GetTokenReply.PayloadCase

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetTokenReply.AsObject
  static toObject(includeInstance: boolean, msg: GetTokenReply): GetTokenReply.AsObject
  static serializeBinaryToWriter(message: GetTokenReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetTokenReply
  static deserializeBinaryFromReader(
    message: GetTokenReply,
    reader: jspb.BinaryReader
  ): GetTokenReply
}

export namespace GetTokenReply {
  export type AsObject = {
    challenge: Uint8Array | string
    token: string
  }

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    CHALLENGE = 1,
    TOKEN = 2
  }
}

export class CreateThreadRequest extends jspb.Message {
  getThreadid(): Uint8Array | string
  getThreadid_asU8(): Uint8Array
  getThreadid_asB64(): string
  setThreadid(value: Uint8Array | string): CreateThreadRequest

  getKeys(): Keys | undefined
  setKeys(value?: Keys): CreateThreadRequest
  hasKeys(): boolean
  clearKeys(): CreateThreadRequest

  getBlockheight(): number
  setBlockheight(value: number): CreateThreadRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): CreateThreadRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): CreateThreadRequest.AsObject
  static toObject(includeInstance: boolean, msg: CreateThreadRequest): CreateThreadRequest.AsObject
  static serializeBinaryToWriter(message: CreateThreadRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): CreateThreadRequest
  static deserializeBinaryFromReader(
    message: CreateThreadRequest,
    reader: jspb.BinaryReader
  ): CreateThreadRequest
}

export namespace CreateThreadRequest {
  export type AsObject = {
    threadid: Uint8Array | string
    keys?: Keys.AsObject
    blockheight: number
    signature: Uint8Array | string
  }
}

export class Keys extends jspb.Message {
  getThreadkeyencrpt(): Uint8Array | string
  getThreadkeyencrpt_asU8(): Uint8Array
  getThreadkeyencrpt_asB64(): string
  setThreadkeyencrpt(value: Uint8Array | string): Keys

  getLogkeyencrpt(): Uint8Array | string
  getLogkeyencrpt_asU8(): Uint8Array
  getLogkeyencrpt_asB64(): string
  setLogkeyencrpt(value: Uint8Array | string): Keys

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): Keys.AsObject
  static toObject(includeInstance: boolean, msg: Keys): Keys.AsObject
  static serializeBinaryToWriter(message: Keys, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): Keys
  static deserializeBinaryFromReader(message: Keys, reader: jspb.BinaryReader): Keys
}

export namespace Keys {
  export type AsObject = {
    threadkeyencrpt: Uint8Array | string
    logkeyencrpt: Uint8Array | string
  }
}

export class ThreadInfoReply extends jspb.Message {
  getThreadid(): Uint8Array | string
  getThreadid_asU8(): Uint8Array
  getThreadid_asB64(): string
  setThreadid(value: Uint8Array | string): ThreadInfoReply

  getLogsList(): Array<LogInfo>
  setLogsList(value: Array<LogInfo>): ThreadInfoReply
  clearLogsList(): ThreadInfoReply
  addLogs(value?: LogInfo, index?: number): LogInfo

  getAddrsList(): Array<Uint8Array | string>
  setAddrsList(value: Array<Uint8Array | string>): ThreadInfoReply
  clearAddrsList(): ThreadInfoReply
  addAddrs(value: Uint8Array | string, index?: number): ThreadInfoReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): ThreadInfoReply.AsObject
  static toObject(includeInstance: boolean, msg: ThreadInfoReply): ThreadInfoReply.AsObject
  static serializeBinaryToWriter(message: ThreadInfoReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): ThreadInfoReply
  static deserializeBinaryFromReader(
    message: ThreadInfoReply,
    reader: jspb.BinaryReader
  ): ThreadInfoReply
}

export namespace ThreadInfoReply {
  export type AsObject = {
    threadid: Uint8Array | string
    logsList: Array<LogInfo.AsObject>
    addrsList: Array<Uint8Array | string>
  }
}

export class LogInfo extends jspb.Message {
  getId(): Uint8Array | string
  getId_asU8(): Uint8Array
  getId_asB64(): string
  setId(value: Uint8Array | string): LogInfo

  getPubkey(): Uint8Array | string
  getPubkey_asU8(): Uint8Array
  getPubkey_asB64(): string
  setPubkey(value: Uint8Array | string): LogInfo

  getPrivkey(): Uint8Array | string
  getPrivkey_asU8(): Uint8Array
  getPrivkey_asB64(): string
  setPrivkey(value: Uint8Array | string): LogInfo

  getAddrsList(): Array<Uint8Array | string>
  setAddrsList(value: Array<Uint8Array | string>): LogInfo
  clearAddrsList(): LogInfo
  addAddrs(value: Uint8Array | string, index?: number): LogInfo

  getHead(): Uint8Array | string
  getHead_asU8(): Uint8Array
  getHead_asB64(): string
  setHead(value: Uint8Array | string): LogInfo

  getCounter(): Uint8Array | string
  getCounter_asU8(): Uint8Array
  getCounter_asB64(): string
  setCounter(value: Uint8Array | string): LogInfo

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): LogInfo.AsObject
  static toObject(includeInstance: boolean, msg: LogInfo): LogInfo.AsObject
  static serializeBinaryToWriter(message: LogInfo, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): LogInfo
  static deserializeBinaryFromReader(message: LogInfo, reader: jspb.BinaryReader): LogInfo
}

export namespace LogInfo {
  export type AsObject = {
    id: Uint8Array | string
    pubkey: Uint8Array | string
    privkey: Uint8Array | string
    addrsList: Array<Uint8Array | string>
    head: Uint8Array | string
    counter: Uint8Array | string
  }
}

export class ThreadIDRequest extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): ThreadIDRequest.AsObject
  static toObject(includeInstance: boolean, msg: ThreadIDRequest): ThreadIDRequest.AsObject
  static serializeBinaryToWriter(message: ThreadIDRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): ThreadIDRequest
  static deserializeBinaryFromReader(
    message: ThreadIDRequest,
    reader: jspb.BinaryReader
  ): ThreadIDRequest
}

export namespace ThreadIDRequest {
  export type AsObject = {}
}

export class ThreadIDReply extends jspb.Message {
  getThreadid(): Uint8Array | string
  getThreadid_asU8(): Uint8Array
  getThreadid_asB64(): string
  setThreadid(value: Uint8Array | string): ThreadIDReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): ThreadIDReply.AsObject
  static toObject(includeInstance: boolean, msg: ThreadIDReply): ThreadIDReply.AsObject
  static serializeBinaryToWriter(message: ThreadIDReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): ThreadIDReply
  static deserializeBinaryFromReader(
    message: ThreadIDReply,
    reader: jspb.BinaryReader
  ): ThreadIDReply
}

export namespace ThreadIDReply {
  export type AsObject = {
    threadid: Uint8Array | string
  }
}

export class AddThreadToPeerRequest extends jspb.Message {
  getThreadid(): Uint8Array | string
  getThreadid_asU8(): Uint8Array
  getThreadid_asB64(): string
  setThreadid(value: Uint8Array | string): AddThreadToPeerRequest

  getBlockheight(): number
  setBlockheight(value: number): AddThreadToPeerRequest

  getKeys(): Keys | undefined
  setKeys(value?: Keys): AddThreadToPeerRequest
  hasKeys(): boolean
  clearKeys(): AddThreadToPeerRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): AddThreadToPeerRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AddThreadToPeerRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: AddThreadToPeerRequest
  ): AddThreadToPeerRequest.AsObject
  static serializeBinaryToWriter(message: AddThreadToPeerRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AddThreadToPeerRequest
  static deserializeBinaryFromReader(
    message: AddThreadToPeerRequest,
    reader: jspb.BinaryReader
  ): AddThreadToPeerRequest
}

export namespace AddThreadToPeerRequest {
  export type AsObject = {
    threadid: Uint8Array | string
    blockheight: number
    keys?: Keys.AsObject
    signature: Uint8Array | string
  }
}

export class AddThreadToPeerReply extends jspb.Message {
  getStatus(): number
  setStatus(value: number): AddThreadToPeerReply

  getCount(): number
  setCount(value: number): AddThreadToPeerReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AddThreadToPeerReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: AddThreadToPeerReply
  ): AddThreadToPeerReply.AsObject
  static serializeBinaryToWriter(message: AddThreadToPeerReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AddThreadToPeerReply
  static deserializeBinaryFromReader(
    message: AddThreadToPeerReply,
    reader: jspb.BinaryReader
  ): AddThreadToPeerReply
}

export namespace AddThreadToPeerReply {
  export type AsObject = {
    status: number
    count: number
  }
}

export class GetThreadRequest extends jspb.Message {
  getThreadid(): Uint8Array | string
  getThreadid_asU8(): Uint8Array
  getThreadid_asB64(): string
  setThreadid(value: Uint8Array | string): GetThreadRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetThreadRequest.AsObject
  static toObject(includeInstance: boolean, msg: GetThreadRequest): GetThreadRequest.AsObject
  static serializeBinaryToWriter(message: GetThreadRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetThreadRequest
  static deserializeBinaryFromReader(
    message: GetThreadRequest,
    reader: jspb.BinaryReader
  ): GetThreadRequest
}

export namespace GetThreadRequest {
  export type AsObject = {
    threadid: Uint8Array | string
  }
}

export class DeleteThreadRequest extends jspb.Message {
  getThreadid(): Uint8Array | string
  getThreadid_asU8(): Uint8Array
  getThreadid_asB64(): string
  setThreadid(value: Uint8Array | string): DeleteThreadRequest

  getBlockheight(): number
  setBlockheight(value: number): DeleteThreadRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): DeleteThreadRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DeleteThreadRequest.AsObject
  static toObject(includeInstance: boolean, msg: DeleteThreadRequest): DeleteThreadRequest.AsObject
  static serializeBinaryToWriter(message: DeleteThreadRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): DeleteThreadRequest
  static deserializeBinaryFromReader(
    message: DeleteThreadRequest,
    reader: jspb.BinaryReader
  ): DeleteThreadRequest
}

export namespace DeleteThreadRequest {
  export type AsObject = {
    threadid: Uint8Array | string
    blockheight: number
    signature: Uint8Array | string
  }
}

export class DeleteThreadReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DeleteThreadReply.AsObject
  static toObject(includeInstance: boolean, msg: DeleteThreadReply): DeleteThreadReply.AsObject
  static serializeBinaryToWriter(message: DeleteThreadReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): DeleteThreadReply
  static deserializeBinaryFromReader(
    message: DeleteThreadReply,
    reader: jspb.BinaryReader
  ): DeleteThreadReply
}

export namespace DeleteThreadReply {
  export type AsObject = {}
}

export class StroeFileRequest extends jspb.Message {
  getCid(): Uint8Array | string
  getCid_asU8(): Uint8Array
  getCid_asB64(): string
  setCid(value: Uint8Array | string): StroeFileRequest

  getFilesize(): number
  setFilesize(value: number): StroeFileRequest

  getBlockheight(): number
  setBlockheight(value: number): StroeFileRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): StroeFileRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): StroeFileRequest.AsObject
  static toObject(includeInstance: boolean, msg: StroeFileRequest): StroeFileRequest.AsObject
  static serializeBinaryToWriter(message: StroeFileRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): StroeFileRequest
  static deserializeBinaryFromReader(
    message: StroeFileRequest,
    reader: jspb.BinaryReader
  ): StroeFileRequest
}

export namespace StroeFileRequest {
  export type AsObject = {
    cid: Uint8Array | string
    filesize: number
    blockheight: number
    signature: Uint8Array | string
  }
}

export class StroeFileReply extends jspb.Message {
  getStatus(): number
  setStatus(value: number): StroeFileReply

  getReceivesize(): number
  setReceivesize(value: number): StroeFileReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): StroeFileReply.AsObject
  static toObject(includeInstance: boolean, msg: StroeFileReply): StroeFileReply.AsObject
  static serializeBinaryToWriter(message: StroeFileReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): StroeFileReply
  static deserializeBinaryFromReader(
    message: StroeFileReply,
    reader: jspb.BinaryReader
  ): StroeFileReply
}

export namespace StroeFileReply {
  export type AsObject = {
    status: number
    receivesize: number
  }
}

export class DeleteFileRequest extends jspb.Message {
  getCid(): Uint8Array | string
  getCid_asU8(): Uint8Array
  getCid_asB64(): string
  setCid(value: Uint8Array | string): DeleteFileRequest

  getBlockheight(): number
  setBlockheight(value: number): DeleteFileRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): DeleteFileRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DeleteFileRequest.AsObject
  static toObject(includeInstance: boolean, msg: DeleteFileRequest): DeleteFileRequest.AsObject
  static serializeBinaryToWriter(message: DeleteFileRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): DeleteFileRequest
  static deserializeBinaryFromReader(
    message: DeleteFileRequest,
    reader: jspb.BinaryReader
  ): DeleteFileRequest
}

export namespace DeleteFileRequest {
  export type AsObject = {
    cid: Uint8Array | string
    blockheight: number
    signature: Uint8Array | string
  }
}

export class DeleteFileReply extends jspb.Message {
  getFlag(): boolean
  setFlag(value: boolean): DeleteFileReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DeleteFileReply.AsObject
  static toObject(includeInstance: boolean, msg: DeleteFileReply): DeleteFileReply.AsObject
  static serializeBinaryToWriter(message: DeleteFileReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): DeleteFileReply
  static deserializeBinaryFromReader(
    message: DeleteFileReply,
    reader: jspb.BinaryReader
  ): DeleteFileReply
}

export namespace DeleteFileReply {
  export type AsObject = {
    flag: boolean
  }
}

export class StoreFolderRequest extends jspb.Message {
  getCid(): Uint8Array | string
  getCid_asU8(): Uint8Array
  getCid_asB64(): string
  setCid(value: Uint8Array | string): StoreFolderRequest

  getFoldersize(): number
  setFoldersize(value: number): StoreFolderRequest

  getFilecount(): number
  setFilecount(value: number): StoreFolderRequest

  getBlockheight(): number
  setBlockheight(value: number): StoreFolderRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): StoreFolderRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): StoreFolderRequest.AsObject
  static toObject(includeInstance: boolean, msg: StoreFolderRequest): StoreFolderRequest.AsObject
  static serializeBinaryToWriter(message: StoreFolderRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): StoreFolderRequest
  static deserializeBinaryFromReader(
    message: StoreFolderRequest,
    reader: jspb.BinaryReader
  ): StoreFolderRequest
}

export namespace StoreFolderRequest {
  export type AsObject = {
    cid: Uint8Array | string
    foldersize: number
    filecount: number
    blockheight: number
    signature: Uint8Array | string
  }
}

export class StoreFolderReply extends jspb.Message {
  getStatus(): number
  setStatus(value: number): StoreFolderReply

  getReceivecount(): number
  setReceivecount(value: number): StoreFolderReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): StoreFolderReply.AsObject
  static toObject(includeInstance: boolean, msg: StoreFolderReply): StoreFolderReply.AsObject
  static serializeBinaryToWriter(message: StoreFolderReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): StoreFolderReply
  static deserializeBinaryFromReader(
    message: StoreFolderReply,
    reader: jspb.BinaryReader
  ): StoreFolderReply
}

export namespace StoreFolderReply {
  export type AsObject = {
    status: number
    receivecount: number
  }
}

export class AccountDealRequest extends jspb.Message {
  getAccountencrypt(): Uint8Array | string
  getAccountencrypt_asU8(): Uint8Array
  getAccountencrypt_asB64(): string
  setAccountencrypt(value: Uint8Array | string): AccountDealRequest

  getAccounthashencrypt(): Uint8Array | string
  getAccounthashencrypt_asU8(): Uint8Array
  getAccounthashencrypt_asB64(): string
  setAccounthashencrypt(value: Uint8Array | string): AccountDealRequest

  getPrikeyencrypt2(): Uint8Array | string
  getPrikeyencrypt2_asU8(): Uint8Array
  getPrikeyencrypt2_asB64(): string
  setPrikeyencrypt2(value: Uint8Array | string): AccountDealRequest

  getBlockheight(): number
  setBlockheight(value: number): AccountDealRequest

  getLoginkeyrandencrypt(): Uint8Array | string
  getLoginkeyrandencrypt_asU8(): Uint8Array
  getLoginkeyrandencrypt_asB64(): string
  setLoginkeyrandencrypt(value: Uint8Array | string): AccountDealRequest

  getPeerid(): Uint8Array | string
  getPeerid_asU8(): Uint8Array
  getPeerid_asB64(): string
  setPeerid(value: Uint8Array | string): AccountDealRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): AccountDealRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AccountDealRequest.AsObject
  static toObject(includeInstance: boolean, msg: AccountDealRequest): AccountDealRequest.AsObject
  static serializeBinaryToWriter(message: AccountDealRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AccountDealRequest
  static deserializeBinaryFromReader(
    message: AccountDealRequest,
    reader: jspb.BinaryReader
  ): AccountDealRequest
}

export namespace AccountDealRequest {
  export type AsObject = {
    accountencrypt: Uint8Array | string
    accounthashencrypt: Uint8Array | string
    prikeyencrypt2: Uint8Array | string
    blockheight: number
    loginkeyrandencrypt: Uint8Array | string
    peerid: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class AccountDealReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AccountDealReply.AsObject
  static toObject(includeInstance: boolean, msg: AccountDealReply): AccountDealReply.AsObject
  static serializeBinaryToWriter(message: AccountDealReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AccountDealReply
  static deserializeBinaryFromReader(
    message: AccountDealReply,
    reader: jspb.BinaryReader
  ): AccountDealReply
}

export namespace AccountDealReply {
  export type AsObject = {}
}

export class AccountLoginRequest extends jspb.Message {
  getAccounthashencrypt(): Uint8Array | string
  getAccounthashencrypt_asU8(): Uint8Array
  getAccounthashencrypt_asB64(): string
  setAccounthashencrypt(value: Uint8Array | string): AccountLoginRequest

  getPubkeyencrypt(): Uint8Array | string
  getPubkeyencrypt_asU8(): Uint8Array
  getPubkeyencrypt_asB64(): string
  setPubkeyencrypt(value: Uint8Array | string): AccountLoginRequest

  getLoginkeyrandencrypt(): Uint8Array | string
  getLoginkeyrandencrypt_asU8(): Uint8Array
  getLoginkeyrandencrypt_asB64(): string
  setLoginkeyrandencrypt(value: Uint8Array | string): AccountLoginRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AccountLoginRequest.AsObject
  static toObject(includeInstance: boolean, msg: AccountLoginRequest): AccountLoginRequest.AsObject
  static serializeBinaryToWriter(message: AccountLoginRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AccountLoginRequest
  static deserializeBinaryFromReader(
    message: AccountLoginRequest,
    reader: jspb.BinaryReader
  ): AccountLoginRequest
}

export namespace AccountLoginRequest {
  export type AsObject = {
    accounthashencrypt: Uint8Array | string
    pubkeyencrypt: Uint8Array | string
    loginkeyrandencrypt: Uint8Array | string
  }
}

export class AccountLoginReply extends jspb.Message {
  getPrikeyencrypt2(): Uint8Array | string
  getPrikeyencrypt2_asU8(): Uint8Array
  getPrikeyencrypt2_asB64(): string
  setPrikeyencrypt2(value: Uint8Array | string): AccountLoginReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AccountLoginReply.AsObject
  static toObject(includeInstance: boolean, msg: AccountLoginReply): AccountLoginReply.AsObject
  static serializeBinaryToWriter(message: AccountLoginReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AccountLoginReply
  static deserializeBinaryFromReader(
    message: AccountLoginReply,
    reader: jspb.BinaryReader
  ): AccountLoginReply
}

export namespace AccountLoginReply {
  export type AsObject = {
    prikeyencrypt2: Uint8Array | string
  }
}

export class TransferAccountRequest extends jspb.Message {
  getAccounthashencrypt(): Uint8Array | string
  getAccounthashencrypt_asU8(): Uint8Array
  getAccounthashencrypt_asB64(): string
  setAccounthashencrypt(value: Uint8Array | string): TransferAccountRequest

  getRecvpubkey(): Uint8Array | string
  getRecvpubkey_asU8(): Uint8Array
  getRecvpubkey_asB64(): string
  setRecvpubkey(value: Uint8Array | string): TransferAccountRequest

  getBlockheight(): number
  setBlockheight(value: number): TransferAccountRequest

  getPeerid(): Uint8Array | string
  getPeerid_asU8(): Uint8Array
  getPeerid_asB64(): string
  setPeerid(value: Uint8Array | string): TransferAccountRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): TransferAccountRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): TransferAccountRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: TransferAccountRequest
  ): TransferAccountRequest.AsObject
  static serializeBinaryToWriter(message: TransferAccountRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): TransferAccountRequest
  static deserializeBinaryFromReader(
    message: TransferAccountRequest,
    reader: jspb.BinaryReader
  ): TransferAccountRequest
}

export namespace TransferAccountRequest {
  export type AsObject = {
    accounthashencrypt: Uint8Array | string
    recvpubkey: Uint8Array | string
    blockheight: number
    peerid: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class TransferAccountReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): TransferAccountReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: TransferAccountReply
  ): TransferAccountReply.AsObject
  static serializeBinaryToWriter(message: TransferAccountReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): TransferAccountReply
  static deserializeBinaryFromReader(
    message: TransferAccountReply,
    reader: jspb.BinaryReader
  ): TransferAccountReply
}

export namespace TransferAccountReply {
  export type AsObject = {}
}

export class SetUserDefaultDBRequest extends jspb.Message {
  getDbinfocrypt(): Uint8Array | string
  getDbinfocrypt_asU8(): Uint8Array
  getDbinfocrypt_asB64(): string
  setDbinfocrypt(value: Uint8Array | string): SetUserDefaultDBRequest

  getBlockheight(): number
  setBlockheight(value: number): SetUserDefaultDBRequest

  getPeerid(): Uint8Array | string
  getPeerid_asU8(): Uint8Array
  getPeerid_asB64(): string
  setPeerid(value: Uint8Array | string): SetUserDefaultDBRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): SetUserDefaultDBRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): SetUserDefaultDBRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: SetUserDefaultDBRequest
  ): SetUserDefaultDBRequest.AsObject
  static serializeBinaryToWriter(message: SetUserDefaultDBRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): SetUserDefaultDBRequest
  static deserializeBinaryFromReader(
    message: SetUserDefaultDBRequest,
    reader: jspb.BinaryReader
  ): SetUserDefaultDBRequest
}

export namespace SetUserDefaultDBRequest {
  export type AsObject = {
    dbinfocrypt: Uint8Array | string
    blockheight: number
    peerid: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class SetUserDefaultDBReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): SetUserDefaultDBReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: SetUserDefaultDBReply
  ): SetUserDefaultDBReply.AsObject
  static serializeBinaryToWriter(message: SetUserDefaultDBReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): SetUserDefaultDBReply
  static deserializeBinaryFromReader(
    message: SetUserDefaultDBReply,
    reader: jspb.BinaryReader
  ): SetUserDefaultDBReply
}

export namespace SetUserDefaultDBReply {
  export type AsObject = {}
}

export class AddSubPubkeyRequest extends jspb.Message {
  getSubpubkey(): Uint8Array | string
  getSubpubkey_asU8(): Uint8Array
  getSubpubkey_asB64(): string
  setSubpubkey(value: Uint8Array | string): AddSubPubkeyRequest

  getBlockheight(): number
  setBlockheight(value: number): AddSubPubkeyRequest

  getPeerid(): Uint8Array | string
  getPeerid_asU8(): Uint8Array
  getPeerid_asB64(): string
  setPeerid(value: Uint8Array | string): AddSubPubkeyRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): AddSubPubkeyRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AddSubPubkeyRequest.AsObject
  static toObject(includeInstance: boolean, msg: AddSubPubkeyRequest): AddSubPubkeyRequest.AsObject
  static serializeBinaryToWriter(message: AddSubPubkeyRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AddSubPubkeyRequest
  static deserializeBinaryFromReader(
    message: AddSubPubkeyRequest,
    reader: jspb.BinaryReader
  ): AddSubPubkeyRequest
}

export namespace AddSubPubkeyRequest {
  export type AsObject = {
    subpubkey: Uint8Array | string
    blockheight: number
    peerid: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class AddSubPubkeyReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AddSubPubkeyReply.AsObject
  static toObject(includeInstance: boolean, msg: AddSubPubkeyReply): AddSubPubkeyReply.AsObject
  static serializeBinaryToWriter(message: AddSubPubkeyReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AddSubPubkeyReply
  static deserializeBinaryFromReader(
    message: AddSubPubkeyReply,
    reader: jspb.BinaryReader
  ): AddSubPubkeyReply
}

export namespace AddSubPubkeyReply {
  export type AsObject = {}
}

export class DeleteSubPubkeyRequest extends jspb.Message {
  getSubpubkey(): Uint8Array | string
  getSubpubkey_asU8(): Uint8Array
  getSubpubkey_asB64(): string
  setSubpubkey(value: Uint8Array | string): DeleteSubPubkeyRequest

  getBlockheight(): number
  setBlockheight(value: number): DeleteSubPubkeyRequest

  getPeerid(): Uint8Array | string
  getPeerid_asU8(): Uint8Array
  getPeerid_asB64(): string
  setPeerid(value: Uint8Array | string): DeleteSubPubkeyRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): DeleteSubPubkeyRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DeleteSubPubkeyRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DeleteSubPubkeyRequest
  ): DeleteSubPubkeyRequest.AsObject
  static serializeBinaryToWriter(message: DeleteSubPubkeyRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): DeleteSubPubkeyRequest
  static deserializeBinaryFromReader(
    message: DeleteSubPubkeyRequest,
    reader: jspb.BinaryReader
  ): DeleteSubPubkeyRequest
}

export namespace DeleteSubPubkeyRequest {
  export type AsObject = {
    subpubkey: Uint8Array | string
    blockheight: number
    peerid: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class DeleteSubPubkeyReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DeleteSubPubkeyReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DeleteSubPubkeyReply
  ): DeleteSubPubkeyReply.AsObject
  static serializeBinaryToWriter(message: DeleteSubPubkeyReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): DeleteSubPubkeyReply
  static deserializeBinaryFromReader(
    message: DeleteSubPubkeyReply,
    reader: jspb.BinaryReader
  ): DeleteSubPubkeyReply
}

export namespace DeleteSubPubkeyReply {
  export type AsObject = {}
}

export class BindAccessPeerToUserRequest extends jspb.Message {
  getBlockheight(): number
  setBlockheight(value: number): BindAccessPeerToUserRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): BindAccessPeerToUserRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): BindAccessPeerToUserRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: BindAccessPeerToUserRequest
  ): BindAccessPeerToUserRequest.AsObject
  static serializeBinaryToWriter(
    message: BindAccessPeerToUserRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): BindAccessPeerToUserRequest
  static deserializeBinaryFromReader(
    message: BindAccessPeerToUserRequest,
    reader: jspb.BinaryReader
  ): BindAccessPeerToUserRequest
}

export namespace BindAccessPeerToUserRequest {
  export type AsObject = {
    blockheight: number
    signature: Uint8Array | string
  }
}

export class BindAccessPeerToUserReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): BindAccessPeerToUserReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: BindAccessPeerToUserReply
  ): BindAccessPeerToUserReply.AsObject
  static serializeBinaryToWriter(
    message: BindAccessPeerToUserReply,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): BindAccessPeerToUserReply
  static deserializeBinaryFromReader(
    message: BindAccessPeerToUserReply,
    reader: jspb.BinaryReader
  ): BindAccessPeerToUserReply
}

export namespace BindAccessPeerToUserReply {
  export type AsObject = {}
}

export class ValidTokenRequest extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): ValidTokenRequest.AsObject
  static toObject(includeInstance: boolean, msg: ValidTokenRequest): ValidTokenRequest.AsObject
  static serializeBinaryToWriter(message: ValidTokenRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): ValidTokenRequest
  static deserializeBinaryFromReader(
    message: ValidTokenRequest,
    reader: jspb.BinaryReader
  ): ValidTokenRequest
}

export namespace ValidTokenRequest {
  export type AsObject = {}
}

export class ValidTokenReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): ValidTokenReply.AsObject
  static toObject(includeInstance: boolean, msg: ValidTokenReply): ValidTokenReply.AsObject
  static serializeBinaryToWriter(message: ValidTokenReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): ValidTokenReply
  static deserializeBinaryFromReader(
    message: ValidTokenReply,
    reader: jspb.BinaryReader
  ): ValidTokenReply
}

export namespace ValidTokenReply {
  export type AsObject = {}
}

export class AddLogToThreadRequest extends jspb.Message {
  getThreadid(): Uint8Array | string
  getThreadid_asU8(): Uint8Array
  getThreadid_asB64(): string
  setThreadid(value: Uint8Array | string): AddLogToThreadRequest

  getLogid(): Uint8Array | string
  getLogid_asU8(): Uint8Array
  getLogid_asB64(): string
  setLogid(value: Uint8Array | string): AddLogToThreadRequest

  getBlockheight(): number
  setBlockheight(value: number): AddLogToThreadRequest

  getPeerid(): Uint8Array | string
  getPeerid_asU8(): Uint8Array
  getPeerid_asB64(): string
  setPeerid(value: Uint8Array | string): AddLogToThreadRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): AddLogToThreadRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AddLogToThreadRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: AddLogToThreadRequest
  ): AddLogToThreadRequest.AsObject
  static serializeBinaryToWriter(message: AddLogToThreadRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AddLogToThreadRequest
  static deserializeBinaryFromReader(
    message: AddLogToThreadRequest,
    reader: jspb.BinaryReader
  ): AddLogToThreadRequest
}

export namespace AddLogToThreadRequest {
  export type AsObject = {
    threadid: Uint8Array | string
    logid: Uint8Array | string
    blockheight: number
    peerid: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class AddLogToThreadReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AddLogToThreadReply.AsObject
  static toObject(includeInstance: boolean, msg: AddLogToThreadReply): AddLogToThreadReply.AsObject
  static serializeBinaryToWriter(message: AddLogToThreadReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AddLogToThreadReply
  static deserializeBinaryFromReader(
    message: AddLogToThreadReply,
    reader: jspb.BinaryReader
  ): AddLogToThreadReply
}

export namespace AddLogToThreadReply {
  export type AsObject = {}
}

export class AddThreadSpaceRequest extends jspb.Message {
  getThreadid(): Uint8Array | string
  getThreadid_asU8(): Uint8Array
  getThreadid_asB64(): string
  setThreadid(value: Uint8Array | string): AddThreadSpaceRequest

  getBlockheight(): number
  setBlockheight(value: number): AddThreadSpaceRequest

  getSpace(): number
  setSpace(value: number): AddThreadSpaceRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): AddThreadSpaceRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AddThreadSpaceRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: AddThreadSpaceRequest
  ): AddThreadSpaceRequest.AsObject
  static serializeBinaryToWriter(message: AddThreadSpaceRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AddThreadSpaceRequest
  static deserializeBinaryFromReader(
    message: AddThreadSpaceRequest,
    reader: jspb.BinaryReader
  ): AddThreadSpaceRequest
}

export namespace AddThreadSpaceRequest {
  export type AsObject = {
    threadid: Uint8Array | string
    blockheight: number
    space: number
    signature: Uint8Array | string
  }
}

export class AddThreadSpaceReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AddThreadSpaceReply.AsObject
  static toObject(includeInstance: boolean, msg: AddThreadSpaceReply): AddThreadSpaceReply.AsObject
  static serializeBinaryToWriter(message: AddThreadSpaceReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AddThreadSpaceReply
  static deserializeBinaryFromReader(
    message: AddThreadSpaceReply,
    reader: jspb.BinaryReader
  ): AddThreadSpaceReply
}

export namespace AddThreadSpaceReply {
  export type AsObject = {}
}

export class GetThreadUsedSpaceRequest extends jspb.Message {
  getThreadid(): Uint8Array | string
  getThreadid_asU8(): Uint8Array
  getThreadid_asB64(): string
  setThreadid(value: Uint8Array | string): GetThreadUsedSpaceRequest

  getRandnum(): number
  setRandnum(value: number): GetThreadUsedSpaceRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetThreadUsedSpaceRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetThreadUsedSpaceRequest
  ): GetThreadUsedSpaceRequest.AsObject
  static serializeBinaryToWriter(
    message: GetThreadUsedSpaceRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): GetThreadUsedSpaceRequest
  static deserializeBinaryFromReader(
    message: GetThreadUsedSpaceRequest,
    reader: jspb.BinaryReader
  ): GetThreadUsedSpaceRequest
}

export namespace GetThreadUsedSpaceRequest {
  export type AsObject = {
    threadid: Uint8Array | string
    randnum: number
  }
}

export class GetThreadUsedSpaceReply extends jspb.Message {
  getUsedsize(): number
  setUsedsize(value: number): GetThreadUsedSpaceReply

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): GetThreadUsedSpaceReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetThreadUsedSpaceReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetThreadUsedSpaceReply
  ): GetThreadUsedSpaceReply.AsObject
  static serializeBinaryToWriter(message: GetThreadUsedSpaceReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetThreadUsedSpaceReply
  static deserializeBinaryFromReader(
    message: GetThreadUsedSpaceReply,
    reader: jspb.BinaryReader
  ): GetThreadUsedSpaceReply
}

export namespace GetThreadUsedSpaceReply {
  export type AsObject = {
    usedsize: number
    signature: Uint8Array | string
  }
}

export class TeeReportVerifyRequest extends jspb.Message {
  getTeereport(): Uint8Array | string
  getTeereport_asU8(): Uint8Array
  getTeereport_asB64(): string
  setTeereport(value: Uint8Array | string): TeeReportVerifyRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): TeeReportVerifyRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: TeeReportVerifyRequest
  ): TeeReportVerifyRequest.AsObject
  static serializeBinaryToWriter(message: TeeReportVerifyRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): TeeReportVerifyRequest
  static deserializeBinaryFromReader(
    message: TeeReportVerifyRequest,
    reader: jspb.BinaryReader
  ): TeeReportVerifyRequest
}

export namespace TeeReportVerifyRequest {
  export type AsObject = {
    teereport: Uint8Array | string
  }
}

export class TeeReportVerifyReply extends jspb.Message {
  getReport(): Uint8Array | string
  getReport_asU8(): Uint8Array
  getReport_asB64(): string
  setReport(value: Uint8Array | string): TeeReportVerifyReply

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): TeeReportVerifyReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): TeeReportVerifyReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: TeeReportVerifyReply
  ): TeeReportVerifyReply.AsObject
  static serializeBinaryToWriter(message: TeeReportVerifyReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): TeeReportVerifyReply
  static deserializeBinaryFromReader(
    message: TeeReportVerifyReply,
    reader: jspb.BinaryReader
  ): TeeReportVerifyReply
}

export namespace TeeReportVerifyReply {
  export type AsObject = {
    report: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class SendMsgToUserBoxRequest extends jspb.Message {
  getMsg(): UserMsg | undefined
  setMsg(value?: UserMsg): SendMsgToUserBoxRequest
  hasMsg(): boolean
  clearMsg(): SendMsgToUserBoxRequest

  getAuthsignature(): Uint8Array | string
  getAuthsignature_asU8(): Uint8Array
  getAuthsignature_asB64(): string
  setAuthsignature(value: Uint8Array | string): SendMsgToUserBoxRequest

  getPeerid(): Uint8Array | string
  getPeerid_asU8(): Uint8Array
  getPeerid_asB64(): string
  setPeerid(value: Uint8Array | string): SendMsgToUserBoxRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): SendMsgToUserBoxRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: SendMsgToUserBoxRequest
  ): SendMsgToUserBoxRequest.AsObject
  static serializeBinaryToWriter(message: SendMsgToUserBoxRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): SendMsgToUserBoxRequest
  static deserializeBinaryFromReader(
    message: SendMsgToUserBoxRequest,
    reader: jspb.BinaryReader
  ): SendMsgToUserBoxRequest
}

export namespace SendMsgToUserBoxRequest {
  export type AsObject = {
    msg?: UserMsg.AsObject
    authsignature: Uint8Array | string
    peerid: Uint8Array | string
  }
}

export class SendMsgToUserBoxReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): SendMsgToUserBoxReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): SendMsgToUserBoxReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: SendMsgToUserBoxReply
  ): SendMsgToUserBoxReply.AsObject
  static serializeBinaryToWriter(message: SendMsgToUserBoxReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): SendMsgToUserBoxReply
  static deserializeBinaryFromReader(
    message: SendMsgToUserBoxReply,
    reader: jspb.BinaryReader
  ): SendMsgToUserBoxReply
}

export namespace SendMsgToUserBoxReply {
  export type AsObject = {
    flag: number
  }
}

export class GetToUserBoxAuthRequest extends jspb.Message {
  getMsgsignature(): Uint8Array | string
  getMsgsignature_asU8(): Uint8Array
  getMsgsignature_asB64(): string
  setMsgsignature(value: Uint8Array | string): GetToUserBoxAuthRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetToUserBoxAuthRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetToUserBoxAuthRequest
  ): GetToUserBoxAuthRequest.AsObject
  static serializeBinaryToWriter(message: GetToUserBoxAuthRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetToUserBoxAuthRequest
  static deserializeBinaryFromReader(
    message: GetToUserBoxAuthRequest,
    reader: jspb.BinaryReader
  ): GetToUserBoxAuthRequest
}

export namespace GetToUserBoxAuthRequest {
  export type AsObject = {
    msgsignature: Uint8Array | string
  }
}

export class GetToUserBoxAuthReply extends jspb.Message {
  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): GetToUserBoxAuthReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetToUserBoxAuthReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetToUserBoxAuthReply
  ): GetToUserBoxAuthReply.AsObject
  static serializeBinaryToWriter(message: GetToUserBoxAuthReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetToUserBoxAuthReply
  static deserializeBinaryFromReader(
    message: GetToUserBoxAuthReply,
    reader: jspb.BinaryReader
  ): GetToUserBoxAuthReply
}

export namespace GetToUserBoxAuthReply {
  export type AsObject = {
    signature: Uint8Array | string
  }
}

export class GetMsgFromUserBoxRequest extends jspb.Message {
  getAppid(): Uint8Array | string
  getAppid_asU8(): Uint8Array
  getAppid_asB64(): string
  setAppid(value: Uint8Array | string): GetMsgFromUserBoxRequest

  getBlockheight(): number
  setBlockheight(value: number): GetMsgFromUserBoxRequest

  getSeekkey(): Uint8Array | string
  getSeekkey_asU8(): Uint8Array
  getSeekkey_asB64(): string
  setSeekkey(value: Uint8Array | string): GetMsgFromUserBoxRequest

  getLimit(): number
  setLimit(value: number): GetMsgFromUserBoxRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetMsgFromUserBoxRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetMsgFromUserBoxRequest
  ): GetMsgFromUserBoxRequest.AsObject
  static serializeBinaryToWriter(message: GetMsgFromUserBoxRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetMsgFromUserBoxRequest
  static deserializeBinaryFromReader(
    message: GetMsgFromUserBoxRequest,
    reader: jspb.BinaryReader
  ): GetMsgFromUserBoxRequest
}

export namespace GetMsgFromUserBoxRequest {
  export type AsObject = {
    appid: Uint8Array | string
    blockheight: number
    seekkey: Uint8Array | string
    limit: number
  }
}

export class GetMsgFromUserBoxReply extends jspb.Message {
  getMsgsList(): Array<UserMsg>
  setMsgsList(value: Array<UserMsg>): GetMsgFromUserBoxReply
  clearMsgsList(): GetMsgFromUserBoxReply
  addMsgs(value?: UserMsg, index?: number): UserMsg

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetMsgFromUserBoxReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetMsgFromUserBoxReply
  ): GetMsgFromUserBoxReply.AsObject
  static serializeBinaryToWriter(message: GetMsgFromUserBoxReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetMsgFromUserBoxReply
  static deserializeBinaryFromReader(
    message: GetMsgFromUserBoxReply,
    reader: jspb.BinaryReader
  ): GetMsgFromUserBoxReply
}

export namespace GetMsgFromUserBoxReply {
  export type AsObject = {
    msgsList: Array<UserMsg.AsObject>
  }
}

export class UserMsg extends jspb.Message {
  getMessageid(): Uint8Array | string
  getMessageid_asU8(): Uint8Array
  getMessageid_asB64(): string
  setMessageid(value: Uint8Array | string): UserMsg

  getSenderpubkey(): Uint8Array | string
  getSenderpubkey_asU8(): Uint8Array
  getSenderpubkey_asB64(): string
  setSenderpubkey(value: Uint8Array | string): UserMsg

  getReceiverpubkey(): Uint8Array | string
  getReceiverpubkey_asU8(): Uint8Array
  getReceiverpubkey_asB64(): string
  setReceiverpubkey(value: Uint8Array | string): UserMsg

  getAppid(): Uint8Array | string
  getAppid_asU8(): Uint8Array
  getAppid_asB64(): string
  setAppid(value: Uint8Array | string): UserMsg

  getBlockheight(): number
  setBlockheight(value: number): UserMsg

  getEncryptmsg(): Uint8Array | string
  getEncryptmsg_asU8(): Uint8Array
  getEncryptmsg_asB64(): string
  setEncryptmsg(value: Uint8Array | string): UserMsg

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): UserMsg

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): UserMsg.AsObject
  static toObject(includeInstance: boolean, msg: UserMsg): UserMsg.AsObject
  static serializeBinaryToWriter(message: UserMsg, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): UserMsg
  static deserializeBinaryFromReader(message: UserMsg, reader: jspb.BinaryReader): UserMsg
}

export namespace UserMsg {
  export type AsObject = {
    messageid: Uint8Array | string
    senderpubkey: Uint8Array | string
    receiverpubkey: Uint8Array | string
    appid: Uint8Array | string
    blockheight: number
    encryptmsg: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class ReportSpamMsgRequest extends jspb.Message {
  getMsg(): UserMsg | undefined
  setMsg(value?: UserMsg): ReportSpamMsgRequest
  hasMsg(): boolean
  clearMsg(): ReportSpamMsgRequest

  getBlockheight(): number
  setBlockheight(value: number): ReportSpamMsgRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): ReportSpamMsgRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): ReportSpamMsgRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: ReportSpamMsgRequest
  ): ReportSpamMsgRequest.AsObject
  static serializeBinaryToWriter(message: ReportSpamMsgRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): ReportSpamMsgRequest
  static deserializeBinaryFromReader(
    message: ReportSpamMsgRequest,
    reader: jspb.BinaryReader
  ): ReportSpamMsgRequest
}

export namespace ReportSpamMsgRequest {
  export type AsObject = {
    msg?: UserMsg.AsObject
    blockheight: number
    signature: Uint8Array | string
  }
}

export class ReportSpamMsgReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): ReportSpamMsgReply.AsObject
  static toObject(includeInstance: boolean, msg: ReportSpamMsgReply): ReportSpamMsgReply.AsObject
  static serializeBinaryToWriter(message: ReportSpamMsgReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): ReportSpamMsgReply
  static deserializeBinaryFromReader(
    message: ReportSpamMsgReply,
    reader: jspb.BinaryReader
  ): ReportSpamMsgReply
}

export namespace ReportSpamMsgReply {
  export type AsObject = {}
}

export class GetUserClientPeersRequest extends jspb.Message {
  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): GetUserClientPeersRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetUserClientPeersRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetUserClientPeersRequest
  ): GetUserClientPeersRequest.AsObject
  static serializeBinaryToWriter(
    message: GetUserClientPeersRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): GetUserClientPeersRequest
  static deserializeBinaryFromReader(
    message: GetUserClientPeersRequest,
    reader: jspb.BinaryReader
  ): GetUserClientPeersRequest
}

export namespace GetUserClientPeersRequest {
  export type AsObject = {
    userpubkey: Uint8Array | string
  }
}

export class GetUserClientPeersReply extends jspb.Message {
  getPeeridsList(): Array<string>
  setPeeridsList(value: Array<string>): GetUserClientPeersReply
  clearPeeridsList(): GetUserClientPeersReply
  addPeerids(value: string, index?: number): GetUserClientPeersReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetUserClientPeersReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetUserClientPeersReply
  ): GetUserClientPeersReply.AsObject
  static serializeBinaryToWriter(message: GetUserClientPeersReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetUserClientPeersReply
  static deserializeBinaryFromReader(
    message: GetUserClientPeersReply,
    reader: jspb.BinaryReader
  ): GetUserClientPeersReply
}

export namespace GetUserClientPeersReply {
  export type AsObject = {
    peeridsList: Array<string>
  }
}

export class AddCommentableObjRequest extends jspb.Message {
  getObjcid(): Uint8Array | string
  getObjcid_asU8(): Uint8Array
  getObjcid_asB64(): string
  setObjcid(value: Uint8Array | string): AddCommentableObjRequest

  getAppid(): Uint8Array | string
  getAppid_asU8(): Uint8Array
  getAppid_asB64(): string
  setAppid(value: Uint8Array | string): AddCommentableObjRequest

  getBlockheight(): number
  setBlockheight(value: number): AddCommentableObjRequest

  getCommentspace(): number
  setCommentspace(value: number): AddCommentableObjRequest

  getAllowspace(): number
  setAllowspace(value: number): AddCommentableObjRequest

  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): AddCommentableObjRequest

  getOpenflag(): number
  setOpenflag(value: number): AddCommentableObjRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): AddCommentableObjRequest

  getCcount(): number
  setCcount(value: number): AddCommentableObjRequest

  getUpcount(): number
  setUpcount(value: number): AddCommentableObjRequest

  getDowncount(): number
  setDowncount(value: number): AddCommentableObjRequest

  getTcount(): number
  setTcount(value: number): AddCommentableObjRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AddCommentableObjRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: AddCommentableObjRequest
  ): AddCommentableObjRequest.AsObject
  static serializeBinaryToWriter(message: AddCommentableObjRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AddCommentableObjRequest
  static deserializeBinaryFromReader(
    message: AddCommentableObjRequest,
    reader: jspb.BinaryReader
  ): AddCommentableObjRequest
}

export namespace AddCommentableObjRequest {
  export type AsObject = {
    objcid: Uint8Array | string
    appid: Uint8Array | string
    blockheight: number
    commentspace: number
    allowspace: number
    userpubkey: Uint8Array | string
    openflag: number
    signature: Uint8Array | string
    ccount: number
    upcount: number
    downcount: number
    tcount: number
  }
}

export class AddCommentableObjReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): AddCommentableObjReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AddCommentableObjReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: AddCommentableObjReply
  ): AddCommentableObjReply.AsObject
  static serializeBinaryToWriter(message: AddCommentableObjReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AddCommentableObjReply
  static deserializeBinaryFromReader(
    message: AddCommentableObjReply,
    reader: jspb.BinaryReader
  ): AddCommentableObjReply
}

export namespace AddCommentableObjReply {
  export type AsObject = {
    flag: number
  }
}

export class AddObjCommentSpaceRequest extends jspb.Message {
  getObjcid(): Uint8Array | string
  getObjcid_asU8(): Uint8Array
  getObjcid_asB64(): string
  setObjcid(value: Uint8Array | string): AddObjCommentSpaceRequest

  getAppid(): Uint8Array | string
  getAppid_asU8(): Uint8Array
  getAppid_asB64(): string
  setAppid(value: Uint8Array | string): AddObjCommentSpaceRequest

  getBlockheight(): number
  setBlockheight(value: number): AddObjCommentSpaceRequest

  getAddspace(): number
  setAddspace(value: number): AddObjCommentSpaceRequest

  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): AddObjCommentSpaceRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): AddObjCommentSpaceRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AddObjCommentSpaceRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: AddObjCommentSpaceRequest
  ): AddObjCommentSpaceRequest.AsObject
  static serializeBinaryToWriter(
    message: AddObjCommentSpaceRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): AddObjCommentSpaceRequest
  static deserializeBinaryFromReader(
    message: AddObjCommentSpaceRequest,
    reader: jspb.BinaryReader
  ): AddObjCommentSpaceRequest
}

export namespace AddObjCommentSpaceRequest {
  export type AsObject = {
    objcid: Uint8Array | string
    appid: Uint8Array | string
    blockheight: number
    addspace: number
    userpubkey: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class AddObjCommentSpaceReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): AddObjCommentSpaceReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AddObjCommentSpaceReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: AddObjCommentSpaceReply
  ): AddObjCommentSpaceReply.AsObject
  static serializeBinaryToWriter(message: AddObjCommentSpaceReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): AddObjCommentSpaceReply
  static deserializeBinaryFromReader(
    message: AddObjCommentSpaceReply,
    reader: jspb.BinaryReader
  ): AddObjCommentSpaceReply
}

export namespace AddObjCommentSpaceReply {
  export type AsObject = {
    flag: number
  }
}

export class SetCacheKeyRequest extends jspb.Message {
  getExpire(): number
  setExpire(value: number): SetCacheKeyRequest

  getBlockheight(): number
  setBlockheight(value: number): SetCacheKeyRequest

  getValue(): Uint8Array | string
  getValue_asU8(): Uint8Array
  getValue_asB64(): string
  setValue(value: Uint8Array | string): SetCacheKeyRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): SetCacheKeyRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): SetCacheKeyRequest.AsObject
  static toObject(includeInstance: boolean, msg: SetCacheKeyRequest): SetCacheKeyRequest.AsObject
  static serializeBinaryToWriter(message: SetCacheKeyRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): SetCacheKeyRequest
  static deserializeBinaryFromReader(
    message: SetCacheKeyRequest,
    reader: jspb.BinaryReader
  ): SetCacheKeyRequest
}

export namespace SetCacheKeyRequest {
  export type AsObject = {
    expire: number
    blockheight: number
    value: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class SetCacheKeyReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): SetCacheKeyReply

  getCachekey(): Uint8Array | string
  getCachekey_asU8(): Uint8Array
  getCachekey_asB64(): string
  setCachekey(value: Uint8Array | string): SetCacheKeyReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): SetCacheKeyReply.AsObject
  static toObject(includeInstance: boolean, msg: SetCacheKeyReply): SetCacheKeyReply.AsObject
  static serializeBinaryToWriter(message: SetCacheKeyReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): SetCacheKeyReply
  static deserializeBinaryFromReader(
    message: SetCacheKeyReply,
    reader: jspb.BinaryReader
  ): SetCacheKeyReply
}

export namespace SetCacheKeyReply {
  export type AsObject = {
    flag: number
    cachekey: Uint8Array | string
  }
}

export class GetCacheValueRequest extends jspb.Message {
  getKey(): Uint8Array | string
  getKey_asU8(): Uint8Array
  getKey_asB64(): string
  setKey(value: Uint8Array | string): GetCacheValueRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetCacheValueRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetCacheValueRequest
  ): GetCacheValueRequest.AsObject
  static serializeBinaryToWriter(message: GetCacheValueRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetCacheValueRequest
  static deserializeBinaryFromReader(
    message: GetCacheValueRequest,
    reader: jspb.BinaryReader
  ): GetCacheValueRequest
}

export namespace GetCacheValueRequest {
  export type AsObject = {
    key: Uint8Array | string
  }
}

export class GetCacheValueReply extends jspb.Message {
  getValue(): Uint8Array | string
  getValue_asU8(): Uint8Array
  getValue_asB64(): string
  setValue(value: Uint8Array | string): GetCacheValueReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetCacheValueReply.AsObject
  static toObject(includeInstance: boolean, msg: GetCacheValueReply): GetCacheValueReply.AsObject
  static serializeBinaryToWriter(message: GetCacheValueReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetCacheValueReply
  static deserializeBinaryFromReader(
    message: GetCacheValueReply,
    reader: jspb.BinaryReader
  ): GetCacheValueReply
}

export namespace GetCacheValueReply {
  export type AsObject = {
    value: Uint8Array | string
  }
}

export class GetObjCommentSpaceRequest extends jspb.Message {
  getObjcid(): Uint8Array | string
  getObjcid_asU8(): Uint8Array
  getObjcid_asB64(): string
  setObjcid(value: Uint8Array | string): GetObjCommentSpaceRequest

  getAppid(): Uint8Array | string
  getAppid_asU8(): Uint8Array
  getAppid_asB64(): string
  setAppid(value: Uint8Array | string): GetObjCommentSpaceRequest

  getBlockheight(): number
  setBlockheight(value: number): GetObjCommentSpaceRequest

  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): GetObjCommentSpaceRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): GetObjCommentSpaceRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetObjCommentSpaceRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetObjCommentSpaceRequest
  ): GetObjCommentSpaceRequest.AsObject
  static serializeBinaryToWriter(
    message: GetObjCommentSpaceRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): GetObjCommentSpaceRequest
  static deserializeBinaryFromReader(
    message: GetObjCommentSpaceRequest,
    reader: jspb.BinaryReader
  ): GetObjCommentSpaceRequest
}

export namespace GetObjCommentSpaceRequest {
  export type AsObject = {
    objcid: Uint8Array | string
    appid: Uint8Array | string
    blockheight: number
    userpubkey: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class GetObjCommentSpaceReply extends jspb.Message {
  getSpace(): number
  setSpace(value: number): GetObjCommentSpaceReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetObjCommentSpaceReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetObjCommentSpaceReply
  ): GetObjCommentSpaceReply.AsObject
  static serializeBinaryToWriter(message: GetObjCommentSpaceReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetObjCommentSpaceReply
  static deserializeBinaryFromReader(
    message: GetObjCommentSpaceReply,
    reader: jspb.BinaryReader
  ): GetObjCommentSpaceReply
}

export namespace GetObjCommentSpaceReply {
  export type AsObject = {
    space: number
  }
}

export class DeleteCommentableObjRequest extends jspb.Message {
  getObjcid(): Uint8Array | string
  getObjcid_asU8(): Uint8Array
  getObjcid_asB64(): string
  setObjcid(value: Uint8Array | string): DeleteCommentableObjRequest

  getAppid(): Uint8Array | string
  getAppid_asU8(): Uint8Array
  getAppid_asB64(): string
  setAppid(value: Uint8Array | string): DeleteCommentableObjRequest

  getBlockheight(): number
  setBlockheight(value: number): DeleteCommentableObjRequest

  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): DeleteCommentableObjRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): DeleteCommentableObjRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DeleteCommentableObjRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DeleteCommentableObjRequest
  ): DeleteCommentableObjRequest.AsObject
  static serializeBinaryToWriter(
    message: DeleteCommentableObjRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): DeleteCommentableObjRequest
  static deserializeBinaryFromReader(
    message: DeleteCommentableObjRequest,
    reader: jspb.BinaryReader
  ): DeleteCommentableObjRequest
}

export namespace DeleteCommentableObjRequest {
  export type AsObject = {
    objcid: Uint8Array | string
    appid: Uint8Array | string
    blockheight: number
    userpubkey: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class DeleteCommentableObjReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): DeleteCommentableObjReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DeleteCommentableObjReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DeleteCommentableObjReply
  ): DeleteCommentableObjReply.AsObject
  static serializeBinaryToWriter(
    message: DeleteCommentableObjReply,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): DeleteCommentableObjReply
  static deserializeBinaryFromReader(
    message: DeleteCommentableObjReply,
    reader: jspb.BinaryReader
  ): DeleteCommentableObjReply
}

export namespace DeleteCommentableObjReply {
  export type AsObject = {
    flag: number
  }
}

export class PublishCommentToObjRequest extends jspb.Message {
  getObjcid(): Uint8Array | string
  getObjcid_asU8(): Uint8Array
  getObjcid_asB64(): string
  setObjcid(value: Uint8Array | string): PublishCommentToObjRequest

  getAppid(): Uint8Array | string
  getAppid_asU8(): Uint8Array
  getAppid_asB64(): string
  setAppid(value: Uint8Array | string): PublishCommentToObjRequest

  getObjauthor(): Uint8Array | string
  getObjauthor_asU8(): Uint8Array
  getObjauthor_asB64(): string
  setObjauthor(value: Uint8Array | string): PublishCommentToObjRequest

  getBlockheight(): number
  setBlockheight(value: number): PublishCommentToObjRequest

  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): PublishCommentToObjRequest

  getCommentcid(): Uint8Array | string
  getCommentcid_asU8(): Uint8Array
  getCommentcid_asB64(): string
  setCommentcid(value: Uint8Array | string): PublishCommentToObjRequest

  getComment(): Uint8Array | string
  getComment_asU8(): Uint8Array
  getComment_asB64(): string
  setComment(value: Uint8Array | string): PublishCommentToObjRequest

  getCommentsize(): number
  setCommentsize(value: number): PublishCommentToObjRequest

  getStatus(): number
  setStatus(value: number): PublishCommentToObjRequest

  getRefercommentkey(): Uint8Array | string
  getRefercommentkey_asU8(): Uint8Array
  getRefercommentkey_asB64(): string
  setRefercommentkey(value: Uint8Array | string): PublishCommentToObjRequest

  getCcount(): number
  setCcount(value: number): PublishCommentToObjRequest

  getUpcount(): number
  setUpcount(value: number): PublishCommentToObjRequest

  getDowncount(): number
  setDowncount(value: number): PublishCommentToObjRequest

  getTcount(): number
  setTcount(value: number): PublishCommentToObjRequest

  getType(): number
  setType(value: number): PublishCommentToObjRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): PublishCommentToObjRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): PublishCommentToObjRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: PublishCommentToObjRequest
  ): PublishCommentToObjRequest.AsObject
  static serializeBinaryToWriter(
    message: PublishCommentToObjRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): PublishCommentToObjRequest
  static deserializeBinaryFromReader(
    message: PublishCommentToObjRequest,
    reader: jspb.BinaryReader
  ): PublishCommentToObjRequest
}

export namespace PublishCommentToObjRequest {
  export type AsObject = {
    objcid: Uint8Array | string
    appid: Uint8Array | string
    objauthor: Uint8Array | string
    blockheight: number
    userpubkey: Uint8Array | string
    commentcid: Uint8Array | string
    comment: Uint8Array | string
    commentsize: number
    status: number
    refercommentkey: Uint8Array | string
    ccount: number
    upcount: number
    downcount: number
    tcount: number
    type: number
    signature: Uint8Array | string
  }
}

export class PublishCommentToObjReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): PublishCommentToObjReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): PublishCommentToObjReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: PublishCommentToObjReply
  ): PublishCommentToObjReply.AsObject
  static serializeBinaryToWriter(message: PublishCommentToObjReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): PublishCommentToObjReply
  static deserializeBinaryFromReader(
    message: PublishCommentToObjReply,
    reader: jspb.BinaryReader
  ): PublishCommentToObjReply
}

export namespace PublishCommentToObjReply {
  export type AsObject = {
    flag: number
  }
}

export class AddUserOffChainSpaceRequest extends jspb.Message {
  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): AddUserOffChainSpaceRequest

  getBlockheight(): number
  setBlockheight(value: number): AddUserOffChainSpaceRequest

  getPeerid(): Uint8Array | string
  getPeerid_asU8(): Uint8Array
  getPeerid_asB64(): string
  setPeerid(value: Uint8Array | string): AddUserOffChainSpaceRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): AddUserOffChainSpaceRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AddUserOffChainSpaceRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: AddUserOffChainSpaceRequest
  ): AddUserOffChainSpaceRequest.AsObject
  static serializeBinaryToWriter(
    message: AddUserOffChainSpaceRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): AddUserOffChainSpaceRequest
  static deserializeBinaryFromReader(
    message: AddUserOffChainSpaceRequest,
    reader: jspb.BinaryReader
  ): AddUserOffChainSpaceRequest
}

export namespace AddUserOffChainSpaceRequest {
  export type AsObject = {
    userpubkey: Uint8Array | string
    blockheight: number
    peerid: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class AddUserOffChainSpaceReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): AddUserOffChainSpaceReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: AddUserOffChainSpaceReply
  ): AddUserOffChainSpaceReply.AsObject
  static serializeBinaryToWriter(
    message: AddUserOffChainSpaceReply,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): AddUserOffChainSpaceReply
  static deserializeBinaryFromReader(
    message: AddUserOffChainSpaceReply,
    reader: jspb.BinaryReader
  ): AddUserOffChainSpaceReply
}

export namespace AddUserOffChainSpaceReply {
  export type AsObject = {}
}

export class ReportMaliciousCommentRequest extends jspb.Message {
  getObjcid(): Uint8Array | string
  getObjcid_asU8(): Uint8Array
  getObjcid_asB64(): string
  setObjcid(value: Uint8Array | string): ReportMaliciousCommentRequest

  getAppid(): Uint8Array | string
  getAppid_asU8(): Uint8Array
  getAppid_asB64(): string
  setAppid(value: Uint8Array | string): ReportMaliciousCommentRequest

  getObjauthor(): Uint8Array | string
  getObjauthor_asU8(): Uint8Array
  getObjauthor_asB64(): string
  setObjauthor(value: Uint8Array | string): ReportMaliciousCommentRequest

  getBlockheight(): number
  setBlockheight(value: number): ReportMaliciousCommentRequest

  getCommentblockheight(): number
  setCommentblockheight(value: number): ReportMaliciousCommentRequest

  getCommentcid(): Uint8Array | string
  getCommentcid_asU8(): Uint8Array
  getCommentcid_asB64(): string
  setCommentcid(value: Uint8Array | string): ReportMaliciousCommentRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): ReportMaliciousCommentRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): ReportMaliciousCommentRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: ReportMaliciousCommentRequest
  ): ReportMaliciousCommentRequest.AsObject
  static serializeBinaryToWriter(
    message: ReportMaliciousCommentRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): ReportMaliciousCommentRequest
  static deserializeBinaryFromReader(
    message: ReportMaliciousCommentRequest,
    reader: jspb.BinaryReader
  ): ReportMaliciousCommentRequest
}

export namespace ReportMaliciousCommentRequest {
  export type AsObject = {
    objcid: Uint8Array | string
    appid: Uint8Array | string
    objauthor: Uint8Array | string
    blockheight: number
    commentblockheight: number
    commentcid: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class ReportMaliciousCommentReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): ReportMaliciousCommentReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): ReportMaliciousCommentReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: ReportMaliciousCommentReply
  ): ReportMaliciousCommentReply.AsObject
  static serializeBinaryToWriter(
    message: ReportMaliciousCommentReply,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): ReportMaliciousCommentReply
  static deserializeBinaryFromReader(
    message: ReportMaliciousCommentReply,
    reader: jspb.BinaryReader
  ): ReportMaliciousCommentReply
}

export namespace ReportMaliciousCommentReply {
  export type AsObject = {
    flag: number
  }
}

export class SetObjCommentPublicRequest extends jspb.Message {
  getObjcid(): Uint8Array | string
  getObjcid_asU8(): Uint8Array
  getObjcid_asB64(): string
  setObjcid(value: Uint8Array | string): SetObjCommentPublicRequest

  getAppid(): Uint8Array | string
  getAppid_asU8(): Uint8Array
  getAppid_asB64(): string
  setAppid(value: Uint8Array | string): SetObjCommentPublicRequest

  getObjauthor(): Uint8Array | string
  getObjauthor_asU8(): Uint8Array
  getObjauthor_asB64(): string
  setObjauthor(value: Uint8Array | string): SetObjCommentPublicRequest

  getBlockheight(): number
  setBlockheight(value: number): SetObjCommentPublicRequest

  getCommentblockheight(): number
  setCommentblockheight(value: number): SetObjCommentPublicRequest

  getCommentcid(): Uint8Array | string
  getCommentcid_asU8(): Uint8Array
  getCommentcid_asB64(): string
  setCommentcid(value: Uint8Array | string): SetObjCommentPublicRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): SetObjCommentPublicRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): SetObjCommentPublicRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: SetObjCommentPublicRequest
  ): SetObjCommentPublicRequest.AsObject
  static serializeBinaryToWriter(
    message: SetObjCommentPublicRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): SetObjCommentPublicRequest
  static deserializeBinaryFromReader(
    message: SetObjCommentPublicRequest,
    reader: jspb.BinaryReader
  ): SetObjCommentPublicRequest
}

export namespace SetObjCommentPublicRequest {
  export type AsObject = {
    objcid: Uint8Array | string
    appid: Uint8Array | string
    objauthor: Uint8Array | string
    blockheight: number
    commentblockheight: number
    commentcid: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class SetObjCommentPublicReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): SetObjCommentPublicReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): SetObjCommentPublicReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: SetObjCommentPublicReply
  ): SetObjCommentPublicReply.AsObject
  static serializeBinaryToWriter(message: SetObjCommentPublicReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): SetObjCommentPublicReply
  static deserializeBinaryFromReader(
    message: SetObjCommentPublicReply,
    reader: jspb.BinaryReader
  ): SetObjCommentPublicReply
}

export namespace SetObjCommentPublicReply {
  export type AsObject = {
    flag: number
  }
}

export class DeleteSelfCommentRequest extends jspb.Message {
  getObjcid(): Uint8Array | string
  getObjcid_asU8(): Uint8Array
  getObjcid_asB64(): string
  setObjcid(value: Uint8Array | string): DeleteSelfCommentRequest

  getAppid(): Uint8Array | string
  getAppid_asU8(): Uint8Array
  getAppid_asB64(): string
  setAppid(value: Uint8Array | string): DeleteSelfCommentRequest

  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): DeleteSelfCommentRequest

  getObjauthor(): Uint8Array | string
  getObjauthor_asU8(): Uint8Array
  getObjauthor_asB64(): string
  setObjauthor(value: Uint8Array | string): DeleteSelfCommentRequest

  getBlockheight(): number
  setBlockheight(value: number): DeleteSelfCommentRequest

  getCommentblockheight(): number
  setCommentblockheight(value: number): DeleteSelfCommentRequest

  getCommentcid(): Uint8Array | string
  getCommentcid_asU8(): Uint8Array
  getCommentcid_asB64(): string
  setCommentcid(value: Uint8Array | string): DeleteSelfCommentRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): DeleteSelfCommentRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DeleteSelfCommentRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DeleteSelfCommentRequest
  ): DeleteSelfCommentRequest.AsObject
  static serializeBinaryToWriter(message: DeleteSelfCommentRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): DeleteSelfCommentRequest
  static deserializeBinaryFromReader(
    message: DeleteSelfCommentRequest,
    reader: jspb.BinaryReader
  ): DeleteSelfCommentRequest
}

export namespace DeleteSelfCommentRequest {
  export type AsObject = {
    objcid: Uint8Array | string
    appid: Uint8Array | string
    userpubkey: Uint8Array | string
    objauthor: Uint8Array | string
    blockheight: number
    commentblockheight: number
    commentcid: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class DeleteSelfCommentReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): DeleteSelfCommentReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DeleteSelfCommentReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DeleteSelfCommentReply
  ): DeleteSelfCommentReply.AsObject
  static serializeBinaryToWriter(message: DeleteSelfCommentReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): DeleteSelfCommentReply
  static deserializeBinaryFromReader(
    message: DeleteSelfCommentReply,
    reader: jspb.BinaryReader
  ): DeleteSelfCommentReply
}

export namespace DeleteSelfCommentReply {
  export type AsObject = {
    flag: number
  }
}

export class DeleteCommentToObjRequest extends jspb.Message {
  getObjcid(): Uint8Array | string
  getObjcid_asU8(): Uint8Array
  getObjcid_asB64(): string
  setObjcid(value: Uint8Array | string): DeleteCommentToObjRequest

  getAppid(): Uint8Array | string
  getAppid_asU8(): Uint8Array
  getAppid_asB64(): string
  setAppid(value: Uint8Array | string): DeleteCommentToObjRequest

  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): DeleteCommentToObjRequest

  getObjauthor(): Uint8Array | string
  getObjauthor_asU8(): Uint8Array
  getObjauthor_asB64(): string
  setObjauthor(value: Uint8Array | string): DeleteCommentToObjRequest

  getBlockheight(): number
  setBlockheight(value: number): DeleteCommentToObjRequest

  getCommentblockheight(): number
  setCommentblockheight(value: number): DeleteCommentToObjRequest

  getCommentcid(): Uint8Array | string
  getCommentcid_asU8(): Uint8Array
  getCommentcid_asB64(): string
  setCommentcid(value: Uint8Array | string): DeleteCommentToObjRequest

  getSignature(): Uint8Array | string
  getSignature_asU8(): Uint8Array
  getSignature_asB64(): string
  setSignature(value: Uint8Array | string): DeleteCommentToObjRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DeleteCommentToObjRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DeleteCommentToObjRequest
  ): DeleteCommentToObjRequest.AsObject
  static serializeBinaryToWriter(
    message: DeleteCommentToObjRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): DeleteCommentToObjRequest
  static deserializeBinaryFromReader(
    message: DeleteCommentToObjRequest,
    reader: jspb.BinaryReader
  ): DeleteCommentToObjRequest
}

export namespace DeleteCommentToObjRequest {
  export type AsObject = {
    objcid: Uint8Array | string
    appid: Uint8Array | string
    userpubkey: Uint8Array | string
    objauthor: Uint8Array | string
    blockheight: number
    commentblockheight: number
    commentcid: Uint8Array | string
    signature: Uint8Array | string
  }
}

export class DeleteCommentToObjReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): DeleteCommentToObjReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DeleteCommentToObjReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DeleteCommentToObjReply
  ): DeleteCommentToObjReply.AsObject
  static serializeBinaryToWriter(message: DeleteCommentToObjReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): DeleteCommentToObjReply
  static deserializeBinaryFromReader(
    message: DeleteCommentToObjReply,
    reader: jspb.BinaryReader
  ): DeleteCommentToObjReply
}

export namespace DeleteCommentToObjReply {
  export type AsObject = {
    flag: number
  }
}

export class GetCommentableObjRequest extends jspb.Message {
  getAppid(): Uint8Array | string
  getAppid_asU8(): Uint8Array
  getAppid_asB64(): string
  setAppid(value: Uint8Array | string): GetCommentableObjRequest

  getObjauthor(): Uint8Array | string
  getObjauthor_asU8(): Uint8Array
  getObjauthor_asB64(): string
  setObjauthor(value: Uint8Array | string): GetCommentableObjRequest

  getStartheight(): number
  setStartheight(value: number): GetCommentableObjRequest

  getDirection(): number
  setDirection(value: number): GetCommentableObjRequest

  getOffset(): number
  setOffset(value: number): GetCommentableObjRequest

  getLimit(): number
  setLimit(value: number): GetCommentableObjRequest

  getSeekkey(): Uint8Array | string
  getSeekkey_asU8(): Uint8Array
  getSeekkey_asB64(): string
  setSeekkey(value: Uint8Array | string): GetCommentableObjRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetCommentableObjRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetCommentableObjRequest
  ): GetCommentableObjRequest.AsObject
  static serializeBinaryToWriter(message: GetCommentableObjRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetCommentableObjRequest
  static deserializeBinaryFromReader(
    message: GetCommentableObjRequest,
    reader: jspb.BinaryReader
  ): GetCommentableObjRequest
}

export namespace GetCommentableObjRequest {
  export type AsObject = {
    appid: Uint8Array | string
    objauthor: Uint8Array | string
    startheight: number
    direction: number
    offset: number
    limit: number
    seekkey: Uint8Array | string
  }
}

export class GetCommentableObjReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): GetCommentableObjReply

  getObjscid(): Uint8Array | string
  getObjscid_asU8(): Uint8Array
  getObjscid_asB64(): string
  setObjscid(value: Uint8Array | string): GetCommentableObjReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetCommentableObjReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetCommentableObjReply
  ): GetCommentableObjReply.AsObject
  static serializeBinaryToWriter(message: GetCommentableObjReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetCommentableObjReply
  static deserializeBinaryFromReader(
    message: GetCommentableObjReply,
    reader: jspb.BinaryReader
  ): GetCommentableObjReply
}

export namespace GetCommentableObjReply {
  export type AsObject = {
    flag: number
    objscid: Uint8Array | string
  }
}

export class GetObjCommentsRequest extends jspb.Message {
  getObjcid(): Uint8Array | string
  getObjcid_asU8(): Uint8Array
  getObjcid_asB64(): string
  setObjcid(value: Uint8Array | string): GetObjCommentsRequest

  getAppid(): Uint8Array | string
  getAppid_asU8(): Uint8Array
  getAppid_asB64(): string
  setAppid(value: Uint8Array | string): GetObjCommentsRequest

  getObjauthor(): Uint8Array | string
  getObjauthor_asU8(): Uint8Array
  getObjauthor_asB64(): string
  setObjauthor(value: Uint8Array | string): GetObjCommentsRequest

  getStartheight(): number
  setStartheight(value: number): GetObjCommentsRequest

  getDirection(): number
  setDirection(value: number): GetObjCommentsRequest

  getOffset(): number
  setOffset(value: number): GetObjCommentsRequest

  getLimit(): number
  setLimit(value: number): GetObjCommentsRequest

  getSeekkey(): Uint8Array | string
  getSeekkey_asU8(): Uint8Array
  getSeekkey_asB64(): string
  setSeekkey(value: Uint8Array | string): GetObjCommentsRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetObjCommentsRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetObjCommentsRequest
  ): GetObjCommentsRequest.AsObject
  static serializeBinaryToWriter(message: GetObjCommentsRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetObjCommentsRequest
  static deserializeBinaryFromReader(
    message: GetObjCommentsRequest,
    reader: jspb.BinaryReader
  ): GetObjCommentsRequest
}

export namespace GetObjCommentsRequest {
  export type AsObject = {
    objcid: Uint8Array | string
    appid: Uint8Array | string
    objauthor: Uint8Array | string
    startheight: number
    direction: number
    offset: number
    limit: number
    seekkey: Uint8Array | string
  }
}

export class GetObjCommentsReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): GetObjCommentsReply

  getCommentscid(): Uint8Array | string
  getCommentscid_asU8(): Uint8Array
  getCommentscid_asB64(): string
  setCommentscid(value: Uint8Array | string): GetObjCommentsReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetObjCommentsReply.AsObject
  static toObject(includeInstance: boolean, msg: GetObjCommentsReply): GetObjCommentsReply.AsObject
  static serializeBinaryToWriter(message: GetObjCommentsReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetObjCommentsReply
  static deserializeBinaryFromReader(
    message: GetObjCommentsReply,
    reader: jspb.BinaryReader
  ): GetObjCommentsReply
}

export namespace GetObjCommentsReply {
  export type AsObject = {
    flag: number
    commentscid: Uint8Array | string
  }
}

export class GetUserCommentsRequest extends jspb.Message {
  getAppid(): Uint8Array | string
  getAppid_asU8(): Uint8Array
  getAppid_asB64(): string
  setAppid(value: Uint8Array | string): GetUserCommentsRequest

  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): GetUserCommentsRequest

  getStartheight(): number
  setStartheight(value: number): GetUserCommentsRequest

  getDirection(): number
  setDirection(value: number): GetUserCommentsRequest

  getOffset(): number
  setOffset(value: number): GetUserCommentsRequest

  getLimit(): number
  setLimit(value: number): GetUserCommentsRequest

  getSeekkey(): Uint8Array | string
  getSeekkey_asU8(): Uint8Array
  getSeekkey_asB64(): string
  setSeekkey(value: Uint8Array | string): GetUserCommentsRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetUserCommentsRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetUserCommentsRequest
  ): GetUserCommentsRequest.AsObject
  static serializeBinaryToWriter(message: GetUserCommentsRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetUserCommentsRequest
  static deserializeBinaryFromReader(
    message: GetUserCommentsRequest,
    reader: jspb.BinaryReader
  ): GetUserCommentsRequest
}

export namespace GetUserCommentsRequest {
  export type AsObject = {
    appid: Uint8Array | string
    userpubkey: Uint8Array | string
    startheight: number
    direction: number
    offset: number
    limit: number
    seekkey: Uint8Array | string
  }
}

export class GetUserCommentsReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): GetUserCommentsReply

  getCommentscid(): Uint8Array | string
  getCommentscid_asU8(): Uint8Array
  getCommentscid_asB64(): string
  setCommentscid(value: Uint8Array | string): GetUserCommentsReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetUserCommentsReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: GetUserCommentsReply
  ): GetUserCommentsReply.AsObject
  static serializeBinaryToWriter(message: GetUserCommentsReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetUserCommentsReply
  static deserializeBinaryFromReader(
    message: GetUserCommentsReply,
    reader: jspb.BinaryReader
  ): GetUserCommentsReply
}

export namespace GetUserCommentsReply {
  export type AsObject = {
    flag: number
    commentscid: Uint8Array | string
  }
}

export class PushCommentFunOptRequest extends jspb.Message {
  getOpt(): CommentFunOpt | undefined
  setOpt(value?: CommentFunOpt): PushCommentFunOptRequest
  hasOpt(): boolean
  clearOpt(): PushCommentFunOptRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): PushCommentFunOptRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: PushCommentFunOptRequest
  ): PushCommentFunOptRequest.AsObject
  static serializeBinaryToWriter(message: PushCommentFunOptRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): PushCommentFunOptRequest
  static deserializeBinaryFromReader(
    message: PushCommentFunOptRequest,
    reader: jspb.BinaryReader
  ): PushCommentFunOptRequest
}

export namespace PushCommentFunOptRequest {
  export type AsObject = {
    opt?: CommentFunOpt.AsObject
  }
}

export class PushCommentFunOptReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): PushCommentFunOptReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: PushCommentFunOptReply
  ): PushCommentFunOptReply.AsObject
  static serializeBinaryToWriter(message: PushCommentFunOptReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): PushCommentFunOptReply
  static deserializeBinaryFromReader(
    message: PushCommentFunOptReply,
    reader: jspb.BinaryReader
  ): PushCommentFunOptReply
}

export namespace PushCommentFunOptReply {
  export type AsObject = {}
}

export class PullCommentFunOptsRequest extends jspb.Message {
  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): PullCommentFunOptsRequest

  getLimit(): number
  setLimit(value: number): PullCommentFunOptsRequest

  getSeqsList(): Array<peerSeqno>
  setSeqsList(value: Array<peerSeqno>): PullCommentFunOptsRequest
  clearSeqsList(): PullCommentFunOptsRequest
  addSeqs(value?: peerSeqno, index?: number): peerSeqno

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): PullCommentFunOptsRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: PullCommentFunOptsRequest
  ): PullCommentFunOptsRequest.AsObject
  static serializeBinaryToWriter(
    message: PullCommentFunOptsRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): PullCommentFunOptsRequest
  static deserializeBinaryFromReader(
    message: PullCommentFunOptsRequest,
    reader: jspb.BinaryReader
  ): PullCommentFunOptsRequest
}

export namespace PullCommentFunOptsRequest {
  export type AsObject = {
    userpubkey: Uint8Array | string
    limit: number
    seqsList: Array<peerSeqno.AsObject>
  }
}

export class peerSeqno extends jspb.Message {
  getPeerid(): Uint8Array | string
  getPeerid_asU8(): Uint8Array
  getPeerid_asB64(): string
  setPeerid(value: Uint8Array | string): peerSeqno

  getSeqno(): number
  setSeqno(value: number): peerSeqno

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): peerSeqno.AsObject
  static toObject(includeInstance: boolean, msg: peerSeqno): peerSeqno.AsObject
  static serializeBinaryToWriter(message: peerSeqno, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): peerSeqno
  static deserializeBinaryFromReader(message: peerSeqno, reader: jspb.BinaryReader): peerSeqno
}

export namespace peerSeqno {
  export type AsObject = {
    peerid: Uint8Array | string
    seqno: number
  }
}

export class PullCommentFunOptsReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): PullCommentFunOptsReply

  getFuncoptscid(): Uint8Array | string
  getFuncoptscid_asU8(): Uint8Array
  getFuncoptscid_asB64(): string
  setFuncoptscid(value: Uint8Array | string): PullCommentFunOptsReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): PullCommentFunOptsReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: PullCommentFunOptsReply
  ): PullCommentFunOptsReply.AsObject
  static serializeBinaryToWriter(message: PullCommentFunOptsReply, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): PullCommentFunOptsReply
  static deserializeBinaryFromReader(
    message: PullCommentFunOptsReply,
    reader: jspb.BinaryReader
  ): PullCommentFunOptsReply
}

export namespace PullCommentFunOptsReply {
  export type AsObject = {
    flag: number
    funcoptscid: Uint8Array | string
  }
}

export class CommentFunOpt extends jspb.Message {
  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): CommentFunOpt

  getSeqno(): number
  setSeqno(value: number): CommentFunOpt

  getPeerid(): Uint8Array | string
  getPeerid_asU8(): Uint8Array
  getPeerid_asB64(): string
  setPeerid(value: Uint8Array | string): CommentFunOpt

  getOptype(): number
  setOptype(value: number): CommentFunOpt

  getOpreq(): Uint8Array | string
  getOpreq_asU8(): Uint8Array
  getOpreq_asB64(): string
  setOpreq(value: Uint8Array | string): CommentFunOpt

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): CommentFunOpt.AsObject
  static toObject(includeInstance: boolean, msg: CommentFunOpt): CommentFunOpt.AsObject
  static serializeBinaryToWriter(message: CommentFunOpt, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): CommentFunOpt
  static deserializeBinaryFromReader(
    message: CommentFunOpt,
    reader: jspb.BinaryReader
  ): CommentFunOpt
}

export namespace CommentFunOpt {
  export type AsObject = {
    userpubkey: Uint8Array | string
    seqno: number
    peerid: Uint8Array | string
    optype: number
    opreq: Uint8Array | string
  }
}

export class ExchangeCommentEdgesRequest extends jspb.Message {
  getUserseqedgesList(): Array<UserCommentSeqEdge>
  setUserseqedgesList(value: Array<UserCommentSeqEdge>): ExchangeCommentEdgesRequest
  clearUserseqedgesList(): ExchangeCommentEdgesRequest
  addUserseqedges(value?: UserCommentSeqEdge, index?: number): UserCommentSeqEdge

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): ExchangeCommentEdgesRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: ExchangeCommentEdgesRequest
  ): ExchangeCommentEdgesRequest.AsObject
  static serializeBinaryToWriter(
    message: ExchangeCommentEdgesRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): ExchangeCommentEdgesRequest
  static deserializeBinaryFromReader(
    message: ExchangeCommentEdgesRequest,
    reader: jspb.BinaryReader
  ): ExchangeCommentEdgesRequest
}

export namespace ExchangeCommentEdgesRequest {
  export type AsObject = {
    userseqedgesList: Array<UserCommentSeqEdge.AsObject>
  }
}

export class ExchangeCommentEdgesReply extends jspb.Message {
  getUserseqedgesList(): Array<UserCommentSeqEdge>
  setUserseqedgesList(value: Array<UserCommentSeqEdge>): ExchangeCommentEdgesReply
  clearUserseqedgesList(): ExchangeCommentEdgesReply
  addUserseqedges(value?: UserCommentSeqEdge, index?: number): UserCommentSeqEdge

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): ExchangeCommentEdgesReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: ExchangeCommentEdgesReply
  ): ExchangeCommentEdgesReply.AsObject
  static serializeBinaryToWriter(
    message: ExchangeCommentEdgesReply,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): ExchangeCommentEdgesReply
  static deserializeBinaryFromReader(
    message: ExchangeCommentEdgesReply,
    reader: jspb.BinaryReader
  ): ExchangeCommentEdgesReply
}

export namespace ExchangeCommentEdgesReply {
  export type AsObject = {
    userseqedgesList: Array<UserCommentSeqEdge.AsObject>
  }
}

export class UserCommentSeqEdge extends jspb.Message {
  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): UserCommentSeqEdge

  getSeqedge(): number
  setSeqedge(value: number): UserCommentSeqEdge

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): UserCommentSeqEdge.AsObject
  static toObject(includeInstance: boolean, msg: UserCommentSeqEdge): UserCommentSeqEdge.AsObject
  static serializeBinaryToWriter(message: UserCommentSeqEdge, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): UserCommentSeqEdge
  static deserializeBinaryFromReader(
    message: UserCommentSeqEdge,
    reader: jspb.BinaryReader
  ): UserCommentSeqEdge
}

export namespace UserCommentSeqEdge {
  export type AsObject = {
    userpubkey: Uint8Array | string
    seqedge: number
  }
}

export class DownloadUserCommentsRequest extends jspb.Message {
  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): DownloadUserCommentsRequest

  getBlockheight(): number
  setBlockheight(value: number): DownloadUserCommentsRequest

  getTeereport(): Uint8Array | string
  getTeereport_asU8(): Uint8Array
  getTeereport_asB64(): string
  setTeereport(value: Uint8Array | string): DownloadUserCommentsRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DownloadUserCommentsRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DownloadUserCommentsRequest
  ): DownloadUserCommentsRequest.AsObject
  static serializeBinaryToWriter(
    message: DownloadUserCommentsRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): DownloadUserCommentsRequest
  static deserializeBinaryFromReader(
    message: DownloadUserCommentsRequest,
    reader: jspb.BinaryReader
  ): DownloadUserCommentsRequest
}

export namespace DownloadUserCommentsRequest {
  export type AsObject = {
    userpubkey: Uint8Array | string
    blockheight: number
    teereport: Uint8Array | string
  }
}

export class DownloadUserCommentsReply extends jspb.Message {
  getFlag(): number
  setFlag(value: number): DownloadUserCommentsReply

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DownloadUserCommentsReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DownloadUserCommentsReply
  ): DownloadUserCommentsReply.AsObject
  static serializeBinaryToWriter(
    message: DownloadUserCommentsReply,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): DownloadUserCommentsReply
  static deserializeBinaryFromReader(
    message: DownloadUserCommentsReply,
    reader: jspb.BinaryReader
  ): DownloadUserCommentsReply
}

export namespace DownloadUserCommentsReply {
  export type AsObject = {
    flag: number
  }
}

export class UserCommentsDownloadReadyRequest extends jspb.Message {
  getUserpubkey(): Uint8Array | string
  getUserpubkey_asU8(): Uint8Array
  getUserpubkey_asB64(): string
  setUserpubkey(value: Uint8Array | string): UserCommentsDownloadReadyRequest

  getCommentscid(): Uint8Array | string
  getCommentscid_asU8(): Uint8Array
  getCommentscid_asB64(): string
  setCommentscid(value: Uint8Array | string): UserCommentsDownloadReadyRequest

  getBlockheight(): number
  setBlockheight(value: number): UserCommentsDownloadReadyRequest

  getTeereport(): Uint8Array | string
  getTeereport_asU8(): Uint8Array
  getTeereport_asB64(): string
  setTeereport(value: Uint8Array | string): UserCommentsDownloadReadyRequest

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): UserCommentsDownloadReadyRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: UserCommentsDownloadReadyRequest
  ): UserCommentsDownloadReadyRequest.AsObject
  static serializeBinaryToWriter(
    message: UserCommentsDownloadReadyRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): UserCommentsDownloadReadyRequest
  static deserializeBinaryFromReader(
    message: UserCommentsDownloadReadyRequest,
    reader: jspb.BinaryReader
  ): UserCommentsDownloadReadyRequest
}

export namespace UserCommentsDownloadReadyRequest {
  export type AsObject = {
    userpubkey: Uint8Array | string
    commentscid: Uint8Array | string
    blockheight: number
    teereport: Uint8Array | string
  }
}

export class UserCommentsDownloadReadyReply extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): UserCommentsDownloadReadyReply.AsObject
  static toObject(
    includeInstance: boolean,
    msg: UserCommentsDownloadReadyReply
  ): UserCommentsDownloadReadyReply.AsObject
  static serializeBinaryToWriter(
    message: UserCommentsDownloadReadyReply,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): UserCommentsDownloadReadyReply
  static deserializeBinaryFromReader(
    message: UserCommentsDownloadReadyReply,
    reader: jspb.BinaryReader
  ): UserCommentsDownloadReadyReply
}

export namespace UserCommentsDownloadReadyReply {
  export type AsObject = {}
}

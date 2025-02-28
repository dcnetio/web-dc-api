import type { Libp2p } from "libp2p";
import { ThreadID } from "@textile/threads-id";
import type { Multiaddr } from "@multiformats/multiaddr";
import { dcnet } from "../proto/dcnet_proto";
import { base58btc } from "multiformats/bases/base58";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { Key as ThreadKey } from './key';
import { DataSource } from "../proto/datasource";

import type { PublicKey,PrivateKey } from "@libp2p/interface"; 
import { extractPublicKeyFromPeerId } from "../dc-key/keyManager";

export class DBGrpcClient {
    grpcClient: Libp2pGrpcClient;
    stream: any;
    token: string;

    constructor(
        node: Libp2p,
        peerAddr: Multiaddr,
        token: string,
        protocol?: string
    ) {
        this.grpcClient = new Libp2pGrpcClient(node, peerAddr, token, protocol);
        this.token = token;
    }

    async RequestThreadID(): Promise<string> {
        try {
            const message = new dcnet.pb.ThreadIDRequest({});
            const messageBytes = dcnet.pb.ThreadIDRequest.encode(message).finish();
            const responseData = await this.grpcClient.unaryCall(
                "/dcnet.pb.Service/RequestThreadID",
                messageBytes,
                30000
            );
            const decoded = dcnet.pb.ThreadIDReply.decode(responseData);
            return uint8ArrayToString(decoded.threadID);
        } catch (err) {
            console.error("RequestThreadID error:", err);
            throw err;
        }
    }

    async CreateThread(tid: string, sk: ThreadKey, logKey: PublicKey | PrivateKey, blockheight: number, signature: Uint8Array): Promise<string> {
        try {
     
            if (this.grpcClient.node == null || this.grpcClient.node.peerId == null) {
                throw new Error("p2pNode is null or node privateKey is null");
            }
            const serverPeerId = this.grpcClient.node.peerId;
            const sPubkey = await extractPublicKeyFromPeerId(serverPeerId);
            
            const message = new dcnet.pb.CreateThreadRequest({});
            message.threadID = new TextEncoder().encode(tid);
            message.keys = await this.getThreadKeys(sPubkey, { threadKey: sk, logKey: logKey });
            message.blockheight = blockheight;
            message.signature = signature;
            const messageBytes = dcnet.pb.CreateThreadRequest.encode(message).finish();
            const responseData = await this.grpcClient.unaryCall(
                "/dcnet.pb.Service/CreateThread",
                messageBytes,
                30000
            );
            const decoded = dcnet.pb.ThreadInfoReply.decode(responseData);
            return uint8ArrayToString(decoded.threadID);
        } catch (err) {
            console.error("CreateThread error:", err);
            throw err;
        }
    }


}

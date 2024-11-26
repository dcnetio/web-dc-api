     
import type { Libp2p } from 'libp2p'
import type {Multiaddr} from '@multiformats/multiaddr'
import { dcnet } from './proto/dcnet_proto'
import { base58btc } from 'multiformats/bases/base58'
import { Libp2pGrpcClient } from 'grpc-libp2p-client';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string' 
import { DataSource } from './proto/datasource' 

export class DCGrpcClient {
    grpcClient: Libp2pGrpcClient;
    stream : any;
    token: string;

    constructor(node:Libp2p,peerAddr:Multiaddr,token:string,protocol?:string) {
        this.grpcClient = new Libp2pGrpcClient(node,peerAddr,token,protocol)
        this.token = token
    }  


    async getHostID(): Promise<{peerID:string,reqAddr:string}> {
        try {
            const message = new dcnet.pb.GetHostIDRequest({})
            const messageBytes = dcnet.pb.GetHostIDRequest.encode(message).finish()  
            const responseData = await this.grpcClient.unaryCall('/dcnet.pb.Service/GetHostID',messageBytes,30000)
            const decoded = dcnet.pb.GetHostIDReply.decode(responseData);  
            const encodedPeerid = base58btc.encode(decoded.peerID) 
            const encodedReqAddr =uint8ArrayToString(decoded.reqAddr)
            const reply = {
                peerID: encodedPeerid,
                reqAddr: encodedReqAddr
            }
            return reply
        } catch (err) {
            console.error('getHostID error:', err)
            throw err
        }
    }

    async GetCacheValue(key:string): Promise<string> {
        try {
            const message = new dcnet.pb.GetCacheValueRequest({})
            message.key = new TextEncoder().encode(key)
            const messageBytes = dcnet.pb.GetCacheValueRequest.encode(message).finish()  
            const responseData = await this.grpcClient.unaryCall('/dcnet.pb.Service/GetCacheValue',messageBytes,30000)
            const decoded = dcnet.pb.GetCacheValueReply.decode(responseData);  
            const encodedValue =uint8ArrayToString(decoded.value)
            return encodedValue
        } catch (err) {
            console.error('GetCacheValue error:', err)
            throw err
        }
    }


    async GetToken(pubkey:string, signCallback: (payload: Uint8Array) => Uint8Array ): Promise<string> {
        let token:string = ''
        try {
            const signatureDataSource = new DataSource();  
            const message = new dcnet.pb.GetTokenRequest({})
            message.key = "testapp_"+pubkey
            const messageBytes = dcnet.pb.GetTokenRequest.encode(message).finish()  
            const onDataCallback = async (payload:Uint8Array) => {
                const decodedPayload = dcnet.pb.GetTokenReply.decode(payload);
                if (decodedPayload.challenge) {
                    const challenge = decodedPayload.challenge;
                    const signature = signCallback(challenge);
                    const message = new dcnet.pb.GetTokenRequest({})
                    message.signature = signature
                    const messageBytes = dcnet.pb.GetTokenRequest.encode(message).finish()
                    signatureDataSource.setData(messageBytes);
                } else if (decodedPayload.token) {//获取到token
                    console.log('GetToken success:',decodedPayload.token)
                    token = decodedPayload.token
                    signatureDataSource.close()//关闭数据源
                }
                console.log('onDataCallback:',payload)
            }
            // 使用方法  
            const dataSourceCallback = (): AsyncIterable<Uint8Array> => {  
                console.log('dataSourceCallback');  
                return signatureDataSource.getDataSource();  
            }; 
            await this.grpcClient.Call('/dcnet.pb.Service/GetToken',messageBytes,30000,"bidirectional",onDataCallback,dataSourceCallback)
            this.token = token
            this.grpcClient.setToken(token)
            return token
        } catch (err) {
            console.error('GetToken error:', err)
            throw err
        }
    }



    async AccountLogin(accounthashencrypt: Uint8Array,  pubkeyencrypt: Uint8Array, loginkeyrandencrypt: Uint8Array ): Promise<Uint8Array> {
        try {
            const message = new dcnet.pb.AccountLoginRequest({})
            message.accounthashencrypt = accounthashencrypt
            message.pubkeyencrypt = pubkeyencrypt
            message.loginkeyrandencrypt = loginkeyrandencrypt
            const messageBytes = dcnet.pb.AccountLoginRequest.encode(message).finish()  
            const responseData = await this.grpcClient.unaryCall('/dcnet.pb.Service/AccountLogin',messageBytes,30000)
            const decoded = dcnet.pb.AccountLoginReply.decode(responseData);  
            const prikeyencrypt2 = decoded.prikeyencrypt2
            return prikeyencrypt2
        } catch (err) {
            console.error('AccountLogin error:', err)
            throw err
        }
    }

    async SetCacheKey(value:string,blockheight:number,expire:number,signature:Uint8Array): Promise<string> {
        try {
            const message = new dcnet.pb.SetCacheKeyRequest({})
            message.value = new TextEncoder().encode(value)
            message.blockheight = blockheight
            message.expire = expire
            message.signature = signature
            const messageBytes = dcnet.pb.SetCacheKeyRequest.encode(message).finish()  
            const reply = await this.grpcClient.unaryCall('/dcnet.pb.Service/SetCacheKey',messageBytes,30000)
            const decoded = dcnet.pb.SetCacheKeyReply.decode(reply)
            if (decoded.flag !== 0) {
                throw new Error('SetCacheKey failed,flag: '+decoded.flag)
            }
            const result = uint8ArrayToString(decoded.cacheKey)
            return result
        } catch (err) {
            console.error('SetCacheKey error:', err)
            throw err
        }
    }

}

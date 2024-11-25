import { HPACK } from './hpack'
import type {Byte,Frame,FrameSettingPayload} from './types'
import {FrameEncoder} from './encoder'

const  SETTINGS_PARAMETERS = {  
    HEADER_TABLE_SIZE: 0x1,  
    ENABLE_PUSH: 0x2,  
    MAX_CONCURRENT_STREAMS: 0x3,  
    INITIAL_WINDOW_SIZE: 0x4,  
    MAX_FRAME_SIZE: 0x5,  
    MAX_HEADER_LIST_SIZE: 0x6  
}; 

const defaultSettings = {
    [SETTINGS_PARAMETERS.HEADER_TABLE_SIZE]: 4096,  
    [SETTINGS_PARAMETERS.ENABLE_PUSH]: 1,  
    [SETTINGS_PARAMETERS.MAX_CONCURRENT_STREAMS]: 100,  
    [SETTINGS_PARAMETERS.INITIAL_WINDOW_SIZE]: 65535,  
    [SETTINGS_PARAMETERS.MAX_FRAME_SIZE]: 4 * 1024 * 1024,  
    [SETTINGS_PARAMETERS.MAX_HEADER_LIST_SIZE]: 8192  
}; 

const HTTP2_PREFACE = 'PRI * HTTP/2.0\r\n\r\nSM\r\n\r\n'

export class Http2Frame {

     

    // 创建并编码PREFACE帧
    static createPreface():Uint8Array {  
        return new TextEncoder().encode(HTTP2_PREFACE);  
    }

    // 创建并编码SETTINGS帧  
    static createSettingsFrame(settings = {}) {  
        // 先创建帧对象  
        const frame = Http2Frame.createOriginSettingsFrame(settings);
        // 然后编码  
        return FrameEncoder.encodeSettingsFrame(frame);  
    } 
     // 创建并编码SETTINGS ACK帧  
    static createSettingsAckFrame() {  
        return FrameEncoder.encodeSettingsAckFrame();  
    }  

   static createDataFrame( streamId:number,data:Uint8Array,endStream:boolean = true):Uint8Array {  
        // gRPC 消息格式: 压缩标志(1字节) + 消息长度(4字节) + 消息内容  
        const messageLen = data.length  
        const framedData = new Uint8Array(5+messageLen)  
        
        // Compression flag (0 = 不压缩)  
        framedData[0] = 0  
        
        // Message length (4 bytes)  
        framedData[1] = (messageLen >> 24) & 0xFF  
        framedData[2] = (messageLen >> 16) & 0xFF  
        framedData[3] = (messageLen >> 8) & 0xFF  
        framedData[4] = messageLen & 0xFF  
        
        // Message content  
        framedData.set(data, 5)  

        const flags = endStream ? 0x1 : 0x0 // END_STREAM flag  
        return Http2Frame.createFrame(0x0, flags, streamId, framedData)  
    }  

    static createHeadersFrame(streamId:number,path:string, endHeaders:boolean = true):Uint8Array {  
        // gRPC-Web 需要的标准 headers  
        const headersList = {  
            ':path': path,  
            ':method': 'POST',  
            ':scheme': 'http',  
            ':authority': 'localhost',  
            'content-type': 'application/grpc+proto',  
            'user-agent': 'grpc-web-client/0.1',  
            'accept': 'application/grpc+proto',  
            'grpc-timeout': '20S'  
        };  
        // 将 headers 编码为 HPACK 格式  
        const hpack = new HPACK();
        const encodedHeaders = hpack.encode(headersList);
        console.log('Encoded:', encodedHeaders);
        // HEADERS frame flags: END_HEADERS | END_STREAM  
        const flags = endHeaders ? 0x04 : 0x00  
        return Http2Frame.createFrame(0x01, flags, streamId, encodedHeaders)  
    }  

  

    // 创建 SETTINGS 帧  
    static createOriginSettingsFrame(settings = {}):Frame {  
        // 验证设置值  
        _validateSettings(settings);  
        // 合并默认值和用户提供的设置  
        const finalSettings = { ...defaultSettings, ...settings };  
        // 创建帧  
        const frame = {  
            type: 0x4, // SETTINGS frame type  
            flags: 0x0, // 无标志  
            streamId: 0, // SETTINGS 总是在 stream 0 上发送  
            payload: _createPayload(finalSettings)  
        };  
        return frame;  
    }  

    // 创建确认帧（SETTINGS ACK）  
    static createOriginSettingsAckFrame() {  
        return {  
            type: 0x4, // SETTINGS frame type  
            flags: 0x1, // ACK flag  
            streamId: 0,  
            payload: [] // ACK 帧没有payload  
        };  
    }  

    static createFrame(type:Byte, flags:Byte, streamId:number, payload:Uint8Array):Uint8Array {  
        const length = payload ? payload.length : 0  
        const frame = new Uint8Array(9 + length) // 9 bytes for header + payload  

        // Length (24 bits)  
        frame[0] = (length >> 16) & 0xFF  
        frame[1] = (length >> 8) & 0xFF  
        frame[2] = length & 0xFF  
        
        // Type (8 bits)  
        frame[3] = type  
        
        // Flags (8 bits)  
        frame[4] = flags  
        
        // Stream Identifier (32 bits)  
        frame[5] = (streamId >> 24) & 0xFF  
        frame[6] = (streamId >> 16) & 0xFF  
        frame[7] = (streamId >> 8) & 0xFF  
        frame[8] = streamId & 0xFF  

        if (payload && length > 0) {  
            frame.set(payload, 9)  
        }  
        return frame  
    }  
}

 // 验证设置值  
 function _validateSettings(settings: { [key: Byte]: number }) {  
    for (const [id, value] of Object.entries(settings)) {  
        switch (Number(id)) {  
            case SETTINGS_PARAMETERS.HEADER_TABLE_SIZE:  
                if (value < 0) {  
                    throw new Error('HEADER_TABLE_SIZE must be non-negative');  
                }  
                break;  

            case SETTINGS_PARAMETERS.ENABLE_PUSH:  
                if (value !== 0 && value !== 1) {  
                    throw new Error('ENABLE_PUSH must be 0 or 1');  
                }  
                break;  

            case SETTINGS_PARAMETERS.INITIAL_WINDOW_SIZE:  
                if (value < 0 || value > 2147483647) { // 2^31 - 1  
                    throw new Error('INITIAL_WINDOW_SIZE must be between 0 and 2^31-1');  
                }  
                break;  

            case SETTINGS_PARAMETERS.MAX_FRAME_SIZE:  
                if (value < 16384 || value > 16777215) { // 2^14 to 2^24-1  
                    throw new Error('MAX_FRAME_SIZE must be between 16,384 and 16,777,215');  
                }  
                break;  

            case SETTINGS_PARAMETERS.MAX_CONCURRENT_STREAMS:  
            case SETTINGS_PARAMETERS.MAX_HEADER_LIST_SIZE:  
                if (value < 0) {  
                    throw new Error(`Parameter ${id} must be non-negative`);  
                }  
                break;  

            default:  
                console.warn(`Unknown settings parameter: ${id}`);  
        }  
    }  
}  

// 创建payload  
 function _createPayload(settings: { [key: Byte]: number }) {  
    const payload: FrameSettingPayload = [];  
    for (const [id, value] of Object.entries(settings)) {  
        payload.push({  
            identifier: Number(id),  
            value: value  
        });  
    }  
    return payload;  
}  
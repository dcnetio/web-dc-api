import type { FrameHeader,Frame,FrameSettingPayload } from './types';


class FrameEncoder {  
    // 编码SETTINGS帧  
   static encodeSettingsFrame(frame:Frame):Uint8Array {  
       // 计算payload总长度：每个设置项占6字节  
       const payloadLength = frame.payload.length * 6;  
       // 分配缓冲区：9字节头部 + payload长度  
       const buffer = new Uint8Array(9 + payloadLength); 
       // 编码帧头部（前9个字节）  
       _encodeFrameHeader(buffer, {  
           length: payloadLength,  
           type: frame.type,  
           flags: frame.flags,  
           streamId: frame.streamId  
       });  
       // 编码payload  
       _encodeSettingsPayload(buffer, frame.payload);  
       return buffer;  
   }  
    // 编码SETTINGS ACK帧  
   static encodeSettingsAckFrame():Uint8Array {  
       const buffer = new Uint8Array(9); // ACK帧只有头部  
       _encodeFrameHeader(buffer, {  
           length: 0,  
           type: 0x4, // SETTINGS  
           flags: 0x1, // ACK  
           streamId: 0  
       });  
       return buffer;  
   }  
}  

// 编码帧头部（9字节）  
function _encodeFrameHeader(buffer:Uint8Array, header:FrameHeader) {  
    // Length: 3 bytes  
    const length = header.length ?? 0;
    buffer[0] = (length >> 16) & 0xFF;  
    buffer[1] = (length >> 8) & 0xFF;  
    buffer[2] = length & 0xFF;  
    // Type: 1 byte  
    buffer[3] = header.type;  
    // Flags: 1 byte  
    buffer[4] = header.flags;  
    // Stream Identifier: 4 bytes  
    _writeUInt32BE(buffer, header.streamId & 0x7FFFFFFF, 5);  
}  

// 编码SETTINGS payload  
function _encodeSettingsPayload(buffer:Uint8Array, payload:FrameSettingPayload) {  
    let offset = 9; // 从第9个字节开始  
    payload.forEach(setting => {  
        // 写入2字节的标识符  
        _writeUInt16BE(buffer, setting.identifier, offset);  
        offset += 2;  
        // 写入4字节的值  
        _writeUInt32BE(buffer, setting.value, offset);  
        offset += 4;  
    });  
}  

// 写入16位无符号整数（大端序）  
function _writeUInt16BE(buffer:Uint8Array, value:number, offset:number ) {  
    buffer[offset] = (value >> 8) & 0xFF;  
    buffer[offset + 1] = value & 0xFF;  
}  

// 写入32位无符号整数（大端序）  
function _writeUInt32BE(buffer:Uint8Array, value:number, offset:number) {  
    buffer[offset] = (value >> 24) & 0xFF;  
    buffer[offset + 1] = (value >> 16) & 0xFF;  
    buffer[offset + 2] = (value >> 8) & 0xFF;  
    buffer[offset + 3] = value & 0xFF;  
} 



export {FrameEncoder};
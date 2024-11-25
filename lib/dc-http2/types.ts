type Byte = Uint8Array[1] 
type FrameHeader = {
    length?: number;
    type: Byte;
    flags: Byte;
    streamId: number;
}
type Frame = {
    length?: number;
    type: Byte;
    flags: Byte;
    streamId: number;
    payload?: any;
}

type FrameSettingPayload = { identifier: number; value: number }[]


const FRAME_TYPES = {  
    DATA: 0x0,            // 传输 HTTP 消息的主体  
    HEADERS: 0x1,         // 压缩的 HTTP 头部  
    PRIORITY: 0x2,        // 指定流的优先级  
    RST_STREAM: 0x3,      // 终止流  
    SETTINGS: 0x4,        // 设置连接参数  
    PUSH_PROMISE: 0x5,    // 服务器推送承诺  
    PING: 0x6,           // 测量RTT和活性检查  
    GOAWAY: 0x7,         // 优雅地关闭连接  
    WINDOW_UPDATE: 0x8,   // 流量控制  
    CONTINUATION: 0x9     // 头部块片段的延续  
} as const;

const FRAME_FLAGS = {  
    ACK: 0x1,  
    END_STREAM: 0x1,  
    END_HEADERS: 0x4  
};  


export type { Byte,FrameHeader, Frame,FrameSettingPayload }
export { FRAME_TYPES, FRAME_FLAGS }
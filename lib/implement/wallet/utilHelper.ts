/**
 * 工具
 */
function _hexToUint8Array(hex:string) {  
  // 如果十六进制字符串以 "0x" 开头，则去掉这个前缀  
  if (hex.startsWith("0x")) {  
      hex = hex.slice(2);  
  }  

  // 确保十六进制字符串长度是偶数  
  if (hex.length % 2 !== 0) {  
      throw new Error("Invalid hex string");  
  }  

  // 创建 Uint8Array  
  const byteArray = new Uint8Array(hex.length / 2);  

  // 遍历十六进制字符串，每两个字符转换为一个字节  
  for (let i = 0; i < hex.length; i += 2) {  
      const byte = hex.substr(i, 2);  
      byteArray[i / 2] = parseInt(byte, 16);  
  }  

  return byteArray;  
}  


const utilHelper = {
    hexToUint8Array: _hexToUint8Array,
    };

export default utilHelper;
  

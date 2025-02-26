import { User } from "../types/types";

// SHA-256 哈希计算
async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hashBuffer);
}

// 生成随机字节
function getRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

// 连接 Uint8Array
function concatenateUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

// Helper 函数：将 Uint32 转换为小端 Uint8Array
function uint32ToLittleEndianBytes(value: number): Uint8Array {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setUint32(0, value, true); // true 表示小端
  return new Uint8Array(buffer);
}
function isUser(obj: any): obj is User {
  // implement checks for required properties here
  return true; // or false if the object doesn't conform to User
}



// 比较两个字节数组是否相等
function compareByteArrays(array1: Uint8Array, array2: Uint8Array) {
  if (array1.byteLength != array2.byteLength) {
    return false;
  }
  const view1 = new DataView(array1.buffer, array1.byteOffset);
  const view2 = new DataView(array2.buffer, array2.byteOffset);
  for (let i = 0; i < array1.length; i++) {
    if (view1.getUint8(i) !== view2.getUint8(i)) {
      return false;
    }
  }
  return true;
}

function mergeUInt8Arrays(a1: Uint8Array, a2: Uint8Array): Uint8Array {
  // sum of individual array lengths
  const mergedArray = new Uint8Array(a1.length + a2.length);
  mergedArray.set(a1);
  mergedArray.set(a2, a1.length);
  return mergedArray;
}


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); 
export {
  sha256,
  getRandomBytes,
  concatenateUint8Arrays,
  uint32ToLittleEndianBytes,
  isUser,
  compareByteArrays,
  mergeUInt8Arrays,
  sleep,
};

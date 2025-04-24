import { CID } from 'multiformats/cid';
import * as dagCBOR from '@ipld/dag-cbor';

import { dagCbor } from '@helia/dag-cbor'
import { sha256 } from 'multiformats/hashes/sha2';
import CID_IPLD from 'cids';
import { Link } from 'multiformats/link'
import { IBlock } from '../core/core';
// 常量定义 - CBOR Tag for links
const CBORTagLink = 42;

// 错误定义
const Errors = {
  ErrNoSuchLink: new Error('no such link found'),
  ErrNonLink: new Error('non-link found at given path'),
  ErrInvalidLink: new Error('link value should have been bytes'),
  ErrInvalidKeys: new Error('map keys must be strings'),
  ErrArrayOutOfRange: new Error('array index out of range'),
  ErrNoLinks: new Error('tried to resolve through object that had no links'),
  ErrEmptyLink: new Error('link value was empty'),
  ErrInvalidMultibase: new Error('invalid multibase on IPLD link'),
  ErrNonStringLink: new Error('link should have been a string')
};



export class Block {
     _data: Uint8Array;
     _cid: CID;
  
    constructor(data: Uint8Array, cid: CID) {
      this._data = data;
      this._cid = cid;
    }
  
    data(): Uint8Array {
      return this._data;
    }
  
    cid(): CID {
      return this._cid;
    }
}
// // Link 接口定义
// export interface Link {
//   name?: string;
//   size?: number;
//   cid: CID;
// }

// NodeStat 接口定义
interface NodeStat {
  cumulativeSize?: number;
  blocks?: number;
  size?: number;
}

// Node 类
export class Node {
  private _obj: any;
  private _tree: string[];
  private _links: Link[];
  private _raw: Uint8Array;
  private _cid: CID;

  constructor(obj: any, tree: string[], links: Link[], raw: Uint8Array, cid: CID) {
    this._obj = obj;
    this._tree = tree;
    this._links = links;
    this._raw = raw;
    this._cid = cid;
  }

  // 解析路径并返回找到的对象
  resolve(path: string[]): [any, string[] | null, Error | null] {
    let cur: any = this._obj;
    
    for (let i = 0; i < path.length; i++) {
      const val = path[i];
      
      if (typeof cur === 'object' && cur !== null) {
        if (Array.isArray(cur)) {
          const n = parseInt(val);
          if (isNaN(n)) {
            return [null, null, new Error('array index was not a number')];
          }
          
          if (n < 0 || n >= cur.length) {
            return [null, null, Errors.ErrArrayOutOfRange];
          }
          
          cur = cur[n];
        } else if (isCID(cur)) {
          return [{ cid: cur }, path.slice(i), null];
        } else {
          const next = cur[val];
          if (next === undefined) {
            return [null, null, Errors.ErrNoSuchLink];
          }
          
          cur = next;
        }
      } else {
        return [null, null, Errors.ErrNoLinks];
      }
    }
    
    if (isCID(cur)) {
      return [{ cid: cur }, null, null];
    }
    
    try {
      const jsonish = this.convertToJSONIsh(cur);
      return [jsonish, null, null];
    } catch (err) {
      return [null, null, err as Error];
    }
  }

  // 解析路径并返回链接
  resolveLink(path: string[]): [Link | null, string[] | null, Error | null] {
    try {
      const [obj, rest, err] = this.resolve(path);
      if (err) {
        return [null, null, err];
      }
      
      if (!obj || !obj.cid || !isCID(obj.cid)) {
        return [null, rest, Errors.ErrNonLink];
      }
      
      return [obj as Link, rest, null];
    } catch (err) {
      return [null, null, err as Error];
    }
  }

  // 返回指定路径和深度的树
  tree(path: string, depth: number): string[] {
    if (path === '' && depth === -1) {
      return [...this._tree]; // Return a copy
    }
    
    const out: string[] = [];
    for (const t of this._tree) {
      if (!t.startsWith(path)) {
        continue;
      }
      
      const sub = t.substring(path.length).replace(/^\/+/, '');
      if (sub === '') {
        continue;
      }
      
      if (depth < 0) {
        out.push(sub);
        continue;
      }
      
      const parts = sub.split('/');
      if (parts.length <= depth) {
        out.push(sub);
      }
    }
    
    return out;
  }

  // 返回节点的所有链接
  links(): Link[] {
    return [...this._links]; // Return a copy
  }

  // 返回节点的原始数据
  rawData(): Uint8Array {
    return new Uint8Array(this._raw); // Return a copy
  }

  // 返回节点的原始数据,兼容IBlock
  data(): Uint8Array {
    return new Uint8Array(this._raw); // Return a copy
  }
  // 返回节点的 CID
  cid(): CID {
    return this._cid;
  }

  // 返回可记录的节点表示
  loggable(): Record<string, any> {
    return {
      node_type: 'cbor',
      cid: this.cid.toString(),
    };
  }

  // 返回节点的大小
  size(): number {
    return this._raw.length;
  }

  // 返回节点的统计信息
  stat(): NodeStat {
    return {};
  }

  // 返回节点的 CID 字符串表示
  toString(): string {
    return this.cid.toString();
  }

  // 转换为 JSON
  toJSON(): any {
    return this.convertToJSONIsh(this._obj);
  }

  // 创建节点的副本
  copy(): Node {
    const links = [...this._links];
    const raw = new Uint8Array(this._raw);
    const tree = [...this._tree];
    
    return new Node(
      this.copyObj(this._obj),
      tree,
      links,
      raw,
      this._cid
    );
  }

  // 深拷贝对象
  private copyObj(i: any): any {
    if (i === null || i === undefined) {
      return i;
    }
    
    if (Array.isArray(i)) {
      return i.map(v => this.copyObj(v));
    }
    
    if (typeof i === 'object') {
      if (isCID(i)) {
        return i;
      }
      
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(i)) {
        out[k] = this.copyObj(v);
      }
      return out;
    }
    
    return i; // 原始值直接返回
  }

  // 转换为 JSON 兼容格式
  private convertToJSONIsh(v: any): any {
    if (v === null || v === undefined) {
      return v;
    }
    
    if (Array.isArray(v)) {
      if (v.length === 0) {
        return [];
      }
      
      return v.map(i => this.convertToJSONIsh(i));
    }
    
    if (typeof v === 'object') {
      if (isCID(v)) {
        return { '/': v.toString() };
      }
      
      const out: Record<string, any> = {};
      for (const [k, val] of Object.entries(v)) {
        out[k] = this.convertToJSONIsh(val);
      }
      return out;
    }
    
    return v; // 原始值直接返回
  }
}

// 从 Block 解码节点
export async function decodeBlock(block: Block): Promise<Node> {
  try {
    const obj = dagCBOR.decode(block.data());
    return await newObject(block, obj);
  } catch (err) {
    throw new Error(`Failed to decode block: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// 从原始数据解码节点
export async function decode(data: Uint8Array, hashAlg: string = 'sha2-256'): Promise<Node> {
  const obj = dagCBOR.decode(data);  
  return await wrapObject(obj);
  // try {
  //     let canonicalData: Uint8Array = data;
  //     let obj: any;
  //     try {
  //        obj = dagCBOR.decode(data);
  //        // 重新编码确保规范化
  //        canonicalData = dagCBOR.encode(obj);
  //     } catch (err) {
        
  //     }
        
  //       // 创建 CID
  //       const hash = await sha256.digest(canonicalData);
  //       const cid = CID.createV1(dagCBOR.code, hash);
  //       const oldCid = new CID_IPLD(cid.toString());
        
  //       // 创建自定义Block对象
  //       const block = new Block(
  //         canonicalData,
  //         cid
  //       )
  //       return await newObject(block, obj);
  //     } catch (err) {
  //       throw new Error(`Failed to decode data: ${err instanceof Error ? err.message : String(err)}`);
  //     }
}
export async function  wrapObject(obj: any): Promise<Node> {
  try {
    // 编码对象
    const data = dagCBOR.encode(obj);
    
    // 创建 CID
    const hash = await sha256.digest(data);
    const cid = CID.createV1(dagCBOR.code, hash);
    
    // 创建块
    const block = new Block(data, cid);
    
    // 创建兼容 Uint8Array 的深拷贝
    const clone = structuredClone(obj) || deepCopyWithTypedArrays(obj);
    
    return await newObject(block, clone);
  } catch (err) {
    throw new Error(`Failed to wrap object: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// 兼容性深拷贝函数
function deepCopyWithTypedArrays(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // 区分处理 ArrayBuffer 和 ArrayBufferView
  if (obj instanceof ArrayBuffer) {
    // ArrayBuffer 直接创建新副本
    return new Uint8Array(obj).buffer;
  }
  
  // 处理 TypedArrays (ArrayBufferView)
  if (ArrayBuffer.isView(obj)) {
    // 从视图创建新副本
    return new Uint8Array(obj.buffer, obj.byteOffset, obj.byteLength);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepCopyWithTypedArrays(item));
  }
  
  if (typeof obj === 'object' && !isCID(obj)) {
    const copy: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      copy[key] = deepCopyWithTypedArrays(value);
    }
    return copy;
  }
  
  // 原始值、CID 直接返回
  return obj;
}
// 从 JSON 创建节点
export async function fromJSON(json: any): Promise<Node> {
  try {
    // 将 JSON 转换为 CBOR 兼容对象
    const obj = await convertToCborIshObj(json);
    
    // 包装对象
    return await wrapObject(obj);
  } catch (err) {
    throw new Error(`Failed to convert from JSON: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// 创建新的节点对象
async function newObject(block: IBlock, obj: any): Promise<Node> {
  try {
    const [tree, links] = await compute(obj);
    return new Node(
      obj,
      tree,
      links,
      block.data(),
      block.cid()
    );
  } catch (err) {
    throw new Error(`Failed to create node: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// 计算对象的树和链接
async function compute(obj: any): Promise<[string[], Link[]]> {
  const tree: string[] = [];
  const links: Link[] = [];
  
  await traverse(obj, '', (name, val) => {
    if (name !== '') {
      tree.push(name.substring(1)); // 去除开头的 /
    }
    if (val && isCID(val)) {
      links.push(val);
    }
    return null;
  });
  
  return [tree, links];
}

// 遍历对象
async function traverse(
  obj: any, 
  cur: string, 
  cb: (path: string, val: any) => Error | null
): Promise<void> {
  const err = cb(cur, obj);
  if (err) throw err;
  
  if (obj === null || obj === undefined) {
    return;
  }
  
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const path = `${cur}/${i}`;
      await traverse(obj[i], path, cb);
    }
    return;
  }
  
  if (typeof obj === 'object' && !isCID(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      const path = `${cur}/${k}`;
      await traverse(v, path, cb);
    }
  }
}

// 将 JSON 对象转换为 CBOR 兼容对象
async function convertToCborIshObj(obj: any): Promise<any> {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return [];
        }

        // 添加类型注解解决 'never' 错误
        const out: any[] = [];
        for (const item of obj) {
            out.push(await convertToCborIshObj(item));
        }
        return out;
    }
  
  if (typeof obj === 'object') {
    // 处理 CID 链接
    if (obj['/'] !== undefined && Object.keys(obj).length === 1) {
      if (typeof obj['/'] !== 'string') {
        throw Errors.ErrNonStringLink;
      }
      
      try {
        return CID.parse(obj['/']);
      } catch (err) {
        throw new Error(`Invalid CID string: ${obj['/']}`);
      }
    }
    
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = await convertToCborIshObj(v);
    }
    return out;
  }
  
  return obj; // 原始值直接返回
}

/**
 * 将字节数组转换为 CID
 * @param x 字节数组
 * @returns 转换后的 CID
 */
export function castBytesToCid(x: Uint8Array): CID {
  if (x.length === 0) {
    throw Errors.ErrEmptyLink;
  }
  
  // 检查多重基编码
  if (x[0] !== 0) {
    throw Errors.ErrInvalidMultibase;
  }
  
  try {
    return CID.decode(x.slice(1));
  } catch (err) {
    throw Errors.ErrInvalidLink;
  }
}

/**
 * 将 CID 转换为字节数组
 * @param link CID
 * @returns 转换后的字节数组
 */
export function castCidToBytes(link: CID): Uint8Array {
  if (!link) {
    throw Errors.ErrEmptyLink;
  }
  
  const bytes = link.bytes;
  const result = new Uint8Array(bytes.length + 1);
  result[0] = 0;  // 多重基编码前缀
  result.set(bytes, 1);
  
  return result;
}

function isCID(value: any): boolean {
    return CID.asCID(value) !== null;
  }


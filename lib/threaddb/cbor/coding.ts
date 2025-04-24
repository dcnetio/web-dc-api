
import { SymmetricKey } from '../common/key'
import {Node} from './node';  
import * as cbornode from './node';
import { IBlock } from '../core/core';
import * as dagCBOR from '@ipld/dag-cbor';




/**
 * Encrypts a block's raw data with the given key and wraps it as a DAG-CBOR node
 * 
 * @param block - The block to encode
 * @param key - The encryption key
 * @returns Promise resolving to a Node
 */
export async function encodeBlock(block: IBlock, key: SymmetricKey): Promise<Node> {
    // Encrypt the block's raw data using the provided key
    const coded =  key.encrypt(block.data());
    return cbornode.wrapObject(coded);
  
}

/**
 * Decrypts a block's raw data with the given key and returns a DAG node
 * 
 * @param block - The block to decode
 * @param key - The decryption key
 * @returns Promise resolving to a Node
 */
export async function decodeBlock(block: any, key?: SymmetricKey): Promise<Node> {
    let obj  = block
    if (typeof block.data === 'function') {  
        obj = dagCBOR.decode(block.data());
    }else {
        try {
            obj = dagCBOR.decode(block);
        } catch (e) {
            obj = block;
        }
    }
    let encryptData :Uint8Array;
    if (obj instanceof Uint8Array) {
        encryptData = obj;
    } else {
        try {
            encryptData = dagCBOR.decode(obj._data);
        } catch (e) {
            encryptData = obj._data;
        }
    }
    let decrptData  = encryptData;
    // Decrypt the data using the provided key
    if (key) {
        decrptData =  await key.decrypt(encryptData);
    }
    return cbornode.decode(decrptData);
}




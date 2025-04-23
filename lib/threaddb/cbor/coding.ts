
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
export async function decodeBlock(block: IBlock, key: SymmetricKey): Promise<Node> {
    const obj = dagCBOR.decode(block.data()) as any;
    let encodedData :Uint8Array;
    if (obj instanceof Uint8Array) {
        encodedData = obj;

    } else {
        encodedData = dagCBOR.decode(obj._data);
    }
    // Decrypt the data using the provided key
    const decoded =  await key.decrypt(encodedData);
    return cbornode.decode(decoded);
}




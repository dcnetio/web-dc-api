
import { SymmetricKey } from '../common/key'
import {Node} from './node';  
import * as cbornode from './node';
import { IBlock } from '../core/core';



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
  
    // Decrypt the data using the provided key
    const decoded =  await key.decrypt(block.data());
    return cbornode.wrapObject(decoded);

   
}



/**
 * Decrypts a block's raw data with the given key and returns a DAG node
 * 
 * @param block - The block to decode
 * @param key - The decryption key
 * @returns Promise resolving to a Node
 */
export async function decodeBlock1(block: IBlock, key: SymmetricKey): Promise<Node> {
  
    // Decrypt the data using the provided key
    const decoded =  await key.decrypt(block.data());
    return cbornode.wrapObject(decoded);

   
}
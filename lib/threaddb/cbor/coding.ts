import { Ed25519PubKey,Ed25519PrivKey} from "../../dc-key/ed25519";
import { DAGNode } from 'ipld-dag-pb';
import { CID } from 'multiformats/cid';
import Block from 'ipld-block';  
import {encode,decode} from '@ipld/dag-cbor';
import {} from 'ipfs-core'
// EncodeBlock returns a node by encrypting the block's raw bytes with key.
export async function encodeBlock(block: Block, key: Ed25519PubKey): Promise<DAGNode> {
	const coded = key.encrypt(block.data);
	const encoded =  encode(coded);
	return CID.create(1, 'dag-cbor', await crypto.createHash('sha256').update(encoded).digest());
}

// DecodeBlock returns a node by decrypting the block's raw bytes with key.
export async function decodeBlock(block: Block, key: Ed25519PrivKey): Promise<Buffer> {
	const raw = await decode(block.data);
	const decoded = key.decrypt(raw);
	return cbor.decodeFirst(decoded);
}

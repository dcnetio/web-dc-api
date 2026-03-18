import * as dagCBOR from "@ipld/dag-cbor";
import { CID } from "multiformats/cid";
const body = CID.parse('bafybeigdyrxgvtdk54y3q6mdptv3w2xey5gxyc7m5mdn2h75i7z54u3hyy');
const head = CID.parse('bafybeigdyrxgvtdk54y3q6mdptv3w2xey5gxyc7m5mdn2h75i7z54u3hyy');
const obj = { body: body, header: head };
const encoded = dagCBOR.encode(obj);
const decoded = dagCBOR.decode(encoded);
console.log("decoded:", typeof decoded, decoded);

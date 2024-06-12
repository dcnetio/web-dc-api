/* global crypto */
import CryptoJS from 'crypto-js';
import { from } from './hasher.js';

function sha256hash(data) {
    return new Uint8Array(CryptoJS.SHA256(CryptoJS.lib.WordArray.create(data)).words.map(word => [
        (word >> 24) & 0xFF,
        (word >> 16) & 0xFF,
        (word >> 8) & 0xFF,
        word & 0xFF
    ]).flat())
}

function sha512hash(data) {
    return new Uint8Array(CryptoJS.SHA512(CryptoJS.lib.WordArray.create(data)).words.map(word => [
        (word >> 24) & 0xFF,
        (word >> 16) & 0xFF,
        (word >> 8) & 0xFF,
        word & 0xFF
    ]).flat())
}

export const sha256 = from({
    name: 'sha2-256',
    code: 0x12,
    encode: sha256hash
})

export const sha512 = from({
    name: 'sha2-512',
    code: 0x13,
    encode: sha512hash
})


//# sourceMappingURL=sha2-browser.js.map
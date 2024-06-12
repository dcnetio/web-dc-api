/* global crypto */
import { from } from './hasher.js'
import CryptoJS from 'crypto-js'

// 检查是否存在crypto.subtle.digest，如果存在使用它，否则使用crypto-js
const sha = (name) => {
    if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
        return async (data) => new Uint8Array(await crypto.subtle.digest(name, data))
    } else {
        return async (data) => {
            const words = CryptoJS.lib.WordArray.create(data)
            let hash
            if (name === 'SHA-1') {
                hash = CryptoJS.SHA1(words)
            }
            // 这里可以进一步添加其它算法的支持
            const hashArray = new Uint8Array(hash.words.length * 4)
            for (let i = 0; i < hash.words.length; i++) {
                const word = hash.words[i]
                hashArray[i * 4] = (word >> 24) & 0xff
                hashArray[i * 4 + 1] = (word >> 16) & 0xff
                hashArray[i * 4 + 2] = (word >> 8) & 0xff
                hashArray[i * 4 + 3] = word & 0xff
            }
            return hashArray
        }
    }
}

export const sha1 = from({
    name: 'sha-1',
    code: 0x11,
    encode: sha('SHA-1')
})
//# sourceMappingURL=sha1-browser.js.map
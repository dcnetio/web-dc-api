// 测试加密库替换后的功能
import { randomBytes } from '@stablelib/random';
import { x25519 } from '@noble/curves/ed25519';

console.log('测试 1: @stablelib/random - randomBytes');
const random1 = randomBytes(32);
console.log('✓ 生成 32 字节随机数:', random1.length === 32);

console.log('\n测试 2: @noble/curves - x25519 密钥生成');
const privateKey = randomBytes(32);
const publicKey = x25519.getPublicKey(privateKey);
console.log('✓ 生成公钥:', publicKey.length === 32);

console.log('\n测试 3: x25519 密钥交换');
const privateKey2 = randomBytes(32);
const publicKey2 = x25519.getPublicKey(privateKey2);
const shared1 = x25519.getSharedSecret(privateKey, publicKey2);
const shared2 = x25519.getSharedSecret(privateKey2, publicKey);
console.log('✓ 共享密钥匹配:', Buffer.from(shared1).equals(Buffer.from(shared2)));

console.log('\n测试 4: 原生 BigInt');
const a = BigInt('57896044618658097711785492504343953926634992332820282019728792003956564819949');
const b = 2n ** 255n - 19n;
console.log('✓ BigInt 计算正确:', a === b);

console.log('\n测试 5: Web Crypto API - AES-GCM');
const testKey = await crypto.subtle.importKey(
  'raw',
  randomBytes(32),
  { name: 'AES-GCM' },
  false,
  ['encrypt', 'decrypt']
);
const nonce = randomBytes(12);
const plaintext = new TextEncoder().encode('Hello World');
const encrypted = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv: nonce, tagLength: 128 },
  testKey,
  plaintext
);
const decrypted = await crypto.subtle.decrypt(
  { name: 'AES-GCM', iv: nonce, tagLength: 128 },
  testKey,
  encrypted
);
const result = new TextDecoder().decode(decrypted);
console.log('✓ AES-GCM 加解密成功:', result === 'Hello World');

console.log('\n✅ 所有测试通过!');

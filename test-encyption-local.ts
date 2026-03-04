
import { Encryption } from './lib/util/curve25519Encryption.ts';
import { ed25519 } from '@noble/curves/ed25519';

async function testEncryption() {
  try {
    const priv = ed25519.utils.randomPrivateKey();
    const pub = ed25519.getPublicKey(priv);

    const message = new TextEncoder().encode("Hello World");
    console.log("Testing encryption...");
    const encrypted = await Encryption.encrypt(pub, message);
    console.log("Encrypted length:", encrypted.length);

    console.log("Testing decryption...");
    const decrypted = await Encryption.decrypt(priv, encrypted);
    const text = new TextDecoder().decode(decrypted);

    if (text === "Hello World") {
        console.log("SUCCESS: Roundtrip encryption/decryption worked.");
    } else {
        console.warn("FAILURE: Decrypted text mismatch:", text);
    }

  } catch (e) {
    console.warn("TEST FAILED with error:", e);
  }
}

testEncryption();

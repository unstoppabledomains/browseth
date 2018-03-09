import * as crypto from 'crypto';
import * as eccrypto from 'eccrypto';

export async function encrypt(publicKey: Buffer, msg: Buffer | string) {
  const encrypted = await eccrypto.encrypt(publicKey, msg);

  return Buffer.concat([
    encrypted.iv,
    encrypted.mac,
    encrypted.ephemPublicKey,
    encrypted.ciphertext,
  ]);
}

export async function decrypt(privateKey: Buffer, data: Buffer) {
  return eccrypto.decrypt(privateKey, {
    iv: data.slice(0, 16),
    mac: data.slice(16, 48),
    ephemPublicKey: data.slice(48, 113),
    ciphertext: data.slice(113),
  });
}

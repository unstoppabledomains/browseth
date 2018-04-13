import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  Hash,
  randomBytes,
} from 'crypto';
import EthereumJsTx from 'ethereumjs-tx';
import {secp256k1} from 'ethereumjs-util';
import {sha3} from 'ethereumjs-util';
import * as createKeccak from 'keccak';
import {pbkdf2Sync} from 'pbkdf2';
import * as scryptsy from 'scryptsy';
import * as uuidv4 from 'uuid/v4';
import {Signer} from './types';

export interface KdfParams {
  dklen: number;
  n?: number;
  c?: number;
  r?: number;
  p?: number;
  salt: string;
  prf?: string;
}

export class PrivateKey implements Signer {
  public static fromV1(json: any, passphrase: string): PrivateKey {
    return new PrivateKey(undefined!);
  }
  public static fromV3(keyStoreStr: any, pw: string) {
    let keyStore;
    if (typeof keyStoreStr !== 'string') {
      keyStore = JSON.stringify(keyStoreStr);
    } else {
      keyStore = keyStoreStr;
    }
    keyStore = JSON.parse(keyStore.toLowerCase());
    if (keyStore.version !== 3) {
      throw new Error('Not a V3 wallet');
    }
    let derivedKey;
    const kdfparams = keyStore.crypto.kdfparams;
    if (keyStore.crypto.kdf === 'pbkdf2') {
      derivedKey = pbkdf2Sync(
        Buffer.from(pw),
        Buffer.from(kdfparams.salt, 'hex'), // salt
        kdfparams.c || 262144, // iterations
        kdfparams.dklen, // length
        'sha256',
      );
    } else if (keyStore.crypto.kdf === 'scrypt') {
      derivedKey = scryptsy(
        Buffer.from(pw),
        Buffer.from(kdfparams.salt, 'hex'),
        kdfparams.n || 262144,
        kdfparams.r, // memory factor
        kdfparams.p, // parallelization factor
        kdfparams.dklen,
      );
    } else {
      throw new Error('Unsupported kdf');
    }
    const ciphertext = Buffer.from(keyStore.crypto.ciphertext, 'hex');
    const mac = sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext]));

    if (mac.toString('hex') !== keyStore.crypto.mac) {
      throw new Error('Macs do not match. Check password');
    }
    const decipher = createDecipheriv(
      keyStore.crypto.cipher,
      derivedKey.slice(0, 16),
      Buffer.from(keyStore.crypto.cipherparams.iv, 'hex'),
    );
    const seed = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return new PrivateKey(seed);
  }

  public static fromHex(raw: string): PrivateKey {
    return new PrivateKey(Buffer.from(raw.replace('0x', ''), 'hex'));
  }

  // returns bip39 seed
  public static fromMnemonic(
    phrase: string | string[],
    password?: string,
  ): PrivateKey {
    return new PrivateKey(
      pbkdf2Sync(
        typeof phrase === 'string' ? phrase : phrase.join(' '),
        password ? `mnemonic${password}` : 'mnemonic',
        2048,
        64,
        'SHA512',
      ),
    );
  }

  public static fromRandomBytes() {
    return new PrivateKey(randomBytes(32));
  }

  constructor(public privateKey: Buffer) {}

  public toAddress() {
    const pubKey = secp256k1.publicKeyCreate(this.privateKey, false).slice(1);
    if (pubKey.length !== 64) {
      throw new Error(`invalid PublicKey<${pubKey}>`);
    }
    return (
      '0x' +
      createKeccak('keccak256')
        .update(pubKey)
        .digest()
        .slice(-20)
        .toString('hex')
    );
  }

  public account = () => Promise.resolve(this.toAddress());
  public signTransaction = (transaction: object) => {
    const tx = new EthereumJsTx(transaction);
    tx.sign(this.privateKey);
    return Promise.resolve('0x' + tx.serialize().toString('hex'));
  };
  public signMessage = (message: string) => {
    const sig = secp256k1.sign(
      createKeccak('keccak256')
        .update(
          '\u0019Ethereum Signed Message:\n' +
            message.length.toString() +
            message,
        )
        .digest(),
      this.privateKey,
    );
    return Promise.resolve(
      '0x' +
        Buffer.concat([
          sig.signature.slice(0, 64) /* TODO(bp): do we need the slice?? */,
          sig.recovery,
        ]).toString('hex'),
    );
  };
  // returns keystore object and private key (randomly generated if not provided)
  public toV3(
    pw: string,
    {
      salt = randomBytes(32),
      iv = randomBytes(16),
      uuid = randomBytes(16),
      kdf = 'scrypt',
      cipher = 'aes-128-ctr',
      dklen = 32,
      c = 262144,
      n = 262144,
      r = 8,
      p = 1,
    } = {},
  ): Promise<any> {
    return new Promise(resolve => {
      const kdfparams: KdfParams = {
        dklen,
        salt: salt.toString('hex'),
      };
      let derivedKey;

      if (kdf === 'pbkdf2') {
        kdfparams.c = c;
        kdfparams.prf = 'hmac-sha256';
        derivedKey = pbkdf2Sync(
          Buffer.from(pw),
          salt,
          kdfparams.c,
          kdfparams.dklen,
          'sha256',
        );
      } else if (kdf === 'scrypt') {
        kdfparams.n = n;
        kdfparams.r = r;
        kdfparams.p = p;
        derivedKey = scryptsy(
          Buffer.from(pw),
          salt,
          kdfparams.n,
          kdfparams.r,
          kdfparams.p,
          kdfparams.dklen,
        );
      } else {
        throw new Error('Unsupported kdf');
      }
      const ciph = createCipheriv(cipher, derivedKey.slice(0, 16), iv);
      if (!ciph) {
        throw new Error('Unsupported cipher');
      }
      const ciphertext = Buffer.concat([
        ciph.update(this.privateKey),
        ciph.final(),
      ]);
      const mac = sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext]));

      resolve(
        JSON.stringify({
          version: 3,
          id: uuidv4({random: uuid}),
          address: this.toAddress(),
          crypto: {
            ciphertext: ciphertext.toString('hex'),
            cipherparams: {
              iv: iv.toString('hex'),
            },
            cipher,
            kdf,
            kdfparams,
            mac: mac.toString('hex'),
          },
        }),
      );
    });
  }

  public toString() {
    return this.privateKey.toString('hex');
  }

  public getKeyStoreFileName(date = new Date()) {
    return `UTC--${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()}T${date.getUTCHours()}-${date.getUTCMinutes()}-${date.getUTCSeconds()}.${date.getUTCMilliseconds()}Z--${this.toAddress().slice(
      2,
    )}`;
  }
}

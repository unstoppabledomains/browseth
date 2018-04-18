import {ETIME} from 'constants';
import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  Hash,
  randomBytes,
} from 'crypto';
import {stripZeros, toBuffer} from 'ethereumjs-util';
import {pbkdf2Sync} from 'pbkdf2';
import {encode as rlpEncode} from 'rlp';
import * as scryptsy from 'scryptsy';
import {publicKeyCreate, sign} from 'secp256k1';
import * as uuidv4 from 'uuid/v4';
import {keccak256} from '../crypto';
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
  // public static fromV1(json: any, passphrase: string): PrivateKey {}

  public static fromV3(keystore: any, pw: string) {
    const parsedKeystore = JSON.parse(
      (typeof keystore === 'string'
        ? keystore
        : JSON.stringify(keystore)
      ).toLowerCase(),
    );

    if (parsedKeystore.version !== 3) {
      throw new Error('Not a V3 wallet');
    }

    let derivedKey;
    const kdfparams = parsedKeystore.crypto.kdfparams;

    if (parsedKeystore.crypto.kdf === 'pbkdf2') {
      derivedKey = pbkdf2Sync(
        Buffer.from(pw),
        Buffer.from(kdfparams.salt, 'hex'), // salt
        kdfparams.c || 262144, // iterations
        kdfparams.dklen, // length
        'sha256',
      );
    } else if (parsedKeystore.crypto.kdf === 'scrypt') {
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

    const ciphertext = Buffer.from(parsedKeystore.crypto.ciphertext, 'hex');
    const mac = keccak256(
      Buffer.concat([derivedKey.slice(16, 32), ciphertext]),
    );
    if (mac.toString('hex') !== parsedKeystore.crypto.mac) {
      throw new Error('Macs do not match. Check password');
    }

    const decipher = createDecipheriv(
      parsedKeystore.crypto.cipher,
      derivedKey.slice(0, 16),
      Buffer.from(parsedKeystore.crypto.cipherparams.iv, 'hex'),
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

  public account() {
    return Promise.resolve(this.toAddress());
  }

  public signTransaction({
    nonce = '0x',
    gasPrice = '0x1',
    gas = '0x5208', // ie 21000
    to = '0x',
    value = '0x',
    data = '0x',
    chainId = 0x1,
  }: {
    nonce: string | Buffer | number;
    gasPrice: string | Buffer | number;
    gas: string | Buffer | number;
    to: string | Buffer;
    value: string | Buffer | number;
    data: string | Buffer;
    chainId: number;
  }) {
    const raw = [
      stripZeros(toBuffer(nonce)),
      stripZeros(toBuffer(gasPrice)),
      stripZeros(toBuffer(gas)),
      toBuffer(to),
      stripZeros(toBuffer(value)),
      toBuffer(data),
    ];

    const sig = sign(
      keccak256(
        rlpEncode(
          raw.concat(
            chainId > 0
              ? [Buffer.from([chainId]), Buffer.from([]), Buffer.from([])]
              : [],
          ),
        ),
      ),
      this.privateKey,
    );

    return Promise.resolve(
      '0x' +
        rlpEncode(
          raw.concat(
            Buffer.from([
              sig.recovery + 27 + (chainId > 0 ? chainId * 2 + 8 : 0),
            ]),
            sig.signature.slice(0, 32),
            sig.signature.slice(32, 64),
          ),
        ).toString('hex'),
    );
  }

  public signMessage(message: string) {
    const hash = keccak256(
      '\u0019Ethereum Signed Message:\n' + message.length.toString() + message,
    );

    const sig = sign(hash, this.privateKey);

    return Promise.resolve(
      '0x' + Buffer.from([...sig.signature, sig.recovery + 27]).toString('hex'),
    );
  }
  // returns keystore object and private key (randomly generated if not provided)

  public toString() {
    return this.privateKey.toString('hex');
  }

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
  ): Promise<string> {
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

      const mac = keccak256(
        Buffer.concat([derivedKey.slice(16, 32), ciphertext]),
      );

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

  public getKeyStoreFileName(date = new Date()) {
    return `UTC--${date.getUTCFullYear()}-${('0' + date.getUTCMonth()).slice(
      -2,
    )}-${('0' + date.getUTCDate()).slice(-2)}T${(
      '0' + date.getUTCHours()
    ).slice(-2)}-${('0' + date.getMinutes()).slice(-2)}-${(
      '0' + date.getUTCSeconds()
    ).slice(-2)}.${('00' + date.getUTCMilliseconds()).slice(
      -3,
    )}Z--${this.toAddress().slice(2)}`;
  }

  private toAddress() {
    const pubKey = publicKeyCreate(this.privateKey, false).slice(1);
    if (pubKey.length !== 64) {
      throw new Error(`invalid PublicKey<${pubKey}>`);
    }
    return (
      '0x' +
      keccak256(pubKey)
        .slice(-20)
        .toString('hex')
    );
  }
}

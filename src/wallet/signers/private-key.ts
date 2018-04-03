import EthereumJsTx = require('ethereumjs-tx');
import {secp256k1} from 'ethereumjs-util';
import createKeccak = require('keccak');
// import secp256k1 from 'secp256k1';
import {Signer} from './types';

export class PrivateKey implements Signer {
  public static fromV1(json: any, passphrase: string): PrivateKey {
    return new PrivateKey(undefined!);
  }
  public static fromV3(json: any, passphrase: string): PrivateKey {
    return new PrivateKey(Buffer.from(''));
  }

  public static fromHex(raw: string): PrivateKey {
    return new PrivateKey(Buffer.from(raw.replace('0x', ''), 'hex'));
  }

  public static privateToAddress(privateKey: Buffer) {
    const pubKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
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

  constructor(public privateKey: Buffer) {}

  public account = () =>
    Promise.resolve(PrivateKey.privateToAddress(this.privateKey));
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
}

import AppEth from '@ledgerhq/hw-app-eth';
import HWTransport from '@ledgerhq/hw-transport';
import EthereumJsTx from 'ethereumjs-tx';
import {rlp} from 'ethereumjs-util';
import {Signer} from './types';

namespace LedgerDPath {
  export const testNet = "m/44'/1'/0'/";
  export const ethClassic = "m/44'/61'/0'/";
  export const mainNet = "m/44'/60'/0'/";
  export function isValid(v: string) {
    return /^(?:m\/)?44'\/(?:1|60|61])'\/0'\/$/.test(v);
  }
}

export class Ledger implements Signer {
  public static Transport: {create(): Promise<HWTransport>};
  public static dPath = {...LedgerDPath};
  private static initialized = false;
  private static allowParallel = false;

  public addressLookup: {[index: number]: string} = {};

  constructor(
    private dPath = Ledger.dPath.mainNet,
    private defaultIndex: number = 0,
  ) {
    if (!LedgerDPath.isValid(dPath)) {
      throw new TypeError(`dPath<${dPath}> is invalid`);
    }
  }

  public async initialize(): Promise<{app: AppEth; close(): void}> {
    if (!Ledger.allowParallel && Ledger.initialized) {
      throw new Error('another ledger wallet call is already initialized');
    }

    Ledger.initialized = true;
    const transport = await Ledger.Transport.create();

    return {
      app: new AppEth(transport),
      close: () => {
        Ledger.initialized = false;
        transport.close();
      },
    };
  }

  public async account(index = this.defaultIndex) {
    const {app, close} = await this.initialize();
    try {
      if (this.addressLookup[index]) {
        return this.addressLookup[index];
      }

      return (await app.getAddress(this.dPath + index)).address;
    } finally {
      close();
    }
  }

  public async accounts(...indices: number[]) {
    const {app, close} = await this.initialize();
    try {
      const addresses = [];
      for (const index of indices) {
        addresses.push(
          this.addressLookup[index]
            ? this.addressLookup[index]
            : (await app.getAddress(this.dPath + index)).address,
        );
      }

      return addresses;
    } finally {
      close();
    }
  }

  public async signTransaction(transaction: any, index = this.defaultIndex) {
    const {app, close} = await this.initialize();
    try {
      const eTx = new EthereumJsTx({
        ...transaction,
        v: transaction.chainId || 1,
      } as any);

      const result = await app.signTransaction(
        this.dPath + index,
        rlp.encode(eTx.raw),
      );

      // console.log(transaction, result);

      const e = new EthereumJsTx({
        ...transaction,
        v: '0x' + result.v,
        r: '0x' + result.r,
        s: '0x' + result.s,
      });

      // console.log({...e});
      // console.log(e.serialize().toString('hex'));
      return `0x${e.serialize().toString('hex')}`;
    } finally {
      close();
    }
  }

  public async signMessage(msg: string, index = this.defaultIndex) {
    const {app, close} = await this.initialize();
    try {
      const result = await app.signPersonalMessage(this.dPath + index, msg);

      const v = result.v - 27;
      const vHex = v.toString(16);
      return `0x${result.r}${result.s}${vHex.length < 2 ? `0${v}` : vHex}`;
    } finally {
      close();
    }
  }
}

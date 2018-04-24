import AppEth from '@ledgerhq/hw-app-eth';
import HWTransport from '@ledgerhq/hw-transport';
import ETx = require('ethereumjs-tx');
import {stripZeros, toBuffer} from 'ethereumjs-util';
import {encode as rlpEncode} from 'rlp';

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

  public getAddressLookup: {
    [index: number]: {
      address: string;
      publicKey: string;
    };
  } = {};

  constructor(
    private dPath = Ledger.dPath.mainNet,
    public defaultIndex: number = 0,
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

    // transport.setDebugMode(true);
    return {
      app: new AppEth(transport),
      close: () => {
        Ledger.initialized = false;
        transport.close();
      },
    };
  }

  public account(index = this.defaultIndex) {
    return this.getAddress(index).then(({address}) => address);
  }

  public publicKey(index = this.defaultIndex) {
    return this.getAddress(index).then(({publicKey}) => publicKey);
  }

  public async signTransaction(
    {
      nonce = '0x',
      gasPrice = '0x1',
      gas = '0x5208', // ie 21000
      to = '0x',
      value = '0x',
      data = '0x',
    }: {
      nonce: string | Buffer | number;
      gasPrice: string | Buffer | number;
      gas: string | Buffer | number;
      to: string | Buffer;
      value: string | Buffer | number;
      data: string | Buffer;
    },
    index = this.defaultIndex,
  ) {
    const {app, close} = await this.initialize();
    try {
      const chainId = this.dPath === LedgerDPath.mainNet ? 1 : 3;
      const raw = [
        stripZeros(toBuffer(nonce)),
        stripZeros(toBuffer(gasPrice)),
        stripZeros(toBuffer(gas)),
        toBuffer(to),
        stripZeros(toBuffer(value)),
        toBuffer(data),
      ];

      const sig = await app.signTransaction(
        this.dPath + index,
        rlpEncode(
          raw.concat(
            chainId > 0
              ? [Buffer.from([chainId]), Buffer.from([]), Buffer.from([])]
              : [],
          ),
        ),
      );
      /* tslint:disable-next-line no-bitwise */
      if (Math.floor((+('0x' + sig.v) - 35) / 2) !== (chainId & 0xff)) {
        throw new Error('invalid signed chainId');
      }

      return `0x${rlpEncode(
        raw.concat(
          Buffer.from(sig.v, 'hex'),
          Buffer.from(sig.r, 'hex'),
          Buffer.from(sig.s, 'hex'),
        ),
      ).toString('hex')}`;
    } finally {
      close();
    }
  }

  public async signMessage(msg: string, index = this.defaultIndex) {
    const {app, close} = await this.initialize();
    try {
      const sig = await app.signPersonalMessage(
        this.dPath + index,
        Buffer.from(msg).toString('hex'),
      );

      return `0x${sig.r}${sig.s}${Buffer.from([sig.v]).toString('hex')}`;
    } finally {
      close();
    }
  }

  private async getAddress(index: number) {
    const {app, close} = await this.initialize();
    try {
      if (this.getAddressLookup[index]) {
        return this.getAddressLookup[index];
      }
      const resp = await app.getAddress(this.dPath + index);

      this.getAddressLookup[index] = resp;

      return resp;
    } finally {
      close();
    }
  }
}

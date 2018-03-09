//import {encData} from '@browseth/utils';
import * as AppEth from '@ledgerhq/hw-app-eth';
import * as TransportNodeHID from '@ledgerhq/hw-transport-node-hid';
import * as TransportU2F from '@ledgerhq/hw-transport-u2f';
import EthereumJsTx, { EthereumJsTxObj } from 'ethereumjs-tx';
import * as Node from '../node/index';
import { ISendTransaction } from '../rpc/methods';

function getTransport() {
  return module && module.exports
    ? TransportNodeHID.create()
    : TransportU2F.create();
}

export namespace LedgerDPath {
  // if (index % 1 !== 0 || index < 0) {
  //   throw new TypeError(`index<${index}> is invalid`);
  // }

  export const testNet = "m/44'/1'/0'/";
  export const ethClassic = "m/44'/61'/0'/";
  export const mainNet = "m/44'/60'/0'/";
  export function isValid(v: string) {
    return /^(?:m\/)?44'\/(?:1|60|61])'\/0'\/$/.test(v);
  }
}

export class Ledger {
  private static initialized = false;
  private static allowParallel = false;

  public addressLookup: { [index: number]: string } = {};

  constructor(
    private dPath = LedgerDPath.mainNet,
    private defaultIndex: number = 0,
  ) {
    if (!LedgerDPath.isValid(dPath)) {
      throw new TypeError(`dPath<${dPath}> is invalid`);
    }
  }

  public async initialize() {
    if (!Ledger.allowParallel && Ledger.initialized) {
      throw new Error('another ledger wallet call is already initialized');
    }

    Ledger.initialized = true;
    const transport = await getTransport();

    return {
      app: new AppEth(transport),
      close: () => {
        Ledger.initialized = false;
        transport.close();
      },
    };
  }

  public async getAccount(index = this.defaultIndex) {
    const { app, close } = await this.initialize();
    try {
      if (this.addressLookup[index]) {
        return this.addressLookup[index];
      }

      return (await app.getAddress(this.dPath + index)).address;
    } finally {
      close();
    }
  }

  public async getAccounts(...indices: number[]) {
    const { app, close } = await this.initialize();
    try {
      let addresses = [];
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

  public async signTransaction(
    transaction: Partial<ISendTransaction>,
    index = this.defaultIndex,
  ) {
    const { app, close } = await this.initialize();
    try {
      const tx = new EthereumJsTx(<EthereumJsTxObj>transaction);

      tx.from = this.addressLookup[index]
        ? this.addressLookup[index]
        : (await app.getAddress(this.dPath + index)).address;

      tx.v = Buffer.from([0x01]);
      tx.r = Buffer.from([]);
      tx.s = Buffer.from([]);

      const result = await app.signTransaction(
        this.dPath + index,
        tx.serialize().toString('hex'),
      );

      tx.v = Buffer.from(result.v, 'hex');
      tx.r = Buffer.from(result.r, 'hex');
      tx.s = Buffer.from(result.s, 'hex');

      return `0x${tx.serialize().toString('hex')}`;
    } finally {
      close();
    }
  }

  public async signMessage(msg: string, index = this.defaultIndex) {
    const { app, close } = await this.initialize();
    try {
      const result = await app.signPersonalMessage(this.dPath + index, msg);

      const v = parseInt(result.v, 10) - 27;
      const vHex = v.toString(16);
      return `0x${result.r}${result.s}${vHex.length < 2 ? `0${v}` : vHex}`;
    } finally {
      close();
    }
  }
}

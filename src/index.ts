// import HWTransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import HWTransportU2F from '@ledgerhq/hw-transport-u2f';
import {BN} from 'bn.js';
import {JsonInterface} from './abi';
import * as Apis from './api';
import {
  keccak256,
  namehash,
  serialize,
  subnodeHash,
  tightlyPackedKeccak256,
} from './common';
import {Contract} from './contract';
import BlockchainExplorer from './explorer';
import * as Fs from './fs';
import * as Rpcs from './rpc';
import * as Signers from './signers';
// import * as NodeHttp from './transport/node-http';
import * as Xhr from './transport/xhr';
// import * as fetch from './transport/fetch';
import * as Units from './units';
import * as Wallets from './wallet';

Signers.Ledger.Transport = HWTransportU2F;

class Browseth {
  public static Rpcs = Rpcs;
  public static Wallets = Wallets;
  public static Signers = Signers;
  public static Apis = Apis;
  public static Units = Units;
  public static Fs = Fs;
  public static BlockChainExplorer = BlockchainExplorer;
  public static tightlyPackedKeccak256 = tightlyPackedKeccak256;
  public static keccak256 = keccak256;
  public static serialize = serialize;
  public static nameUtil = {
    namehash,
    subnodeHash,
  };
  public static transport = Xhr;
  public contract: {
    [k: string]: Contract;
  } = {};
  public api: {
    [k: string]: {wallet: Wallets.Wallet; [k: string]: any};
  } = {};

  private _rpc: Rpcs.Rpc;
  private _wallet: Wallets.Wallet;

  constructor(
    initializer?: string | Rpcs.Rpc | Wallets.Wallet,
    public options: {gasPrice: string} = {gasPrice: '0x0'},
  ) {
    if (typeof initializer === 'string') {
      this._rpc = new Rpcs.Default(Browseth.transport, initializer);
      this._wallet = new Wallets.ReadOnly(this._rpc);
    } else if (initializer instanceof Rpcs.Rpc) {
      this._rpc = initializer;
      this._wallet = new Wallets.ReadOnly(this._rpc);
    } else if (initializer instanceof Wallets.Wallet) {
      this._rpc = initializer.rpc;
      this._wallet = initializer;
    } else {
      this._rpc = new Rpcs.Default(Browseth.transport);
      this._wallet = new Wallets.ReadOnly(this._rpc);
    }
    // this.poll().catch();
  }

  //
  // public options: {gasPrice: string | number | BN | (() => any)} = {
  //   gasPrice() {
  //     this._rpc.send('eth_gasPrice');
  //   },
  // };

  set rpc(newRpc: Rpcs.Rpc) {
    this._rpc = newRpc;
    this.wallet.rpc = newRpc;
  }

  get rpc() {
    return this._rpc;
  }

  set wallet(newWallet: Wallets.Wallet) {
    this._rpc = newWallet.rpc;
    this._wallet = newWallet;
    Object.keys(this.c).forEach(k => {
      this.contract[k].wallet = newWallet;
    });
    Object.keys(this.api).forEach(k => {
      this.api[k].wallet = newWallet;
    });
  }

  get wallet() {
    return this._wallet;
  }

  get c() {
    return this.contract;
  }

  get w() {
    return this.wallet;
  }

  public addContract(
    name: string,
    jsonInterface: JsonInterface | string,
    options: {
      address?: string;
      bytecode?: string;
    } = {},
  ) {
    this.c[name] = new Contract(
      this.wallet,
      typeof jsonInterface === 'string'
        ? JSON.parse(jsonInterface)
        : jsonInterface,
      options,
    );
    return this;
  }

  public addApi(name: string, api: {wallet: Wallets.Wallet; [k: string]: any}) {
    api.wallet = this._wallet;
    this.api[name] = api;
    return this;
  }

  public setGasPrice(amount: string | BN) {
    let amt = '';
    if (typeof amount === 'number') {
      throw new Error(
        `For {${amount}}, please use a string for numbers to avoid precision issues.`,
      );
    } else if (typeof amount === 'string') {
      amt = amount;
      if (/^-/.test(amt)) {
        throw new Error(`{${amt}}: Please use a positive number`);
      }
      if (!/^(\d*\.\d+)|\d+$$/.test(amt)) {
        if (!/^0x[0-9a-f]+$/i.test(amt)) {
          throw new Error(`'${amount}' is not a valid number or hex`);
        }
      }
      if (!amt.includes('0x')) {
        amt = '0x' + new BN(amt).toString(16);
      }
    } else {
      // if BN
      amt = '0x' + amount.toString(16);
    }
    this.options.gasPrice = amt;
    this.wallet.options.gasPrice = amt;
  }

  // public monitorTransaction(transactionHash: string) {}
}

export default Browseth;

// export = Browseth;

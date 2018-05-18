// import HWTransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import HWTransportU2F from '@ledgerhq/hw-transport-u2f';
import {BN} from 'bn.js';
import {JsonInterface} from './abi';
import * as Apis from './api';
import {Contract} from './contract';
import * as Rpcs from './rpc';
import * as Signers from './signers';
// import * as NodeHttp from './transport/node-http';
import * as Xhr from './transport/xhr';
// import * as fetch from './transport/fetch';
import * as Utils from './utils';

import * as Wallets from './wallet';

Signers.Ledger.Transport = HWTransportU2F;

class Browseth {
  public static Rpcs = Rpcs;
  public static Wallets = Wallets;
  public static Signers = Signers;
  public static Apis = Apis;

  public static transport = Xhr;
  public contract: {
    [k: string]: Contract;
  } = {};
  public api: {
    [k: string]: {wallet: Wallets.Wallet; [k: string]: any};
  } = {};

  private _rpc: Rpcs.Rpc;
  private _wallet: Wallets.Wallet;

  constructor(initializer?: string | Rpcs.Rpc | Wallets.Wallet) {
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

  // public monitorTransaction(transactionHash: string) {}
}

export default Browseth;

// export = Browseth;

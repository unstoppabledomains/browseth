import HWTransportU2F from '@ledgerhq/hw-transport-u2f';
import {JsonInterface} from './abi';
import * as Apis from './api';
import {Contract} from './contract';
import * as Rpcs from './rpc';
import * as Xhr from './transport/xhr';
import * as Wallets from './wallet';

export default class Browseth {
  public static Rpcs = {...Rpcs};
  public static Wallets = {...Wallets};
  public static Apis = {...Apis};

  public static transport = Xhr;
  public c: {
    [k: string]: Contract;
  } = {};
  public api: {
    [k: string]: {wallet: Wallets.Wallet; [k: string]: any};
  } = {};

  private _rpc: Rpcs.Rpc;
  private _wallet: Wallets.Wallet;
  constructor(initializer?: string | Rpcs.Rpc | Wallets.Wallet) {
    if (typeof initializer === 'string') {
      this._rpc = new Rpcs.Rpc(Browseth.transport, initializer);
      this._wallet = new Wallets.ReadOnly(this._rpc);
    } else if (initializer instanceof Rpcs.Rpc) {
      this._rpc = initializer;
      this._wallet = new Wallets.ReadOnly(this._rpc);
    } else if (initializer instanceof Wallets.Wallet) {
      this._rpc = initializer.rpc;
      this._wallet = initializer;
    } else {
      this._rpc = new Rpcs.Rpc(Browseth.transport);
      this._wallet = new Wallets.ReadOnly(this._rpc);
    }
  }

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
      this.c[k].wallet = newWallet;
    });
    Object.keys(this.api).forEach(k => {
      this.api[k].wallet = newWallet;
    });
  }

  get wallet() {
    return this._wallet;
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
}

Browseth.Wallets.SignerWallet.Signers.Ledger.Transport = HWTransportU2F;

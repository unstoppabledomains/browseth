import * as Node from '../node/index';
import {
  MetaMaskProviderEngine,
  ISendTransaction,
  All,
  IData,
} from '../rpc/methods';
import { Base } from './base';

export class Web3 extends Node.Web3 {
  constructor(provider: any) {
    super(provider);
  }

  public getAccount() {
    return this.send('eth_coinbase', []);
  }

  public getAccounts() {
    return this.send('eth_accounts', []);
  }

  public async sendTransaction(transaction: ISendTransaction) {
    return this.send('eth_sendTransaction', [
      {
        ...transaction,
        from: transaction.from || (await this.getAccounts())[0],
        gas: transaction.gas || (await this.estimateGas(transaction)),
      },
    ]);
  }

  public async signMessage(message: IData) {
    return this.send('eth_sign', [await this.getAccount(), message]);
  }
}

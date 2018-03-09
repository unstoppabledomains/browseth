import { RequestObject, ResponseObject, ApiAbstract } from '../rpc/types';
import { ISendTransaction, IData } from '../rpc/methods';
import * as Node from '../node/index';

export class Base extends Node.Base implements Node.Base {
  public async getAccount() {
    return (await this.getAccounts())[0];
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

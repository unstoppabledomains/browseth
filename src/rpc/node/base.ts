import {
  All,
  ICallTransaction,
  IData,
  IEstimateTransaction,
  ITag,
} from '../methods';























export class Base<Api extends ApiAbstract = All> {
  public tag: ITag = 'latest';
  public public;
  public send<Method extends keyof Api>(
    method: Method,
    params: Api[Method]['params'],
  ): Promise<Api[Method]['result']> {
    return undefined!;
  }

  public getBalance(address: IData, tag: ITag = this.defaultTag) {
    return this.send('eth_getBalance', []);
  }

  public getChainId() {
    return this.send('net_version', []);
  }

  public getGasPrice() {
    return this.send('eth_gasPrice', []);
  }

  public estimateGas(
    transaction: IEstimateTransaction,
    tag: ITag = this.defaultTag,
  ) {
    return this.send('eth_estimateGas', [transaction, tag]);
  }

  public ethCall(transaction: ICallTransaction, tag: ITag = this.defaultTag) {
    return this.send('eth_call', [transaction, tag]);
  }
}

import {
  ICallTransaction,
  IData,
  IEstimateTransaction,
  ITag,
} from '../rpc/methods';
import {Base} from './base';

export class Noop extends Base implements Base {
  public defaultTag: ITag = 'latest';

  public send() {
    return undefined!;
  }

  public getBalance(address: IData, tag: ITag = this.defaultTag) {
    return undefined!;
  }

  public getChainId() {
    return undefined!;
  }

  public getGasPrice() {
    return undefined!;
  }

  public estimateGas(
    transaction: IEstimateTransaction,
    tag: ITag = this.defaultTag,
  ) {
    return undefined!;
  }

  public ethCall(transaction: ICallTransaction, tag: ITag = this.defaultTag) {
    return undefined!;
  }
}

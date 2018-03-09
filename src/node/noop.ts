import { Base } from './base';
import {
  IData,
  ITag,
  IEstimateTransaction,
  ISendTransaction,
  ICallTransaction,
} from '../rpc/methods';

export class Noop extends Base implements Base {
  public send() {
    return undefined!;
  }

  public defaultTag: ITag = 'latest';

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

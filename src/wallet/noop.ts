import {Noop as NoopNode} from '../node/noop';
import {Base} from './base';

export class Noop extends NoopNode implements Base {
  public getAccount() {
    return undefined!;
  }
  public getAccounts() {
    return undefined!;
  }
  public sendTransaction() {
    return undefined!;
  }
  public signMessage() {
    return undefined!;
  }
  public send() {
    return undefined!;
  }
}

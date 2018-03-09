import { Noop as NoopNode } from '../node/noop';
import { Base } from './base';

export class Noop extends NoopNode implements Base {
  getAccount() {
    return undefined!;
  }
  getAccounts() {
    return undefined!;
  }
  sendTransaction() {
    return undefined!;
  }
  signMessage() {
    return undefined!;
  }
  send() {
    return undefined!;
  }
}

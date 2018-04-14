import {Rpc} from '../rpc';
import {Online} from './online';
import {Wallet} from './types';

export class ReadOnly extends Online {
  constructor(
    rpc: Rpc,
    public address = '0x0000000000000000000000000000000000000000',
  ) {
    super(rpc);
  }

  public account = () => Promise.resolve(this.address);
  public send = (transaction: object) =>
    Promise.reject(new Error('must use a wallet with sending abilities'));
  public sign = (message: string) =>
    Promise.reject(new Error('must use an actual wallet'));
}

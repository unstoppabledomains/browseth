import {Wallet} from './types';

export class Throw implements Wallet {
  public rpc = undefined!;
  public account = () => Promise.reject(new Error('must use an actual wallet'));
  public send = () => Promise.reject(new Error('must use an actual wallet'));
  public call = () => Promise.reject(new Error('must use an actual wallet'));
  public gas = () => Promise.reject(new Error('must use an actual wallet'));
  public sign = () => Promise.reject(new Error('must use an actual wallet'));
}

import {Rpc} from '../rpc';
import {Wallet} from './types';

export class ReadOnly implements Wallet {
  constructor(
    public rpc: Rpc,
    private address = '0x0000000000000000000000000000000000000000',
  ) {}

  public account = () => Promise.resolve(this.address);

  public send = (transaction: object) =>
    Promise.reject(new Error('must use a wallet with sending abilities'));

  public call = async (transaction: object, block?: string) =>
    this.rpc.send(
      'eth_call',
      {
        ...transaction,
        from: await this.account(),
      },
      block,
    );

  public gas = async (transaction: object) =>
    this.rpc.send('eth_estimateGas', {
      ...transaction,
      from: await this.account(),
    });

  public sign = (message: string) =>
    Promise.reject(new Error('must use an actual wallet'));
}

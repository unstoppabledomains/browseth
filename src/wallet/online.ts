import {Rpc} from '../rpc';
import {Wallet} from './types';

export class Online implements Wallet {
  constructor(public rpc: Rpc) {}

  public account = () => this.rpc.send('eth_coinbase');

  public accounts = () => this.rpc.send('eth_accounts');

  public send = async (transaction: object) => {
    const tx: any = {
      ...transaction,
      from: await this.account(),
    };
    return this.rpc.send('eth_sendTransaction', {
      ...tx,
      gas: tx.gas || (await this.gas(tx)),
    });
  };

  public call = async (transaction: object, block?: string) =>
    this.rpc.send(
      'eth_call',
      {
        ...transaction,
        from: await this.account(),
      },
      block,
    );

  public gas = async (transaction: object, block?: string) =>
    this.rpc.send(
      'eth_estimateGas',
      {
        ...transaction,
        from: await this.account(),
      },
      // block,
    );

  public sign = async (message: string) =>
    this.rpc.send('eth_sign', await this.account(), message);
}

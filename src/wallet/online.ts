import {toBuffer} from 'ethereumjs-util';
import {toHex} from '../crypto';
import {Rpc} from '../rpc';
import {Wallet} from './types';

export class Online implements Wallet {
  public batch = {
    send: async (transaction: object, cb: () => void) => {
      const tx: any = {
        gasPrice: this.options.gasPrice,
        ...transaction,
        from: await this.account(),
      };
      return [
        {
          method: 'eth_sendTransaction',
          params: [toHex({
            ...tx,
            gas: tx.gas || (await this.gas(tx)),
          })],
        },
        cb,
    ];
    },
    call: async (transaction: object, block: string, cb: () => void) => {
      return [
        {
          method: 'eth_call',
          params: [toHex({
            gasPrice: this.options.gasPrice,
            ...transaction,
            from: await this.account(),
          }),
          block],
        },
        cb,
      ];
    },
    gas: async (transaction: object, block: string, cb: () => void) => {
      return [
        {
          method: 'eth_estimateGas',
          params: [toHex({
            gasPrice: this.options.gasPrice,
            ...transaction,
            from: await this.account(),
          })],
          // block,
        },
        cb,
      ];
    }
  }

  constructor(public rpc: Rpc, public options: {gasPrice: string} = {gasPrice: '0x0'}) {}

  public account = () => this.rpc.send('eth_coinbase');

  public accounts = () => this.rpc.send('eth_accounts');

  public send = async (transaction: object) => {
    const tx: any = {
      gasPrice: this.options.gasPrice,
      ...transaction,
      from: await this.account(),
    };
    return this.rpc.send(
      'eth_sendTransaction',
      toHex({
        ...tx,
        gas: tx.gas || (await this.gas(tx)),
      }),
    );
  };

  public call = async (transaction: object, block?: string) =>
    this.rpc.send(
      'eth_call',
      toHex({
        gasPrice: this.options.gasPrice,
        ...transaction,
        from: await this.account(),
      }),
      block,
    );

  public gas = async (transaction: object, block?: string) =>
    this.rpc.send(
      'eth_estimateGas',
      toHex({
        gasPrice: this.options.gasPrice,
        ...transaction,
        from: await this.account(),
      }),
      // block,
    );

  public sign = async (message: string) =>
    this.rpc.send('eth_sign', await this.account(), message);
}

import {toHex} from '../crypto';
import {Rpc} from '../rpc';
import {Signer} from '../signers';
import {Wallet} from './types';

export class Offline implements Wallet {
  public batch = {
    send: async (transaction: any, cb: () => {}) => {
      const tx = {
        gasPrice: this.options.gasPrice,
        ...transaction,
        from: await this.signer.account(),
      };

      return [
        {
          method: 'eth_sendRawTransaction',
          params: [await this.signer.signTransaction(
            toHex({
              ...tx,
              gas: tx.gas || (await this.rpc.send('eth_estimateGas', tx)),
              gasPrice: tx.gasPrice,
              nonce: await this.rpc.send(
                'eth_getTransactionCount',
                tx.from,
                'latest',
              ),
              chainId:
                tx.chainId || parseInt(await this.rpc.send('net_version'), 10),
            }),
          )],
        },
        cb,
      ];
    },
    call: async (transaction: object, block: string, cb: () => {}) => {
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
    gas: async (transaction: object, block: string, cb: () => {}) => {
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

  constructor(public rpc: Rpc, public signer: Signer, public options: {gasPrice: string} = {gasPrice: '0x0'}) {}

  public account = (...args: any[]) => this.signer.account(...args);
  
  public send = async (transaction: any) => {
    const tx = {
      gasPrice: this.options.gasPrice,
      ...transaction,
      from: await this.signer.account(),
    };

    return this.rpc.send(
      'eth_sendRawTransaction',
      await this.signer.signTransaction(
        toHex({
          ...tx,
          gas: tx.gas || (await this.rpc.send('eth_estimateGas', tx)),
          gasPrice: tx.gasPrice,
          nonce: await this.rpc.send(
            'eth_getTransactionCount',
            tx.from,
            'latest',
          ),
          chainId:
            tx.chainId || parseInt(await this.rpc.send('net_version'), 10),
        }),
      ),
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

  public sign = async (message: string) => this.signer.signMessage(message);
}

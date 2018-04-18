import {toHex} from '../crypto';
import {Rpc} from '../rpc';
import {Signer} from '../signers';
import {Wallet} from './types';

export class Offline implements Wallet {
  constructor(public rpc: Rpc, public signer: Signer) {}

  public account = () => this.signer.account();
  public send = async (transaction: any) => {
    const tx = {
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
        ...transaction,
        from: await this.account(),
      }),
      block,
    );
  public gas = async (transaction: object, block?: string) =>
    this.rpc.send(
      'eth_estimateGas',
      toHex({
        ...transaction,
        from: await this.account(),
      }),
      // block,
    );
  public sign = async (message: string) => this.signer.signMessage(message);
}

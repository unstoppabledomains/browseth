import {Rpc} from '../rpc';
import * as Signers from './signers';
import {Wallet} from './types';

export class SignerWallet implements Wallet {
  public static Signers = {...Signers};

  constructor(public rpc: Rpc, public signer: Signers.Signer) {}

  public account = () => this.signer.account();
  public send = async (transaction: any) => {
    const tx = {
      ...transaction,
      from: await this.signer.account(),
    };

    return this.rpc.send(
      'eth_sendRawTransaction',
      await this.signer.signTransaction({
        ...tx,
        gas: tx.gas || (await this.rpc.send('eth_estimateGas', tx)),
        // gasPrice: tx.gasPrice || 1000000000,
        nonce: await this.rpc.send(
          'eth_getTransactionCount',
          tx.from,
          'latest',
        ),
      }),
    );
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
  public sign = async (message: string) => this.signer.signMessage(message);
}

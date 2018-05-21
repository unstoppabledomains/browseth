// import {BN} from 'bn.js';
import {Rpc} from '../rpc';

export abstract class Wallet {
  public abstract rpc: Rpc;
  public abstract batch: any;
  public abstract account(): Promise<string>;
  public abstract send(transaction: object): Promise<string>;
  public abstract call(transaction: object, block?: string): Promise<string>;
  public abstract gas(transaction: object, block?: string): Promise<string>;
  public abstract sign(message: string): Promise<string>;
}

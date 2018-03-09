declare module 'ethereumjs-tx' {
  import BN from 'bn.js';
  import {Buffer} from 'buffer';

  type EthereumJsTxObjField = Buffer | BN | string | number;

  export interface EthereumJsTxObj {
    chainId?: number | null;
    gasLimit?: EthereumJsTxObjField;
    gasPrice?: EthereumJsTxObjField;
    to?: EthereumJsTxObjField;
    nonce?: EthereumJsTxObjField;
    data?: EthereumJsTxObjField;
    v?: EthereumJsTxObjField;
    r?: EthereumJsTxObjField;
    s?: EthereumJsTxObjField;
    value?: EthereumJsTxObjField;
  }

  class EthereumJsTx {
    public _chainId: number;
    public raw: Buffer;
    public gasLimit: Buffer;
    public gasPrice: Buffer;
    public to: Buffer;
    public nonce: Buffer;
    public data: Buffer;
    public value: Buffer;
    public from: Buffer;
    public v: Buffer;
    public r: Buffer;
    public s: Buffer;
    constructor(data: EthereumJsTxObj | string | Buffer);
    public toCreationAddress(): string;
    public hash(bool: boolean): Buffer;
    public getChainId(): number;
    public getSenderAddress(): Buffer;
    public getSenderPublicKey(): Buffer;
    public verifySignature(): boolean;
    public sign(privateKey: Buffer): void;
    public getDataFee(): BN;
    public getBaseFee(): BN;
    public getUpfrontCost(): BN;
    public validate(stringError: boolean): boolean | string;
    public toJSON(): any;
    public serialize(): Buffer;
  }
  export default EthereumJsTx;
}

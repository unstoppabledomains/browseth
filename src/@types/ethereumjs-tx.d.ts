declare module 'ethereumjs-tx' {
  import {BN} from 'bn.js';
  import {Buffer} from 'buffer';

  type TransactionObjectField = Buffer | BN | string | number;

  type RawTransactionObject = Partial<{
    chainId: number | null;

    gasLimit: TransactionObjectField;

    gasPrice: TransactionObjectField;

    to: TransactionObjectField;

    nonce: TransactionObjectField;

    data: TransactionObjectField;

    v: TransactionObjectField;

    r: TransactionObjectField;

    s: TransactionObjectField;

    value: TransactionObjectField;
  }>;

  export default class Transaction {
    _chainId: number;

    raw: Buffer | string;

    gasLimit: Buffer | string;

    gasPrice: Buffer | string;

    to: Buffer | string;

    nonce: Buffer | string;

    data: Buffer | string;

    value: Buffer | string;

    from: Buffer | string;

    v: Buffer | string;

    r: Buffer | string;

    s: Buffer | string;

    constructor(data: RawTransactionObject | string | Buffer);

    toCreationAddress(): string;

    hash(bool: boolean): Buffer;

    getChainId(): number;

    getSenderAddress(): Buffer;

    getSenderPublicKey(): Buffer;

    verifySignature(): boolean;

    sign(privateKey: Buffer): void;

    getDataFee(): BN;

    getBaseFee(): BN;

    getUpfrontCost(): BN;

    validate(stringError: boolean): boolean | string;

    toJSON(): any;

    serialize(): Buffer;
  }
}

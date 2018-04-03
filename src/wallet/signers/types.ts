export interface Signer {
  account(): Promise<string>;
  signTransaction(transaction: object): Promise<string>;
  signMessage(message: string): Promise<string>;
}

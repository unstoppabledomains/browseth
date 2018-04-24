export interface Signer {
  account(...args: any[]): Promise<string>;
  signTransaction(transaction: object): Promise<string>;
  signMessage(message: string): Promise<string>;
}

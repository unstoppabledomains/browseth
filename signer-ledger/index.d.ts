export = SignerLedger
export as namespace SignerLedger

declare namespace SignerLedger {
  export { SignerLedger as default, SignerLedger }

  class SignerLedger {
    constructor()
    signTransaction(transaction: any): ArrayBuffer
    signMessage(message: string, shouldConcat: boolean): ArrayBuffer
    toAddress(): string
  }
}

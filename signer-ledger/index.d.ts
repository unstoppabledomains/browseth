export = SignerPrivatekey
export as namespace SignerPrivatekey

declare namespace SignerPrivatekey {
  export { SignerPrivatekey as default, SignerPrivatekey }

  class SignerPrivatekey {
    constructor(privateKey: string | ArrayBuffer | ArrayBufferView)
    signTransaction(transaction: any): ArrayBuffer
    signMessage(message: string, shouldConcat: boolean): ArrayBuffer
    toAddress(): string
  }
}

export = Abi
export as namespace Abi

declare namespace Abi {
  class AbiFunction {
    meta: object
    fullName?: string
    sig?: ArrayBuffer
    canUseNamedInput: boolean
    canUseNamedOutput: boolean

    enc(): string
    dec(): any
  }

  class AbiEvent {
    meta: object
    isAnonymous: boolean
    fullName?: string
    sig?: string
    canUseNamedInput: boolean
    canUseNamedOutput: boolean

    enc(): Array<string | string[]>
    dec(): any
  }

  class AbiCodec {
    constructor(
      abiJsonInterface: object[],
      options?: { bin: string | ArrayBuffer | ArrayBufferView },
    )

    construct(...args): string
    fn: { [key: string]: (...args) => string }
    ev: { [key: string]: (...args) => Array<string | string[]> }
  }
}

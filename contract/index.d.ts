export = ContractNamespace
export as namespace ContractNamespace

declare namespace ContractNamespace {
  export { Contract as default, Contract }

  class Contract {
    constructor(
      ethRef,
      abiJsonInterface: object[],
      options: {
        bin: string | ArrayBuffer | ArrayBufferView
        address: string | ArrayBuffer | ArrayBufferView
      },
    )

    construct(
      ...args
    ): {
      send(params?): Promise<any>
      gas(params?): Promise<any>
      abi: ArrayBuffer
    }

    fallback(): {
      send(params?): Promise<any>
      gas(params?): Promise<any>
    }

    fn: {
      [key: string]: (
        ...args
      ) => {
        send(params?): Promise<any>
        gas(params?): Promise<any>
        call(params?, block?): Promise<any>
        abi: ArrayBuffer
      }
    }

    ev: {
      [key: string]: (
        ...args
      ) => {
        logs(from?, to?, ...addresses): Promise<any[]>
        subscribe(
          from?,
          ...addresses
        ): {
          on(fn: Function): void
          off(fn?: Function): void
          dispose(): void
        }
      }
    }
  }
}

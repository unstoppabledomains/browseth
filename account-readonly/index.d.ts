export = AccountReadonlyNamespace
export as namespace AccountReadonlyNamespace

declare namespace AccountReadonlyNamespace {
  class AccountReadonly {
    id: string

    constructor(
      ethRef,
      options: { from: string | ArrayBuffer | ArrayBufferView },
    )

    address(): Promise<string>
    gas(params: any): Promise<any>
    call(params: any, block: any): Promise<any>
    send(params: any): Promise<never>
    sign(message: string): Promise<never>
  }
}

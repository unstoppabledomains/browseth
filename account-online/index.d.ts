export = AccountOnlineNamespace
export as namespace AccountOnlineNamespace

declare namespace AccountOnlineNamespace {
  class AccountOnline {
    id: string
    cachedAddresses: {
      timestamp: number
      values: null | string[]
    }

    constructor(ethRef, options: { addressTtl: number })

    addresses(): Promise<string[]>

    address(): Promise<string>
    gas(params: any): Promise<any>
    call(params: any, block: any): Promise<any>
    send(params: any): Promise<any>
    sign(message: string): Promise<any>
  }
}

import JsonRpcRequestBatchQueue from '.'

export = Queue
export as namespace Queue

declare namespace Queue {
  export {
    JsonRpcRequestBatchQueue as default,
    JsonRpcRequestBatchQueue,
    JsonRpcRequestQueue,
  }
  class JsonRpcRequestBatchQueue {
    id: number
    url?: string
    headers?: { [key: string]: string | string[] }
    timeout: number
    maxBatchSize: number

    constructor(
      url: string,
      options: {
        timeout: number
        maxBatchSize: number
        headers: { [key: string]: string | string[] }
      },
    )
    constructor(
      web3: {
        currentProvider: {
          send(payload: object | object[]): any
          sendAsync?(payload: object | object[], fn: Function): void
        }
      },
      options: {
        timeout: number
        maxBatchSize: number
      },
    )

    batch(): {
      request(method: string, ...params: string[]): Promise<any>
      requestCb(
        payload: { method: string; params: string[] },
        fn: Function,
      ): void
      send(): Promise<void>
    }
    request(method: string, ...params: string[]): Promise<any>
    requestCb(payload: { method: string; params: string[] }, fn: Function): void
    send(payload: object | object[], fn: Function): void
    sendBatch(payloads: object[], fns: Function[]): Promise<void>
    flush(payloads: object[], fns: Function[]): void
    cleanup(): void
  }

  class JsonRpcRequestQueue {
    id: number
    url?: string
    headers?: { [key: string]: string | string[] }

    constructor(
      url: string,
      options: {
        headers: { [key: string]: string | string[] }
      },
    )
    constructor(web3: {
      currentProvider: {
        send(payload: object | object[]): any
        sendAsync?(payload: object | object[], fn: Function): void
      }
    })

    request(method: string, ...params: string[]): Promise<any>
    requestCb(payload: { method: string; params: string[] }, fn: Function): void
    send(payload: object | object[], fn: Function): void
    cleanup(): void
  }
}

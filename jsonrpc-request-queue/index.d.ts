export = Queue
export as namespace Queue

declare namespace Queue {
  export {
    BufferedJsonRpcRequestQueue as default,
    BufferedJsonRpcRequestQueue,
    JsonRpcRequestQueue,
  }
  class BufferedJsonRpcRequestQueue {
    id: number
    url: string
    timeout: number
    maxBatchSize: number
    headers: { [key: string]: string | string[] }

    constructor(
      url: string,
      options: {
        timeout: number
        maxBatchSize: number
        headers: { [key: string]: string | string[] }
      },
    )
    request(method: string, ...params: string[]): Promise<any>
    cleanup(): void
  }
  class JsonRpcRequestQueue {
    id: number
    url: string
    timeout: number
    headers: { [key: string]: string | string[] }

    constructor(
      url: string,
      options: {
        timeout: number
        headers: { [key: string]: string | string[] }
      },
    )
    request(method: string, ...params: string[]): Promise<any>
    cleanup(): void
  }
}

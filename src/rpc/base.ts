export interface Request<M extends string = string, P extends any[] = any[]> {
  method: M;
  params?: P;
  jsonrpc?: '2.0';
  id?: string | number | null;
}

export const enum ErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
}

export interface RpcError {
  id: number | null;
  jsonrpc: '2.0';
  error: {
    code: ErrorCode;
    message: string;
    data?: any;
  };
}

export interface RpcResponse<R extends any = any> {
  id: number | null;
  jsonrpc: '2.0';
  result: R;
}

export function isRpcError(v: RpcResponse | RpcError): v is RpcError {
  return Boolean((v as RpcError).error);
}

let id = 0;
export abstract class Rpc {
  public send(method: string, ...params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = this.prep(
        {
          method,
          params,
        },
        (err: Error | void, result: any) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        },
      );
      this.handle(request[0], request[1]);
    });
  }

  public batch(
    done: () => void | [Request, (err: Error | void, response: any) => void],
    ...requests: Array<[Request, (err: Error | void, response: any) => void]>
  ) {
    let completionCb: () => void;
    if (typeof done !== 'function') {
      requests.unshift(done);
    } else {
      completionCb = done;
    }
    const payload: Request[] = [];
    const cbs: Function[] = [];
    const preppedRequests = requests.map(([request, cb]) => {
      const prepped = this.prep(request, cb);
      payload.push(prepped[0]);
      cbs.push(prepped[1]);
    });

    this.handle(payload, (err, json) => {
      if (err) {
        cbs.forEach(cb => {
          cb(err);
        });
        return;
      }

      json.forEach((v: any, i: number) => {
        setImmediate(cbs[i], undefined, v);
      });

      if (completionCb) {
        setImmediate(completionCb);
      }
    });
  }

  public async promiseBatch(resolveFun:(...promises: Array<Promise<any>>) => Promise<any[]> | Request, ...requests: Request[]): Promise<any[]> {
    const promises: Array<Promise<any>> = [];

    let rF = Promise.all.bind(Promise);
    if (typeof resolveFun === 'function') {
      rF = resolveFun;
    } else {
      requests.unshift(resolveFun);
    }

    await new Promise(r => {
      this.batch(
        () => {
          r();
        },
        ...requests.map(
          request =>
            [
              request,
              (err: Error | void, response: any) => {
                promises.push(
                  new Promise((resolve, reject) => {
                    if (err) {
                      reject(err);
                    }
                    resolve(response);
                  }),
                );
              },
            ] as [Request, (err: Error | void, response: any) => void],
        ),
      );
    })

    return rF(promises);    
  }

  public prep(
    request: Request,
    cb: (err: Error | void, response?: any) => void,
  ): [Request, ((err: Error | void, json?: any) => void)] {
    const payload: Request = {
      method: request.method,
      params: request.params || [],
      id: request.id || (id += 1),
      jsonrpc: '2.0',
    };

    return [
      payload,
      (err: Error | void, rpcResponse?: RpcResponse | RpcError) => {
        if (err) {
          cb(err);
          return;
        }
        if (rpcResponse && rpcResponse.id === payload.id) {
          if (!isRpcError(rpcResponse)) {
            cb(undefined, rpcResponse.result);
            return;
          }
          cb(new Error(JSON.stringify(rpcResponse)));
          return;
        }
        cb(new Error(`response is malformed: '${rpcResponse}'`));
      },
    ];
  }

  public abstract handle(
    payload: any,
    cb: (err: Error | void, json?: any) => void,
  ): void;
}

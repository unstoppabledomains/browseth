import {isRpcError, Request, RpcError, RpcResponse} from './rpc';

interface ProviderObject {
  send(payload: Request): any;
  send(
    payload: Request,
    cb: (e?: Error, result?: RpcResponse | RpcError) => void,
  ): void;
  // send(payload:  Request,cb?: (e: any, result: any) => void): any | void;
  sendAsync?(
    payload: Request,
    cb: (e?: Error, result?: RpcResponse | RpcError) => void,
  ): void;
}

function createProviderHandle(
  provider: any,
): (
  payload: Request,
  cb: (e?: Error, result?: RpcResponse | RpcError) => void,
) => void {
  if (typeof provider.send !== 'function') {
    throw new TypeError(`provider<${provider}> must have a send method`);
  }

  const typedProvider = provider as ProviderObject;

  if (typeof typedProvider.sendAsync !== 'function') {
    return typedProvider.send.bind(typedProvider);
  }
  return typedProvider.sendAsync.bind(typedProvider);
}

let id = 0;
export class Web3 {
  private _providerHandle: (
    payload: Request,
    cb: (e?: Error, result?: RpcResponse | RpcError) => void,
  ) => void;
  constructor(private provider: any) {
    this._providerHandle = createProviderHandle(provider);
  }

  public send(method: string, ...params: any[]): Promise<any> {
    return new Promise((resolve, reject) =>
      this.handle(
        {
          method,
          params,
        },
        (err, result) => (err ? reject(err) : resolve(result)),
      ),
    );
  }

  public handle(
    request: Request,
    cb: (err: Error | void, response?: any) => void,
  ) {
    const payload: Request = {
      method: request.method,
      params: request.params || [],
      id: request.id || (id += 1),
      jsonrpc: '2.0',
    };

    this._providerHandle(
      payload,
      (err: Error | void, response?: RpcResponse | RpcError) => {
        if (err) {
          cb(err);
          return;
        }

        if (response) {
          if (response && response.id === payload.id) {
            if (!isRpcError(response)) {
              cb(undefined, response.result);
              return;
            }
            cb(new Error(JSON.stringify(response)));
            return;
          }
        }
        cb(new Error('response is malformed'));
      },
    );
  }
}

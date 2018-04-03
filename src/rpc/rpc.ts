import * as Transport from '../transport';

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
export class Rpc {
  constructor(
    public transport: Transport.Handler,
    public endpoint = 'http://localhost:8545',
    public timeout = 30000,
    public headers?: {[k: string]: string | string[]},
  ) {}

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
    const payload = {
      method: request.method,
      params: request.params || [],
      id: request.id || (id += 1),
      jsonrpc: '2.0',
    };

    console.log(payload);

    this.transport.handle(
      {
        url: this.endpoint,
        msg: JSON.stringify(payload),
        headers: {...this.headers, 'Content-Type': 'application/json'},
        timeout: this.timeout,
      },
      (err: Error | void, response?: Transport.Response) => {
        if (err) {
          cb(err);
          return;
        }

        if (response) {
          const rpcResponse = JSON.parse(response!.msg);

          if (rpcResponse && rpcResponse.id === payload.id) {
            if (!isRpcError(rpcResponse)) {
              cb(undefined, rpcResponse.result);
              return;
            }
            cb(new Error(JSON.stringify(response!.msg)));
            return;
          }
        }
        cb(new Error('response is malformed'));
      },
    );
  }
}

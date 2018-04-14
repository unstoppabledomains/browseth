import {isRpcError, Request, Rpc, RpcError, RpcResponse} from './base';

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

export class Web3 extends Rpc {
  constructor(private provider: any) {
    super();
    this.handle = createProviderHandle(provider);
  }

  // STUB
  public handle(
    payload: any,
    cb: (err: Error | void, json?: any) => void,
  ): void {
    /*  */
  }
}

import {All, IData, ITag} from '../rpc/methods';
import {ApiAbstract, RequestObject, ResponseObject} from '../rpc/types';
import {Base as BaseNode} from './base';

interface ProviderObject<Api extends ApiAbstract> {
  send(payload: RequestObject<keyof Api>): any;
  send(
    payload: RequestObject<keyof Api>,
    cb: (e?: Error, result?: ResponseObject) => void,
  ): void;
  // send(payload:  RequestObject<keyof Api>,cb?: (e: any, result: any) => void): any | void;
  sendAsync?(
    payload: RequestObject<keyof Api>,
    cb: (e?: Error, result?: ResponseObject) => void,
  ): void;
}

function createSend<Api extends ApiAbstract>(
  provider: any,
): (
  payload: RequestObject,
  cb: (e?: Error, result?: ResponseObject) => void,
) => void {
  if (typeof provider.send !== 'function') {
    throw new TypeError(`provider<${provider}> must have a send method`);
  }

  const typedProvider = provider as ProviderObject<Api>;

  if (typeof typedProvider.sendAsync !== 'function') {
    return typedProvider.send.bind(typedProvider);
  }
  return typedProvider.sendAsync.bind(typedProvider);
}

export class Web3 extends BaseNode<All> {
  private id: number = 0;

  private providerSend: (
    payload: RequestObject,
    cb: (e?: Error, result?: ResponseObject) => void,
  ) => void;

  constructor(provider: any) {
    super();
    this.providerSend = createSend<All>(provider);
  }

  public send<Method extends keyof All>(
    method: Method,
    params: All[Method]['params'],
  ): Promise<All[Method]['result']> {
    return new Promise(resolve => {
      this.providerSend(
        {
          id: (this.id += 1),
          jsonrpc: '2.0',
          method,
          params,
        },
        (err?: Error, response?: ResponseObject<All[Method]['result']>) => {
          if (err) {
            throw err;
          } else if (response === undefined) {
            throw new Error('no response object');
          } else if (response.error && !response.result) {
            throw new Error(
              `${response.error.code}:${response.error.message}${response.error
                .data && '\n' + response.error.data}`,
            );
          } else if (!response.result) {
            throw new Error('invalid jsonrpc response');
          }

          resolve(response.result);
        },
      );
    });
  }

  public getBalance(address: IData, tag: ITag): Promise<string> {
    // return this.send('eth_getBalance', []);
    throw new Error('Meta-Mask-Provider-Engine has no getBalance');
    // return null!;
  }

  public getGasPrice(): Promise<string> {
    // return this.send('eth_gasPrice', []);
    throw new Error('Meta-Mask-Provider-Engine has no getGasPrice');
    // return null!;
  }
}

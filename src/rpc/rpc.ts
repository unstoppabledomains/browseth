import * as TransportTypes from '../transport/types';
import {Requester} from '../transport/types';
import {ApiAbstract, RequestOptions, Response} from './types';

let id = 0;
function toTransportRequestOptions<
  Api extends ApiAbstract,
  Method extends keyof Api
>(opts: RequestOptions): TransportTypes.RequestOptions {
  return {
    headers: {...opts.headers, 'Content-Type': 'application/json'},
    msg: JSON.stringify({
      id: (id += 1),
      jsonrpc: '2.0',
      method: opts.method,
      params: opts.params,
    }),
    timeout: opts.timeout || 30000,
    url: opts.url,
  };
}

export class Rpc<Api extends ApiAbstract> {
  public static staticOptions: Partial<RequestOptions<any, any>>;
  public defaultOptions: Partial<RequestOptions<any, any>>;

  constructor(
    public transport: Requester,
    public url: string,
    public opts?: Partial<RequestOptions<Api, any>>,
  ) {
    this.defaultOptions = opts || {};
  }

  public async request<Method extends keyof Api>(
    method: Method,
    params: Api[Method]['params'],
    opts?: Partial<RequestOptions<Api, Method>>,
  ): Promise<Response<Api, Method>> {
    const requestOptions = {
      ...Rpc.staticOptions,
      ...this.defaultOptions,
      ...opts,
      method,
      params,
      url: this.url,
    };

    const resp = await this.transport(
      toTransportRequestOptions(requestOptions),
    );
    const parsed = JSON.parse(resp.msg);

    if (parsed.error && !parsed.result) {
      throw new Error(
        `${parsed.error.code}:${parsed.error.message}${parsed.error.data &&
          '\n' + parsed.error.data}`,
      );
    } else if (!parsed.result) {
      throw new Error('invalid jsonrpc response');
    }

    return {
      headers: resp.headers,
      requestOptions,
      result: parsed.result,
      status: resp.status,
    };
  }
}

// const a = {
//   web3_sha3: {
//     params: <[IData]>[''],
//     ptypes: [{type: 'data'}],
//     result: [{type: 'string'}],
//   },
// };
// type a = typeof a;

// type I = {
//   web3_sha3: {
//     params: [string];
//     result: [string];
//   };
//   web3_clientVersion: {
//     params: never[];
//     result: [string];
//   };
// };

// const asdf = new Defaultjsonrpc<I>('asdf');
// asdf.request('web3_sha3', ['string']);

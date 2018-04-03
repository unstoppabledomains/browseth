import {Rpc} from '../rpc';
import {Infura as InfuraApiMethods} from '../rpc/methods';
import Transport from '../transport';
import {Base} from './base';

export enum InfuraNetEnum {
  mainnet = 'mainnet',
  ropsten = 'ropsten',
  infuranet = 'infuranet',
  kovan = 'kovan',
  rinkeby = 'rinkeby',
}

export interface InfuraConstructorParams {
  netEnum?: InfuraNetEnum;
  apikey: string;
}

export class Infura extends Base<InfuraApiMethods> {
  private jsonrpc: Rpc<InfuraApiMethods>;

  constructor(params: InfuraConstructorParams) {
    super();

    this.jsonrpc = new Rpc(
      Transport,
      `https://${params.netEnum || InfuraNetEnum.mainnet}.infura.io/${
        params.apikey
      }`,
    );
  }

  public async send<Method extends keyof InfuraApiMethods>(
    method: Method,
    params: InfuraApiMethods[Method]['params'],
  ): Promise<InfuraApiMethods[Method]['result']> {
    const resp = await this.jsonrpc.request(method, params);
    return resp.result;
  }
}

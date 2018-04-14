import * as Transport from '../transport';
import {Default} from './default';

export class Whitelist extends Default {
  constructor(
    transport: Transport.Handler,
    public whitelist: string[],
    endpoint = 'http://localhost:8545',
    timeout = 30000,
    headers?: {[k: string]: string | string[]},
  ) {
    super(transport, endpoint, timeout, headers);
  }

  public handle(
    request: Request,
    cb: (err: Error | void, response?: any) => void,
  ) {
    if (this.whitelist.indexOf(request.method) !== -1) {
      throw new Error(`'${request.method}' is not allowed`);
    }
    super.handle(request, cb);
  }
}

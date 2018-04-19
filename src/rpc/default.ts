import * as Transport from '../transport';
import {Request, Rpc} from './base';

export class Default extends Rpc {
  constructor(
    public transport: Transport.Handler,
    public endpoint = 'http://localhost:8545',
    public timeout = 0,
    public headers?: {[k: string]: string | string[]},
  ) {
    super();
  }

  public handle(payload: any, cb: (err: Error | void, json?: any) => void) {
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
        try {
          cb(undefined, JSON.parse(response!.msg));
        } catch (e) {
          cb(new Error(`response is malformed: '${response!.msg}'`));
        }
      },
    );
  }
}

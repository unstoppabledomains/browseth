import BN = require('bn.js');
import RequestHandler from '../handler';
import {RpcHandler} from '../rpc';
import {
  ICallTransaction,
  IEstimateTransaction,
  ISendTransaction,
  ITag,
} from './methods';

export abstract class AbstractNodeHandler extends RequestHandler<{
  method: string;
  params: any[];
}> {
  public defaultTag = 'latest';

  constructor(rpc: RpcHandler) {
    super(rpc);
  }

  set rpc(handler: RpcHandler) {
    this.successor = handler;
  }

  // public abstract getAccount(): string;
  // public abstract getAccounts(): string[];
  // public abstract sendTransaction(transaction: ISendTransaction): string;

  public handle(
    request: {
      method: string;
      params: any[];
    },
    cb: (err: Error | void, response: Response) => void,
  ) {
    this.successor.handle(request, cb);
  }
}

// TODO(bp): Make a Credentials System
// public credentials?: {username: string; password: string},

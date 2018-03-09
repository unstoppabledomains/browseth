import { Abi, AbiFunction } from '../abi/index';
import { JsonInterface } from '../abi/types';
import { OData, ITag, OQuantity } from '../rpc/methods';
import * as Wallet from '../wallet/index';

export interface MethodWrapper {
  send: (transaction: any, ...params: any[]) => Promise<OData>;
  estimate: (
    transaction: any,
    tag: ITag,
    ...params: any[]
  ) => Promise<OQuantity>;
  call: (transaction: any, tag: ITag, ...params: any[]) => Promise<any>;
  encode: (...params: any[]) => string;
}

export class Contract {
  public methods: { [key: string]: MethodWrapper } = {};
  private abi: Abi;
  constructor(
    private wallet: Wallet.Base,
    public jsonInterface: JsonInterface,
    public strict: boolean = true,
  ) {
    this.abi = new Abi(jsonInterface);

    this.abi.f.forEach(v => {
      const wrapper: MethodWrapper = {
        send: async (transaction, ...params) => {
          if (
            (strict && (v.payable === false && transaction.value)) ||
            v.constant === true
          ) {
            throw new Error(
              `send of transaction<${transaction}> is incompatable with v<${v}>`,
            );
          }

          return this.wallet.sendTransaction({
            ...transaction,
            data: v.enc(params),
          });
        },
        estimate: async (transaction, tag, ...params) => {
          if (
            (strict && (v.payable === false && transaction.value)) ||
            v.constant === true
          ) {
            throw new Error(
              `estamate of transaction<${transaction}> is incompatable with v<${v}>`,
            );
          }

          return this.wallet.estimateGas(
            { ...transaction, data: v.enc(params) },
            tag,
          );
        },
        call: async (transaction, tag, ...params) => {
          if (strict && (v.payable === false && transaction.value)) {
            throw new Error(
              `call of transaction<${transaction}> is incompatable with v<${v}>`,
            );
          }

          const resp = await this.wallet.ethCall(
            { ...transaction, data: v.enc(params) },
            tag,
          );

          return v.dec(resp);
        },
        encode: (...params: any[]) => v.enc(params),
      };

      if (v.name) {
        this.methods[v.name] = wrapper;
      }
      this.methods[v.sig] = wrapper;
    });

    // this.abi.events.forEach(v => {
    // 	// TODO: Event Binding
    // });
  }
}

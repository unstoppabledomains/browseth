// import {EventEmitter, EventSubscription} from 'fbemitter';
import {EventElement} from './abi';
import {AbiCodec, createAbiCodec, JsonInterface} from './abi';
// import TransactionListener from './transaction-listener';
import {Wallet} from './wallet';

export class Contract {
  public abi: AbiCodec;
  public function: {
    [k: string]: (
      ...params: any[]
    ) => {
      send(transaction?: object): Promise<string>;
      call(transaction?: object, block?: string): Promise<any>;
      gas(transaction?: object, block?: string): Promise<string>;
    };
  };
  public event: {
    [k: string]: (
      topics?: {[k: string]: any | any[]},
    ) => {
      logs(
        ...logOpts: any[]
      ): Promise<
        Array<{
          address: string;
          topics: Array<string | string[]>;
          data: string;
          blockNumber: string;
          transactionHash: string;
          transactionIndex: string;
          blockHash: string;
          logIndex: string;
          removed: boolean;
          decodedTopics: {[k: string]: string};
        }>
      >;
      // subscribe(logOpts: any): EventSubscription;
    };
  };

  constructor(
    public wallet: Wallet,
    jsonInterface: JsonInterface,
    public options: {
      address?: string;
      bytecode?: string; // maybe bin
    } = {},
  ) {
    this.abi = createAbiCodec(jsonInterface);

    this.event = Object.keys(this.abi.event)
      .map((k: string) => this.abi.event[k])
      .reduce((a, v) => {
        const codec = (topics: {[k: string]: any | any[]} = {}) => {
          const encodedTopics = v.encode(topics);
          // console.log(encodedTopics);
          return {
            logs: (
              fromBlock = 'latest',
              toBlock = 'latest',
              address?: string,
            ) =>
              this.wallet.rpc
                .send('eth_getLogs', {
                  fromBlock,
                  toBlock,
                  address: address ? address : this.options.address,
                  topics: encodedTopics,
                })
                .then(logs =>
                  logs.map((log: any) => ({
                    ...log,
                    decodedTopics: v.decode(log),
                  })),
                ),
            // sub(topics: {
            //   [k: string]: any | any[];
            // }): Promise<EventSubscription> {
            //   //
            // },
          };
        };
        return {
          ...a,
          [v.name]: codec,
          [v.signature]: codec,
        };
      }, {});

    this.function = Object.keys(this.abi.function)
      .map(k => this.abi.function[k])
      .reduce((a, v) => {
        const codec = (...params: any[]) => {
          const data = v.encode(...params);

          return {
            batch: {
              send: ({
                transaction = {},
                cb,
              }: {
                transaction?: object;
                cb?: () => void;
              }) =>
                this.wallet.batch.send({
                  to: this.options.address,
                  ...transaction,
                  data,
                  cb,
                }),
              call: ({
                transaction = {},
                block = 'latest',
                cb,
              }: {
                transaction?: object;
                block?: string;
                cb?: () => void;
              }) =>
                this.wallet.batch.call(
                  {
                    to: this.options.address,
                    ...transaction,
                    data,
                  },
                  block,
                  cb,
                ),
              gas: ({
                transaction = {},
                block = 'latest',
                cb,
              }: {
                transaction?: object;
                block?: string;
                cb?: () => void;
              }) =>
                this.wallet.batch.gas(
                  {
                    to: this.options.address,
                    ...transaction,
                    data,
                  },
                  block,
                  cb,
                ),
            },
            send: (transaction = {}) =>
              this.wallet.send({
                to: this.options.address,
                ...transaction,
                data,
              }),
            call: (transaction = {}, block = 'latest') =>
              this.wallet
                .call(
                  {
                    to: this.options.address,
                    ...transaction,
                    data,
                  },
                  block,
                )
                .then(raw => v.decode(raw)),
            gas: (transaction = {}, block = 'latest') =>
              this.wallet.gas(
                {
                  to: this.options.address,
                  ...transaction,
                  data,
                },
                block,
              ),
          };
        };
        return {
          ...a,
          [v.name]: codec,
          [v.signature]: codec,
        };
      }, {});
  }

  public deploy(
    ...params: any[]
  ): {
    send(transaction?: object): Promise<string>;
    gas(transaction?: object, block?: string): Promise<string>;
  } {
    if (
      this.options.bytecode &&
      typeof this.abi.constructor.encode === 'function'
    ) {
      const data = this.abi.constructor.encode(
        this.options.bytecode,
        ...params,
      );

      return {
        send: (transaction = {}) =>
          this.wallet.send({
            to: this.options.address,
            ...transaction,
            data,
          }),
        gas: (transaction = {}, block = 'latest') =>
          this.wallet.gas(
            {
              to: this.options.address,
              ...transaction,
              data,
            },
            block,
          ),
      };
    }
    throw new Error(
      'Must have bytecode and a constructor jsonInterface element to deploy',
    );
  }

  // aliases for the values
  get e() {
    return this.event;
  }
  // get events() {
  //   return this.event;
  // }
  get f() {
    return this.function;
  }
  // get functions() {
  //   return this.function;
  // }
  // get method() {
  //   return this.function;
  // }

  get methods() {
    return this.function;
  }
}

// class Transaction {
//   constructor(public txObj: object, batch: boolean) {
//     return this.send(txObj)
//   }

//   pBatch() {
//     return this.txObj;
//   }

//   batch(cb) {
//     return [this.txObj, cb];
//   }

//   send(rpc) {
//     rpc.send(this.txObj)
//   }
// }

// new Transaction(true) // return Promise<string>;

// b.c.cname.function.batch.send({
//   // transaction
// },
// () => {})

// b.rpc.batch(
//   () => {},
//   b.c.cname.function.fname.batch.send({to: '0x123456789'}, () => {}), // [req, cb] || req if send args
//   b.c.cname.function.fname.batch.send(() => {}),
//   b.c.cname.function.fname.batch.send({}, () => {}),
// )

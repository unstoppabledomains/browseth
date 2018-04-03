// import {EventEmitter, EventSubscription} from 'fbemitter';
import {EventElement} from './abi';
import {AbiCodec, createAbiCodec, JsonInterface} from './abi';
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
      topics: {[k: string]: any | any[]},
    ) => {
      logs(logOpts: any): Promise<object[]>;
      // subscribe(logOpts: any): EventSubscription;
    };
  };

  constructor(
    public wallet: Wallet,
    jsonInterface: JsonInterface,
    public options: {
      address?: string;
      bytecode?: string;
    } = {},
  ) {
    this.abi = createAbiCodec(jsonInterface);

    this.event = Object.keys(this.abi.event)
      .map((k: string) => this.abi.event[k])
      .reduce((a, v) => {
        const codec = (topics: {[k: string]: any | any[]} = {}) => {
          const encodedTopics = v.encode(topics);

          return {
            logs: (
              fromBlock = 'latest',
              toBlock = 'latest',
              address?: string,
            ) =>
              this.wallet.rpc.send('eth_getLogs', {
                fromBlock: '0x1',
                toBlock: '0x2',
                address: address ? address : this.options.address,
                topics: encodedTopics,
              }),
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
          [v.signiture]: codec,
        };
      }, {});

    this.function = Object.keys(this.abi.function)
      .map(k => this.abi.function[k])
      .reduce((a, v) => {
        const codec = (...params: any[]) => {
          const data = v.encode(...params);

          return {
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
          [v.signiture]: codec,
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
}

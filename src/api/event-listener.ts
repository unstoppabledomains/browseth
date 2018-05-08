import {Subscription} from '@ledgerhq/hw-transport';
import {SIGPOLL} from 'constants';
import {EventEmitter, EventSubscription} from 'fbemitter';
import {AbiCodec, createAbiCodec, JsonInterface} from '../abi';
import {Contract} from '../contract';
import {Rpc} from '../rpc';

export interface ContractEvent {
  address: string;
  eventName: string;
  topics: any[];
}

class EventListener {
  public static pollInterval = 500;
  public listeningFor: string[] = [];
  public blockNumber: string;
  public abi: AbiCodec;
  private ee = new EventEmitter();
  private timer: any;

  constructor(
    public rpc: Rpc,
    jsonInterface: JsonInterface,
    private isPolling = false,
    startingBlock = 'latest',
  ) {
    this.abi = createAbiCodec(jsonInterface);
    this.blockNumber = startingBlock;
  }

  public async startPolling(interval = EventListener.pollInterval) {
    if (this.isPolling) {
      return;
    }

    this.isPolling = true;
    
    const done = () => {
      let hasFinishedPolling = false;
      let isPastTimeout = false;

      setTimeout(() => {
        isPastTimeout = true;
        if (hasFinishedPolling && this.isPolling) {
          this.poll(done);
        }
      }, interval);

      this.poll(() => {
        hasFinishedPolling = true;
        if (isPastTimeout && this.isPolling) {
          this.poll(done)
        }
      });
    };

    this.poll(done);
  }
  

  public stopPolling() {
    if (!this.isPolling) {
      return;
    }
    this.isPolling = false;
    clearInterval(this.timer);
  }

  public removeAllListeners() {
    this.ee.removeAllListeners();
    this.listeningFor = [];
  }

  public addEventListener(
    address: string,
    eventName: string,
    topics: any[],
    cb: (logs?: any) => void,
  ) {
    if (typeof this.abi.event[eventName].encode !== 'function') {
      throw new Error("event doesn't exist");
    }

    const contract = JSON.stringify({
      address,
      eventName,
      topics: this.abi.event[eventName].encode(topics),
    });
    this.listeningFor.push(contract);
    const subscription = this.ee.addListener(address, cb);
    return ({
      contract,
      cb,
      remove: () => {
        const index = this.listeningFor.findIndex(
          i => i === contract,
        );
        if (index > -1) {
          this.listeningFor.splice(index, 1);
        }
        subscription.remove();
      }
    });
  }

  private async getBlockNumber() {
    const latest = await this.rpc.send('eth_blockNumber');
    return latest;
  }

  private async poll(done: () => void) {
    if (this.listeningFor.length === 0) {
      done();
      return;
    }

    const latestBlock = await this.getBlockNumber();

    const prep = (contractStr: string) => {
      const contract = JSON.parse(contractStr);
      return (
        [
          {
            method: 'eth_getLogs',
            params: [
              {
                fromBlock: this.blockNumber,
                toBlock: latestBlock,
                address: contract.address,
                topics: contract.topics,
              },
            ],
          },
          (err: void | Error, logs: any) => {
            if (!this.isPolling) {
              return;
            }
            if (err) {
              this.ee.emit('networkError', err);
            }
            if (logs) {
              this.ee.emit(
                contract.address,
                // this.abi.event[contract.eventName].decode(logs),
                logs,
              );
            }
          },
        ] as any
      )
    }
    // console.log('latest', latestBlock, 'current', this.blockNumber);

    this.rpc.batch(done, ...this.listeningFor.map(prep));
    this.blockNumber = latestBlock;
  }
}

export default EventListener;

// import {Subscription} from '@ledgerhq/hw-transport';
// import {SIGPOLL} from 'constants';
// import * as EventEmitter from 'events';
// import {AbiCodec, createAbiCodec, JsonInterface} from '../abi';
// import {Contract} from '../contract';
// import {Rpc} from '../rpc';

// export interface ContractEvent {
//   address: string;
//   eventName: string;
//   topics: any[];
// }

// class EventListener{ // extends EventEmitter {
//   public static pollInterval = 500;
//   public listeningFor: ContractEvent[] = [];
//   public blockNumber: string;
//   public abi: AbiCodec;
//   private ee = new EventEmitter();
//   private timer: any;

//   constructor(
//     public rpc: Rpc,
//     jsonInterface: JsonInterface,
//     private isPolling = false,
//     startingBlock = 'latest',
//   ) {
//     // super();
//     this.abi = createAbiCodec(jsonInterface);
//     this.blockNumber = startingBlock;
//   }

//   public startPolling(interval = EventListener.pollInterval) {
//     if (this.isPolling) {
//       return;
//     }

//     this.isPolling = true;

//     const done = () => {
//       let hasFinishedPolling = false;
//       let isPastTimeout = false;

//       setTimeout(() => {
//         isPastTimeout = true;
//         if (hasFinishedPolling && this.isPolling) {
//           this.poll(done);
//         }
//       }, interval);

//       this.poll(() => {
//         hasFinishedPolling = true;
//         if (isPastTimeout && this.isPolling) {
//           this.poll(done);
//         }
//       });
//     };

//     this.poll(done);
//   }

//   public stopPolling() {
//     if (!this.isPolling) {
//       return;
//     }
//     this.isPolling = false;
//     clearInterval(this.timer);
//   }

//   public removeAllListeners() {
//     this.ee.removeAllListeners();
//     this.listeningFor = [];
//   }

//   public addEventListener(
//     address: string,
//     eventName: string,
//     topics: any[],
//     cb: (receipt?: any) => void,
//   ) {
//     if (typeof this.abi.event[eventName].encode !== 'function') {
//       throw new Error("event doesn't exist");
//     }

//     this.listeningFor.push({
//       address,
//       eventName,
//       topics: this.abi.event[eventName].encode(topics),
//     });

//     const subscription = this.ee.once(address, cb);
//     return subscription;
//   }

//   public async getBlockNumber() {
//     const latest = await this.rpc.send('eth_blockNumber');
//     this.blockNumber = latest;
//     return latest;
//   }

//   private poll(done: any) {
//     if (this.ee.eventNames() === undefined || this.ee.eventNames.length === 0) {
//       done();
//       return;
//     }
//     const prep = (contract: ContractEvent) =>
//       [
//         {
//           method: 'eth_getLogs',
//           params: [
//             {
//               fromBlock: this.blockNumber,
//               toBlock: 'latest',
//               address: contract.address,
//               topics: contract.topics,
//             },
//           ],
//         },
//         (err: void | Error, logs: any) => {
//           if (!this.isPolling) {
//             return;
//           }
//           if (err) {
//             this.ee.emit('networkError', err);
//           }
//           if (logs) {
//             this.ee.emit(
//               contract.address,
//               // this.abi.event[contract.eventName].decode(logs),
//               logs,
//             );
//             // const index = this.listeningFor.findIndex(
//             //   i => i.address === contract.address,
//             // );
//             // if (index > -1) {
//             //   this.listeningFor.splice(index, 1);
//             // }
//           }
//         },
//       ] as any;

//     this.rpc.batch(done, ...this.listeningFor.map(prep));
//   }
// }

// export default EventListener;

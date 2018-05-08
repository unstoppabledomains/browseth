import {Subscription} from '@ledgerhq/hw-transport';
import {SIGPOLL} from 'constants';
import {EventEmitter, EventSubscription} from 'fbemitter';
import {Wallet} from '../wallet';

class TransactionListener {
  public static pollInterval = 500;
  public listeningFor: string[] = [];
  private ee = new EventEmitter();
  private timer: any;

  constructor(public wallet: Wallet, private isPolling = false) {
    if (this.isPolling) {
      this.startPolling();
    }
  }

  public startPolling(interval = TransactionListener.pollInterval) {
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
          this.poll(done);
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

  public resolveTransaction(transactionHash: string) {
    return new Promise((resolve, reject) => {
      this.addTransactionListener(transactionHash, receipt => {
        if (receipt.status === '0x1') {
          resolve(receipt);
          return;
        }
        reject(new Error('not mined'));
      });
    });
  }

  private addTransactionListener(
    transactionHash: string,
    cb: (receipt?: any) => void,
  ): EventSubscription {
    this.listeningFor.push(transactionHash);

    const subscription = this.ee.once(transactionHash, cb);
    return subscription; // this does nothing ///////////////////////////////////////////////////////////
  }

  private poll(done: () => void) {
    if (this.listeningFor.length === 0) {
      done();
      return;
    }

    this.wallet.rpc.batch(
      done,
      ...this.listeningFor.map(
        transactionHash =>
          [
            {method: 'eth_getTransactionReceipt', params: [transactionHash]},
            (err: void | Error, receipt: any) => {
              if (!this.isPolling) {
                return;
              }
              if (err) {
                this.ee.emit('networkError', err);
              }
              if (receipt) {
                this.ee.emit(transactionHash, receipt);
                const transactionIndex = this.listeningFor.indexOf(
                  transactionHash,
                );
                if (transactionIndex > -1) {
                  this.listeningFor.splice(transactionIndex, 1);
                }
              }
            },
          ] as any,
      ),
    );
  }
}

export default TransactionListener;

// const tl = new TransactionListener(new rpc);

// tl.listenForTransaction('adsfasdfasdf');
// tl.listenForTransaction('adsfasdfasdf');
// tl.on('asdfasdfasdf', (err, resp) => {});

// tl.startPolling();
//
// tl.stopPolling();

// browseth.listenForTransaction('0x12345678');
// Browseth.privateTransactionEE.emit('0x21343453');
// browseth.onTransactionMined('0x1234456', receipt => {});
// browseth.onTransactionFail('0x1234456', receipt => {});
// Browseth.rpc.send('')

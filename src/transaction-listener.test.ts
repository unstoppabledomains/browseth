import {resolve} from 'dns';
import {Default} from './rpc';
import TransactionListener from './transaction-listener';
import {NodeHttp} from './transport';
import {Online} from './wallet';

test(
  '',
  async done => {
    const wallet = new Online(new Default(NodeHttp));
    TransactionListener.pollInterval = 2000;

    const t = new TransactionListener(wallet.rpc);
    t.startPolling();

    const receipt = await t.resolveTransaction(
      await wallet.send({
        to: '0x1234567890123456789012345678901234567890',
        value: 2,
      }),
    );

    console.log('receipt', receipt);
  },
  10000,
);

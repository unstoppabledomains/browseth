import {resolve} from 'dns';
import {Default} from '../rpc';
import {NodeHttp} from '../transport';
import {Online} from '../wallet';
import TransactionListener from './transaction-listener';

test(
  '',
  async (done) => {
    const wallet = new Online(new Default(NodeHttp, 'https://mainnet.infura.io/mew'));
    TransactionListener.pollInterval = 2000;


    const t = new TransactionListener(wallet);
    t.startPolling();
    console.log(await t.resolveTransaction(
      '0x318c3a828a65bd20452064fbe1076dfd8efc2d9a67fa82c93b4941dfd887ad60'
    ));
    
    // const receipt = await t.resolveTransaction(
    //   await wallet.send({
    //     to: '0x1234567890123456789012345678901234567890',
    //     value: 2,
    //   }),
    // );

    // console.log('receipt', receipt);
  },
  200000,
);

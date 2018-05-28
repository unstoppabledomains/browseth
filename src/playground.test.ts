import HWTransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import Browseth from '.';
import {keccak256} from './crypto';
import {Default, Rpc} from './rpc';

import {BN} from 'bn.js';
import {randomBytes} from 'crypto';
import * as web3 from 'web3';
import * as NodeHttp from './transport/node-http';
import {Wallet} from './wallet';

Browseth.transport = NodeHttp;
Browseth.Signers.Ledger.Transport = HWTransportNodeHid as any;

const simple = [
  {
    constant: false,
    inputs: [{name: 'a', type: 'string'}, {name: 'b', type: 'string'}],
    name: 'f',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{name: 'a', type: 'uint256'}, {name: 'b', type: 'uint256'}],
    name: 'add',
    outputs: [{name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, name: 'a', type: 'string'},
      {indexed: true, name: 'b', type: 'string'},
    ],
    name: 'Test',
    type: 'event',
  },
];
const bin =
  '608060405234801561001057600080fd5b50610187806100206000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806318159cfb14610051578063771602f714610097575b600080fd5b6100956004803603810190808035906020019082018035906020019190919293919293908035906020019082018035906020019190919293919293905050506100e2565b005b3480156100a357600080fd5b506100cc600480360381019080803590602001909291908035906020019092919050505061014e565b6040518082815260200191505060405180910390f35b818160405180838380828437820191505092505050604051809103902084846040518083838082843782019150509250505060405180910390207f74cb234c0dd0ccac09c19041a69978ccb865f1f44a2877a009549898f6395b1060405160405180910390a350505050565b60008183019050929150505600a165627a7a72305820dfbb700f57eda16a1cbc1cccde42304941c07f90e852c59105afc812c988a61e0029';

fit('', async () => {
  // const b = new Browseth('https://mainnet.infura.io/mew').addContract(
  //   'simple',
  //   simple,
  //   {address: '0x9eead2301792af12115d125c48966246e5b455a1'},
  // );

  // console.log(
  //   'add',
  //   await b.c.simple.e.Added().logs('0x' + (5637702).toString(16)),
  // );
  // console.log(
  //   'fin',
  //   await b.c.simple.e.Finished().logs('0x' + (5637702).toString(16)),
  // );
  // console.log(
  //   'for',
  //   await b.c.simple.e.Forfeited().logs('0x' + (5637702).toString(16)),
  // );
  // console.log(
  //   'with',
  //   await b.c.simple.e.Withdrawn().logs('0x' + (5637702).toString(16)),
  // );

  const keystore =
    '{"version":3,"id":"b919560d-346b-44d4-92a9-8059c6ee7989","address":"82137e3b5a4fd84250bbfbad8c58e65a4460f991","Crypto":{"ciphertext":"f599218f7155512595ee5f191ae922f2c61ba6560c1ac283a1162569f3f490ba","cipherparams":{"iv":"629773b80c288af597383d029ce4a24d"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"a41900b88518ffd14ee04bbac893d705e4231d52580c9bc72f3c277e663892cd","n":8192,"r":8,"p":1},"mac":"2dd028de90423af0c47549afa819c52a99bd36df2cbf11ad3b386aec79a203ba"}}';
  const pw = '111111111';
  const b = new Browseth();
  b.wallet = new Browseth.Wallets.Online(b.rpc);
  // console.log('my address:', await b.wallet.account());
  // console.log('my balance:', await b.rpc.send('eth_getBalance', await b.wallet.account(), 'latest'));
  // b.wallet = new Browseth.Wallets.Offline(b.rpc, Browseth.Signers.PrivateKey.fromV3(keystore, pw));
  // console.log('my address:', await b.wallet.account());
  // console.log('my balance:', await b.rpc.send('eth_getBalance', await b.wallet.account(), 'latest'));
  // b.setGasPrice('8');
  // const t = await b.wallet.send({
  //   to: '0x9971404CD2c28F824b6321793c94d9B9A1ca76F8',
  //   value: '0xf12f1',
  //   chainId: 123,
  // });
  // console.log('tx:', t);
  // console.log('their balance:', await b.rpc.send('eth_getBalance', '0x9971404CD2c28F824b6321793c94d9B9A1ca76F8', 'latest'));
  // console.log('gas price:', b.wallet.options.gasPrice);
  // console.log(b.wallet.options.gasPrice);

  b.addContract('Simple', simple as any, {bytecode: bin});
  const txh = await b.c.Simple.deploy().send();
  const txl = new Browseth.Apis.TransactionListener(b.wallet);
  txl.startPolling();
  const tx = await txl.resolveTransaction(txh);
  // console.log('TX', tx);
  b.c.Simple.options.address = tx.contractAddress;
  await b.c.Simple.f.f('hello', 'world').send();
  await b.c.Simple.f
    .f(
      'on the next episode of dragon ball z frieza and cell join forces to put a stop to goku and the z squad',
      'badger badger badger badger badger badger badger badger badger badger badger badger mushroom mushroom',
    )
    .send();
  console.log(
    await b.c.Simple.e
      .Test({
        a: [
          'asd',
          'on the next episode of dragon ball z frieza and cell join forces to put a stop to goku and the z squad',
        ],
        b:
          'badger badger badger badger badger badger badger badger badger badger badger badger mushroom mushroom',
      })
      .logs(0),
  );
});

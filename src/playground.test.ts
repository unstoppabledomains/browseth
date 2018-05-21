import HWTransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import {BN} from 'ethereumjs-util';
import {provider} from 'ganache-core';
import Browseth from '.';
import {keccak256} from './crypto';
import {Default, Rpc} from './rpc';

import {randomBytes} from 'crypto';
import * as NodeHttp from './transport/node-http';
import * as Xhr from './transport/xhr';
import {Wallet} from './wallet';

const simple =
  '[{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"add","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]';
const bin =
  '608060405234801561001057600080fd5b5060c58061001f6000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063771602f7146044575b600080fd5b348015604f57600080fd5b5060766004803603810190808035906020019092919080359060200190929190505050608c565b6040518082815260200191505060405180910390f35b60008183019050929150505600a165627a7a72305820d33e45d5f6cc9627f6b61d94c1d8d597a800d698c723d1b41ae2b5a022e8d56b0029';
// Browseth.transport = NodeHttp;
Browseth.Signers.Ledger.Transport = HWTransportNodeHid as any;

test('', async () => {
  // const b = new Browseth('https://mainnet.infura.io/mew');
  const b = new Browseth();
  b.wallet = new Browseth.Wallets.Online(b.rpc);
  b.addContract('simple', simple, {
    bytecode: bin,
  });

  b.addApi('tx', new Browseth.Apis.TransactionListener(b.wallet));
  b.api.tx.startPolling();
  const txreciept = await b.api.tx.resolveTransaction(
    await b.c.simple.deploy().send(),
  );
  b.c.simple.options.address = txreciept.contractAddress;
  // console.log(await b.c.simple.f.add(1, 2).call());
  const requests = [];

  requests.push(
    await b.c.simple.f.add(1, 2).batch.call({
      cb: (e, r) => {
        console.log(r);
      },
    }),
  );
  requests.push(
    await b.c.simple.f.add(3, 2).batch.call({
      cb: (e, r) => {
        console.log(r);
      },
    }),
  );
  // await b.rpc.batch(() => {
  //   console.log('done!');
  // }, ...requests);
  console.log(...requests);

  // b.wallet = new Browseth.Wallets.Online(b.rpc);

  // const l = new Browseth.Signers.Ledger();
  // b.wallet = new Browseth.Wallets.Offline(b.rpc, l);
  // const qwe = await b.wallet.account(0).catch(e => {
  //   console.error(e);
  // });
  // console.log(qwe);

  // const block = await b.rpc.send('eth_blockNumber');
  // console.log(block);

  // await b.wallet.send({
  //   to:
  //   value:
  //   gasPrice: '0x1',
  // });

  // const sumGuysSigner = new Browseth.Signers.PrivateKey(PRIVATE_KEY);
  // const hisAddress = await sumGuysSigner.account();
});
// const addr1 = '0x11c9D4Dc5B34dDD7F4eA03E59402404a170DFeF7';
//   const addr2 = '0x9490E324203D77937d9ae041F65878901f7e3948';

//   const requests = [
//     {
//       method: 'eth_getBalance',
//       params: [addr1, 'latest',],
//     }, {
//       method: 'eth_getBalance',
//       params: [addr2, 'latest',]
//     }

//   ];

//   const ps = await (b.rpc.promiseBatch( ...requests));

//   console.log(ps);

// b.addContract('contractName', '[]');

// const subscription = b.contract.contractName.event
//   .MyEventName({})
//   .subscribe(() => {});

// b.contract.contractName.event.MyEventName({}).logs();

// await onlineWallet.send({
//   to: await offlineWallet.account(),
//   value: '0x' + (123456789).toString(16),
//   gasPrice: '0x1',
// });

// console.log(await offlineWallet.account());

// await offlineWallet.send({
//   to: await onlineWallet.account(),
//   value: '0x' + (12345).toString(16),
//   gasPrice: '0x1',
// });

// console.log(
//   await b.rpc.send('eth_getBalance', await offlineWallet.account(), 'latest'),
// );
// console.log(
//   await b.rpc.send(
//     'eth_getTransactionReceipt',
//     '0xde95d10b5937fa19ee828db49bdbc10d9aaa72b4cc0c54953abebfc19d13d8ff',
//   ),
// );

//   b.addContract(
//     'ethRegistrar',
//     '[{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"releaseDeed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getAllowedTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"unhashedName","type":"string"}],"name":"invalidateName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"},{"name":"owner","type":"address"},{"name":"value","type":"uint256"},{"name":"salt","type":"bytes32"}],"name":"shaBid","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"bidder","type":"address"},{"name":"seal","type":"bytes32"}],"name":"cancelBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"entries","outputs":[{"name":"","type":"uint8"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_salt","type":"bytes32"}],"name":"unsealBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"transferRegistrars","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"sealedBids","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"newOwner","type":"address"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_timestamp","type":"uint256"}],"name":"isAllowed","outputs":[{"name":"allowed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"finalizeAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"registryStarted","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"launchLength","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sealedBid","type":"bytes32"}],"name":"newBid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"labels","type":"bytes32[]"}],"name":"eraseNode","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hashes","type":"bytes32[]"}],"name":"startAuctions","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"deed","type":"address"},{"name":"registrationDate","type":"uint256"}],"name":"acceptRegistrarTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"startAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rootNode","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"hashes","type":"bytes32[]"},{"name":"sealedBid","type":"bytes32"}],"name":"startAuctionsAndBid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"_ens","type":"address"},{"name":"_rootNode","type":"bytes32"},{"name":"_startDate","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"AuctionStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"bidder","type":"address"},{"indexed":false,"name":"deposit","type":"uint256"}],"name":"NewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"status","type":"uint8"}],"name":"BidRevealed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"HashRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"HashReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"name","type":"string"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"HashInvalidated","type":"event"}]',
//     {
//       address: '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef',
//     },
//   );

//   // const ledgerWallet = new Wallets.Offline(b.rpc, new Signers.Ledger());
//   // b.wallet = ledgerWallet;

//   console.log(
//     await b.contract.ethRegistrar.function
//       .state(
//         '0x0aad943de3669df70ed8e294a0a7b46b8c1d01f62ad84b66154f75f0f67c47d6',
//       )
//       .call(),
//   );

//   beth.wallet = new Wallets.Online(beth.rpc);
// });

// b.addContract('myContract', json, {
//   address: '0x12345678',
//   bytecode: '00112233'
// })

// const txhash = await b.c.myContract.deploy('arg1', 'arg2').send();
// b.c.myContract.options.address = (await b.api.tx.resolveTransaction(txhash)).contractAddress

// b.c.myContract.function.myfunc('arg1').send()

// function MyContract(string arg1, string arg2) {

// }

// b.c.myContract.event.MyEvent({
//   indexedParam2: ['val', 'asdfas'],
// }).logs('0x234', 'latest' ,'0x1234');

// .logs() 'latest','lateset', '0x12324'

// .logs({
//   fromBlock: '',
//   toBlock: '',
//   address: ''
// })

// abiCodec.constructor.encode('adsf', 'args');
// abiCodec.function.myFunc.decode('0x123456789'); // raw eth_call result
// abiCodec.function.myFunc.decode('0x123456789');

// b.c.myContract.abi.constructor.encode;

// 'https://mainnet.infura.io/MY_API_KEY' // node uri

// 'ipc://'

// // if you want to use injected web3 provider
// new Rpcs.Web3(window.web3.currentProvider);

// encoded stuff

// 0x2345898765678986545678765...

// // signature keccak('fname(uint256,bool,bytes)').slice(0,8)
// 0x12345678
// // static encoded params fixed width
// 12345678901234567890123456789011234567890123456789012345678901
// // offset for dynamic params
// 00000000000000000000000000000000000000000000000000000000003000
// 12345678901234567890123456789011234567890123456789012345678901
// // dynamic params after
// 00001234567896567876567876567876567876567876567876789876787678
// 23421234567896567876567876567876567876567876567876789876787678

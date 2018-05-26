import HWTransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import Browseth from '.';
import {keccak256} from './crypto';
import {Default, Rpc} from './rpc';

import {BN} from 'bn.js'
import {randomBytes} from 'crypto';
import * as web3 from 'web3';
import * as NodeHttp from './transport/node-http';
import {Wallet} from './wallet';

Browseth.transport = NodeHttp;
Browseth.Signers.Ledger.Transport = HWTransportNodeHid as any;

const simple =
  '[{"constant":false,"inputs":[{"name":"addrs","type":"address[]"}],"name":"removeAddressesFromWhitelist","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"removeAddressFromWhitelist","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_salt","type":"bytes32"}],"name":"reveal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"addAddressToWhitelist","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_shaBid","type":"bytes32"}],"name":"getBid","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bytes32"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_shaBid","type":"bytes32"}],"name":"finalize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_shaBid","type":"bytes32"}],"name":"bid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"whitelist","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_shaBid","type":"bytes32"},{"name":"reward","type":"uint256"},{"name":"_cypherBid","type":"bytes"},{"name":"_gasPrices","type":"bytes8"}],"name":"add","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"addrs","type":"address[]"}],"name":"addAddressesToWhitelist","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_shaBid","type":"bytes32"}],"name":"forfeit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newRegistrar","type":"address"}],"name":"setRegistrar","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_registrar","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"shaBid","type":"bytes32"},{"indexed":true,"name":"gasPrices","type":"bytes8"},{"indexed":false,"name":"cypherBid","type":"bytes"}],"name":"Added","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"shaBid","type":"bytes32"}],"name":"Finished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"shaBid","type":"bytes32"}],"name":"Forfeited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Withdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"}],"name":"WhitelistedAddressAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"}],"name":"WhitelistedAddressRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]';

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

  const keystore = '{"version":3,"id":"b919560d-346b-44d4-92a9-8059c6ee7989","address":"82137e3b5a4fd84250bbfbad8c58e65a4460f991","Crypto":{"ciphertext":"f599218f7155512595ee5f191ae922f2c61ba6560c1ac283a1162569f3f490ba","cipherparams":{"iv":"629773b80c288af597383d029ce4a24d"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"a41900b88518ffd14ee04bbac893d705e4231d52580c9bc72f3c277e663892cd","n":8192,"r":8,"p":1},"mac":"2dd028de90423af0c47549afa819c52a99bd36df2cbf11ad3b386aec79a203ba"}}';
  const pw = '111111111';
  const b = new Browseth();
  // b.wallet = new Browseth.Wallets.Online(b.rpc);
  // console.log('my address:', await b.wallet.account());
  // console.log('my balance:', await b.rpc.send('eth_getBalance', await b.wallet.account(), 'latest'));
  b.wallet = new Browseth.Wallets.Offline(b.rpc, Browseth.Signers.PrivateKey.fromV3(keystore, pw));
  console.log('my address:', await b.wallet.account());
  // console.log('my balance:', await b.rpc.send('eth_getBalance', await b.wallet.account(), 'latest'));
  b.setGasPrice('8');
  const t = await b.wallet.send({
    to: '0x9971404CD2c28F824b6321793c94d9B9A1ca76F8',
    value: '0xf12f1',
    chainId: 123,
  });
  console.log('tx:', t);
  console.log('their balance:', await b.rpc.send('eth_getBalance', '0x9971404CD2c28F824b6321793c94d9B9A1ca76F8', 'latest'));
  console.log('gas price:', b.wallet.options.gasPrice);
  // console.log(b.wallet.options.gasPrice);

});

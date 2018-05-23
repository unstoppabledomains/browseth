import HWTransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import Browseth from '.';
import {keccak256} from './crypto';
import {Default, Rpc} from './rpc';

import {BN} from 'bn.js'
import {randomBytes} from 'crypto';
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

 
  // includes decimal place 
  console.log(Browseth.Units.toWei(12345.678));
  console.log(Browseth.Units.toWei('12345.678'));
  console.log(Browseth.Units.toWei('12345.12345678912345678909875654321', 'tether'));
  console.log(Browseth.Units.toWei('12345.12345678912345678909875654321', 'gwei'));
  console.log(Browseth.Units.toWei('12345.12345678912345678909875654321', 'wei'));

  // ignores decimal place
  console.log(Browseth.Units.toWei(new BN(12345.678)));
  console.log(Browseth.Units.toWei('0x3039.AD916872B020C49BA5E3'));
  console.log(Browseth.Units.toWei('0X3039.AD916872B020C49BA5E3'));
  console.log(Browseth.Units.toWei('0x3039'));
  // console.log(Browseth.Units.toWei(new BN(12345).toString()));
});


import HWTransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import Browseth from '.';
import {keccak256} from './crypto';
import {Default, Rpc} from './rpc';

import {BN} from 'bn.js';
import {randomBytes} from 'crypto';
import * as Web3 from 'web3';
import * as NodeHttp from './transport/node-http';
import {Wallet} from './wallet';

import * as fs from 'fs';
import {pbkdf2} from 'libp2p-crypto';
import {Bzz, Ipfs} from './fs';

Browseth.transport = NodeHttp;
Browseth.Signers.Ledger.Transport = HWTransportNodeHid as any;

fit('', async () => {
  const b = new Browseth('https://mainnet.infura.io/mew');
  b.wallet = new Browseth.Wallets.Offline(
    b.rpc,
    Browseth.Signers.PrivateKey.fromHex(
      'ad55a3365f25186d5ada49cdeb44eb0cfcd1b8523e90f7014031a963fec8cca1',
    ),
  );
  const ensLookup = new Browseth.Apis.EnsLookup(b.wallet);
  const node = Browseth.nameUtil.namehash('timjose.eth');
  const addr = await ensLookup.getAddress(node);
  console.log(addr);
});

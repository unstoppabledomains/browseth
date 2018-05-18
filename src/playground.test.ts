import HWTransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import {BN} from 'ethereumjs-util';
import {provider} from 'ganache-core';
import Browseth from '.';
import {keccak256} from './crypto';
import {Default, Rpc} from './rpc';

import {randomBytes} from 'crypto';
import * as NodeHttp from './transport/node-http';
import {Wallet} from './wallet';

Browseth.transport = NodeHttp;
Browseth.Signers.Ledger.Transport = HWTransportNodeHid as any;

const simple = [
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, name: 'iui', type: 'uint256'},
      {indexed: false, name: 's', type: 'string'},
      {indexed: false, name: 'ui', type: 'uint256'},
    ],
    name: 'Event',
    type: 'event',
  },
];

const bin =
  '6080604052348015600f57600080fd5b5060408051601460208201528181526005818301527f68656c6c6f000000000000000000000000000000000000000000000000000000606082015290516032917f9a8638d69c886c4aa29475d78d676e6ea25b41e1d94f912950dea370ae50c647919081900360800190a260358060876000396000f3006080604052600080fd00a165627a7a723058208bd3c9120601fd160a671245103044ee271a54a9eced41b4f71abfcb9f8b81980029';

fit('', async () => {
  const b = new Browseth().addContract('simple', simple as any, {
    bytecode: bin,
  });
  b.addApi('tx', new Browseth.Apis.TransactionListener(b.w));
  b.api.tx.startPolling();

  b.wallet = new Browseth.Wallets.Online(b.rpc);

  const hash = await b.c.simple.deploy().send();
  console.log(hash);

  const receipt = await b.api.tx.resolveTransaction(hash);
  console.log(receipt);

  const logs = await b.c.simple.e.Event().logs();
  console.log(logs);
});

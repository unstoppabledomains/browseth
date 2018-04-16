import HWTransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import ETx = require('ethereumjs-tx');
import {ecrecover, publicToAddress, toBuffer} from 'ethereumjs-util';
import {keccak256} from '../crypto';
import {Ledger} from './ledger';

Ledger.Transport = HWTransportNodeHid;

xit('ledgerInstance.account()', () => {
  const ledger = new Ledger();
  expect(ledger.account()).resolves.toMatch(/^0x[a-fA-F\d]{40}$/);
});

xit('ledgerInstance.signMessage()', async () => {
  const ledger = new Ledger();
  const address = await ledger.account();
  const message = 'hello';

  const hash = keccak256(
    '\u0019Ethereum Signed Message:\n' + message.length.toString() + message,
  );

  const sig = Buffer.from(
    (await ledger.signMessage('hello')).replace('0x', ''),
    'hex',
  );

  expect(
    '0x' +
      publicToAddress(
        ecrecover(
          hash,
          sig[64] < 27 ? sig[64] + 27 : sig[64],
          sig.slice(0, 32),
          sig.slice(32, 64),
        ),
      ).toString('hex'),
  ).toBe(address);
});

const signTransactionTests: Array<[string, number, string]> = [
  [
    Ledger.dPath.mainNet,
    0,
    '{"nonce":"0x00","gasPrice":"0x00","gasLimit":"0x01","to":"0x0000000000000000000000000000000000000000","value":"0x00","data":"0x00"}',
  ],
  [
    Ledger.dPath.mainNet,
    0,
    '{"nonce":"0x00","gasPrice":"0x098bca5a00","gasLimit":"0x5208","to":"0x0000000000000000000000000000000000000000","value":"0x0de0b6b3a7640000","data":"0x00"}',
  ],
  [
    Ledger.dPath.testNet,
    0,
    '{"nonce":"0x5","gasPrice":"0x098bca5a00","gasLimit":"0x5208","to":"0x0000000000000000000000000000000000000000","value":"0x00","data":"0x00123456789012345678"}',
  ],
  [
    Ledger.dPath.mainNet,
    0,
    '{"nonce":"0x03","gasPrice":"0x33b9","gasLimit":"0x0145a432","to":"0x000000000000000000000000000000000000dead","value":"0x12327dd14627a1f80000","data":"0x1223"}',
  ],
  [
    Ledger.dPath.mainNet,
    0,
    '{"nonce":"0x00","gasPrice":"0x00","gasLimit":"0x00","to":"0x0000000000000000000000000000000000000000","value":"0x00","data":"0x00"}',
  ],
];

xdescribe('ledgerInstance.signTransaction()', () => {
  signTransactionTests.forEach(([dpath, index, transaction]) => {
    it(`${dpath}${index} && ${transaction}`, async () => {
      const ledger = new Ledger(dpath, index);
      const address = await ledger.account();
      const rawTransaction = await ledger.signTransaction(
        JSON.parse(transaction),
      );
      const etx = new ETx(Buffer.from(rawTransaction.replace('0x', ''), 'hex'));
      etx.verifySignature();
      expect('0x' + etx.from.toString('hex')).toBe(address.toLowerCase());
    });
  });
});

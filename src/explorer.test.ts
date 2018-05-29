import {BN} from 'bn.js';
import {setupMaster} from 'cluster';
import Browseth from '.';
import {TransactionListener} from './api';
import * as NodeHttp from './transport/node-http';

Browseth.transport = NodeHttp;

// REQUIRES GETH TO BE RUNNING

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

const b = new Browseth();
b.wallet = new Browseth.Wallets.Online(b.rpc);
const transactionListener = new Browseth.Apis.TransactionListener(b.wallet);
transactionListener.startPolling();
b.addContract('Simple', simple as any, {bytecode: bin});
let transactionHash;
let transaction;
let e;

describe('transaction.receipt', () => {
  it('returns receipt', async done => {
    transactionHash = await b.c.Simple.deploy().send();
    transaction = (await transactionListener.resolveTransaction(
      transactionHash,
    )) as any;
    b.c.Simple.options.address = transaction.contractAddress;
    await b.c.Simple.f.f('hello', 'world').send();
    await b.c.Simple.f
      .f(
        'on the next episode of dragon ball z frieza and cell join forces to put a stop to goku and the z squad',
        'badger badger badger badger badger badger badger badger badger badger badger badger mushroom mushroom',
      )
      .send();
    e = new Browseth.BlockChainExplorer(b.rpc);
    await e.transaction.receipt(transactionHash);
    done();
  });
  it('returns null when necessary', async done => {
    await e.transaction.receipt(
      '0x1231231231231231231231231231231231231231231231231231231231231231',
    );
    done();
  });
});

describe('transaction.byBlockAndIndex', () => {
  it('accepts string block and string index', async done => {
    await e.transaction.byBlockAndIndex('0x41', '0x0');
    done();
  });
  it('accepts number block, returns null when necessary', async done => {
    await e.transaction.byBlockAndIndex(65234234324235235, '0x0');
    done();
  });
  it('accepts hash block and number index', async done => {
    await e.transaction.byBlockAndIndex(
      '0xb7e2c7b05da9e72dc1febdf7e8a156216b6f172e2ce96c0a94d69517212ea5e8',
      0,
    );
    done();
  });
});

describe('transaction.byHash', () => {
  it('works', async done => {
    await e.transaction.byHash(transactionHash);
    done();
  });
  it('returns null when necessary', async done => {
    await e.transaction.byHash(
      '0x1231231231231231231231231231231231231231231231231231231231231231',
    );
    done();
  });
});

describe('transaction.countByBlock', () => {
  it('takes hash block', async done => {
    await e.transaction.countByBlock(
      '0xb7e2c7b05da9e72dc1febdf7e8a156216b6f172e2ce96c0a94d69517212ea5e8',
    );
    done();
  });
  it('takes number block', async done => {
    await e.transaction.countByBlock(65);
    done();
  });
  it('takes string block, returns null when necessary', async done => {
    await e.transaction.countByBlock('0x5231123213242');
    done();
  });
});

describe('.block()', () => {
  it('takes block as a string', async done => {
    await e.block('0x65');
    done();
  });
  it('takes block as a number, returns null when necessary', async done => {
    await e.block(1298172983712);
    done();
  });
  it('takes block as a hash', async done => {
    await e.block(
      '0xb7e2c7b05da9e72dc1febdf7e8a156216b6f172e2ce96c0a94d69517212ea5e8',
    );
    done();
  });
});

describe('.blockCount()', () => {
  it('returns a block number', async done => {
    await e.blockCount();
    done();
  });
});

describe('.uncle()', () => {
  it('takes block as a string', async done => {});
});

// const deployedCode = await e.codeAt(transaction.contractAddress, 'latest');
// expect(deployedCode).toBe('0x' + bin.slice(64));

import {BN} from 'bn.js';
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
  '608060405261303960005560006001557f6173640000000000000000000000000000000000000000000000000000000000600360006101000a8154816fffffffffffffffffffffffffffffffff0219169083700100000000000000000000000000000000900402179055506021600360106101000a81548163ffffffff021916908363ffffffff160217905550610360600360146101000a81548163ffffffff021916908363ffffffff1602179055503480156100bb57600080fd5b50610187806100cb6000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806318159cfb14610051578063771602f714610097575b600080fd5b6100956004803603810190808035906020019082018035906020019190919293919293908035906020019082018035906020019190919293919293905050506100e2565b005b3480156100a357600080fd5b506100cc600480360381019080803590602001909291908035906020019092919050505061014e565b6040518082815260200191505060405180910390f35b818160405180838380828437820191505092505050604051809103902084846040518083838082843782019150509250505060405180910390207f74cb234c0dd0ccac09c19041a69978ccb865f1f44a2877a009549898f6395b1060405160405180910390a350505050565b60008183019050929150505600a165627a7a723058201e9f7a95312a204e368a1d7f22c900b0c64f0c49cf479173faf1e0755cdd46da0029';

const b = new Browseth();
b.wallet = new Browseth.Wallets.Online(b.rpc);

const transactionListener = new Browseth.Apis.TransactionListener(b.wallet);
transactionListener.startPolling();

b.addContract('Simple', simple as any, {bytecode: bin});

let transactionHash;
let transaction;
const e = new Browseth.BlockChainExplorer(b.rpc);

describe('transaction.receipt', () => {
  it('returns receipt', async done => {
    transactionHash = await b.c.Simple.deploy().send();
    transaction = (await transactionListener.resolveTransaction(
      transactionHash,
    )) as any;
    console.log(transaction);
    b.c.Simple.options.address = transaction.contractAddress;
    await b.contract.Simple.function.f('hello', 'world').send();
    await b.c.Simple.f
      .f(
        'on the next episode of dragon ball z frieza and cell join forces to put a stop to goku and the z squad',
        'badger badger badger badger badger badger badger badger badger badger badger badger mushroom mushroom',
      )
      .send();
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
    const a = await e.transaction.byBlockAndIndex(
      '0xb7e2c7b05da9e72dc1febdf7e8a156216b6f172e2ce96c0a94d69517212ea5e8',
      0,
    );
    // console.log(a);
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
    await e.block('0x65', false);
    done();
  });
  it('takes block as a number, returns null when necessary', async done => {
    await e.block(1298172983712, false);
    done();
  });
  it('takes block as a hash', async done => {
    await e.block(
      '0xb7e2c7b05da9e72dc1febdf7e8a156216b6f172e2ce96c0a94d69517212ea5e8',
      true,
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
  it('takes block as a string, index as string, returns null', async done => {
    await e.uncle('0x66', '0x1');
    done();
  });
  it('takes block as a number, index as number', async done => {
    await e.uncle(123, 0);
    done();
  });
  it('takes block as a hash', async done => {
    await e.uncle(
      '0xb7e2c7b05da9e72dc1febdf7e8a156216b6f172e2ce96c0a94d69517212ea5e8',
      0,
    );
    done();
  });
});

describe('.uncleCount()', () => {
  it('takes block as a string, returns null', async done => {
    await e.uncleCount('0x23');
    done();
  });
  it('takes block as a number', async done => {
    await e.uncleCount(234);
    done();
  });
  it('takes block as a hash', async done => {
    await e.uncleCount(
      '0xb7e2c7b05da9e72dc1febdf7e8a156216b6f172e2ce96c0a94d69517212ea5e8',
    );
    done();
  });
});

describe('.balanceOf()', () => {
  it('accepts latest', async done => {
    await e.balanceOf('0x8734fF23f448FaBEc750a341f71dBA19E5571c38', 'latest');
    done();
  });
  it('accepts block as string', async done => {
    await e.balanceOf('0x8734fF23f448FaBEc750a341f71dBA19E5571c38', '0x0');
    done();
  });
  it('accepts block as number', async done => {
    await e.balanceOf('0x8734fF23f448FaBEc750a341f71dBA19E5571c38', 0);
    done();
  });
});

describe('.hashRate()', () => {
  it('works', async done => {
    await e.hashRate();
    done();
  });
});

describe('.chainId()', () => {
  it('works', async done => {
    await e.chainId();
    done();
  });
});

describe('.client()', () => {
  it('works', async done => {
    await e.client();
    done();
  });
});

describe('.codeAt()', () => {
  it('produces matching bytecode with first [constructor?] characters removed', async done => {
    const deployedCode = await e.codeAt(transaction.contractAddress, 'latest');
    expect(deployedCode).toBe('0x' + bin.slice(406)); // + bin.slice(64));
    done();
  });
});

//////////////////////////////////////////////////////////////////////////////////////////

describe('.protocolVersion()', () => {
  it('works', async done => {
    const a = await e.protocolVersion();
    // console.log(a);
    done();
  });
});

describe('.sshVersion()', () => {
  it('works', async done => {
    const a = await e.sshVersion();
    // console.log(a);
    done();
  });
});

/////////////////////////////////////////////////////////////////////////////////////////

describe('.clientIsListening()', () => {
  it('works', async done => {
    const a = await e.clientIsListening();
    // console.log(a);
    done();
  });
});

describe('.peersConnected()', () => {
  it('works', async done => {
    const a = await e.peersConnected();
    // console.log(a);
    done();
  });
});

describe('.isSyncing()', () => {
  it('works', async done => {
    const a = await e.isSyncing();
    // console.log(a);
    done();
  });
});

describe('.isMining()', () => {
  it('works', async done => {
    const a = await e.isMining();
    // console.log(a);
    done();
  });
});

describe('.getWork()', () => {
  it('works', async done => {
    const a = await e.getWork();
    // console.log(a);
    done();
  });
});

/////////////////////////////////////////////////////////////////////////////////

describe('.coinbase()', () => {
  it('works', async done => {
    const a = await e.coinbase();
    // console.log(a);
    done();
  });
});

describe('.accounts()', () => {
  it('works', async done => {
    const a = await e.accounts();
    // console.log(a);
    done();
  });
});

describe('.gasPrice()', () => {
  it('works', async done => {
    const a = await e.gasPrice();
    // console.log(a);
    done();
  });
});

describe('.transactionCount()', () => {
  it('works', async done => {
    const a = await e.transactionCount(await e.coinbase(), '0x0');
    // console.log(a);
    done();
  });
});

describe('.blockTransactionCount()', () => {
  it('takes block as hash', async done => {
    const a = await e.blockTransactionCount(
      '0xb7e2c7b05da9e72dc1febdf7e8a156216b6f172e2ce96c0a94d69517212ea5e8',
    );
    // console.log(a);
    done();
  });
  it('takes block as string', async done => {
    const a = await e.blockTransactionCount('0x123');
    // console.log(a);
    done();
  });
  it('takes block as number', async done => {
    const a = await e.blockTransactionCount(123);
    // console.log(a);
    done();
  });
});

describe('.storageAt', () => {
  for (let i = 0; i < 5; i++) {
    it('works sorta', async done => {
      const a = await e.storageAt(
        transaction.contractAddress,
        `0x${i}`,
        'latest',
      );
      // console.log(i, a);
      done();
    });
  }
});

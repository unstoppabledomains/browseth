import * as Browseth from '../';
import {keccak256} from '../crypto';
import {Default} from '../rpc';
import {NodeHttp} from '../transport';
import {Online} from '../wallet';
import EventListener from './event-listener';
import TransactionListener from './transaction-listener';

const RegistrarJson = [
  {
    constant: false,
    inputs: [{name: '_hash', type: 'bytes32'}],
    name: 'releaseDeed',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{name: '_hash', type: 'bytes32'}],
    name: 'getAllowedTime',
    outputs: [{name: 'timestamp', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{name: 'unhashedName', type: 'string'}],
    name: 'invalidateName',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: 'bidder', type: 'address'},
      {name: 'seal', type: 'bytes32'},
    ],
    name: 'cancelBid',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{name: '_hash', type: 'bytes32'}],
    name: 'entries',
    outputs: [
      {name: '', type: 'uint8'},
      {name: '', type: 'address'},
      {name: '', type: 'uint256'},
      {name: '', type: 'uint256'},
      {name: '', type: 'uint256'},
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'ens',
    outputs: [{name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: '_hash', type: 'bytes32'},
      {name: '_value', type: 'uint256'},
      {name: '_salt', type: 'bytes32'},
    ],
    name: 'unsealBid',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {name: 'hash', type: 'bytes32'},
      {name: 'value', type: 'uint256'},
      {name: 'salt', type: 'bytes32'},
    ],
    name: 'shaBid',
    outputs: [{name: 'sealedBid', type: 'bytes32'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{name: '_hash', type: 'bytes32'}],
    name: 'transferRegistrars',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{name: '', type: 'address'}, {name: '', type: 'bytes32'}],
    name: 'sealedBids',
    outputs: [{name: '', type: 'address'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{name: '_hash', type: 'bytes32'}],
    name: 'state',
    outputs: [{name: '', type: 'uint8'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: '_hash', type: 'bytes32'},
      {name: 'newOwner', type: 'address'},
    ],
    name: 'transfer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {name: '_hash', type: 'bytes32'},
      {name: '_timestamp', type: 'uint256'},
    ],
    name: 'isAllowed',
    outputs: [{name: 'allowed', type: 'bool'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{name: '_hash', type: 'bytes32'}],
    name: 'finalizeAuction',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'registryStarted',
    outputs: [{name: '', type: 'uint256'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{name: 'sealedBid', type: 'bytes32'}],
    name: 'newBid',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{name: 'labels', type: 'bytes32[]'}],
    name: 'eraseNode',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{name: '_hashes', type: 'bytes32[]'}],
    name: 'startAuctions',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: 'hash', type: 'bytes32'},
      {name: 'deed', type: 'address'},
      {name: 'registrationDate', type: 'uint256'},
    ],
    name: 'acceptRegistrarTransfer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{name: '_hash', type: 'bytes32'}],
    name: 'startAuction',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'rootNode',
    outputs: [{name: '', type: 'bytes32'}],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {name: 'hashes', type: 'bytes32[]'},
      {name: 'sealedBid', type: 'bytes32'},
    ],
    name: 'startAuctionsAndBid',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {name: '_ens', type: 'address'},
      {name: '_rootNode', type: 'bytes32'},
      {name: '_startDate', type: 'uint256'},
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, name: 'hash', type: 'bytes32'},
      {indexed: false, name: 'registrationDate', type: 'uint256'},
    ],
    name: 'AuctionStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, name: 'hash', type: 'bytes32'},
      {indexed: true, name: 'bidder', type: 'address'},
      {indexed: false, name: 'deposit', type: 'uint256'},
    ],
    name: 'NewBid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, name: 'hash', type: 'bytes32'},
      {indexed: true, name: 'owner', type: 'address'},
      {indexed: false, name: 'value', type: 'uint256'},
      {indexed: false, name: 'status', type: 'uint8'},
    ],
    name: 'BidRevealed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, name: 'hash', type: 'bytes32'},
      {indexed: true, name: 'owner', type: 'address'},
      {indexed: false, name: 'value', type: 'uint256'},
      {indexed: false, name: 'registrationDate', type: 'uint256'},
    ],
    name: 'HashRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, name: 'hash', type: 'bytes32'},
      {indexed: false, name: 'value', type: 'uint256'},
    ],
    name: 'HashReleased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {indexed: true, name: 'hash', type: 'bytes32'},
      {indexed: true, name: 'name', type: 'string'},
      {indexed: false, name: 'value', type: 'uint256'},
      {indexed: false, name: 'registrationDate', type: 'uint256'},
    ],
    name: 'HashInvalidated',
    type: 'event',
  },
];

it(
  'simple test',
  async done => {
    const b = new Browseth(
      new Default(NodeHttp, 'https://mainnet.infura.io/mew'),
    );
    b.wallet = new Online(b.rpc);

    // const t = new TransactionListener(b.rpc);
    // t.startPolling();

    // const latest = await b.rpc.send('eth_blockNumber');
    // console.log(latest);
    // const logs = await b.rpc.send('eth_getLogs', {
    //   fromBlock: '0x536400',
    //   toBlock: latest,
    //   address: '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef',
    //   topics: [],
    // });
    // console.log(logs);

    const e = new EventListener(b.rpc, RegistrarJson as any, false, '0x547990');
    e.startPolling();
    // e.abi.event.AuctionStarted.signature;

    const subscription = e.addEventListener(
      '0x6090a6e47849629b7245dfa1ca21d94cd15878ef',
      'AuctionStarted',
      [],
      logs => {
        // console.log(
        //   'its probs AuctionStarted',
        //   logs.find(log => {
        //     // console.log(e.abi.event.AuctionStarted.signature, log.topics[0]);
        //     return (
        //       '0x' + e.abi.event.AuctionStarted.signature === log.topics[0]
        //     );
        //   }),
        // );
        if (logs !== undefined && logs.length > 0) {
          console.log(logs);
        }
        // done();
      },
    );
    console.log(subscription.contract);
    console.log(subscription.cb);

    setTimeout(() => {
      const subscription2 = e.addEventListener(
        '0x6090a6e47849629b7245dfa1ca21d94cd15878ef',
        'AuctionStarted',
        [],
        logs => {
          if (logs !== undefined && logs.length > 0) {
            console.log(logs);
          }
        },
      );
    }, 8000);

    setTimeout(() => {
      subscription.remove();
    }, 10000)

    setTimeout(() => {
      e.removeAllListeners();
    }, 13000)

    setTimeout(() => {
      e.stopPolling();
    }, 15000)
  },
  100000,
);

// keccak256('ENumber1()');
// [
//   '0xe#1',
// ]

// keccak256('ENumber2()');
// []
// data:  '0xe#2',

// keccak256('ENumber3()');
// [
//  '0xe#2',
// ]
// data:  '0xuint-bytes',

// keccak256('ENumber4(uint256,bytes)');
// [
//   '0xe#4',
//   '0xbytes'
// ]
// data: '0xuint'

// contract Simple {
//     event ENumber1();
//     anonymous event ENumber2();
//     event ENumber3(uint num, bytes bytestring);
//     event ENumber4(uint num, bytes indexed bytestring);
// }

// // event AuctionStarted(bytes32 indexed hash, uint registrationDate);
// [
//   keccak256(AuctionStarted(bytes32 indexed hash, uint registrationDate)),
//   0xbytes32
// ]
// data: 0xuint

// // event NewBid(bytes32 indexed hash, address indexed bidder, uint deposit);
// [
//   keccak256(NewBid(bytes32 indexed hash, address indexed bidder, uint deposit)),
//   0xbytes32,
//   0xaddress
// ]
// data: 0xuint

// // event BidRevealed(bytes32 indexed hash, address indexed owner, uint value, uint8 status);
// [
//   keccak256(BidRevealed(bytes32,address,uint256,uint8)),
//   0xbytes32,
//   0xaddress,
// ]
// data: 0xuint-uint8

// // event HashRegistered(bytes32 indexed hash, address indexed owner, uint value, uint registrationDate);
// [
//   keccak256(HashRegistered(bytes32 indexed hash, address indexed owner, uint value, uint registrationDate)),
//   0xbytes32,
//   0xaddress,
// ]
// data: 0xuint-uint

// // event HashReleased(bytes32 indexed hash, uint value);
// [
//   keccak256(HashReleased(bytes32 indexed hash, uint value)),
//   0xbytes32
// ]
// data: 0xuint

// // event HashInvalidated(bytes32 indexed hash, string indexed name, uint value, uint registrationDate);
// [
//   keccak256(HashInvalidated(bytes32 indexed hash, string indexed name, uint value, uint registrationDate)),
//   0xbytes32,
//   0xstring,
// ]
// data: 0xuint-uint

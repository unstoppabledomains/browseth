import {Browseth} from '.';
import EventListener from './event-listener';
import {Default} from './rpc';
import TransactionListener from './transaction-listener';
import {NodeHttp} from './transport';
import {Online} from './wallet';
import {keccak256} from './crypto';

const SimpleBin =
  '60606040523415600e57600080fd5b60dc8061001c6000396000f300606060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063f3a8023e146044575b600080fd5b3415604e57600080fd5b60546056565b005b7fbd9a6b785f517d571b17c262f589c1a0d4caf23eac194f7006e3ba2d9eeb1a1c60405160405180910390a17f1146b77863d0b3f278e4e143393625e9a5ceb1712b14951167a4d222098aa8ae60405160405180910390a15600a165627a7a723058208af4e52c520b639aaf67fb9326d5a19975b2e80caf560de5d0faba653891126a0029';
const RegistrarJson =
  '[{"constant":false,"inputs":[],"name":"emitMyEvents","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"FirstEvent","type":"event"},{"anonymous":false,"inputs":[],"name":"SecondEvent","type":"event"}]';

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

    const e = new EventListener(b.rpc, '0x536400');
    e.startPolling();
    const subscription = e.addEventListener(
      '0x6090a6e47849629b7245dfa1ca21d94cd15878ef',
      [],
      (...args) => {
        console.log(...args);
        done();
      },
    );
  },
  5000,
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

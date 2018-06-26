import * as fs from 'fs';
import {Ipfs} from '.';
import Browseth from '../';
import * as NodeHttp from '../transport/node-http';

Browseth.transport = NodeHttp;

let ipfs;
const f1 = fs.readFileSync(__dirname + '/lebron.jpg');
const f2 = fs.readFileSync(__dirname + '/index.ts');
const dir = [
  {
    path: __dirname + '/lebron.jpg',
    content: f1,
  },
  {
    path: __dirname + '/index.ts',
    content: f2,
  },
];

// jest.setTimeout(1000000);

beforeAll(() => {
  ipfs = new Ipfs({
    config: {
      Addresses: {
        Swarm: [
          '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
        ],
      },
    },
  });
});

describe('ipfs', () => {
  it('can retrieve id', async done => {
    await ipfs.start();
    const peers = await ipfs.peers();
    console.log(peers);
    done();
  });
});

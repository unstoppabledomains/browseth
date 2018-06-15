import * as fs from 'fs';
import {Bzz, Ipfs} from '.';
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
  ipfs = new Ipfs();
});

describe('ipfs', () => {
  it('node can start', async done => {
    expect(ipfs.getNodeStatus()).toBe('uninitalized');
    await ipfs.start();
    expect(ipfs.getNodeStatus()).toBe('running');
    done();
  });

  it('node cannot start more than once', async done => {
    try {
      await ipfs.start();
    } catch (e) {
      // console.error('err', e);
      expect(e).toBeDefined();
      done();
    }
    done();
  });

  it('can upload one file', async done => {
    const uploadedData = await ipfs.upload(f1);
    expect(uploadedData).toEqual([
      {
        path: 'QmasQSijKVS2aBgYs6kKFDusFJ5cK1yYAgSUmugZPfVVYJ',
        hash: 'QmasQSijKVS2aBgYs6kKFDusFJ5cK1yYAgSUmugZPfVVYJ',
        size: 51115,
      },
    ]);
    done();
  });

  it('can download one file', async done => {
    const uploadedData = await ipfs.upload(f2);
    const downloadedData = await ipfs.download(uploadedData[0].hash);
    // console.log(downloadedData);
    expect(downloadedData.toString()).toBe(f2.toString());

    /* DOWNLOADING PIC
    const pic = await ipfs.upload(f1);
    const dl = await ipfs.download(pic[0].hash);
    fs.writeFileSync(__dirname + '/test.jpg', dl);
    */
    done();
  });

  it('can upload multiple files/directory', async done => {
    const uploadedData = await ipfs.upload(dir);
    // console.log(uploadedData);
    expect(uploadedData[uploadedData.length - 1].hash).toEqual(
      'QmXJa48wxLSRhDLadhJGr1y4MnsGKnnTdFEUhTHq9XSrod',
    );
    expect(uploadedData[uploadedData.length - 2].hash).toEqual(
      'QmasQSijKVS2aBgYs6kKFDusFJ5cK1yYAgSUmugZPfVVYJ',
    );
    done();
  });

  it('can display uploaded files at a given path (viewFiles())', async done => {
    const upped = await ipfs.upload(dir);
    // console.log(upped);
    const ls = await ipfs.viewFiles(upped[0].hash);
    // console.log(ls);
    expect(ls.length).toBe(2);
    done();
  });

  it('can download a directory', async done => {
    const up = await ipfs.upload(dir);
    const dl = await ipfs.downloadDirectory(up[0].hash);
    // console.log(dl);
    expect(dl.length).toBe(3);
    done();
  });

  it('can upload and download an object', async done => {
    const obj = {
      a: 1,
      b: 2,
      asd: {
        z: 'qwe',
        y: 123,
        x: 'asd',
      },
    };
    const up = await ipfs.uploadObject(obj);
    // console.log(up);
    expect('codec' in up).toBe(true);
    expect('version' in up).toBe(true);
    expect('multihash' in up).toBe(true);
    const down = await ipfs.downloadObject(up);
    // console.log(down);
    expect(down.value).toEqual(obj);
    done();
  });

  it('can stop node, but not more than once', async done => {
    expect(ipfs.getNodeStatus()).toBe('running');
    await ipfs.stop();
    await ipfs.stop();
    expect(ipfs.getNodeStatus()).toBe('stopped');
    done();
  });

  it('can retrieve id', async done => {
    const id = await ipfs.id();
    expect(id).toBeDefined();
    // console.log(id);
    await ipfs.spawnDaemon();
    const peers = await ipfs.peers();
    console.log(peers);
    done();
  });
});

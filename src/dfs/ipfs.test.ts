import HWTransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import {BN} from 'bn.js';
import * as fs from 'fs';
import {Bzz, Ipfs} from '.';
import Browseth from '../';
import * as NodeHttp from '../transport/node-http';

Browseth.transport = NodeHttp;
// Browseth.Signers.Ledger.Transport = HWTransportNodeHid as any;

const ipfs = new Ipfs();
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

describe('ipfs', () => {
  it('node can start', async done => {
    expect(ipfs.getNodeStatus()).toBe('uninitialized');
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
    const downloadedData = (await ipfs.download(uploadedData[0].hash)) as any;
    expect(downloadedData.toString()).toBe(f2.toString());

    /* DOWNLOADING PIC
    const pic = await ipfs.upload(f1);
    const dl = await ipfs.download(pic[0].hash);
    fs.writeFileSync(__dirname + '/test.jpg', dl);
    */
    done();
  });

  it('can upload multiple files/directory', async done => {
    const uploadedData = (await ipfs.upload(dir)) as any;
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
    const ls = (await ipfs.viewFiles(upped[0].hash)) as any;
    // console.log(ls);
    expect(ls.length).toBe(2);
    done();
  });

  it('can download a directory', async done => {
    const up = await ipfs.upload(dir);
    const dl = (await ipfs.downloadDirectory(up[0].hash)) as any;
    // console.log(dl);
    expect(dl.length).toBe(3);
    done();
  });

  it('can upload and download an object', async done => {
    const obj = {
      a: 1,
      b: 2,
    };
    const up = await ipfs.uploadDag(obj, {
      format: 'dag-cbor',
      hashAlg: 'sha2-256',
    });
    console.log(up);
    const down = await ipfs.downloadDag(up);
    console.log(down);
    done();
  });

  it('can stop node, but not more than once', async done => {
    expect(ipfs.getNodeStatus()).toBe('running');
    await ipfs.stop();
    await ipfs.stop();
    expect(ipfs.getNodeStatus()).toBe('stopped');
    done();
  });
});

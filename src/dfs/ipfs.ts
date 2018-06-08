import * as fs from 'fs';
import * as IPFS from 'ipfs';

export interface InitObject {
  emptyRepo: boolean;
  bits: number;
  pass: string;
}

export interface ExperimentalObject {
  pubsub: boolean;
  sharding: boolean;
  dht: boolean;
  relay: {
    enabled: boolean;
    hop: {
      enabled: boolean;
      active: boolean;
    };
  };
}

export interface ConfigObject {
  Addresses: {
    Swarm: string[];
    API: string;
    Gateway: string;
  };
  Discovery: {
    MDNS: {
      Enabled: boolean;
      Interval: number;
    };
    webRTCStar: {
      Enabled: boolean;
    };
  };
  Bootstrap: string[];
}

export interface IpfsOptions {
  repo: string; // The file path at which to store the IPFS node’s data. (Default: '~/.jsipfs' in Node.js, 'ipfs' in browsers.)
  init: boolean | InitObject; // Initialize the repo when creating the IPFS node. (Default: true)
  start: boolean; // If false, do not automatically start the IPFS node. (Default: true)
  pass: string; // A passphrase to encrypt/decrypt your keys.
  EXPERIMENTAL: ExperimentalObject; // Enable and configure experimental features.
  config: ConfigObject; // Modify the default IPFS node config
  libp2p: {
    // add custom modules to the libp2p stack of your node
    modules: {
      transport: any[]; // array of libp2p.Transport instances
      discovery: any[]; // array of libp2p.PeerDiscovery instances
    };
  };
}

export interface UploadOptions {
  'cid-version': number; // (integer, default 0): the CID version to use when storing the data (storage keys are based on the CID, including it's version)
  progress: () => void; // (function): a function that will be called with the byte length of chunks as a file is added to ipfs.
  recursive: boolean; // (boolean): for when a Path { is } passed, this option can be enabled to add recursively all the files.
  hashAlg: string;
  hash: string; // (string): multihash hashing algorithm to use.
  wrapWithDirectory: boolean; // (boolean): adds a wrapping node around the content.
  onlyHash: boolean; // (boolean): doesn't actually add the file to IPFS, but rather calculates its hash.
}

export class Ipfs {
  private node: any;

  constructor(private options?: IpfsOptions) {}

  public start(): Promise<void> {
    if (!this.node) {
      this.node = new IPFS(this.options);
      this.node.on('error', () => {
        /*  */
      });
      console.log(this.node);
      return new Promise(resolve => {
        this.node.on('ready', resolve);
      });
    }
    // does it need async/await if returns promise?
    return new Promise((resolve, reject) => {
      this.node.start((err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public stop(): Promise<void> | undefined {
    if (this.node && this.node.state.state() !== 'stopped') {
      return new Promise((resolve, reject) => {
        this.node.stop((err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
    return;
  }

  public getNodeStatus(): string | null {
    if (this.node) {
      return this.node.state.state();
    }
    return 'uninitialized';
  }

  public upload(
    data: string | Buffer | ArrayBuffer | ArrayBufferView | object[],
    options?: UploadOptions,
    cb?: () => void,
  ) {
    let files: any;

    if (data instanceof ArrayBuffer) {
      if (ArrayBuffer.isView(data)) {
        files = new Buffer(data.buffer);
      } else {
        files = new Buffer(data);
      }
    } else if (typeof data === 'string') {
      files = Buffer.from(data);
    } else {
      files = data;
    }
    return new Promise((resolve, reject) => {
      this.node.files.add(files, options, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public download(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.node.files.cat(path, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public viewFiles(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.node.ls(path, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public downloadDirectory(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.node.files.get(path, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public uploadDag(node: any, options: any) {
    return new Promise((resolve, reject) => {
      this.node.dag.put(node, options, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public downloadDag(cid: any) {
    return new Promise((resolve, reject) => {
      this.node.dag.get(cid, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}

export default Ipfs;

import * as SwarmJs from 'swarm-js';

// interface Swarm {
// { at: [Function: at],
//   local: [Function: local],
//   download: [Function: _download],
//   downloadBinary: [Function: downloadBinary],
//   downloadData: [Function: downloadData],
//   downloadDataToDisk: [Function: downloadDataToDisk],
//   downloadDirectory: [Function: downloadDirectory],
//   downloadDirectoryToDisk: [Function: downloadDirectoryToDisk],
//   downloadEntries: [Function: downloadEntries],
//   downloadRoutes: [Function: downloadRoutes],
//   isAvailable: [Function: _isAvailable],
//   startProcess: [Function: startProcess],
//   stopProcess: [Function: stopProcess],
//   upload: [Function: _upload],
//   uploadData: [Function: uploadData],
//   uploadDataFromDisk: [Function: uploadDataFromDisk],
//   uploadFile: [Function: uploadFile],
//   uploadFileFromDisk: [Function: uploadFileFromDisk],
//   uploadDirectory: [Function: uploadDirectory],
//   uploadDirectoryFromDisk: [Function: uploadDirectoryFromDisk],
//   uploadToManifest: [Function: uploadToManifest],
//   pick: { data: [Function], file: [Function], directory: [Function] },
//   hash: [Function: swarmHash],
//   fromString: [Function: fromString],
//   toString: [Function: toString] }
// }

export class Bzz {
  public swarm: any;

  constructor(endpoint: string = 'http://swarm-gateways.net') {
    this.swarm = SwarmJs;
    this.setEndpoint(endpoint);
  }

  public setEndpoint(url: string) {
    this.swarm.at(url);
  }

  public upload(data: string | Buffer | Uint8Array | Object): Promise<string> {
    return this.swarm.upload(data);
  }

  public download(hash: string, path: string) {
    this.swarm.download(hash, path);
  }

  public endpointIsAvailable() {
    this.swarm.isAvailable();
  }
}

export default Bzz;

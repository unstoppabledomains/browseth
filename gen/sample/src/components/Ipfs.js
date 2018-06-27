import * as React from 'react';
import Browseth from 'browseth';
import '../App.css';
import Prism from 'prismjs';
import * as config from '../config.json';

class Ipfs extends React.Component {
  constructor(props) {
    super(props);
    this.beth = new Browseth(config.url);
    this.ipfs = new Browseth.Fs.Ipfs({
      config: {
        Addresses: {
          Swarm: [
            '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
          ],
        },
      },
    });
    this.state = {
      fileContent: '',
      status: this.ipfs.getNodeStatus(),
      dlHash: '',
      ulHash: '',
      id: '',
      peer: '',
      img: '',
    };
  }

  render() {
    return (
      <div className="container">
        <div className="left">
          <div>
            <h2>Interacting with IPFS</h2>
            <div>
              <img src={this.state.img} alt="uploaded" className="fit" />
            </div>
            <button onClick={this.startNode}>Start Node</button>{' '}
            <p>
              <b>ID</b>: {this.state.id}
            </p>
            <p>
              <b>NODE STATUS</b>: {this.state.status}
            </p>
            <br />
            <h3>Upload a file</h3>
            <input
              type="file"
              ref={node => {
                this.fileinput = node;
              }}
              onChange={this.handleUpload}
            />
            <p>
              {this.state.ulHash === ''
                ? 'Upload a file!'
                : 'Upload Hash: ' + this.state.ulHash}
            </p>
            <h3>Download a File</h3>
            <input type="text" onChange={this.updateDl} />
            <button onClick={this.downloadFile}>Download!</button>
            <h3>Connect to a Peer</h3>
            <input type="text" onChange={this.updatePeer} />
            <button onClick={this.connectPeer}>Connect!</button>
          </div>
        </div>
        <div className="right">
          <code
            className="language-javascript"
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                `
  // Create a new IPFS instance
  const ipfs = new Browseth.Fs.Ipfs({
    config: {
      Addresses: {
        Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'],
      },
    },
  });

  // Get ID and current status
  const id = await ipfs.id();
  const nodeStatus = ipfs.getNodeStatus();

  // Upload a file
  // Hash is located in 'uploadedData[0].hash'
  const uploadedData = await ipfs.upload(FILE_CONTENTS);

  // Download a file
  const downloadedData = await ipfs.download(FILE_HASH);

  // Connect to a Peer
  await ipfs.connectPeer(
    '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/ipfs/'
      + PEER_HASH,
  );

  // View Peer(s)
  console.log(await ipfs.peers());
                `,
                Prism.languages.javascript,
                'javascript',
              ),
            }}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.getId();
  }

  startNode = async () => {
    if (this.state.status !== 'running') {
      await this.ipfs.start();
      this.setState({status: this.ipfs.getNodeStatus()});
    }
  };

  getId = async () => {
    if (this.ipfs.getNodeStatus() !== 'uninitalized') {
      const id = await this.ipfs.id();
      this.setState({id: id.id, status: this.ipfs.getNodeStatus()});
    } else {
      setTimeout(() => {
        this.getId();
      }, 300);
    }
  };

  handleUpload = () => {
    const fileReader = new FileReader();
    // console.log(this.fileinput.files);
    fileReader.onload = async () => {
      const up = await this.ipfs.upload(fileReader.result);
      console.log(up);
      this.setState({fileContent: fileReader.result, ulHash: up[0].hash});
    };
    console.log(this.fileinput.files);
    fileReader.readAsArrayBuffer(this.fileinput.files[0]);
  };

  updateDl = e => {
    this.setState({dlHash: e.target.value});
  };

  updatePeer = e => {
    this.setState({peer: e.target.value});
  };

  downloadFile = async () => {
    console.log('attempting dl...');
    const dl = await this.ipfs.download(this.state.dlHash);
    console.log(dl.toString('base64'));
    this.setState({img: 'data:image/jpeg;base64,' + dl.toString('base64')});
  };

  connectPeer = async () => {
    await this.ipfs.connectPeer(
      '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/ipfs/' +
        this.state.peer,
    );
    console.log(JSON.stringify(await this.ipfs.peers()));
  };
}

export default Ipfs;

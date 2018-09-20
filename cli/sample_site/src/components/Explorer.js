import * as React from 'react';
import Browseth from 'browseth';
import '../App.css';
import Prism from 'prismjs';
import * as config from '../config.json';

class Explorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      txHash: '',
      block1: '',
      index1: '',
      hash2: '',
      block2: '',
      addr: '',
      block3: '',
      res: '',
    };
    this.beth = new Browseth(config.url);
    this.explorer = new Browseth.BlockChainExplorer(this.beth.rpc);
  }

  render() {
    return (
      <div className="container">
        <div className="left">
          <div>
            <h2>BlockChain Explorer</h2>
            <h3>Get Transaction</h3>
            Receipt{' '}
            <input
              type="text"
              value={this.state.txHash}
              onChange={this.updateTxHash}
              placeholder="TX_HASH"
            />
            <button onClick={this.getReceipt}>Get Receipt!</button>
            <br />
            By Block and Index{' '}
            <input
              type="text"
              value={this.state.block1}
              onChange={this.updateBlock1}
              placeholder="BLOCK"
            />
            <input
              type="text"
              value={this.state.index1}
              onChange={this.updateIndex1}
              placeholder="INDEX"
            />
            <button onClick={this.getByBlockAndIndex}>Get tx!</button>
            <br />
            By Hash{' '}
            <input
              type="text"
              value={this.state.hash2}
              onChange={this.updateHash2}
              placeholder="TX_HASH"
            />
            <button onClick={this.getByHash}>Get tx!</button>
            <br />
            Count By Block{' '}
            <input
              type="text"
              value={this.state.block2}
              onChange={this.updateBlock2}
              placeholder="BLOCK"
            />
            <button onClick={this.getCountByBlock}>Get tx!</button>
            <h3>Get Balance</h3>
            Public Address{' '}
            <input
              type="text"
              value={this.state.addr}
              onChange={this.updateAddr}
              placeholder="YOUR_ADDRESS"
            />
            <input
              type="text"
              value={this.state.block3}
              onChange={this.updateBlock3}
              placeholder="BLOCK"
            />
            <button onClick={this.getBalance}>Get balance!</button>
          </div>
          <br />
          <div className="text-box">
            <code>{this.state.res}</code>
          </div>
        </div>
        <div className="right">
          <code
            className="language-javascript"
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                `
  // Create a Blockchain Explorer
  explorer = new Browseth.BlockChainExplorer(this.beth.rpc);

  // get Transaction Receipt
  const txr = await explorer.transaction.receipt(TX_HASH);

  // get Transaction by block and index
  const tx = await explorer.transaction.byBlockAndIndex(BLOCK, INDEX);

  // get Transaction by hash
  const tx2 = await explorer.transaction.byHash(TX_HASH);

  // get Transaction count by block
  const count = await explorer.transaction.countByBlock(BLOCK);

  // get balance of address
  const balance = await explorer.balanceOf(YOUR_ADDRESS, BLOCK);
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

  updateTxHash = e => {
    this.setState({
      txHash: e.target.value,
    });
  };

  updateBlock1 = e => {
    this.setState({
      block1: e.target.value,
    });
  };

  updateIndex1 = e => {
    this.setState({
      index1: e.target.value,
    });
  };

  updateHash2 = e => {
    this.setState({
      hash2: e.target.value,
    });
  };

  updateBlock2 = e => {
    this.setState({
      block2: e.target.value,
    });
  };

  updateAddr = e => {
    this.setState({
      addr: e.target.value,
    });
  };

  updateBlock3 = e => {
    this.setState({
      block3: e.target.value,
    });
  };

  getReceipt = async () => {
    const receipt = await this.explorer.transaction.receipt(this.state.txHash);
    this.setState({res: JSON.stringify(receipt)});
  };

  getByBlockAndIndex = async () => {
    const tx = await this.explorer.transaction.byBlockAndIndex(
      this.state.block1,
      this.state.index1,
    );
    this.setState({res: JSON.stringify(tx)});
  };

  getByHash = async () => {
    const tx = await this.explorer.transaction.byHash(this.state.hash2);
    this.setState({res: JSON.stringify(tx)});
  };

  getCountByBlock = async () => {
    const count = await this.explorer.transaction.countByBlock(
      this.state.block2,
    );
    this.setState({res: count});
  };

  getBalance = async () => {
    const balance = await this.explorer.balanceOf(
      this.state.addr,
      this.state.block3,
    );
    const ethBalance = Browseth.Units.convert(balance, 'wei', 'ether');
    this.setState({res: ethBalance + ' ETH'});
  };
}

export default Explorer;

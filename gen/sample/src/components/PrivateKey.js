import * as React from 'react';
import Browseth from 'browseth';
import '../App.css';
import Prism from 'prismjs';

class PrivateKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from: '',
      to: '',
      amount: '',
      tx: '',
      err: '',
    };
    this.beth = new Browseth('https://mainnet.infura.io/mew');
  }

  render() {
    return (
      <div className="container">
        <div className="left">
          <div>
            <h2>Sending Ether with a Private Key</h2>
            Your Private Key{' '}
            <input
              type="text"
              value={this.state.from}
              onChange={this.updateFrom}
              placeholder="YOUR_PRIVATE_KEY"
            />
            <br />
            Address to send to{' '}
            <input
              type="text"
              value={this.state.to}
              onChange={this.updateTo}
              placeholder="THEIR_PUBLIC_ADDRESS"
            />
            <br />
            Amount in Eth{' '}
            <input
              type="text"
              value={this.state.amount}
              onChange={this.updateAmount}
              placeholder="AMOUNT_IN_ETH"
            />
            <br />
            <button onClick={this.sendEth}>Send!</button>
            <br />
            {this.state.tx
              ? `Transaction Hash: ${this.state.tx}`
              : `A transaction hash will appear here once successful!`}
            <br />
            {this.state.err === '' ? '' : this.state.err}
          </div>
        </div>
        <div className="right">
          <code
            className="language-javascript"
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                `
  // Create an "Offline" wallet
  beth.wallet = new Browseth.Wallets.Offline(
    beth.rpc,
    Browseth.Signers.PrivateKey.fromHex(YOUR_PRIVATE_KEY),
  );

  // Send money
  const tx = await beth.wallet.send({
    to: THEIR_PUBLIC_ADDRESS,
    gasPrice: '0x1',
    value: Browseth.Units.etherToWei(AMOUNT_IN_ETH),
  });
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

  updateFrom = e => {
    this.setState({
      from: e.target.value,
    });
  };

  updateTo = e => {
    this.setState({
      to: e.target.value,
    });
  };

  updateAmount = e => {
    this.setState({
      amount: e.target.value,
    });
  };

  sendEth = async () => {
    try {
      this.beth.wallet = new Browseth.Wallets.Offline(
        this.beth.rpc,
        Browseth.Signers.PrivateKey.fromHex(this.state.from),
      );
      const tx = await this.beth.wallet.send({
        to: this.state.to,
        gasPrice: '0x1',
        value: Browseth.Units.etherToWei(this.state.amount),
      });
      // console.log(tx);
      this.setState({tx, err: ''});
    } catch (err) {
      console.error(err);
      this.setState({err: 'Error!'});
    }
  };
}

export default PrivateKey;

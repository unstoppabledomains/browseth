import Browseth from 'browseth';
import Prism from 'prismjs';
import * as React from 'react';
import '../App.css';
import * as config from '../config.json';

class Metamask extends React.Component {
  constructor(props) {
    super(props);
    this.beth = new Browseth(config.url);
    let err = '';
    try {
      this.beth.wallet = new Browseth.Wallets.Online(
        new Browseth.Rpcs.Web3(window.web3.currentProvider),
      );
    } catch (e) {
      console.error(e);
      err = `Metamask isn't enabled! Please turn on the extension and refresh the page`;
    }
    this.state = {
      to: '',
      amount: '',
      tx: '',
      err,
    };
    console.log(err);
  }

  render() {
    return (
      <div className="container">
        <div className="left">
          <div>
            <h2>Sending Ether with Metamask</h2>
            Address to send to{' '}
            <input
              type="text"
              value={this.state.to}
              onChange={e => {
                this.updateTo(e);
              }}
              placeholder="THEIR_PUBLIC_ADDRESS"
            />
            <br />
            Amount in Eth{' '}
            <input
              type="text"
              value={this.state.amount}
              onChange={e => {
                this.updateAmount(e);
              }}
              placeholder="AMOUNT_IN_ETH"
            />
            <br />
            <button onClick={this.sendEth}>Send!</button>
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
  // Create an "Online" wallet
  beth.wallet = new Browseth.Wallets.Online(
    new Browseth.Rpcs.Web3(window.web3.currentProvider),
  );

  // Send money
  // Automatically opens a Metamask prompt
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
      const tx = await this.beth.wallet.send({
        to: this.state.to,
        gasPrice: '0x1',
        value: Browseth.Units.etherToWei(this.state.amount),
      });
      this.setState({tx, err: ''});
    } catch (err) {
      console.error(err);
      this.setState({err: 'Error!'});
    }
  };
}

export default Metamask;

// this.browseth.wallet = new Browseth.Wallets.Online(
//   new Browseth.Rpcs.Web3((window as any).web3.currentProvider),
// );

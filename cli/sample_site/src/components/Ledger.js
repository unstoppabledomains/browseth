import * as React from 'react';
import Browseth from 'browseth';
import '../App.css';
import Prism from 'prismjs';
import * as config from '../config.json';

class Ledger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: ['0x0', '0x1', '0x2', '0x3', '0x4'],
      value: ['0', '0', '0', '0', '0'],
      current: '0',
      to: '',
      amount: '',
      tx: '',
      err: '',
    };
    this.beth = new Browseth(config.url);
  }

  render() {
    return (
      <div className="container">
        <div className="left">
          <div>
            <h2>Using a Ledger Wallet</h2>
            <p>
              <i>
                Note: Requires https connection. Use 'HTTPS=true yarn start'
              </i>
            </p>
            <li>Plug your Ledger Wallet in and unlock it</li>
            <li>Enter the Ethereum App</li>
            <li>In "Settings" ensure that "Browser support" is set to "Yes"</li>
            <button onClick={this.refreshLedger}>Load Ledger</button>
            <table>
              <tbody>
                <tr>
                  <td />
                  <td>Address</td>
                  <td>Value</td>
                </tr>
                <tr>
                  <td className="ledger-table">
                    <input
                      type="radio"
                      name="account"
                      value="0"
                      onClick={this.updateCurrent}
                    />
                  </td>
                  <td className="ledger-table address-td">
                    {this.state.account[0]}
                  </td>
                  <td className="ledger-table amount-td">
                    {this.state.value[0]} Eth
                  </td>
                </tr>
                <tr>
                  <td className="ledger-table">
                    <input
                      type="radio"
                      name="account"
                      value="1"
                      onClick={this.updateCurrent}
                    />
                  </td>
                  <td className="ledger-table">{this.state.account[1]}</td>
                  <td className="ledger-table">{this.state.value[1]} Eth</td>
                </tr>
                <tr>
                  <td className="ledger-table">
                    <input
                      type="radio"
                      name="account"
                      value="2"
                      onClick={this.updateCurrent}
                    />
                  </td>
                  <td className="ledger-table">{this.state.account[2]}</td>
                  <td className="ledger-table">{this.state.value[2]} Eth</td>
                </tr>
                <tr>
                  <td className="ledger-table">
                    <input
                      type="radio"
                      name="account"
                      value="3"
                      onClick={this.updateCurrent}
                    />
                  </td>
                  <td className="ledger-table">{this.state.account[3]}</td>
                  <td className="ledger-table">{this.state.value[3]} Eth</td>
                </tr>
                <tr>
                  <td className="ledger-table">
                    <input
                      type="radio"
                      name="account"
                      value="4"
                      onClick={this.updateCurrent}
                    />
                  </td>
                  <td className="ledger-table">{this.state.account[4]}</td>
                  <td className="ledger-table">{this.state.value[4]} Eth</td>
                </tr>
              </tbody>
            </table>
            <br />
            Send money to:{' '}
            <input
              type="text"
              value={this.state.name}
              onChange={this.updateTo}
              placeholder="THEIR_PUBLIC_ADDRESS"
            />
            <br />
            Amount:{' '}
            <input
              type="text"
              value={this.state.name}
              onChange={this.updateAmount}
              placeholder="AMOUNT_IN_ETH"
            />{' '}
            Eth
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
  // Create a wallet
  beth.wallet = new Browseth.Wallets.Offline(
    beth.rpc,
    new Browseth.Signers.Ledger(),
  );

  // Get first 5 accounts and their balances
  let account = [];
  let value = [];
  for (let i = 0; i < 5; i++) {
    account[i] = await beth.wallet.account(i);
    value[i] = Browseth.Units.convert(
      await beth.rpc.send('eth_getBalance', account[i], 'latest'),
      'wei',
      'ether',
    );
  }

  // Send money
  // Uses the private key of 'beth.wallet.signer.defaultIndex'
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

  refreshLedger = async () => {
    try {
      this.beth.wallet = new Browseth.Wallets.Offline(
        this.beth.rpc,
        new Browseth.Signers.Ledger(),
      );

      let account = [];
      let value = [];
      for (let i = 0; i < 5; i++) {
        account[i] = await this.beth.wallet.account(i);
        value[i] = Browseth.Units.convert(
          await this.beth.rpc.send('eth_getBalance', account[i], 'latest'),
          'wei',
          'ether',
        );
      }

      this.setState({account, value});
    } catch (err) {
      console.error(err);
    }
  };

  updateCurrent = e => {
    this.setState({current: e.target.value});
  };

  sendEth = async () => {
    try {
      this.beth.wallet.signer.defaultIndex = this.state.current;
      const tx = await this.beth.wallet.send({
        to: this.state.to,
        gasPrice: '0x1',
        value: Browseth.Units.etherToWei(this.state.amount),
      });
      // console.log(tx);
      this.setState({tx});
    } catch (e) {
      console.error(e);
      this.setState({err: 'Error!'});
    }
  };
}

export default Ledger;

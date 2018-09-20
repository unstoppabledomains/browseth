import * as React from 'react';
import Browseth from 'browseth';
import '../App.css';
import Prism from 'prismjs';
import * as Tokens from './tokens-eth.json';
import * as ERC20 from './erc20.json';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import * as config from '../config.json';

class Token extends React.Component {
  constructor(props) {
    super(props);
    this.beth = new Browseth(config.url);
    this.beth.addContract('ERC20', ERC20);
    this.state = {
      tokenAddr: '',
      symbol: '',
      pKey: '',
      balance: '',
      publicAddr: '',
      decimals: '',
      to: '',
      amount: '',
    };
  }

  render() {
    return (
      <div className="container">
        <div className="left">
          <div>
            <h2>Sending ERC20 Tokens</h2>
            <b>
              {this.state.symbol === '' ? 'Select Token' : this.state.symbol}
              {this.state.balance === '' ? '' : `: ${this.state.balance}`}
            </b>
            <Select
              name="Select Token"
              value={this.state.selectedToken}
              onChange={this.selectToken}
              options={this.getTokens()}
            />
            <br />
            Your Private Key{' '}
            <input
              type="text"
              value={this.state.pKey}
              onChange={this.updatePrivateKey}
              placeholder="YOUR_PRIVATE_KEY"
            />
            <button onClick={this.enableWallet}>Enable Private Key</button>
            <p>
              {this.state.publicAddr === ''
                ? 'Enable your private key to see your balance'
                : `Public Address:${this.state.publicAddr}`}
            </p>
            <br />
            Address to send to{' '}
            <input
              type="text"
              value={this.state.to}
              onChange={this.updateTo}
              placeholder="THEIR_PUBLIC_ADDRESS"
            />
            <br />
            Amount{this.state.symbol === '' ? ' ' : ` in ${this.state.symbol} `}
            <input
              type="text"
              value={this.state.amount}
              onChange={this.updateAmount}
              placeholder={'AMOUNT_IN_TOKEN'}
            />
            <br />
            <button onClick={this.sendToken}>Send!</button>
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
  // ERC20 abi
  const abi = [{"constant": true,"inputs": [],"name": "name","outputs": [{"name": "", "type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_spender", "type": "address"},{"name": "_value", "type": "uint256"}],"name": "approve","outputs": [{"name": "", "type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "totalSupply","outputs": [{"name": "", "type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_from", "type": "address"},{"name": "_to", "type": "address"},{"name": "_value", "type": "uint256"}],"name": "transferFrom","outputs": [{"name": "", "type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "decimals","outputs": [{"name": "", "type": "uint8"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "_owner", "type": "address"}],"name": "balanceOf","outputs": [{"name": "balance", "type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "symbol","outputs": [{"name": "", "type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_to", "type": "address"},{"name": "_value", "type": "uint256"}],"name": "transfer","outputs": [{"name": "", "type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "_owner", "type": "address"},{"name": "_spender", "type": "address"}],"name": "allowance","outputs": [{"name": "", "type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"payable": true, "stateMutability": "payable", "type": "fallback"},{"anonymous": false,"inputs": [{"indexed": true, "name": "owner", "type": "address"},{"indexed": true, "name": "spender", "type": "address"},{"indexed": false, "name": "value", "type": "uint256"}],"name": "Approval","type": "event"},{"anonymous": false,"inputs": [{"indexed": true, "name": "from", "type": "address"},{"indexed": true, "name": "to", "type": "address"},{"indexed": false, "name": "value", "type": "uint256"}],"name": "Transfer","type": "event"}];
  
  // Address of a token- EOS in this example
  const tokenAddress = '0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0';

  // Add contract to browseth instance
  beth.addContract('ERC20', abi);

  // Create an "Offline" wallet using private key
  beth.wallet = new Browseth.Wallets.Offline(
    beth.rpc,
    Browseth.Signers.PrivateKey.fromHex(YOUR_PRIVATE_KEY),
  );

  // Check our balance
  // Note: Since we used the generic ERC20 contract abi it's
  // important that we call the function using the token's
  // contract address to call its version of balanceOf() instead.
  //
  // Call beth.contract.ERC20.function.decimals().call({to: tokenAddress})
  // to get the number of the decimals to divide the AMOUNT_IN_TOKEN
  // by to convert to user representation.
  beth.contract.ERC20.function.balanceOf(
    await beth.wallet.account()
  ).call({to: tokenAddress})

  // Send tokens
  // Note: Multiply AMOUNT_IN_TOKEN by decimals amount if
  // in user representation
  const tx = await beth.contract.ERC20.function
        .transfer(THEIR_PUBLIC_ADDRESS, AMOUNT_IN_TOKEN)
        .send({to: tokenAddress});
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

  getTokens = () => {
    return Tokens.map((token, i) => {
      return {
        value: token.address,
        label: `${token.name} - [${token.symbol}]`,
      };
    });
  };

  selectToken = async token => {
    console.log(token.value);
    const symbol = token.label.match(/\[(.*?)\]/)[1];
    console.log(symbol);
    const decimals = (await this.beth.contract.ERC20.function
      .decimals()
      .call({to: token.value})).toString();
    if (this.state.publicAddr !== '') {
      this.setState({
        tokenAddr: token.value,
        symbol,
        decimals,
      });
      this.getBalance();
    } else {
      this.setState({tokenAddr: token.value, symbol});
    }
  };

  getBalance = async () => {
    const balance = this.toDecimal(
      await this.beth.contract.ERC20.function
        .balanceOf(
          this.state.publicAddr === ''
            ? await this.beth.wallet.account()
            : this.state.publicAddr,
        )
        .call({to: this.state.tokenAddr}),
    );
    this.setState({balance});
  };

  enableWallet = async () => {
    this.beth.wallet = new Browseth.Wallets.Offline(
      this.beth.rpc,
      new Browseth.Signers.PrivateKey.fromHex(this.state.pKey),
    );
    const publicAddr = await this.beth.wallet.account();
    console.log(publicAddr);
    if (this.state.symbol !== '') {
      this.setState({publicAddr});
      this.getBalance();
    } else {
      this.setState({publicAddr});
    }
  };

  updatePrivateKey = e => {
    this.setState({
      pKey: e.target.value,
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

  sendToken = async () => {
    try {
      const tx = await this.beth.contract.ERC20.function
        .transfer(this.state.to, this.removeDecimal(this.state.amount))
        .send({to: this.state.tokenAddr});
      this.setState({tx, err: ''});
    } catch (err) {
      console.error(err);
      this.setState({err: 'Error!'});
    }
  };

  toDecimal = balance => {
    const bal = balance.toString();
    if (bal.length > this.state.decimals) {
      return (
        bal.slice(0, bal.length - this.state.decimals) +
        '.' +
        bal.slice(bal.length - this.state.decimals)
      );
    } else {
      let zeroes = '0.';
      for (let i = 0; i < this.state.decimals - bal.length; i++) {
        zeroes += '0';
      }
      return zeroes + bal;
    }
  };

  removeDecimal = amount => {
    if (/^0\./.test(amount)) {
      return amount.replace(/^0\.0*/, '');
    } else {
      return amount.replace('.', '');
    }
  };
}

export default Token;

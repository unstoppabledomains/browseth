import * as React from 'react';
import Browseth from 'browseth';
import '../App.css';
import * as Tokens from './tokens-eth.json';
import Select from 'react-select';
import '../react-select.css';
import * as config from '../config.json';

class SendMoney extends React.Component {
  state = {
    tokenAddr: '',
    symbol: '',
    tokenBalance: '',
    ethBalance: '',
    decimals: '',
    to: '',
    tokenAmount: '',
    ethAmount: '',
    err: '',
    transactionHash: '',
    activeSender: 0,
    activeGas: 1,
    safeLowGas: '',
    safeSlowGas: '',
    safeFastGas: '',
    gasLimit: '21000',
    gasPrice: '',
    gasEstimate: '0',
    ethPrice: '',
  };

  componentDidMount() {
    this.init();
  }

  init = () => {
    if (this.props.isLoadingAddresses) {
      setTimeout(() => {
        this.init();
      }, 200);
      return;
    }
    this.getEthBalance();
    this.getGasPrice().then(() => {
      this.setActiveGas(1);
    });
    this.fetchUsdPrice();
  };

  getTokens = () => {
    return Tokens.map((token, i) => {
      return {
        value: token.address,
        label: `${token.name} - [${token.symbol}]`,
      };
    });
  };

  selectToken = async token => {
    const symbol = token.label.match(/\[(.*?)\]/)[1];
    const decimals = (await this.props.browseth.contract.ERC20.function
      .decimals()
      .call({to: token.value})).toString();
    if (this.state.publicAddr !== '') {
      this.setState({
        tokenAddr: token.value,
        symbol,
        decimals,
      });
      this.getTokenBalance();
    } else {
      this.setState({tokenAddr: token.value, symbol});
    }
  };

  // Note: Since we used the generic ERC20 contract abi it's
  // important that we call the function using the token's
  // contract address to call its version of balanceOf() instead.
  //
  // Call beth.contract.ERC20.function.decimals().call({to: tokenAddress})
  // to get the number of the decimals to divide the AMOUNT_IN_TOKEN
  // by to convert to user representation.
  getTokenBalance = async () => {
    const balance = await this.props.browseth.contract.ERC20.function
      .balanceOf(this.props.publicAddress)
      .call({to: this.state.tokenAddr});
    let tokenBalance;
    if (!balance.isZero()) {
      tokenBalance = this.toDecimal(balance);
    } else {
      tokenBalance = '0';
    }
    this.setState({tokenBalance});
  };

  getEthBalance = async () => {
    if (!this.props.publicAddress) {
      setTimeout(() => {
        this.getEthBalance();
      }, 200);
      return;
    }
    const balance = await this.props.browseth.rpc.send(
      'eth_getBalance',
      this.props.publicAddress,
      'latest',
    );
    const ethBalance = Browseth.Units.weiToEther(balance);
    this.setState({ethBalance});
  };

  enableWallet = async () => {
    if (this.state.symbol !== '') {
      this.getTokenBalance();
    }
  };

  setActiveSender = activeSender => {
    this.setState({activeSender});
  };

  setActiveGas = activeGas => {
    let gasPrice;
    if (activeGas === 0) {
      gasPrice = this.state.safeSlowGas;
    } else if (activeGas === 1) {
      gasPrice = this.state.safeLowGas;
    } else {
      gasPrice = this.state.safeFastGas;
    }
    this.setState({activeGas, gasPrice}, () => {
      this.getGasEstimate();
    });
  };

  setMaxEth = () => {
    this.setState({ethAmount: this.state.ethBalance});
  };

  setMaxToken = () => {
    this.setState({tokenAmount: this.state.tokenBalance});
  };

  updateTo = e => {
    this.setState(
      {
        to: e.target.value,
      },
      () => {
        this.getGasEstimate();
      },
    );
  };

  updateTokenAmount = e => {
    this.setState(
      {
        tokenAmount: e.target.value,
      },
      () => {
        this.getGasEstimate();
      },
    );
  };

  updateEthAmount = e => {
    this.setState({ethAmount: e.target.value}, () => {
      this.getGasEstimate();
    });
  };

  updateGasLimit = e => {
    this.setState({gasLimit: e.target.value});
  };

  // Note: For sending tokens, multiply AMOUNT_IN_TOKEN
  // by decimals amount if in user representation
  sendMoney = async () => {
    if (this.state.activeSender === 0) {
      const transactionHash = await this.props.browseth.wallet.send({
        to: this.state.to,
        value: Browseth.Units.etherToWei(this.state.ethAmount),
        gasPrice: Browseth.Units.gweiToWei(this.state.gasPrice),
        chainId: config.chainId,
      });
      this.setState({transactionHash});
    } else {
      const transactionHash = await this.props.browseth.contract.ERC20.function
        .transfer(this.state.to, this.removeDecimal(this.state.tokenAmount))
        .send({
          to: this.state.tokenAddr,
          gasPrice: Browseth.Units.gweiToWei(this.state.gasPrice),
          chainId: config.chainId,
        });
      this.setState({transactionHash});
    }
  };

  // dividing
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

  // multiplying
  removeDecimal = amount => {
    if (/^0\./.test(amount)) {
      return amount.replace(/^0\.0*/, '');
    } else {
      return amount.replace('.', '');
    }
  };

  getGasEstimate = async () => {
    if (/^0x[a-f\d]{40}$/i.test(this.state.to)) {
      let gasLimit;
      if (this.state.activeSender === 0 && this.state.ethAmount) {
        gasLimit = parseInt(
          await this.props.browseth.wallet.gas({
            to: this.props.publicAddress,
            value: Browseth.Units.etherToWei(this.state.ethAmount),
          }),
          16,
        );
      } else if (this.state.tokenAmount) {
        gasLimit = parseInt(
          await this.props.browseth.contract.ERC20.function
            .transfer(this.state.to, this.removeDecimal(this.state.tokenAmount))
            .gas({to: this.state.tokenAddr}),
          16,
        );
      }
      if (gasLimit) {
        const gasEstimate = (
          Browseth.Units.convert(
            `${this.state.gasPrice * gasLimit}`,
            'gwei',
            'ether',
          ) * this.state.ethPrice
        ).toFixed(4);
        this.setState({
          gasLimit,
          gasEstimate,
        });
      }
    }
  };

  getGasPrice = async () => {
    const response = await fetch(
      'https://ethgasstation.info/json/ethgasAPI.json',
    );
    const gasInfo = await response.json();
    this.setState({
      safeLowGas: (gasInfo.safeLow / 10).toFixed(2),
      safeSlowGas: (gasInfo.safeLowWait / 10).toFixed(2),
      safeFastGas: (gasInfo.fast / 10).toFixed(2),
    });
  };

  fetchUsdPrice = async () => {
    const response = await fetch(
      'https://api.coinmarketcap.com/v1/ticker/ethereum/',
    );
    const price = (await response.json())[0].price_usd;
    this.setState({ethPrice: parseFloat(price).toFixed(2)});
  };

  render() {
    return (
      <div className="wider">
        <h2>Address of Recipient</h2>
        <input
          type="text"
          value={this.state.to}
          onChange={this.updateTo}
          placeholder="THEIR_PUBLIC_ADDRESS"
          className="their-address"
        />
        <br />
        <div className="gas-price-container">
          <div
            className={`gas-price-option ${
              this.state.activeGas === 0 ? 'selected' : 'deselected'
            }`}
            onClick={() => {
              this.setActiveGas(0);
            }}
          >
            <b>Safe Slow Gas</b>
            <br />
            {this.state.safeSlowGas} Gwei
          </div>
          <div
            className={`gas-price-option ${
              this.state.activeGas === 1 ? 'selected' : 'deselected'
            }`}
            onClick={() => {
              this.setActiveGas(1);
            }}
          >
            <b>Safe Low Gas</b>
            <br />
            {this.state.safeLowGas} Gwei
          </div>
          <div
            className={`gas-price-option ${
              this.state.activeGas === 2 ? 'selected' : 'deselected'
            }`}
            onClick={() => {
              this.setActiveGas(2);
            }}
          >
            <div>
              <b>Safe Fast Gas</b>
              <br />
              {this.state.safeFastGas} Gwei
            </div>
          </div>
          <div
            className="refresh-gas"
            onClick={() => {
              this.getGasPrice();
              this.fetchUsdPrice();
            }}
          >
            Refresh Prices
          </div>
        </div>
        <div className="flex gas-info-container">
          <div className="gas-info">
            <b>Gas Limit:</b> {this.state.gasLimit} Gwei
          </div>
          <div className="gas-info">
            <b>Price of ETH</b> ${this.state.ethPrice}
          </div>
          <div className="gas-info">
            <b>Gas Estimate:</b> ${this.state.gasEstimate}
          </div>
        </div>
        <div className="sender">
          <div
            className={`sender-column ${
              this.state.activeSender === 0 ? 'selected' : 'deselected'
            }`}
            onClick={() => {
              this.setActiveSender(0);
            }}
          >
            <h2>Send ETH</h2>
            <b>Balance: </b>
            <div>{this.state.ethBalance} ETH</div>
            <br />
            <br />
            <b>Amount to Send</b>
            <br />
            <input
              type="number"
              value={this.state.ethAmount}
              onChange={this.updateEthAmount}
              placeholder={'AMOUNT_IN_ETH'}
              className="amount-input"
            />{' '}
            ETH
            <div className="send-max" onClick={this.setMaxEth}>
              Send Max
            </div>
          </div>
          <div
            className={`sender-column ${
              this.state.activeSender === 1 ? 'selected' : 'deselected'
            }`}
            onClick={() => {
              this.setActiveSender(1);
            }}
          >
            <h2>Send ERC20 Tokens</h2>
            <b>{this.state.symbol === '' ? 'Select a Token' : 'Balance: '}</b>
            <div>
              {this.state.tokenBalance === ''
                ? ''
                : `${this.state.tokenBalance} ${this.state.symbol}`}
            </div>
            <Select
              name="Select Token"
              value={this.state.selectedToken}
              onChange={this.selectToken}
              options={this.getTokens()}
              className="select-adjust"
            />
            <br />
            <b>Amount to Send</b>
            <br />
            <input
              type="number"
              value={this.state.tokenAmount}
              onChange={this.updateTokenAmount}
              placeholder={'AMOUNT_IN_TOKEN'}
              className="amount-input"
            />{' '}
            {this.state.symbol === '' ? '' : `${this.state.symbol}`}
            <div className="send-max" onClick={this.setMaxToken}>
              Send Max
            </div>
            <br />
          </div>
        </div>
        <div className="flex sender-bottom">
          <div className="transaction-hash">
            {this.state.transactionHash === '' ? (
              ''
            ) : (
              <div>
                Transaction Hash:<br /> ${this.state.transactionHash}
              </div>
            )}
          </div>
          <button className="send-button" onClick={this.sendMoney}>
            Send!
          </button>
        </div>
      </div>
    );
  }
}

export default SendMoney;

import * as React from 'react';
import Browseth from 'browseth';
import '../App.css';
import Prism from 'prismjs';
import * as abi from './etherdelta.json';
import * as config from '../config.json';

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trades: true,
      withdraws: false,
      deposits: false,
    };
    this.beth = new Browseth(config.url);
    this.eventListener = new Browseth.Apis.EventListener(
      this.beth.rpc,
      abi,
      true,
      '0x547990',
    );
    console.log(this.eventListener);
    this.contractAddress = '0x8d12A197cB00D4747a1fe03395095ce2A5CC6819';
  }

  render() {
    return (
      <div className="container">
        <div className="left">
          <div>
            <h2>Event Listener</h2>
            <h3>Live Ether Delta Events</h3>
            <button onClick={this.listen4Trades}>Listen for Trades</button>
            <button onClick={this.stopTrades}>Stop listening for Trades</button>
            {this.state.trades ? ' Listening!' : ''}
            <br />
            <button onClick={this.listen4Withdraws}>
              Listen for Withdraws
            </button>
            <button onClick={this.stopWithdraws}>
              Stop listening for Withdraws
            </button>
            {this.state.withdraws ? ' Listening!' : ''}
            <br />
            <button onClick={this.listen4Deposits}>Listen for Deposits</button>
            <button onClick={this.stopDeposits}>
              Stop listening for Deposits
            </button>
            {this.state.deposits ? ' Listening!' : ''}
            <br />
            <div className="text-box full-box">
              <code>{this.state.res}</code>
            </div>
          </div>
        </div>
        <div className="right">
          <code
            className="language-javascript"
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                `
  // Ether Delta contract abi
  const abi = [{"constant":false,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"user","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"amount","type":"uint256"}],"name":"trade","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"}],"name":"order","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"orderFills","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"cancelOrder","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"name":"depositToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"user","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"amountFilled","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"tokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"feeMake_","type":"uint256"}],"name":"changeFeeMake","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"feeMake","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"feeRebate_","type":"uint256"}],"name":"changeFeeRebate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"feeAccount","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"user","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"amount","type":"uint256"},{"name":"sender","type":"address"}],"name":"testTrade","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"feeAccount_","type":"address"}],"name":"changeFeeAccount","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"feeRebate","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"feeTake_","type":"uint256"}],"name":"changeFeeTake","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"admin_","type":"address"}],"name":"changeAdmin","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"name":"withdrawToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"orders","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"feeTake","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"accountLevelsAddr_","type":"address"}],"name":"changeAccountLevelsAddr","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"accountLevelsAddr","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"user","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"availableVolume","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"admin_","type":"address"},{"name":"feeAccount_","type":"address"},{"name":"accountLevelsAddr_","type":"address"},{"name":"feeMake_","type":"uint256"},{"name":"feeTake_","type":"uint256"},{"name":"feeRebate_","type":"uint256"}],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenGet","type":"address"},{"indexed":false,"name":"amountGet","type":"uint256"},{"indexed":false,"name":"tokenGive","type":"address"},{"indexed":false,"name":"amountGive","type":"uint256"},{"indexed":false,"name":"expires","type":"uint256"},{"indexed":false,"name":"nonce","type":"uint256"},{"indexed":false,"name":"user","type":"address"}],"name":"Order","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenGet","type":"address"},{"indexed":false,"name":"amountGet","type":"uint256"},{"indexed":false,"name":"tokenGive","type":"address"},{"indexed":false,"name":"amountGive","type":"uint256"},{"indexed":false,"name":"expires","type":"uint256"},{"indexed":false,"name":"nonce","type":"uint256"},{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"v","type":"uint8"},{"indexed":false,"name":"r","type":"bytes32"},{"indexed":false,"name":"s","type":"bytes32"}],"name":"Cancel","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenGet","type":"address"},{"indexed":false,"name":"amountGet","type":"uint256"},{"indexed":false,"name":"tokenGive","type":"address"},{"indexed":false,"name":"amountGive","type":"uint256"},{"indexed":false,"name":"get","type":"address"},{"indexed":false,"name":"give","type":"address"}],"name":"Trade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"balance","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"balance","type":"uint256"}],"name":"Withdraw","type":"event"}];

  // Ether Delta contract address
  const contractAddress = '0x8d12A197cB00D4747a1fe03395095ce2A5CC6819';

  // Create a new Event Listener
  // Note: We use 'true' for the 3rd parameter to have
  // the listener begin polling immediately.
  const eventListener = new Browseth.Apis.EventListener(
    beth.rpc,
    abi,
    true,
  );

  // Add a listener for Trades
  const listening4Trades = eventListener.addEventListener(
    contractAddress,
    'Trade',
    [],
    logs => {
      console.log(logs);
    },
  );

  // Remove the listener
  listening4Trades.remove();
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
    this.listen4Trades();
  }

  listen4Trades = () => {
    if (!this.listening4Trades) {
      this.listening4Trades = this.eventListener.addEventListener(
        this.contractAddress,
        'Trade',
        [],
        logs => {
          console.log(logs);
        },
      );
      this.setState({trades: true});
    }
    console.log(this.eventListener);
  };

  stopTrades = () => {
    if (this.listening4Trades) {
      this.listening4Trades.remove();
      this.listening4Trades = null;
      this.setState({trades: false});
    }
  };

  listen4Withdraws = () => {
    if (!this.listening4Withdraws) {
      this.listening4Withdraws = this.eventListener.addEventListener(
        this.contractAddress,
        'Withdraw',
        [],
        logs => {
          console.log(logs);
        },
      );
      this.setState({withdraws: true});
    }
  };

  stopWithdraws = () => {
    if (this.listening4Withdraws) {
      this.listening4Withdraws.remove();
      this.listening4Withdraws = null;
      this.setState({withdraws: false});
    }
  };

  listen4Deposits = () => {
    if (!this.listening4Deposits) {
      this.listening4Deposits = this.eventListener.addEventListener(
        this.contractAddress,
        'Deposit',
        [],
        logs => console.log(logs),
      );
      this.setState({deposits: true});
    }
  };

  stopDeposits = () => {
    if (this.listening4Deposits) {
      this.listening4Deposits.remove();
      this.listening4Deposits = null;
      this.setState({deposits: false});
    }
  };
}

export default Event;

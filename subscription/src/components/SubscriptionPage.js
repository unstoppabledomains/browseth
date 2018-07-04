import * as React from 'react';
import Browseth from 'browseth';
import '../App.css';
import * as SubscriptionAbi from './NFTSubscription.json';
import sapphire from '../assets/images/sapphire.png';
import diamond from '../assets/images/diamond.png';

class SubscriptionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      err: '',
      state: '',
      amountEth: '',
      amountTime: '',
      to: '',
    };
    this.props.browseth.wallet = new Browseth.Wallets.Online(
      new Browseth.Rpcs.Web3(window.web3.currentProvider),
    );
    this.props.browseth.addContract('subscription', SubscriptionAbi); // need address
    
  }

  render() {
    switch (this.state.state) {
      case 'noSub':
        return (
          <div>
            <h2>
              We noticed you don't have a subscription with this account!
              <br />
            </h2>
            <div className="container">
              <div className="subBox">
                <img
                  src={sapphire}
                  className="App-logo imgFit"
                  alt="sapphire"
                />
                <h2>Some Package</h2>
                <li>Some selling point</li>
                <li>another one</li>
                <li>blalabla</li>
                <h3>Gain access to</h3>
                <li>more stuff</li>
                <li>moremoremore</li>
                <br />
                <br />
                <div className="price">$3.99/year</div>
                or
                <br />
                <div className="price">.009ETH/year</div>
                <br />
                <br />
                <button onClick={this.subscribe} className="subscribe">
                  Subscribe!
                </button>
              </div>
              <div className="subBox">
                <img src={diamond} className="App-logo imgFit" alt="diamond" />
                <h2>A Better Package</h2>
                <li>another one</li>
                <li>Some selling point</li>
                <li>blalabla</li>
                <h3>Gain access to</h3>
                <li>moremoremore</li>
                <li>more stuff</li>
                <br />
                <br />
                <div className="price">$5.99/year</div>
                or
                <br />
                <div className="price">.014ETH/year</div>
                <br />
                <br />
                <button onClick={this.subscribe} className="subscribe">
                  Subscribe!
                </button>
              </div>
            </div>
            <div className="container">
              <a className="optOutBox" href="https://buyethdomains.com">
                No thanks! Go Back.
              </a>
            </div>
          </div>
        );
      case 'subbed':
        return (
          <div className="subscription-management">
            <h1>Subscription Management</h1>
            <br />
            <b>Subscription Type: </b>some-name-here
            <br />
            <br />
            <b>Expires at: </b>
            {this.getExpiration()}
            <br />
            <br />
            <h3>Extend Subscription</h3>
            <b>Add Eth to account</b>
            <br />
            <i>We'll calculate how much time is purchased!</i>
            <br />
            <input
              type="text"
              placeholder="Amount in Eth"
              onChange={this.updateAmountEth}
              value={this.state.amountEth}
            />
            <button onClick={this.purchaseByEth}>Purchase!</button>
            <br />
            <b>Add Time to account</b>
            <br />
            <i>We'll calculate how much Eth is required to purchase!</i>
            <br />
            <input
              type="text"
              placeholder="Number of months"
              onChange={this.updateAmountTime}
              value={this.state.amountTime}
            />
            <button onClick={this.purchaseByTime}>Purchase!</button>
            <br />
            <br />
            <h3>Transfer Subscription to Another User</h3>
            Address of new account:{' '}
            <input
              type="text"
              placeholder="0x123..."
              onChange={this.updateTo}
              value={this.state.to}
            />
            <button onClick={this.transferSub}>Transfer!</button>
          </div>
        );
      default:
        return <div>{this.state.err}</div>;
    }
  }

  componentDidMount() {
    this.props.browseth.wallet
      .account()
      .then(address => {
        if (!address) {
          this.setState({
            state: '',
            err: `You have Metamask enabled, but you're not logged in! Please log in, then refresh the page.`,
          });
        } else {
          this.setState({ address }, () => {
            this.determineState();
          });
        }
      })
      .catch(() => {
        this.setState({ err: 'Error!' });
      });
  }

  determineState = () => {
    if (!this.checkSubscription()) {
      this.setState({ state: 'noSub' });
    } else {
      this.setState({ state: 'subbed' });
    }
  };

  checkSubscription = () => {
    // logic for checking if user's address is subscribed
    // this.beth.contract.subscription.function.CHECKADDRESS(this.state.address).call();

    // return false; // temp
    return true; // temp
  };

  subscribe = () => {
    // logic for subscribing to a token
    // this.beth.contract.subscription.send({value: amount})?????
    this.setState({ state: 'subbed' }); // temp
  };

  getExpiration = () => {
    return 'some-amount-of-time';
  };

  transferSub = () => {
    // logic for transferring a subscription
    // NEED TOKEN ID
    // safeTransferFrom vs TransferFrom?
    // my private key or public address?
    // this.beth.contract.subscription.function.transferFrom(
    //   this.state.address,
    //   this.state.to,
    //   // TOKENID
    // );
  };

  updateAmountEth = e => {
    this.setState({
      amountEth: e.target.value,
    });
  };

  updateAmountTime = e => {
    this.setState({
      amountTime: e.target.value,
    });
  };

  updateTo = e => {
    this.setState({
      to: e.target.value,
    });
  };
}

export default SubscriptionPage;

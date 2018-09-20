import * as React from 'react';
import Browseth from 'browseth';
import '../App.css';
import sapphire from '../assets/images/sapphire.png';
import diamond from '../assets/images/diamond.png';
import TransactionHash from './TransactionHash';
import * as config from '../config.json';

class SubscriptionBoxes extends React.Component {
  state = {
    ethPrice: '',
    interval: 0,
    transactionHash: '',
    subscription: '',
    paid: false,
  };

  componentDidMount() {
    // this.getPrice();
    this.hasPaidSubscription().then(res => {
      if (!res) {
        this.hasFreeSubscription();
      }
    });
  }

  componentWillUnmount() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
  }

  freeSubscribe = async () => {
    if (await this.hasPaidSubscription()) {
      return;
    } else if (await this.hasFreeSubscription()) {
      return;
    }
    const transactionHash = await this.props.browseth.wallet.send({
      to: config.freeAddress,
      gasPrice: '0x1',
      value: '0x0',
    });
    this.setState({transactionHash, paid: true});
  };

  premiumSubscribe = async () => {
    if (await this.hasPaidSubscription()) {
      return;
    }

    const transactionHash = await this.props.browseth.wallet.send({
      to: config.paidAddress,
      gasPrice: '0x1',
      value: Browseth.Units.etherToWei(config.paidPrice),
    });
    this.setState({transactionHash, paid: true});
  };

  hasPaidSubscription = async () => {
    if (
      (await this.props.browseth.contract.paidSubscription.function
        .balanceOf(await this.props.browseth.wallet.account())
        .call()).toString() > '0'
    ) {
      this.setState({subscription: 'paid'});
      return true;
    }
    return false;
  };

  hasFreeSubscription = async () => {
    if (
      (await this.props.browseth.contract.freeSubscription.function
        .balanceOf(await this.props.browseth.wallet.account())
        .call()).toString() > '0'
    ) {
      this.setState({subscription: 'free'});
      return true;
    }
    return false;
  };

  // getPrice = () => {
  //   this.fetchPrice();
  //   const interval = setInterval(() => {
  //     this.fetchPrice();
  //   }, 30000);
  //   this.setState({interval});
  // };

  // // Gets the current price of Eth and returns the Eth equivalent to $5.99
  // fetchPrice = async () => {
  //   const response = await fetch(
  //     'https://api.coinmarketcap.com/v1/ticker/ethereum/',
  //   );
  //   const price = (await response.json())[0].price_usd;
  //   this.setState({ethPrice: (5.99 / price).toFixed(3)});
  // };

  render() {
    return (
      <div>
        {this.state.paid ? (
          <div>
            <h1>Thank you for subscribing!</h1>
            <h3 className="narrowerH3">
              We've submitted a transaction for your account to obtain a
              subscription token to the Ethereum Blockchain. Once your
              transaction has been mined, you will gain access to our content!
            </h3>
            <br />
            <TransactionHash transactionHash={this.state.transactionHash} />
          </div>
        ) : (
          <div>
            {(() => {
              switch (this.state.subscription) {
                case 'paid':
                  return (
                    <div>
                      <h2>
                        We noticed you may already have a paid subscription on
                        this account!
                      </h2>
                      <h3>
                        Please refresh this page once your transaction has been
                        mined.
                      </h3>
                    </div>
                  );
                case 'free':
                  return (
                    <div>
                      <h2>
                        We noticed you may already have a free subscription on
                        this account!
                      </h2>
                      <h3>
                        Refresh this page once your transaction has been mined.
                        Please take this time to consider the benefits of our
                        premium options for your account as well!
                      </h3>
                    </div>
                  );
                default:
                  return (
                    <div>
                      <h2>
                        We noticed you don't have a subscription with this
                        account
                      </h2>
                      <h3>
                        Please choose a subscription package to gain access to
                        amazing content!
                      </h3>
                    </div>
                  );
              }
            })()}
            <div className="container">
              <div className="subBox">
                <br />
                <img
                  src={sapphire}
                  className="App-logo imgFit"
                  alt="sapphire"
                />
                <h2>Basic Package</h2>
                <li>Access our site</li>
                <li>Simple account management</li>
                <br />
                <h3>Gain access to</h3>
                <li>Basic and free content</li>
                <li>Minimum page functionality</li>
                <br />
                <br />
                <br />
                <div className="price">FREE</div>
                <div className="button-container">
                  <button
                    onClick={this.freeSubscribe}
                    className="subscribe-button"
                  >
                    Subscribe!
                  </button>
                </div>
              </div>
              <div className="subBox">
                <br />
                <img src={diamond} className="App-logo imgFit" alt="diamond" />
                <h2>A Better Package</h2>
                <li>Full access to our site</li>
                <li>Advanced account management</li>
                <h3>Gain access to</h3>
                <li>All premium content</li>
                <li>Full page functionality</li>
                <br />
                <br />
                <div className="price">$5.99/year</div>
                or
                <br />
                <div className="price">0.012ETH/year</div>
                <div className="button-container">
                  <button
                    onClick={this.premiumSubscribe}
                    className="subscribe-button"
                  >
                    Subscribe!
                  </button>
                </div>
              </div>
            </div>
            <div className="container">
              <a className="go-back" href="https://buyethdomains.com">
                No thanks! Go Back.
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SubscriptionBoxes;

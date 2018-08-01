import * as React from 'react';
import '../App.css';
import Browseth from 'browseth';
import TransactionHash from './TransactionHash';
import * as config from '../config.json';

class FreeAccountManagement extends React.Component {
  state = {
    expiration: '',
    state: '',
    page: 0,
    isLoading: false,
    pageItems: [],
    numTokens: 0,
    transactionHash: '',
  };

  componentDidMount() {
    this.initToken();
  }

  initToken = async () => {
    const tokenId = await this.props.browseth.c.freeSubscription.f
      .getTokenId(this.state.page)
      .call();
    const expiration = await this.props.browseth.c.freeSubscription.f
      .expiresAt(tokenId.toNumber())
      .call();
    const date = new Date(expiration * 1000);
    this.setState({
      tokenId: tokenId.toNumber(),
      expiration: date.toDateString(),
    });
  };

  upgrade = async () => {
    const transactionHash = await this.props.browseth.wallet.send({
      to: config.paidAddress,
      gasPrice: '0x1',
      value: Browseth.Units.etherToWei(config.paidPrice),
    });
    this.setState({transactionHash, state: 'subbed'});
  };

  render() {
    switch (this.state.state) {
      case 'subbed':
        return (
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
        );
      case 'transfered':
        return (
          <div>
            <h1>Transferring your subscription!</h1>
            <h3 className="narrowerH3">
              We've submitted a transaction to transfer your subscription token
              to {this.state.transferTo} to the Ethereum Blockchain. Once your
              transaction has been mined, you will no longer be able to access
              this subscription token from this address!
            </h3>
            <br />
            <TransactionHash transactionHash={this.state.transactionHash} />
          </div>
        );
      default:
        return (
          <div className="subscription-management">
            <h1>Subscription Management</h1>
            <p>
              <b>Subscription Type: </b>Free
            </p>
            <p>
              <b>Expires on: </b>
              {this.state.expiration}
            </p>
            <br />
            <h2>Upgrade to Premium!</h2>
            <b>Gain full access for only {config.paidPrice}ETH!!!</b>
            <br />
            <button
              className="subscribe-button upgrade-button"
              onClick={this.upgrade}
            >
              Subscribe Now!
            </button>
          </div>
        );
    }
  }
}

export default FreeAccountManagement;

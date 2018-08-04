import * as React from 'react';
import '../App.css';
import Browseth from 'browseth';
import TransactionHash from './TransactionHash';

class PremiumAccountManagement extends React.Component {
  state = {
    amountEth: '',
    amountTime: '',
    transferTo: '',
    expiration: '',
    price: '',
    state: '',
    transactionHash: '',
    page: 0,
    isLoading: false,
    pageItems: [],
    numTokens: 0,
    toggleButton: false,
  };

  componentDidMount() {
    this.initToken();
    this.createPageOptions();
  }

  initToken = async () => {
    const tokenId = await this.props.browseth.c.paidSubscription.f
      .getTokenId(this.state.page)
      .call();
    const expiration = await this.props.browseth.c.paidSubscription.f
      .expiresAt(tokenId.toNumber())
      .call();
    const price = await this.props.browseth.c.paidSubscription.f
      .getMinimumPrice()
      .call();
    console.log(expiration.toNumber());
    const date = new Date(expiration * 1000);
    this.setState({
      tokenId: tokenId.toNumber(),
      expiration: date.toDateString(),
      price: parseFloat(Browseth.Units.convert(price, 'wei', 'ether')).toFixed(
        3,
      ),
    });
  };

  createPageOptions = () => {
    this.setState({isLoading: true}, () => {
      this.props.browseth.wallet.account().then(address => {
        this.props.browseth.c.paidSubscription.f
          .balanceOf(address)
          .call()
          .then(result => {
            let pageItems = [];
            const numTokens = result.toNumber();
            for (let i = 0; i < numTokens; i++) {
              pageItems.push(
                <option key={i} value={i}>
                  Subscription {i}
                </option>,
              );
            }
            this.setState({isLoading: false, pageItems, numTokens});
          });
      });
    });
  };

  onDropdownSelected = e => {
    this.setState({page: e.target.value}, () => {
      this.initToken();
    });
  };

  renew = async () => {
    const transactionHash = await this.props.browseth.c.paidSubscription.f
      .renew(this.state.tokenId)
      .send({
        gasPrice: '0x1',
        value: Browseth.Units.etherToWei(this.state.price),
      });
    this.setState({transactionHash, state: 'renewed'});
  };

  transferSub = async () => {
    const address = await this.props.browseth.wallet.account();
    const transactionHash = await this.props.browseth.c.paidSubscription.f
      .transferFrom(address, this.state.transferTo, this.state.tokenId)
      .send();
    this.setState({transactionHash, state: 'transfered'});
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

  updateTransferTo = e => {
    if (/^0x[a-f\d]{40}$/i.test(e.target.value)) {
      if (!this.state.toggleButton) {
        this.setState({toggleButton: true});
      }
    } else {
      if (this.state.toggleButton) {
        this.setState({toggleButton: false});
      }
    }
    this.setState({
      transferTo: e.target.value,
    });
  };

  render() {
    switch (this.state.state) {
      case 'renewed':
        return (
          <div>
            <h1>Thank you for renewing!</h1>
            <h3 className="narrowerH3">
              We've submitted a transaction to extend your account subscription
              by one additional year to the Ethereum Blockchain. Once your
              transaction has been mined, your account will be renewed!
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
            {this.state.loading ? (
              <div>Loading Tokens</div>
            ) : (
              <div>
                You own {this.state.numTokens} premium subscription{this.state
                  .numTokens > 1
                  ? 's'
                  : ''}
                <br />
                <b>Select account: </b>
                <select onChange={this.onDropdownSelected}>
                  {this.state.pageItems}
                </select>
              </div>
            )}
            <hr />
            <p>
              <b>Subscription Type: </b>Premium
            </p>
            <p>
              <b>Expires on: </b>
              {this.state.expiration}
            </p>
            <hr />
            <h2>Renew Subscription</h2>
            <b>Add 1 year to your account: {this.state.price}ETH</b>
            <button onClick={this.renew}>Purchase!</button>
            <br />
            <br />
            <h2>Transfer Subscription to Another User</h2>
            Address of new account:{' '}
            <input
              type="text"
              placeholder="0x123..."
              onChange={this.updateTransferTo}
              value={this.state.transferTo}
              size="42"
            />
            <button
              onClick={this.transferSub}
              disabled={!this.state.toggleButton}
            >
              Transfer!
            </button>
          </div>
        );
    }
  }
}

export default PremiumAccountManagement;

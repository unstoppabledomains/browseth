import * as React from 'react';
import '../App.css';
import Browseth from 'browseth';
import clipboard from '../assets/icons/clipboard.svg';

class AccountManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amountEth: '',
      amountTime: '',
      transferTo: '',
      expiration: '',
      price: '',
      state: '',
      transactionHash: '',
      fade: false,
      page: 0,
      isLoading: false,
      pageItems: [],
      numTokens: 0,
    };
  }

  render() {
    switch (this.state.state) {
      case 'renewed':
        return (
          <div>
            <h1>Thank you for renewing!</h1>
            <h3>
              We've submitted a transaction to extend your account subscription
              by one additional year to the Ethereum Blockchain. Once your
              transaction has been mined, your account will be renewed!
            </h3>
            <div className="hash-outer">
              <div className="hash">Transaction Hash</div>
              <div className="txh">
                <code>
                  <a
                    href={
                      'https://etherscan.io/tx/' + this.state.transactionHash
                    }
                  >
                    {this.state.transactionHash}
                  </a>
                </code>
              </div>
              <div className="tooltip">
                <div
                  className={
                    'tooltip-text' + (this.state.fade ? ' fadeout' : '')
                  }
                >
                  Copied!
                </div>
                <img
                  className="clipboard"
                  src={clipboard}
                  onClick={this.copyToClipboard}
                  alt="icon"
                />
              </div>
            </div>
            <br />
            <p className="smaller">
              Please save this transaction hash while you wait for it to be
              mined. Once you leave this page you won't be able to retrieve it.
              You can check the status of your transaction at{' '}
              <a href={'https://etherscan.io/tx/' + this.state.transactionHash}>
                Etherscan
              </a>.
            </p>
            <br />
            <a className="go-back" href="http://localhost:3000">
              Got it! Go Back.
            </a>
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
            />
            <button onClick={this.transferSub}>Transfer!</button>
          </div>
        );
    }
  }

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
    this.props.browseth.c.paidSubscription.f
      .transferFrom(address, this.state.transferTo, this.state.tokenId)
      .send();

    // temp
    const temp = await this.props.browseth.c.paidSubscription.f
      .balanceOf(this.state.transferTo)
      .call();
    console.log(temp.toString());
    //
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
    this.setState({
      transferTo: e.target.value,
    });
  };

  copyToClipboard = () => {
    if (this.state.fade) {
      return;
    }
    this.setState({fade: true});
    setTimeout(() => {
      this.setState({fade: false});
    }, 1400);

    const temp = document.createElement('textarea');
    temp.innerText = this.state.transactionHash;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
  };
}

export default AccountManagement;

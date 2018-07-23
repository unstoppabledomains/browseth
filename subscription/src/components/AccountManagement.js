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
      to: '',
      expiration: '',
      price: '',
      state: '',
      transactionHash: '',
      fade: false,
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
            <br />
            <b>Subscription Type: </b>Premium
            <br />
            <br />
            <b>Expires on: </b>
            {this.state.expiration}
            <br />
            <br />
            <h3>Renew Subscription</h3>
            <b>Add 1 year to your account: {this.state.price}ETH</b>
            <button onClick={this.renew}>Purchase!</button>
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
    }
  }

  componentDidMount() {
    this.getPaidExpiration();
    this.getPrice();
  }

  getPrice = async () => {
    const price = await this.props.browseth.c.paidSubscription.f
      .getMinimumPrice()
      .call();
    this.setState({
      price: parseFloat(Browseth.Units.convert(price, 'wei', 'ether')).toFixed(
        3,
      ),
    });
  };

  getPaidExpiration = async () => {
    const tokenId = await this.props.browseth.c.paidSubscription.f
      .getTokenId(0)
      .call();
    console.log('tokenid', tokenId);
    const expiration = await this.props.browseth.c.paidSubscription.f
      .expiresAt(tokenId.toNumber())
      .call();
    console.log('expiration', expiration.toString());
    const date = new Date(expiration * 1000);
    console.log(date);
    this.setState({expiration: date.toDateString()});
  };

  renew = async () => {
    const tokenId = await this.props.browseth.c.paidSubscription.f
      .getTokenId(0)
      .call();
    const transactionHash = await this.props.browseth.c.paidSubscription.f
      .renew(tokenId)
      .send({
        gasPrice: '0x1',
        value: Browseth.Units.etherToWei(this.state.price),
      });
    console.log(transactionHash);
    this.setState({transactionHash, state: 'renewed'});
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

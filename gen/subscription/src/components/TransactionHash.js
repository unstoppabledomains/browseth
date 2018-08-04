import * as React from 'react';
import '../App.css';
import clipboard from '../assets/icons/clipboard.svg';

class TransactionHash extends React.Component {
  state = {
    fade: false,
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

  render() {
    return (
      <div>
        <div className="hash-outer">
          <div className="hash">Transaction Hash</div>
          <div className="txh">
            <code>
              <a href={'https://etherscan.io/tx/' + this.props.transactionHash}>
                {this.props.transactionHash}
              </a>
            </code>
          </div>
          <div className="tooltip">
            <div
              className={'tooltip-text' + (this.state.fade ? ' fadeout' : '')}
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
          Please save this transaction hash while you wait for it to be mined.
          You can check the status of your transaction at{' '}
          <a href={'https://etherscan.io/tx/' + this.props.transactionHash}>
            Etherscan
          </a>.
        </p>
        <br />
        <a className="go-back" href="http://localhost:3000">
          Got it! Go Back.
        </a>
      </div>
    );
  }
}

export default TransactionHash;

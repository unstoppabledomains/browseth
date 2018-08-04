import * as React from 'react';
import '../App.css';

class SelectWallet extends React.Component {
  state = {
    describePrivateKey: false,
    describeLedger: false,
    describeKeystore: false,
    describeMetamask: false,
  };

  togglePrivateKey = () => {
    this.setState({describePrivateKey: !this.state.describePrivateKey});
  };

  toggleLedger = () => {
    this.setState({describeLedger: !this.state.describeLedger});
  };

  toggleKeystore = () => {
    this.setState({describeKeystore: !this.state.describeKeystore});
  };

  toggleMetamask = () => {
    this.setState({describeMetamask: !this.state.describeMetamask});
  };

  render() {
    return (
      <div>
        <div className="wallet-header">Please Select a Wallet to use</div>
        <div className="options-container">
          <div
            className="wallet-option"
            onClick={() => {
              this.props.flip('privateKey');
            }}
            onMouseOver={this.togglePrivateKey}
            onMouseOut={this.togglePrivateKey}
          >
            {this.state.describePrivateKey ? (
              <div className="description">
                Access your wallet directly via your raw Private Key
              </div>
            ) : (
              <div>PrivateKey</div>
            )}
          </div>
          <div
            className="wallet-option"
            onClick={() => {
              this.props.flip('ledger');
            }}
            onMouseOver={this.toggleLedger}
            onMouseOut={this.toggleLedger}
          >
            {this.state.describeLedger ? (
              <div className="description">
                Access the accounts on your Ledger Nano S
              </div>
            ) : (
              <div>Ledger</div>
            )}
          </div>
          <div
            className="wallet-option"
            onClick={() => {
              this.props.flip('keystore');
            }}
            onMouseOver={this.toggleKeystore}
            onMouseOut={this.toggleKeystore}
          >
            {this.state.describeKeystore ? (
              <div className="description">
                Enable your wallet via a keystore file and password
              </div>
            ) : (
              <div>Keystore</div>
            )}
          </div>
          <div
            className="wallet-option"
            onClick={() => {
              this.props.flip('metamask');
            }}
            onMouseOver={this.toggleMetamask}
            onMouseOut={this.toggleMetamask}
          >
            {this.state.describeMetamask ? (
              <div className="description">
                Access your wallet via the Metamask Chrome extension
              </div>
            ) : (
              <div>Metamask</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default SelectWallet;

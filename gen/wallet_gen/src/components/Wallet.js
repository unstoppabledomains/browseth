import * as React from 'react';
import '../App.css';
import PrivateKeyWallet from './PrivateKeyWallet';
import MetaMaskWallet from './MetaMaskWallet';
import KeystoreWallet from './KeystoreWallet';
import LedgerWallet from './LedgerWallet';

class Wallet extends React.Component {
  state = {
    publicAddress: '',
    privateKey: '',
    isVisible: false,
    fade: false,
  };

  copyToClipboard = text => {
    if (this.state.fade) {
      return;
    }
    this.setState({fade: true});
    setTimeout(() => {
      this.setState({fade: false});
    }, 1400);

    const temp = document.createElement('textarea');
    temp.innerText = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
  };

  render() {
    switch (this.props.state) {
      case 'privateKey':
        return (
          <PrivateKeyWallet
            browseth={this.props.browseth}
            copyToClipboard={this.copyToClipboard}
            fade={this.state.fade}
          />
        );
      case 'ledger':
        return <LedgerWallet browseth={this.props.browseth} />;
      case 'keystore':
        return (
          <KeystoreWallet
            browseth={this.props.browseth}
            copyToClipboard={this.copyToClipboard}
            fade={this.state.fade}
          />
        );
      case 'metamask':
        return (
          <MetaMaskWallet
            browseth={this.props.browseth}
            copyToClipboard={this.copyToClipboard}
            fade={this.state.fade}
          />
        );
      default:
        return <div>Error!</div>;
    }
  }
}

export default Wallet;

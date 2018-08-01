import * as React from 'react';
import '../App.css';
import PrivateKeyWallet from './PrivateKeyWallet';
import MetaMaskWallet from './MetaMaskWallet';
import KeystoreWallet from './KeystoreWallet';

class Wallet extends React.Component {
  state = {
    publicAddress: '',
    privateKey: '',
    isVisible: false,
    fade: false,
  };

  componentDidMount() {
    this.getAddress();
  }

  getAddress = async () => {
    const publicAddress = await this.props.browseth.wallet.account();
    let privateKey = '';
    if (this.props.state === 'privateKey' || this.props.state === 'keystore') {
      privateKey = '0x' + this.props.browseth.wallet.signer.toString();
      console.log(privateKey);
    }
    this.setState({publicAddress, privateKey});
  };

  copyToClipboard = () => {
    console.log('asdasdasdsad');
    if (this.state.fade) {
      return;
    }
    this.setState({fade: true});
    setTimeout(() => {
      this.setState({fade: false});
    }, 1400);

    const temp = document.createElement('textarea');
    temp.innerText = this.state.publicAddress;
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
            publicAddress={this.state.publicAddress}
            privateKey={this.state.privateKey}
          />
        );
      case 'keystore':
        return (
          <KeystoreWallet
            browseth={this.props.browseth}
            copyToClipboard={this.copyToClipboard}
            fade={this.state.fade}
            publicAddress={this.state.publicAddress}
            privateKey={this.state.privateKey}
          />
        );
      case 'metamask':
        return (
          <MetaMaskWallet
            browseth={this.props.browseth}
            copyToClipboard={this.copyToClipboard}
            fade={this.state.fade}
            publicAddress={this.state.publicAddress}
          />
        );
      default:
        return <div>Error!</div>;
    }
  }
}

export default Wallet;

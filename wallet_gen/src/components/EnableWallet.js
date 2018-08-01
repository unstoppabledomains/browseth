import * as React from 'react';
import '../App.css';
import EnablePrivateKey from './EnablePrivateKey';
import EnableLedger from './EnableLedger';
import EnableMetaMask from './EnableMetaMask';
import EnableKeystore from './EnableKeystore';
import Browseth from '../../node_modules/browseth';

class EnableWallet extends React.Component {
  state = {
    privateKey: '',
  };

  authPrivateKey = privateKey => {
    this.props.browseth.wallet = new Browseth.Wallets.Offline(
      this.props.browseth.rpc,
      Browseth.Signers.PrivateKey.fromHex(privateKey),
    );
    this.props.enable();
  };

  authLedger = () => {
    this.props.enable();
  };

  authMetaMask = () => {
    this.props.enable();
  };

  authKeystore = privateKey => {
    this.props.browseth.wallet = new Browseth.Wallets.Offline(
      this.props.browseth.rpc,
      privateKey,
    );
    this.props.enable();
  };

  render() {
    switch (this.props.state) {
      case 'privateKey':
        return (
          <EnablePrivateKey
            auth={this.authPrivateKey}
            unflip={this.props.unflip}
          />
        );
      case 'ledger':
        return (
          <EnableLedger
            auth={this.authLedger}
            unflip={this.props.unflip}
            browseth={this.props.browseth}
          />
        );
      case 'keystore':
        return (
          <EnableKeystore auth={this.authKeystore} unflip={this.props.unflip} />
        );
      case 'metamask':
        return (
          <EnableMetaMask auth={this.authMetaMask} unflip={this.props.unflip} />
        );
      default:
        return <div>Error!</div>;
    }
  }
}

export default EnableWallet;

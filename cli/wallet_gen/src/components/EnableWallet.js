import * as React from 'react';
import '../App.css';
import EnablePrivateKey from './EnablePrivateKey';
import EnableLedger from './EnableLedger';
import EnableMetaMask from './EnableMetaMask';
import EnableKeystore from './EnableKeystore';

class EnableWallet extends React.Component {
  state = {
    privateKey: '',
  };

  auth = () => {
    this.props.enable();
  };

  render() {
    switch (this.props.state) {
      case 'privateKey':
        return (
          <EnablePrivateKey
            auth={this.auth}
            browseth={this.props.browseth}
            unflip={this.props.unflip}
          />
        );
      case 'ledger':
        return (
          <EnableLedger
            auth={this.auth}
            unflip={this.props.unflip}
            browseth={this.props.browseth}
          />
        );
      case 'keystore':
        return (
          <EnableKeystore
            auth={this.auth}
            unflip={this.props.unflip}
            browseth={this.props.browseth}
          />
        );
      case 'metamask':
        return (
          <EnableMetaMask
            auth={this.auth}
            unflip={this.props.unflip}
            browseth={this.props.browseth}
          />
        );
      default:
        return <div>Error!</div>;
    }
  }
}

export default EnableWallet;

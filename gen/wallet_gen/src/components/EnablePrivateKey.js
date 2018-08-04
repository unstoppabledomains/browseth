import * as React from 'react';
import '../App';
import * as Arrow from '../assets/arrow.png';
import Browseth from 'browseth';

class EnablePrivateKey extends React.Component {
  state = {
    privateKey: '',
    isEnabled: false,
  };

  generatePrivKey = () => {
    const privateKey = '0x' + Browseth.Signers.PrivateKey.fromRandomBytes();
    this.checkPrivateKey(privateKey);
    this.setState({privateKey});
  };

  updatePrivateKey = e => {
    this.checkPrivateKey(e.target.value);
    this.setState({privateKey: e.target.value});
  };

  checkPrivateKey = key => {
    if (/^0x[a-f\d]{64}$/i.test(key)) {
      if (!this.state.isEnabled) {
        this.setState({isEnabled: true});
      }
    } else {
      if (this.state.isEnabled) {
        this.setState({isEnabled: false});
      }
    }
  };

  auth = () => {
    this.props.browseth.wallet = new Browseth.Wallets.Offline(
      this.props.browseth.rpc,
      Browseth.Signers.PrivateKey.fromHex(this.state.privateKey),
    );
    this.props.auth();
  };

  render() {
    return (
      <div>
        <div className="wallet-header">
          Private Key
          <div className="back-arrow-container">
            <img
              className="back-arrow"
              src={Arrow}
              onClick={this.props.unflip}
              alt="backArrow"
            />
          </div>
        </div>
        <div className="back-box">
          <div className="container">
            <div className="top-blue-oval" />
            <div className="middle-blue-box" />
            <div className="middle-right-oval" />
            <div className="bottom-blue-box" />
            <div className="black-oval" />

            <div className="enable-content">
              <h1>Enter your Private Key</h1>
              <input
                type="text"
                className="privatekey-input"
                value={this.state.privateKey}
                onChange={this.updatePrivateKey}
              />
              <br />
              <button
                onClick={this.auth}
                className="auth-button"
                disabled={!this.state.isEnabled}
              >
                Enable!
              </button>
              <br />
              <br />
              <p>
                Don't have one?{' '}
                <button onClick={this.generatePrivKey} className="make-button">
                  Make me one!
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EnablePrivateKey;

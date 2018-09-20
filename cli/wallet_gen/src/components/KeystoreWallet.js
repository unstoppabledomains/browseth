import * as React from 'react';
import '../App.css';
import SendMoney from './SendMoney';
import * as Clipboard from '../assets/clipboard.svg';
import * as Invisible from '../assets/invisible.png';
import * as Visible from '../assets/visible.png';

class KeystoreWallet extends React.Component {
  state = {
    activeTab: 0,
    isVisible: false,
    publicAddress: '',
    privateKey: '',
  };

  componentDidMount() {
    this.getAddresses();
  }

  getAddresses = async () => {
    const publicAddress = await this.props.browseth.wallet.account();
    const privateKey = '0x' + this.props.browseth.wallet.signer.toString();
    this.setState({publicAddress, privateKey});
  };

  toggleEye = () => {
    this.setState({isVisible: !this.state.isVisible});
  };

  activateTab = tab => {
    this.setState({activeTab: tab});
  };

  render() {
    switch (this.state.activeTab) {
      default:
        return (
          <div>
            <div className="wallet-header">Your Wallet</div>

            <div className="back-box">
              <div
                className={`tab ${
                  this.state.activeTab === 0 ? 'active' : 'inactive'
                }`}
                onClick={() => {
                  this.activateTab(0);
                }}
              >
                Address
              </div>
              <div
                className={`tab t1 ${
                  this.state.activeTab === 1 ? 'active' : 'inactive'
                }`}
                onClick={() => {
                  this.activateTab(1);
                }}
              >
                Send Money
              </div>

              <div
                className={`content-container ${
                  this.state.activeTab === 0 ? 'forward' : 'behind'
                }`}
              >
                <div className="blue-container">
                  <h1>Your Public Address</h1>
                  <div className="public-address-box">
                    <div className="public-address-box-content">
                      {this.state.publicAddress}
                      <div className="tooltip">
                        <div
                          className={
                            'tooltip-text privatekey-tooltip-position' +
                            (this.props.fade ? ' fadeout' : '')
                          }
                        >
                          Copied!
                        </div>
                        <img
                          className="clipboard"
                          src={Clipboard}
                          onClick={() => {
                            this.props.copyToClipboard(
                              this.state.publicAddress,
                            );
                          }}
                          alt="icon"
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <h1>Your Private Key</h1>
                  <div className="private-key-input-container">
                    <input
                      className="private-key-input"
                      type="text"
                      value={
                        this.state.isVisible
                          ? this.state.privateKey
                          : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
                      }
                      disabled
                    />
                    <img
                      onClick={this.toggleEye}
                      src={this.state.isVisible ? Visible : Invisible}
                      className="invisible-icon"
                      alt="visibility-icon"
                    />
                  </div>
                  <div className="dont-share">
                    Do not share your private key with anyone!
                  </div>
                </div>
              </div>
              <div
                className={`content-container ${
                  this.state.activeTab === 1 ? 'forward' : 'behind'
                }`}
              >
                <div className="blue-container">
                  <SendMoney browseth={this.props.browseth} publicAddress={this.state.publicAddress}/>
                </div>
              </div>
            </div>
          </div>
        );
    }
  }
}

export default KeystoreWallet;

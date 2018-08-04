import * as React from 'react';
import '../App';
import * as Arrow from '../assets/arrow.png';
import Browseth from 'browseth';

class EnableMetaMask extends React.Component {
  state = {
    privateKey: '',
    isEnabled: false,
    err: '',
  };

  componentDidMount() {
    if (!window.web3) {
      this.setState({
        err:
          'No Web3! Try installing/enabling the Metamask extension, then refresh the page.',
      });
      return;
    }
    this.props.browseth.wallet = new Browseth.Wallets.Online(
      new Browseth.Rpcs.Web3(window.web3.currentProvider),
    );
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = async () => {
    const address = await this.props.browseth.wallet.account();
    if (!address) {
      this.setState({
        err:
          "You have Metamask enabled, but you're not logged in. Please log in, then refresh the page.",
      });
    } else {
      this.setState({isEnabled: true});
    }
  };

  render() {
    return (
      <div>
        <div className="wallet-header">
          MetaMask
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

            <div className="enable-content adjust-metamask">
              <h2>
                {this.state.err === ''
                  ? 'Your MetaMask wallet is ready to go!'
                  : this.state.err}
              </h2>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              {this.state.err === ''
                ? `If you still can't enable, double check you are connected to a network.`
                : ''}
              <button
                onClick={this.props.auth}
                className="auth-button"
                disabled={!this.state.isEnabled}
              >
                Enable!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EnableMetaMask;

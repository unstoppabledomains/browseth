import * as React from 'react';
import '../App';
import * as Arrow from '../assets/arrow.png';
import Browseth from 'browseth';

class EnableLedger extends React.Component {
  state = {
    title: 'Searching for Local Ledger Wallet',
    isEnabled: false,
    err: '',
    uploading: true,
    filename: '',
    privateKey: '',
  };

  componentDidMount() {
    this.refreshLedger();
  }

  refreshLedger = async () => {
    if (this.state.title !== 'Searching for Local Ledger Wallet') {
      this.setState({title: 'Searching for Local Ledger Wallet'});
    }
    try {
      this.props.browseth.wallet = new Browseth.Wallets.Offline(
        this.props.browseth.rpc,
        new Browseth.Signers.Ledger(),
      );
      await this.props.browseth.wallet.account(1);
    } catch (err) {
      console.log(err);
      if (err.toString().includes('HTTPS')) {
        this.setState({title: 'Error!', err: 'No HTTPS connection!'});
      } else {
        this.setState({
          title: 'Error!',
          err: `Couldn't find local Ledger Wallet. Please ensure you are in the Ethereum app with Browser support enabled!`,
        });
      }
    }
    this.setState({
      isLoading: false,
      isEnabled: true,
      title: 'Ledger Found!',
      err: '',
    });
  };

  doubleCheck = () => {
    this.setState(
      {
        isEnabled: false,
        err:
          'If the Enable process takes a while, your Ledger may have disconnected.',
      },
      async () => {
        try {
          await this.props.browseth.wallet.account(0);
        } catch (err) {
          this.setState({
            title: 'Error!',
            err: `Ledger lost! Double check that it's plugged in and in the Ethereum app`,
          });
          return;
        }
        this.props.auth();
      },
    );
  };

  render() {
    return (
      <div>
        <div className="wallet-header">
          Ledger
          <div className="back-arrow-container">
            <img
              className="back-arrow"
              src={Arrow}
              onClick={() => {
                this.props.unflip();
                this.setState({isEnabled: false});
              }}
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
              <h1>{this.state.title}</h1>
              <br />
              <li>Plug your Ledger Wallet in and unlock it</li>
              <br />
              <li>Enter the Ethereum App</li>
              <br />
              <li>
                In "Settings" ensure that "Browser support" is set to "Yes"
              </li>
              <br />
              <button onClick={this.refreshLedger}>Reload Ledger</button>
              <br />
              <br />
              {this.state.err === '' ? '' : this.state.err}
              <button
                onClick={this.doubleCheck}
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

export default EnableLedger;

import * as React from 'react';
import '../App.css';
import SendMoney from './SendMoney';
import Browseth from 'browseth';

class LedgerWallet extends React.Component {
  state = {
    activeTab: 0,
    isVisible: false,
    currentIndex: 0,
    activeIndex: 0,
    addresses: [],
    balances: [],
    isLoadingAddresses: true,
    prev5Available: false,
    page: '', // ???
  };

  componentDidMount() {
    this.getAddresses(0);
  }

  activateTab = tab => {
    this.setState({activeTab: tab});
  };

  async getAddresses(currentIndex) {
    this.setState({isLoadingAddresses: true});

    const addresses = [];

    for (let i = currentIndex; i < currentIndex + 5; i++) {
      addresses.push(await this.props.browseth.wallet.account(i));

      if (i === 0 && this.state.page === 'loading') {
        this.setState({page: 'loaded'});
      }
    }
    const balances = await this.getBalances(addresses);
    this.setState({
      addresses,
      balances,
      currentIndex,
      page: 'loaded',
      prev5Available: currentIndex !== 0,
      isLoadingAddresses: false,
    });
  }

  getBalances = async addresses => {
    const balances = [];

    return new Promise(resolve =>
      this.props.browseth.wallet.rpc.batch(
        () => {
          resolve(balances);
        },
        ...addresses.map(addr => [
          {
            method: 'eth_getBalance',
            params: [addr, 'latest'],
          },
          (err, balance) => {
            if (err) {
              console.error(err);
              return;
            }
            const res = parseFloat(Browseth.Units.weiToEther(balance)).toFixed(
              4,
            );
            balances.push(`${res} ETH`);
          },
        ]),
      ),
    );
  };

  handleNext5Addr = () => {
    this.getAddresses(this.state.currentIndex + 5).catch(err => {
      this.setState({page: 'failed'});
    });

    this.props.browseth.wallet.signer.defaultIndex += 5;
  };

  handlePrev5Addr = () => {
    this.getAddresses(this.state.currentIndex - 5).catch(err => {
      this.setState({page: 'failed'});
    });

    this.props.browseth.wallet.signer.defaultIndex -= 5;
  };

  handleRadio = e => {
    this.props.browseth.wallet.signer.defaultIndex = +e.target.value;
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
                  <h1>Ledger Addresses</h1>
                  <table className="table" style={{verticalAlign: 'middle'}}>
                    <thead>
                      <tr>
                        <td>Account #</td>
                        <td style={{minWidth: '27rem'}}>Address</td>
                        <td style={{minWidth: '7rem'}}>Balance</td>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({length: 5}, (_, i) => i).map(i => (
                        <tr key={i + this.state.currentIndex}>
                          <td style={{verticalAlign: 'middle'}}>
                            <label className="radio">
                              <input
                                name="account"
                                type="radio"
                                value={i + this.state.currentIndex}
                                onChange={this.handleRadio}
                                defaultChecked={i === 0}
                              />{' '}
                              {i + this.state.currentIndex}
                            </label>
                          </td>
                          <td style={{verticalAlign: 'middle'}}>
                            {this.state.addresses[i]}
                          </td>
                          <td style={{verticalAlign: 'middle'}}>
                            {this.state.balances[i]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div>
                    <button
                      disabled={
                        !this.state.prev5Available ||
                        this.state.isLoadingAddresses
                      }
                      onClick={this.handlePrev5Addr}
                    >
                      Prev 5
                    </button>
                    <button
                      disabled={this.state.isLoadingAddresses}
                      onClick={this.handleNext5Addr}
                      className={
                        this.state.isLoadingAddresses ? 'is-loading' : ''
                      }
                    >
                      Next 5
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={`content-container ${
                  this.state.activeTab === 1 ? 'forward' : 'behind'
                }`}
              >
                <div className="blue-container">
                  <SendMoney
                    browseth={this.props.browseth}
                    publicAddress={this.props.publicAddress}
                    isLoadingAddresses={this.state.isLoadingAddresses}
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  }
}

export default LedgerWallet;

import React from 'react';
import Browseth from 'browseth';
import SubscriptionPage from './components/SubscriptionPage';
import './App.css';
import * as config from './config.json';
import * as SubscriptionAbi from './components/NFTSubscription.json';

class App extends React.PureComponent {
  render() {
    const beth = new Browseth();
    beth.wallet = new Browseth.Wallets.Online(
      beth.rpc,
      // new Browseth.Rpcs.Web3(window.web3.currentProvider),
    );
    beth.addContract('freeSubscription', SubscriptionAbi, {
      address: config.freeAddress,
    });
    beth.addContract('paidSubscription', SubscriptionAbi, {
      address: config.paidAddress,
    });

    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h1>Example Subscription</h1>
        </header>
        {window.web3 ? (
          <SubscriptionPage browseth={beth} />
        ) : (
          <div>
            <h1>Error!</h1>
            <h3>
              No Web3!! Try installing/enabling the{' '}
              <a href="https://metamask.io/">Metamask</a> extension, then
              refresh the page.
            </h3>
          </div>
        )}
      </div>
    );
  }
}

export default App;

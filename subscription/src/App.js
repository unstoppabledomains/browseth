import React from 'react';
import Browseth from 'browseth';
import SubscriptionPage from './components/SubscriptionPage';
import './App.css';

class App extends React.PureComponent {
  render() {
    const beth = new Browseth();
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

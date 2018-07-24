import React, {Component} from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Wallet Example</h1>
        </header>
        <br />
        <div className="tab">Please Select a Wallet to use</div>
        <div className="options-container">
          <div className="wallet-option">Private Key</div>
          <div className="wallet-option">Ledger Wallet</div>
          <div className="wallet-option">Keystore</div>
          <div className="wallet-option">Metamask</div>
        </div>
      </div>
    );
  }
}

export default App;

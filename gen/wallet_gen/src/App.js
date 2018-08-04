import React, {Component} from 'react';
import './App.css';
import Flipper from './components/Flipper';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Wallet Example</h1>
        </header>
        <br />
        <Flipper />
      </div>
    );
  }
}

export default App;

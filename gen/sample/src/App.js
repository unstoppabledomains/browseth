import React, {Component} from 'react';
import './App.css';
import PrivateKey from './components/PrivateKey';
import Contract from './components/Contract';
import Ledger from './components/Ledger';
import Keystore from './components/Keystore';
import Ipfs from './components/Ipfs';
import Metamask from './components/Metamask';
import Explorer from './components/Explorer';
import Deploy from './components/Deploy';
import Token from './components/Token';
// import Event from './components/Event';
import Prism from 'prismjs';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>- Welcome to Browseth -</h1>
        </header>
        <br />
        <div className="middle">
          <code
            className="language-javascript"
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                `
  import Browseth from 'browseth';

  const beth = new Browseth('https://mainnet.infura.io/YOUR_API_KEY');
                `,
                Prism.languages.javascript,
                'javascript',
              ),
            }}
          />
        </div>
        <hr />
        <Keystore />
        <hr />
        <PrivateKey />
        <hr />
        <Metamask />
        <hr />
        <Ledger />
        <hr />
        <Token />
        <hr />
        <Contract />
        <hr />
        <Deploy />
        <hr />
        {/* <Event /> */}
        {/* <hr /> */}
        <Explorer />
        <hr />
        <Ipfs />
      </div>
    );
  }
}

export default App;

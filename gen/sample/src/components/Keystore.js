import * as React from 'react';
import Browseth from 'browseth';
import '../App.css';
import Prism from 'prismjs';
import * as config from '../config.json';

class Keystore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pw: '',
      pk: '',
      url: '',
      filename: '',
    };
    this.beth = new Browseth(config.url);
  }

  render() {
    return (
      <div className="container">
        <div className="left">
          <div>
            <h2>Private Key Generation</h2>
            <p>
              Do not ever give away or lose your private key, password, and
              keystore file! They cannot be recovered.
            </p>
            <br />
            Enter a new password{' '}
            <input
              type="text"
              value={this.state.from}
              onChange={e => {
                this.updatePw(e);
              }}
              placeholder="YOUR_PASSWORD"
            />
            <br />
            <button onClick={this.generatePk}>Generate!</button>
            <br />
            {this.state.url ? (
              <a
                href={this.state.url}
                download={this.state.filename}
                className="button"
              >
                Download your keystore file
              </a>
            ) : (
              <div>Generate a new Private key and Keystore file!</div>
            )}
            <br />
            Your Private Key: {this.state.pk ? this.state.pk : ''}
            <br />
            Your Public Address: {this.state.address ? this.state.address : ''}
          </div>
        </div>
        <div className="right">
          <code
            className="language-javascript"
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                `
  const privKey = Browseth.Signers.PrivateKey.fromRandomBytes();
  const filename = privKey.getKeyStoreFileName();
  const address = await privKey.account();
  const keystore = await privKey.toV3(YOUR_PASSWORD);
                `,
                Prism.languages.javascript,
                'javascript',
              ),
            }}
          />
        </div>
      </div>
    );
  }

  updatePw = e => {
    this.setState({
      pw: e.target.value,
    });
  };

  generatePk = async () => {
    const pk = Browseth.Signers.PrivateKey.fromRandomBytes();
    // console.log(pk.toString());
    const keystore = await pk.toV3(this.state.pw);
    // console.log(JSON.parse(keystore).address);
    const blob = new Blob([keystore]);
    this.setState({
      pk: '0x' + pk.toString(),
      filename: pk.getKeyStoreFileName(),
      url: window.URL.createObjectURL(blob),
      address: await pk.account(),
    });
  };
}

export default Keystore;

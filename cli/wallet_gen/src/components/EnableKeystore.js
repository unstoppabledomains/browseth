import * as React from 'react';
import '../App';
import * as Arrow from '../assets/arrow.png';
import Browseth from 'browseth';

class EnableKeystore extends React.Component {
  state = {
    password: '',
    newPassword: '',
    isEnabled: false,
    err: '',
    uploading: true,
    filename: '',
    privateKey: '',
  };

  generateKeystore = async () => {
    const privateKey = Browseth.Signers.PrivateKey.fromRandomBytes();
    const keystore = await privateKey.toV3(this.state.newPassword);
    const blob = new Blob([keystore]);
    this.setState({
      privateKey: '0x' + privateKey.toString(),
      filename: privateKey.getKeyStoreFileName(),
      url: window.URL.createObjectURL(blob),
    });
  };

  changeToGenerate = () => {
    this.setState({uploading: false});
  };

  updatePassword = e => {
    this.setState({password: e.target.value});
  };

  updateNewPassword = e => {
    this.setState({newPassword: e.target.value});
  };

  handleUpload = () => {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      this.setState({keystoreText: fileReader.result, isEnabled: true});
    };
    fileReader.readAsText(this.fileinput.files[0]);
  };

  checkPassword = async () => {
    let privateKey;
    try {
      privateKey = await Browseth.Signers.PrivateKey.fromV3(
        JSON.parse(this.state.keystoreText),
        this.state.password,
      );
    } catch (err) {
      console.error(err);
      this.setState({
        err: err.toString().includes('password')
          ? 'Incorrect Password!'
          : 'Not a valid keystore file!',
      });
      return;
    }
    this.setState({privateKey: privateKey.toString()}, () => {
      this.auth();
    });
  };

  enable = () => {
    this.setState({isEnabled: true});
  };

  auth = () => {
    this.props.browseth.wallet = new Browseth.Wallets.Offline(
      this.props.browseth.rpc,
      Browseth.Signers.PrivateKey.fromHex(this.state.privateKey),
    );
    this.props.auth();
  };

  render() {
    return (
      <div>
        <div className="wallet-header">
          Keystore
          <div className="back-arrow-container">
            <img
              className="back-arrow"
              src={Arrow}
              onClick={() => {
                this.props.unflip();
                this.setState({uploading: true, isEnabled: false});
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
              {this.state.uploading ? (
                <div>
                  <h1>Upload a Keystore File</h1>
                  <input
                    type="file"
                    ref={node => {
                      this.fileinput = node;
                    }}
                    onChange={this.handleUpload}
                  />
                  <h1>Enter your Password</h1>
                  <input
                    type="password"
                    value={this.state.password}
                    onChange={this.updatePassword}
                    placeholder="YOUR_PASSWORD"
                    className="password"
                  />
                  <br />
                  <br />
                  <br />
                  {this.state.err ? <div>Error! {this.state.err}</div> : ''}
                  <br />
                  <p>
                    Don't have one?{' '}
                    <button
                      onClick={this.changeToGenerate}
                      className="make-button"
                    >
                      Make me one!
                    </button>
                  </p>
                </div>
              ) : (
                <div>
                  <h1>Enter a new password</h1>
                  <input
                    type="password"
                    onChange={this.updateNewPassword}
                    placeholder="YOUR_PASSWORD"
                    className="password"
                  />
                  <br />
                  <button onClick={this.generateKeystore}>Generate!</button>
                  <br />
                  {this.state.url ? (
                    <a
                      href={this.state.url}
                      download={this.state.filename}
                      className="button"
                      onClick={this.enable}
                    >
                      Download your keystore file to unlock
                    </a>
                  ) : (
                    <div>Generate a new Private key and Keystore file!</div>
                  )}
                </div>
              )}
              <button
                onClick={() => {
                  this.state.uploading
                    ? this.checkPassword()
                    : this.props.auth();
                }}
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

export default EnableKeystore;

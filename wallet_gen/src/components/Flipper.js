import * as React from 'react';
import '../App.css';
import SelectWallet from './SelectWallet';
import EnableWallet from './EnableWallet';
import Wallet from './Wallet';
import Browseth from 'browseth';
import * as ERC20 from './erc20.json';

class Flipper extends React.Component {
  browseth = new Browseth();

  state = {
    clicked: '',
    isFlipped: false,
    isEnabled: false,
    privateKey: '',
  };

  componentDidMount() {
    this.browseth.addContract('ERC20', ERC20);
  }

  unflip = () => {
    this.setState({isFlipped: false});
  };

  flip = clicked => {
    this.setState({clicked, isFlipped: true});
  };

  enable = () => {
    this.setState({isEnabled: true, isFlipped: false});
  };

  render() {
    switch (this.state.state) {
      default:
        return (
          <div>
            <div className={this.state.isFlipped ? 'flipped' : 'unflipped'}>
              <div className="front">
                {this.state.isEnabled ? (
                  <Wallet state={this.state.clicked} browseth={this.browseth} />
                ) : (
                  <SelectWallet flip={this.flip} unflip={this.unflip} />
                )}
              </div>

              <div className="back">
                <EnableWallet
                  browseth={this.browseth}
                  state={this.state.clicked}
                  enable={this.enable}
                  unflip={this.unflip}
                />
              </div>
            </div>
          </div>
        );
    }
  }
}

export default Flipper;

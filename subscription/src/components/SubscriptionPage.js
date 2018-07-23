import * as React from 'react';
import Browseth from 'browseth';
import '../App.css';
import * as SubscriptionAbi from './NFTSubscription.json';
import SubscriptionBoxes from './SubscriptionBoxes';
import AccountManagement from './AccountManagement';
import BN from 'bn.js';

class SubscriptionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      err: '',
      state: '',
    };

    this.props.browseth.wallet = new Browseth.Wallets.Online(
      this.props.browseth.rpc,
      // new Browseth.Rpcs.Web3(window.web3.currentProvider),
    );

    this.props.browseth.addContract('freeSubscription', SubscriptionAbi, {
      address: '0x3b36368d5866b146905c31373ea4137975a7566e',
    });
    this.props.browseth.addContract('paidSubscription', SubscriptionAbi, {
      address: '0x00c1619bb02b0bb0e2ca5dbc0aedabcf2489c997',
    });
  }

  render() {
    switch (this.state.state) {
      case 'noSub':
        return (
          <SubscriptionBoxes
            updateState={this.updateState}
            browseth={this.props.browseth}
            determineState={this.determineState}
          />
        );

      case 'premSub':
        return (
          <AccountManagement
            browseth={this.props.browseth}
            determineState={this.determineState}
          />
        );
      case 'freeSub':
        return (
          <AccountManagement
            browseth={this.props.browseth}
            determineState={this.determineState}
          />
        );

      default:
        return (
          <div>
            <h1>Error!</h1>
            <h3>{this.state.err}</h3>
          </div>
        );
    }
  }

  componentDidMount() {
    console.log(this.props.browseth);
    this.props.browseth.wallet
      .account()
      .then(address => {
        if (!address) {
          this.setState({
            state: '',
            err: `You have Metamask enabled, but you're not logged in! Please log in, then refresh the page.`,
          });
        } else {
          this.setState({address}, () => {
            this.determineState();
          });
        }
      })
      .catch(() => {
        this.setState({err: 'Error!'});
      });
  }

  determineState = async () => {
    console.log(
      'paid owned:',
      (await this.props.browseth.contract.paidSubscription.function
        .balanceOf(this.state.address)
        .call()).toString(),
    );
    console.log(
      'free owned:',
      (await this.props.browseth.contract.freeSubscription.function
        .balanceOf(this.state.address)
        .call()).toString(),
    );
    if (
      (await this.props.browseth.contract.paidSubscription.function
        .balanceOf(this.state.address)
        .call()).gt(new BN(0))
    ) {
      this.setState({state: 'premSub'});
    } else if (
      (await this.props.browseth.contract.freeSubscription.function
        .balanceOf(this.state.address)
        .call()).gt(new BN(0))
    ) {
      this.setState({state: 'freeSub'});
    } else {
      this.setState({state: 'noSub'});
    }
  };

  updateState = state => {
    this.setState(state);
  };
}

export default SubscriptionPage;

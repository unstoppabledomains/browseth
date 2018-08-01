import * as React from 'react';
import '../App.css';
import SubscriptionBoxes from './SubscriptionBoxes';
import PremiumAccountManagement from './PremiumAccountManagement';
import FreeAccountManagement from './FreeAccountManagement';
import BN from 'bn.js';

class SubscriptionPage extends React.Component {
  state = {
    address: '',
    err: '',
    state: '',
  };

  componentDidMount() {
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

  render() {
    switch (this.state.state) {
      case 'noSub':
        return (
          <SubscriptionBoxes
            browseth={this.props.browseth}
            determineState={this.determineState}
          />
        );

      case 'premSub':
        return (
          <PremiumAccountManagement
            browseth={this.props.browseth}
            determineState={this.determineState}
          />
        );

      case 'freeSub':
        return (
          <FreeAccountManagement
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
}

export default SubscriptionPage;

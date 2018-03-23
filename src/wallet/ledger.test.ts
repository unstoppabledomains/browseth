import * as Node from '../node';
import {Ledger, LedgerDPath} from './ledger';

const node = new Node.Web3({
  send() {
    console.log(arguments);
  },
});

test('', async () => {
  const ledgerWallet = new Ledger();

  const accounts = await ledgerWallet.getAccounts(0, 4);

  console.log(accounts);

  const signedMessage = await ledgerWallet.signMessage('adfadf');

  console.log(signedMessage);
});

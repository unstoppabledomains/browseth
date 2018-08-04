const fs = require('fs');
const Browseth = require('browseth').default;
const {XMLHttpRequest} = require('xmlhttprequest');
const subabi = require('../build/NFTSubscription.json');
const curveabi = require('../build/EthPriceCurve.json');
const config = require('./config.json');

const subbin = fs.readFileSync('../build/NFTSubscription.bin', 'utf8');
const curvebin = fs.readFileSync('../build/EthPriceCurve.bin', 'utf8');

global.XMLHttpRequest = XMLHttpRequest;

const subscriptionPrice = config.paidPrice;
const SECONDS_PER_YEAR = 31540000;
const COST_PER_SECOND = config.costPerSecond;

const b = new Browseth();

b.wallet = new Browseth.Wallets.Online(b.rpc);

const a = async () => {
  const transactionListener = new Browseth.Apis.TransactionListener(b.wallet);
  transactionListener.startPolling();

  b.addContract('priceCurve', curveabi, {bytecode: curvebin});
  b.addContract('subscription', subabi, {bytecode: subbin});

  const transactionHash1 = await b.contract.priceCurve
    .deploy(SECONDS_PER_YEAR, COST_PER_SECOND)
    .send();
  console.log('transaction hash for paid price curve', transactionHash1);
  const transaction1 = await transactionListener.resolveTransaction(
    transactionHash1,
  );
  console.log('transaction for paid price curve', transaction1);

  const transactionHash2 = await b.contract.priceCurve
    .deploy(3154000000, 0)
    .send();
  console.log('transaction hash for free price curve', transactionHash2);
  const transaction2 = await transactionListener.resolveTransaction(
    transactionHash2,
  );
  console.log('transaction for free price curve', transaction1);

  const transactionHash3 = await b.contract.subscription
    .deploy(transaction1.contractAddress)
    .send();
  console.log('transaction hash for token', transactionHash3);
  const transaction3 = await transactionListener.resolveTransaction(
    transactionHash3,
  );

  const transactionHash4 = await b.contract.subscription
    .deploy(transaction2.contractAddress)
    .send();
  console.log('transaction hash for token', transactionHash4);
  const transaction4 = await transactionListener.resolveTransaction(
    transactionHash4,
  );

  console.log('address for paid token', transaction3.contractAddress);
  console.log('address for free token', transaction4.contractAddress);

  const json = `{
    "paidAddress": "${transaction3.contractAddress}",
    "freeAddress": "${transaction4.contractAddress}",
    "paidPrice": "${subscriptionPrice}"
  }`;

  fs.writeFileSync('./config.json', json);
  fs.writeFileSync('./components/NFTSubscription.json', JSON.stringify(subabi));
};

a();

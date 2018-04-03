import * as Rpcs from '.';
import * as Transports from '../transport';

test('', async () => {
  const rpc = new Rpcs.Rpc(new Transports.NodeHttpHandler());

  const coinbase = await rpc.send('eth_coinbase');
  const balance = await rpc.send('eth_getBalance', coinbase, 'latest');
  console.log(coinbase, balance);

  expect(coinbase).toBeDefined();
  expect(balance).toBeDefined();
});

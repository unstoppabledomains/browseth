import * as Xhr from './xhr';

test('', async () => {
  console.log(
    await new Promise((resolve, reject) => {
      Xhr.handle(
        {
          headers: {'Content-type': 'application/json;charset=UTF-8'},
          url: 'https://mainnet.infura.io/mew',
          msg: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_blockNumber',
            params: [],
          }),
          timeout: 1000,
        },
        (err, resp) => {
          err ? reject(err) : resolve(resp);
        },
      );
    }),
  );
});

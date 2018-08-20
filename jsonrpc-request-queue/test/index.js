require('isomorphic-fetch')

const { BufferedJsonRpcRequestQueue } = require('..')

const requestor = new BufferedJsonRpcRequestQueue(
  'https://mainnet.infura.io/mew',
)

let successes = 0

Promise.all(
  Array(100)
    .fill(null)
    .map(() =>
      new Promise(r => setTimeout(r, Math.random() * 10000))
        .then(() => requestor.request('eth_blockNumber'))
        .then(console.log)
        .then(() => {
          successes++
        })
        .catch(console.error),
    ),
)
  .then(() => console.log('successes:', successes))
  .catch(console.error)

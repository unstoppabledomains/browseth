require('isomorphic-fetch')
const { Explorer } = require('..')
const {
  default: JsonRpcRequestQueue,
} = require('@browseth/jsonrpc-request-queue')

const jsonrpc = new JsonRpcRequestQueue('https://mainnet.infura.io/mew')

const explore = new Explorer(jsonrpc)

const keepaliveInterval = setInterval(() => {}, 10000)

Promise.resolve()
  .then(async () => {
    console.log(
      await explore
        .account('0x0000000000000000000000000000000000000000')
        .balance(),
    )
  })
  .catch(console.error)
  .then(() => {
    clearInterval(keepaliveInterval)
  })

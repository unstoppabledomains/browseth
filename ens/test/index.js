require('isomorphic-fetch')
const { EnsLookup } = require('..')
const { JsonRpcRequestBatchQueue } = require('@browseth/jsonrpc-request-queue')

process.on('unhandledRejection', console.error)

const ens = new EnsLookup(
  new JsonRpcRequestBatchQueue('https://mainnet.infura.io/mew'),
)
const interval = setInterval(() => {}, 10000)
Promise.resolve()
  .then(async () => {
    console.time('req')
    await Promise.all([
      ens.info(
        '0xfdd5d5de6dd63db72bbc2d487944ba13bf775b50a80805fe6fcaba9b0fba88f5',
      ),
      ens.info(
        '0xfdd5d5de6dd63db72bbc2d487944ba13bf775b50a80805fe6fcaba9b0fba88f5',
      ),
      ens.info(
        '0xfdd5d5de6dd63db72bbc2d487944ba13bf775b50a80805fe6fcaba9b0fba88f5',
      ),
      ens.info(
        '0xfdd5d5de6dd63db72bbc2d487944ba13bf775b50a80805fe6fcaba9b0fba88f5',
      ),
      ens.info(
        '0xfdd5d5de6dd63db72bbc2d487944ba13bf775b50a80805fe6fcaba9b0fba88f5',
      ),
      ens.info(
        '0xfdd5d5de6dd63db72bbc2d487944ba13bf775b50a80805fe6fcaba9b0fba88f5',
      ),
      ens.info(
        '0xfdd5d5de6dd63db72bbc2d487944ba13bf775b50a80805fe6fcaba9b0fba88f5',
      ),
      ens.info(
        '0xfdd5d5de6dd63db72bbc2d487944ba13bf775b50a80805fe6fcaba9b0fba88f5',
      ),
      ens.info(
        '0xfdd5d5de6dd63db72bbc2d487944ba13bf775b50a80805fe6fcaba9b0fba88f5',
      ),
      ens.info(
        '0xfdd5d5de6dd63db72bbc2d487944ba13bf775b50a80805fe6fcaba9b0fba88f5',
      ),
    ])
    console.timeEnd('req')
  })
  .catch(console.error)
  .then(() => clearInterval(interval))

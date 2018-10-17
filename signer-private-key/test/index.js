const { SignerPrivateKey } = require('..')
const { ec } = require('elliptic')

const { ab, crypto, rlp, address } = require('@browseth/utils')

const ETx = require('ethereumjs-tx')

const secp256k1 = new ec('secp256k1')

const pk = new SignerPrivateKey(
  '72307ba0c2225b6ad2f307f1c9449478a358589b83e19dcc562de189518e102d',
)

//0x0 1000000 0x5208 0x89a8f5f337304eaa7caed7aa1d88b791f3d8b51d 10000000 0x 3
// console.log(nonce, gasPrice, gas, to, value, ab.toHex(data), chainId)

const params = {
  nonce: 0x0,
  gasPrice: 1000000,
  gas: 0x5208,
  to: Buffer.from(new ArrayBuffer(0)),
  value: 10000000,
  chainId: 3,
  data: Buffer.from(new ArrayBuffer(0)),
}

const tx = new ETx(params)

tx.sign(
  Buffer.from(
    '72307ba0c2225b6ad2f307f1c9449478a358589b83e19dcc562de189518e102d',
    'hex',
  ),
)

console.log('0x' + tx.serialize().toString('hex'))
console.log(ab.toHex(pk.signTransaction(params)))

const object = pk.signMessage('kalnfsndlknalsdknflkasdnlkfn', false)

console.log(object)

console.log({ ...new ETx(ab.toHex(pk.signTransaction(params))) })

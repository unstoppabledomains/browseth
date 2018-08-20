const { SignerPrivateKey } = require('..')
const { ec } = require('elliptic')

const { ab, crypto, rlp, address } = require('@browseth/utils')

const ETx = require('ethereumjs-tx')

const secp256k1 = new ec('secp256k1')

const pk = new SignerPrivateKey(
  '0x0000000000000000000000000000000000000000000000000000000000000001',
)

const params = {
  nonce: 0,
  gasPrice: 10 ** 9 * 5,
  gas: 21000,
  to: Buffer.from(new ArrayBuffer(0)),
  value: 5,
  chainId: 1332347,
  data: Buffer.from(new ArrayBuffer(0)),
}

const tx = new ETx(params)

tx.sign(
  Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000001',
    'hex',
  ),
)

console.log('0x' + tx.serialize().toString('hex'))
console.log(ab.toHex(pk.signTransaction(params)))

const object = pk.sign('kalnfsndlknalsdknflkasdnlkfn', false)

console.log(object)

console.log(pk.recover(object))

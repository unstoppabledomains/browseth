import { ec } from 'elliptic'

import { ab, crypto, address } from '@browseth/utils'

export { recover as default, recover }

const secp256k1 = new ec('secp256k1')

// const address = eth.recover(
//   '0x...' || {
//     hash,
//     s,
//     r,
//     v,
//   },
// )

function recover({ hash, r, s, v }) {
  const publicKey = secp256k1.recoverPubKey(
    new Uint8Array(ab.fromBytes(hash)),
    {
      r: new Uint8Array(ab.fromBytes(r)),
      s: new Uint8Array(ab.fromBytes(s)),
    },
    ab.toHex(v) - 27,
  )

  return address.from(
    crypto
      .keccak256(new Uint8Array(publicKey.encode('array').slice(1)))
      .slice(12, 32),
  )
}

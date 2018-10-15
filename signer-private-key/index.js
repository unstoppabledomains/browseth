import { ec } from 'elliptic'

import { ab, crypto, rlp, address } from '@browseth/utils'

export { SignerPrivateKey as default, SignerPrivateKey }

const secp256k1 = new ec('secp256k1')

class SignerPrivateKey {
  constructor(privateKey) {
    this.privateKey = ab.fromBytes(privateKey, 32)
    this.pair = secp256k1.keyFromPrivate(new Uint8Array(this.privateKey))
  }

  signTransaction = ({
    nonce = 0,
    gasPrice = 1,
    gas = 21000,
    to = new ArrayBuffer(0),
    value = 0,
    data = new ArrayBuffer(0),
    chainId = 1,
  }) => {
    const raw = [
      ab.stripStart(ab.fromUInt(nonce)),
      ab.stripStart(ab.fromUInt(gasPrice)),
      ab.stripStart(ab.fromUInt(gas)),
      ab.fromBytes(to),
      ab.stripStart(ab.fromUInt(value)),
      ab.fromBytes(data),
    ]

    const sig = this.pair.sign(
      crypto.keccak256(
        rlp.encode(
          raw.concat(
            chainId > 0
              ? [
                  ab.stripStart(ab.fromUInt(chainId)),
                  new ArrayBuffer(0),
                  new ArrayBuffer(0),
                ]
              : [],
          ),
        ),
      ),
      { canonical: true },
    )

    return rlp.encode(
      raw.concat(
        ab.stripStart(
          ab.fromUInt(
            sig.recoveryParam + 27 + (chainId > 0 ? chainId * 2 + 8 : 0),
          ),
        ),
        ab.padStart(sig.r.toArray(), 32),
        ab.padStart(sig.s.toArray(), 32),
      ),
    )
  }

  signMessage = (message, shouldConcat = true) => {
    const hash = crypto.keccak256(
      ab.fromUtf8(
        '\u0019Ethereum Signed Message:\n' +
          message.length.toString() +
          message,
      ),
    )

    const sig = this.pair.sign(hash, { canonical: true })

    return shouldConcat
      ? ab.concat([
          ab.padStart(sig.r.toArray(), 32),
          ab.padStart(sig.s.toArray(), 32),
          [sig.recoveryParam + 27],
        ])
      : {
          hash: ab.fromView(hash),
          r: ab.padStart(sig.r.toArray(), 32),
          s: ab.padStart(sig.s.toArray(), 32),
          v: ab.fromBytes([sig.recoveryParam + 27]),
        }
  }

  address = () => {
    const pubKey = new Uint8Array(this.pair.getPublic(false, true).slice(1))

    if (pubKey.length !== 64)
      throw new TypeError('invalid public key ' + pubKey)

    return address.from(crypto.keccak256(pubKey).slice(12, 32))
  }
}

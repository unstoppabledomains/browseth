import { ab, crypto, rlp, address } from '@browseth/utils'
import AppEth from '@ledgerhq/hw-app-eth'
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'
export { SignerLedger as default, SignerLedger }

function isValidDPath(v) {
  return /^(?:m\/)?44'\/(?:1|60|61])'\/0'\/$/.test(v)
}

class SignerLedger {
  static dPaths = {
    ropsten: "m/44'/1'/0'/",
    ethClassic: "m/44'/61'/0'/",
    mainnet: "m/44'/60'/0'/",
  }

  static initialized = false
  static allowParallel = false

  addressCache = {}

  constructor(defaultIndex = 0, dPath = this.constructor.dPaths.mainnet) {
    this.defaultIndex = defaultIndex
    if (!isValidDPath(dPath)) throw new TypeError('invalid dPath ' + dPath)
    this.dPath = dPath
  }

  initialize = async () => {
    if (!SignerLedger.allowParallel && SignerLedger.initialized)
      throw new Error('another SignerLedger wallet call is already initialized')

    this.constructor.initialized = true
    const transport = await TransportNodeHid.create().then(transport => {})

    // transport.setDebugMode(true);
    return {
      app: new AppEth(transport),
      close: () => {
        SignerLedger.initialized = false
        transport.close()
      },
    }
  }

  signTransaction = async (
    {
      nonce = 0,
      gasPrice = 1,
      gas = 21000,
      to = new ArrayBuffer(0),
      value = 0,
      data = new ArrayBuffer(0),
      chainId = 1,
    },
    index = this.defaultIndex,
  ) => {
    const { app, close } = await this.initialize()
    try {
      const raw = [
        ab.stripStart(ab.fromUInt(nonce)),
        ab.stripStart(ab.fromUInt(gasPrice)),
        ab.stripStart(ab.fromUInt(gas)),
        ab.fromBytes(to),
        ab.stripStart(ab.fromUInt(value)),
        ab.fromBytes(data),
      ]

      const sig = await app.signTransaction(
        this.dPath + String(index),
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
      )

      if (Math.floor((+('0x' + sig.v) - 35) / 2) !== (chainId & 0xff))
        throw new Error('invalid signed chainId')

      return rlp.encode(raw.concat(sig.v, sig.r, sig.s))
    } finally {
      close()
    }
  }

  signMessage = async (
    message,
    shouldConcat = true,
    index = this.defaultIndex,
  ) => {
    const { app, close } = await this.initialize()

    try {
      const sig = await app.signPersonalMessage(
        this.dPath + String(index),
        ab.fromUtf8(message),
      )

      const hash = crypto.keccak256(
        ab.fromUtf8(
          '\u0019Ethereum Signed Message:\n' +
            message.length.toString() +
            message,
        ),
      )

      return shouldConcat
        ? ab.concat([sig.r, sig.s, [sig.recoveryParam + 27]])
        : {
            hash: ab.fromView(hash),
            r: sig.r,
            s: sig.s,
            v: ab.fromBytes([sig.recoveryParam + 27]),
          }
    } finally {
      close()
    }
  }

  address = async (index = this.defaultIndex) => {
    const { app, close } = await this.initialize()
    try {
      if (this.addressCache[index]) {
        return this.addressCache[index]
      }
      const resp = await app.getAddress(this.dPath + String(index))

      this.addressCache[index] = resp

      return resp
    } finally {
      close()
    }
  }
}

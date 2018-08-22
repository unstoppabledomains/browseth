import { ab } from '@browseth/utils'
import { AbiFunction } from './function'
import { AbiEvent } from './event'

export { AbiCodec as default, AbiCodec }

class AbiCodec {
  fn = {}
  ev = {}

  constructor(abiJsonInterface, options = {}) {
    this.bin = options.bin ? ab.fromBytes(options.bin) : null
    this.abiJsonInterface = [...abiJsonInterface]

    // default constructor
    if (
      this.abiJsonInterface.findIndex(
        element => element.type === 'constructor',
      ) === -1
    )
      this.abiJsonInterface.push({
        type: 'constructor',
        inputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        constant: false,
      })

    this.abiJsonInterface.forEach(element => {
      switch (element.type) {
        case 'constructor': {
          const abi = new AbiFunction(element)

          this.construct = {
            enc: (...values) => {
              if (this.bin == null) {
                throw new Error(
                  "must include 'bin' in options in order to use the constructor",
                )
              }

              return ab.toHex(ab.concat([this.bin, abi.enc(...values)]))
            },
            dec: abi.dec,
          }
          break
        }
        case 'event': {
          const abi = new AbiEvent(element)

          const codec = {
            enc: (...topics) =>
              abi
                .enc(...topics)
                .map(
                  topic =>
                    Array.isArray(topic)
                      ? topic.map(ab.toHex)
                      : ab.toHex(topic),
                ),
            dec: abi.dec,
          }

          if (abi.meta.name) this.ev[abi.meta.name] = codec
          this.ev[abi.fullName] = codec
          if (!abi.isAnonymous) {
            const stringSig = ab.toHex(abi.sig)
            this.ev[stringSig] = codec
            this.ev[stringSig.slice(2)] = codec
          }
          break
        }
        case null:
        case undefined:
        case 'function': {
          const abi = new AbiFunction(element)

          const codec = {
            enc: (...values) =>
              ab.toHex(ab.concat([abi.sig, abi.enc(...values)])),
            dec: abi.dec,
          }
          this.fn[abi.meta.name] = codec
          this.fn[abi.fullName] = codec
          const stringSig = ab.toHex(abi.sig)
          this.fn[stringSig] = codec
          this.fn[stringSig.slice(2)] = codec
          break
        }
        case 'fallback':
          break
        default: {
          throw new TypeError(
            'invalid abiJsonInterface element type ' + element.type,
          )
        }
      }
    })
  }
}

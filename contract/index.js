import { AbiFunction, AbiEvent } from '@browseth/abi'
import { ab, address, Emitter } from '@browseth/utils'

export { Contract as default, Contract }

function range(start = 0, stop, step = 1) {
  if (stop === undefined) {
    stop = start
    start = 0
  }
  const result = []
  let i = start

  if (start === stop) return [[start, stop]]
  else if (step > 0 ? start > stop : start < stop) return []
  for (; step > 0 ? i < stop : i > stop; i += step) result.push([i, i + step])
  if (i >= stop) result[result.length - 1][1] = stop
  return result
}

function transactionPreflightCheck(transaction, abi) {
  if (
    transaction.value != null &&
    abi.meta.payable !== true &&
    // transaction.value is 0
    ab.stripStart(ab.fromUInt(transaction.value)).byteLength > 0
  )
    throw new RangeError(
      'invalid value ' + transaction.value + ' function is not payable',
    )
}

class Contract {
  fn = {}
  ev = {}

  // static ALL_EVENTS = Symbol('AllEvents')
  // ALL_EVENTS = this.constructor.ALL_EVENTS

  emitter = new Emitter()

  constructor(ethRef, abiJsonInterface, options = {}) {
    this.ethRef = ethRef
    this.abiJsonInterface = [...abiJsonInterface]

    this.bin = options.bin ? ab.fromBytes(options.bin) : null
    this.address = options.address ? address.from(options.address) : null

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

    // default fallback
    if (
      this.abiJsonInterface.findIndex(
        element => element.type === 'fallback',
      ) === -1
    )
      this.abiJsonInterface.push({
        type: 'fallback',
        payable: false,
        stateMutability: 'pure',
        constant: true,
      })

    this.abiJsonInterface.forEach(element => {
      switch (element.type) {
        case 'constructor': {
          const abi = new AbiFunction(element)

          this.construct = (...values) => {
            if (this.bin == null) {
              throw new Error(
                "must include 'bin' in options in order to use the constructor",
              )
            }

            const encoded = ab.concat([this.bin, abi.enc(...values)])

            return {
              send: (transaction = {}) => {
                transactionPreflightCheck(transaction, abi)

                return this.ethRef.send({
                  to: new ArrayBuffer(20),
                  UNSAFE_data: encoded,
                  ...transaction,
                })
              },
              call: () =>
                Promise.reject(new RangeError("can't call the constructor")),
              gas: (transaction = {}) => {
                transactionPreflightCheck(transaction, abi)

                return this.ethRef.gas({
                  to: new ArrayBuffer(20),
                  UNSAFE_data: encoded,
                  ...transaction,
                })
              },
              abi: encoded,
            }
          }
          break
        }
        case 'event': {
          const abi = new AbiEvent(element)

          const codec = (...topics) => {
            const encodedTopics = abi.enc(topics)
            const logs = (
              from = 'latest',
              to = 'latest',
              address = this.address,
              ...addresses
            ) =>
              this.ethRef
                .request('eth_getLogs', {
                  fromBlock: this.ethRef.tag(from),
                  toBlock: this.ethRef.tag(to),
                  topics: encodedTopics.map(
                    topic =>
                      Array.isArray(topic)
                        ? topic.map(v => this.ethRef.data(v))
                        : this.ethRef.data(topic),
                  ),
                  address: (address
                    ? addresses.concat(address)
                    : addresses
                  ).map(v => this.ethRef.data(v, 20)),
                })
                .then(logs => logs.map(abi.dec))

            return {
              logs,
              subscribe: (
                from = 'latest',
                address = this.address,
                ...addresses
              ) => {
                const symbol = Symbol(abi.fullName)

                this.ethRef.block.addTracker(symbol, { synced: from })

                const concatedAddresses = address
                  ? addresses.concat(address)
                  : addresses

                const handler = latest => {
                  const tracker = this.ethRef.block.trackers.get(symbol)

                  if (tracker.isSyncing) return
                  tracker.isSyncing = true

                  const latestConfirmed = latest - tracker.confirmationDelay
                  const synced = tracker.synced

                  if (synced < latestConfirmed) {
                    tracker.synced = latestConfirmed
                    Promise.all(
                      range(synced, latestConfirmed, 5000).map(
                        ([fromBlock, toBlock]) =>
                          logs(fromBlock, toBlock, concatedAddresses).then(
                            v => {
                              v.forEach(vv => {
                                this.emitter.emit(symbol, vv)
                              })
                            },
                          ),
                      ),
                    )
                      .catch(error => {
                        tracker.synced = synced
                      })
                      .then(() => {
                        tracker.isSyncing = false
                      })
                  }
                }

                this.ethRef.block.emitter.on('block.number', handler)

                return {
                  on: fn => this.emitter.on(symbol, fn),
                  off: fn => this.emitter.off(symbol, fn),
                  dispose: () => {
                    this.ethRef.block.tracker.delete(symbol)
                    this.ethRef.block.emitter.off('block.number', handler)
                    this.emitter.off(symbol)
                  },
                }
              },
            }
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

          const codec = (...values) => {
            const encoded = ab.concat([abi.sig, abi.enc(...values)])

            return {
              send:
                abi.meta.constant === true
                  ? () =>
                      Promise.reject(
                        new RangeError("can't send to a constant function"),
                      )
                  : (transaction = {}) => {
                      transactionPreflightCheck(transaction, abi)

                      return this.ethRef.send({
                        to: this.address,
                        ...transaction,
                        UNSAFE_data: encoded,
                      })
                    },
              call: (transaction = {}, block) => {
                transactionPreflightCheck(transaction, abi)

                return this.ethRef
                  .call(
                    { to: this.address, ...transaction, UNSAFE_data: encoded },
                    block,
                  )
                  .then(abi.dec)
              },
              gas: (transaction = {}) => {
                transactionPreflightCheck(transaction, abi)

                return this.ethRef.gas({
                  to: this.address,
                  ...transaction,
                  UNSAFE_data: encoded,
                })
              },
              abi: encoded,
            }
          }

          if (abi.meta.name) this.fn[abi.meta.name] = codec
          this.fn[abi.fullName] = codec
          const stringSig = ab.toHex(abi.sig)
          this.fn[stringSig] = codec
          this.fn[stringSig.slice(2)] = codec
          break
        }
        case 'fallback': {
          this.fallback = () => ({
            send:
              element.constant === true
                ? () =>
                    Promise.reject(
                      new RangeError("can't send to a constant function"),
                    )
                : (transaction = {}) => {
                    transactionPreflightCheck(transaction, abi)

                    return this.ethRef.send({
                      to: this.address,
                      ...transaction,
                      UNSAFE_data: new ArrayBuffer(0),
                    })
                  },
            gas: (transaction = {}) => {
              transactionPreflightCheck(transaction, abi)

              return this.ethRef.gas({
                to: this.address,
                ...transaction,
                UNSAFE_data: new ArrayBuffer(0),
              })
            },
            call: () =>
              Promise.reject(new RangeError("can't call the fallback")),
          })
          break
        }
        default: {
          throw new TypeError(
            'invalid abiJsonInterface element type ' + element.type,
          )
        }
      }
    })
  }
}

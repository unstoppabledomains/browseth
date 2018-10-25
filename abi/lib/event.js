import { parse } from './param'
import { crypto, ab } from '@browseth/utils'
import { getFullName } from './util'

export { AbiEvent as default, AbiEvent }

class AbiEvent {
  constructor(object) {
    // asssert object.inputs.indexed < 4
    if ((object.inputs.length + object.anonymous === true ? 0 : 1) > 4)
      throw new RangeError('too many topics')

    this.indexedCodecs = object.inputs.filter(input => input.indexed).map(parse)

    this.unindexedCodec = parse({
      type: 'tuple',
      components: object.inputs.filter(input => !input.indexed),
    })

    const iNames = this.indexedCodecs.map(param => param.meta.name)
    this.canUseNamedInput =
      // all are unique
      new Set(iNames).size === this.indexedCodecs.length &&
      // all are non null strings
      iNames.every(name => name && typeof name === 'string')

    const uINames = this.unindexedCodec.components.map(param => param.meta.name)

    this.canUseNamedOutput =
      this.canUseNamedInput &&
      iNames.concat(uINames).map(name => !(name in Array.prototype)) &&
      uINames.every(name => iNames.findIndex(n => n === name) === -1)

    this.isAnonymous = object.anonymous === true

    this.fullName = getFullName(object)
    if (!this.isAnonymous) {
      this.sig = crypto.keccak256(ab.fromUtf8(this.fullName))
    }
    this.meta = object
  }

  encTopic = (param, value) => {
    const encoded = ab[param.isPaddedStart ? 'padStart' : 'padEnd'](
      param.enc(value),
      32,
    )

    return param.isDynamic || encoded.byteLength > 32
      ? crypto.keccak256(encoded)
      : encoded
  }

  enc = (...values) => {
    let flattened
    if (
      values.length === 1 &&
      this.canUseNamedInput &&
      typeof values[0] === 'object' &&
      // topic ORs don't count
      !Array.isArray(values[0]) &&
      (this.indexedCodecs[0].meta.type !== 'function' ||
        !('address' in values[0] && 'selector' in values[0]))
    ) {
      const mapped = this.indexedCodecs.map(param => {
        if (param.meta.name in values[0]) {
          return values[0][param.meta.name] || null
        }
      })

      flattened = mapped
    } else {
      if (values[0] && values[0].length > this.indexedCodecs.length)
        throw new RangeError('too many topics')

      flattened = values
    }

    const lioDefined = [...flattened].reverse().findIndex(v => v != null)
    flattened =
      lioDefined === -1 ? [] : flattened.slice(0, flattened.length - lioDefined)

    const encoded = flattened.map((v, i) => {
      if (v == null) return null
      else if (Array.isArray(v))
        return v.map(vv => this.encTopic(this.indexedCodecs[i], vv))
      else return this.encTopic(this.indexedCodecs[i], v)
    })

    if (!this.isAnonymous) encoded.unshift(this.sig)

    return encoded
  }

  dec = log => {
    const decoded = []
    if (!this.isAnonymous) {
      log.topics.shift()
    }
    const decodedTopics = this.indexedCodecs.map(
      (codec, i) =>
        codec.isDynamic
          ? parse({ type: 'bytes32' }).dec(log.topics[i])
          : codec.dec(log.topics[i]),
    )
    const decodedData = this.unindexedCodec.dec(log.data)
    this.meta.inputs
      .filter(input => input.indexed)
      .map((input, i) => (decoded[input.name] = decodedTopics[i]))
    Object.keys(decodedData)
      .splice(Object.keys(decodedData).length / 2)
      .map(key => (decoded[key] = decodedData[key]))
    this.meta.inputs.map(input => {
      decoded.push(decoded[input.name])
    })
    decoded[Symbol('log')] = log
    return decoded
  }
}

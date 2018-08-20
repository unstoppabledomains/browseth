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

    this.unindexedCodecs = parse({
      type: 'tuple',
      components: object.inputs.filter(input => !input.indexed),
    })

    const names = this.indexedCodecs.map(param => param.meta.name)
    this.canUseNamedInput =
      // all are unique
      new Set(names).size === this.indexedCodecs.length &&
      // all are non null strings
      names.every(name => name && typeof name === 'string')

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
      if (values.length > this.indexedCodecs.length)
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

  dec = log => log
}

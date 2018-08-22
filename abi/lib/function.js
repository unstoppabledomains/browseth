import { parse } from './param'
import { ab, crypto } from '@browseth/utils'
import { getFullName } from './util'

export { AbiFunction as default, AbiFunction }

class AbiFunction {
  constructor(object) {
    this.meta = object

    if (object.type === 'function' || object.type == null) {
      if (!Boolean(object.name) || typeof object.name !== 'string')
        throw new TypeError("invalid name '" + object.name + "'")

      this.fullName = getFullName(object)

      this.sig = crypto.keccak256(ab.fromUtf8(this.fullName)).slice(0, 4)
    }

    this.inputCodec = parse({
      type: 'tuple',
      components: object.inputs,
    })

    this.canUseNamedInput = this.inputCodec.canUseNamedInput

    this.outputCodec = object.outputs
      ? parse({
          type: 'tuple',
          components: object.outputs,
        })
      : null

    this.canUseNamedOutput =
      this.outputCodec && this.outputCodec.canUseNamedOutput
  }

  enc = (...values) => {
    const encoded =
      values.length === 1 &&
      this.inputCodec.canUseNamedInput &&
      typeof values[0] === 'object' &&
      (this.inputCodec.components[0].meta.type !== 'function' ||
        !('address' in values[0] && 'selector' in values[0]))
        ? this.inputCodec.enc(values[0])
        : this.inputCodec.enc(values)

    return this.inputCodec.isDynamic ? encoded.value : encoded
  }

  dec = value => {
    if (this.outputCodec) {
      if (this.outputCodec.components.length === 0) return null
      const returnValue = this.outputCodec.dec(value)
      return this.outputCodec.isDynamic ? returnValue.value : returnValue
    }
  }
}

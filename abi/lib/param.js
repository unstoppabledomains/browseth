import { ab, address } from '@browseth/utils'

export {
  AbiParamBoolean,
  AbiParamNumber,
  AbiParamFixedBytes,
  AbiParamAddress,
  AbiParamDynamicBytes,
  AbiParamString,
  AbiParamFixedPoint,
  AbiParamFunction,
  AbiParamArray,
  AbiParamTuple,
  parse,
}

class AbiParamBoolean {
  constructor(object) {
    this.meta = object
  }

  isDynamic = false
  length = 1
  byteLength = 32
  isPaddedStart = true

  enc(value) {
    if (typeof value !== 'boolean') {
      throw new TypeError("invalid value '" + value + "' must be a boolean")
    }
    return new Uint8Array([Boolean(value) ? 1 : 0])
  }

  dec(value) {
    return new Uint8Array(value, 31, 1)[0] > 0
  }
}

class AbiParamNumber {
  static regex = /^(u)?int([\d]+)?$/

  constructor(object) {
    const match = object.type.match(this.constructor.regex)

    if (match == null) {
      throw new TypeError("invalid type '" + object.type + "'")
    }

    const bits = match[2] == null ? 256 : Number(match[2])

    if (bits > 256 || bits < 8 || bits % 8 !== 0) {
      throw new TypeError(
        "invalid type '" +
          object.type +
          "' size must be between 8 and 256 bits and in byte increments",
      )
    }

    this.length = bits / 8
    this.isSigned = !Boolean(match[1])
    this.meta = object
  }

  isDynamic = false
  byteLength = 32
  isPaddedStart = true

  enc = value => {
    if (this.isSigned && Number.isInteger(value) && value < 0) {
      return ab.padStart(ab.toTwos(ab.fromUInt(-value), this.length), 32, 0xff)
    }

    const buf = new Uint8Array(ab.fromUInt(value))

    if (
      buf.length > this.length ||
      (this.isSigned &&
        buf.length === this.length &&
        buf[buf.length - 1] === 255)
    ) {
      throw new RangeError("invalid value '" + value + "' too large")
    }

    return ab.padStart(buf, 32)
  }

  dec = value => {
    if (this.isSigned && new Uint8Array(value)[0] === 255) {
      return -BigInt(
        ab.toHex(ab.toTwos(value.slice(32 - this.length, 32), this.length)),
      )
    }
    return BigInt(ab.toHex(value.slice(32 - this.length, 32)))
  }
}

class AbiParamFixedBytes {
  static regex = /^bytes([\d]+)$/

  constructor(object) {
    const match = object.type.match(this.constructor.regex)

    if (match == null) {
      throw new TypeError("invalid type '" + object.type + "'")
    }

    this.length = Number(match[1])

    if (this.length > 32 || this.length < 1) {
      throw new RangeError(
        "invalid type '" + object.type + "' length must be between 1 and 32",
      )
    }

    this.meta = object
  }

  isDynamic = false
  byteLength = 32
  isPaddedStart = false

  enc = value => ab.fromBytes(value, this.length)

  dec = value => {
    return value.slice(0, this.length)
  }
}

class AbiParamAddress {
  constructor(object) {
    this.meta = object
  }

  isDynamic = false
  length = 20
  byteLength = 32
  isPaddedStart = true

  enc(value) {
    const data = value == null ? new ArrayBuffer(20) : ab.fromBytes(value, 20)

    if (data.byteLength > 20) {
      throw new RangeError('address must be 20 bytes')
    }

    return ab.padStart(data, 20)
  }

  dec(value) {
    const address = value.slice(12, 32)

    if (new Uint8Array(address).every(byte => byte === 0)) {
      return null
    }

    // TODO: CHECKSUM
    return ab.toHex(address)
  }
}

class AbiParamDynamicBytes {
  constructor(object) {
    if (object.type !== 'bytes') {
      throw new TypeError("invalid type '" + object.type + "' must be 'bytes'")
    }
    this.meta = object
  }

  isDynamic = true
  isPaddedStart = false

  enc(value) {
    const encodedValue =
      value == null
        ? new ArrayBuffer(0)
        : typeof value === 'string'
          ? ab.fromUtf8(value)
          : ab.fromBytes(value)

    return { value: encodedValue, length: encodedValue.byteLength }
  }

  dec(value, length) {
    return {
      value: value.slice(0, length),
      consumed: length + ((32 - (length % 32)) % 32),
    }
  }
}

class AbiParamString {
  constructor(object) {
    if (object.type !== 'string') {
      throw new TypeError("invalid type '" + object.type + "' must be 'string'")
    }
    this.meta = object
  }

  isDynamic = true
  isPaddedStart = false

  enc(value) {
    if (value instanceof ArrayBuffer) {
      return { value, length: value.byteLength }
    } else if (ArrayBuffer.isView(value)) {
      return { value: ab.fromView(value), length: value.byteLength }
    }
    const encodedValue = ab.fromUtf8(value)
    return { value: encodedValue, length: encodedValue.byteLength }
  }

  dec(value, length) {
    return {
      value: ab.toUtf8(value.slice(value, length)),
      consumed: length + ((32 - (length % 32)) % 32),
    }
  }
}

class AbiParamFixedPoint {}

class AbiParamFunction {
  constructor(object) {
    if (object.type !== 'function') {
      throw new TypeError(
        "invalid type '" + object.type + "' must be 'function'",
      )
    }
    this.meta = object
  }

  isDynamic = false
  length = 24
  byteLength = 32
  isPaddedStart = false

  enc = value => {
    if (typeof value !== 'object' && typeof value !== 'function') {
      throw new TypeError("invalid value '" + value + "' must be an object")
    }

    const { address, selector } = value

    return ab.concat([
      address == null ? new ArrayBuffer(20) : ab.fromBytes(address, 20),
      ab.fromBytes(selector, 4),
    ])
  }

  dec(value) {
    const address = value.slice(0, 20)

    return {
      address: new Uint8Array(address).every(byte => byte === 0)
        ? null
        : address,
      selector: new Uint8Array(value.slice(20, 24)),
    }
  }
}

class AbiParamArray {
  static regex = /^(.+)(?:\[([\d]+)?\])$/

  constructor(object) {
    const match = object.type.match(this.constructor.regex)

    if (match == null) {
      throw new TypeError("invalid type '" + object.type + "'")
    }

    this.param = parse({ ...object, type: match[1] })
    this.isDynamic = match[2] == null || this.param.isDynamic

    this.length = match[2] ? Number(match[2]) : null
    if (this.length != null && this.length < 1) {
      throw new RangeError(
        "invalid type '" + object.type + "' size must be greater than 1",
      )
    }

    this.byteLength = this.isDynamic
      ? null
      : this.length * this.param.byteLength

    this.meta = object
  }

  enc = value => {
    if (!Array.isArray(value)) {
      throw new TypeError("invalid value '" + value + "' must be an array")
    }

    if (!this.isDynamic && this.length !== value.length) {
      throw new RangeError(
        "invalid number of arguments got '" +
          value.length +
          "' must be '" +
          this.size +
          "'",
      )
    }

    const packed = pack(
      new Array(this.length || value.length).fill(this.param),
      value,
      false,
    )

    if (this.isDynamic) return { value: packed, length: value.length }
    else return packed
  }

  dec = (value, length) =>
    unpack(
      new Array(this.length || length).fill(this.param),
      value,
      false,
      this.isDynamic,
      false,
    )
}

class AbiParamTuple {
  constructor(object) {
    if (object.type !== 'tuple') {
      throw new TypeError("invalid type '" + object.type + "' must be 'tuple'")
    }

    if (!Array.isArray(object.components)) {
      throw new TypeError("invalid components '" + object.components + "'")
    }

    this.components = object.components.map(componentObject =>
      parse(componentObject),
    )

    const names = this.components.map(component => component.meta.name)
    this.canUseNamedInput =
      // all are unique
      new Set(names).size === this.components.length &&
      // all are non null strings
      names.every(name => name && typeof name === 'string')

    this.canUseNamedOutput =
      this.canUseNamedInput && names.every(name => !(name in Array.prototype))

    this.isDynamic = !this.components.every(component => !component.isDynamic)

    if (!this.isDynamic) {
      this.length = this.components.length
      this.byteLength = this.components.reduce((a, v) => a + v.byteLength, 0)
    }

    this.meta = object
  }

  enc = value => {
    if (typeof value !== 'object' && typeof value !== 'function') {
      throw new TypeError(
        "invalid value '" + value + "' tuples are arrays or objects",
      )
    }

    let flattened
    if (Array.isArray(value)) {
      if (value.length !== this.components.length) {
        throw new RangeError(
          "invalid number of arguments got '" +
            value.length +
            "' must be '" +
            this.length +
            "'",
        )
      }

      flattened = value
    } else {
      if (!this.canUseNamedInput) {
        throw new TypeError(
          "invalid value '" + value + "' unnamable tuples must be arrays",
        )
      }

      flattened = this.components.map(component => {
        if (!(component.meta.name in value)) {
          throw new TypeError(
            "invalid value, named tuple must include key '" +
              component.meta.name +
              "'",
          )
        }
        return value[component.meta.name]
      })
    }

    const packed = pack(this.components, flattened, true)

    if (this.isDynamic) return { value: packed, length: packed.byteLength }
    else return packed
  }

  dec = value =>
    unpack(this.components, value, true, this.isDynamic, this.canUseNamedOutput)
}

function parse(object) {
  if (typeof object.type !== 'string') {
    throw new TypeError("invalid type '" + object.type + "' must be string")
  }

  switch (object.type) {
    case 'address':
      return new AbiParamAddress(object)
    case 'bool':
      return new AbiParamBoolean(object)
    case 'bytes':
      return new AbiParamDynamicBytes(object)
    case 'function':
      return new AbiParamFunction(object)
    case 'string':
      return new AbiParamString(object)
    case 'tuple':
      return new AbiParamTuple(object)
    default: {
      if (/^.+\[(?:\d+)?\]$/.test(object.type)) return new AbiParamArray(object)
      if (object.type.startsWith('bytes')) return new AbiParamFixedBytes(object)
      if (object.type.includes('int')) return new AbiParamNumber(object)
      // if (object.type.includes('fixed')) return new AbiParamFixedPoint(object)
      throw new TypeError("invalid type '" + object.type + "'")
    }
  }
}

function pack(params, values, isTuple) {
  let staticSize = 0
  let dynamicSize = 0

  const parsed = params.map((param, i) => {
    if (param.isDynamic) {
      const { value, length } = param.enc(values[i])
      const rem = value.byteLength % 32
      const wordLength =
        32 + (rem === 0 ? value.byteLength : value.byteLength + 32 - rem)

      if (isTuple) {
        staticSize += 32
      }
      dynamicSize += wordLength

      return {
        isDynamic: true,
        value: ab[param.isPaddedStart ? 'padStart' : 'padEnd'](
          ab.concat([ab.padStart(ab.fromUInt(length), 32), value]),
          wordLength,
        ),
        wordLength,
      }
    }

    const rem = param.byteLength % 32
    const wordLength =
      rem === 0 ? param.byteLength : param.byteLength + 32 - rem

    staticSize += wordLength

    return {
      isDynamic: false,
      wordLength,
      value: ab[param.isPaddedStart ? 'padStart' : 'padEnd'](
        param.enc(values[i]),
        wordLength,
      ),
    }
  })

  let offset = 0
  let dynamicOffset = staticSize
  let data = new Uint8Array(staticSize + dynamicSize)

  for (const { value, wordLength, isDynamic } of parsed) {
    if (isDynamic) {
      if (isTuple) {
        data.set(
          new Uint8Array(ab.padStart(ab.fromUInt(dynamicOffset), 32)),
          offset,
        )
        offset += 32
      }

      data.set(new Uint8Array(value), dynamicOffset)
      dynamicOffset += wordLength
    } else {
      data.set(new Uint8Array(value), offset)
      offset += wordLength
    }
  }

  return ab.fromView(data)
}

function unpack(params, data, isTuple, isDynamic, hasNamedOutput) {
  let offset = 0

  const buf = ab.fromBytes(data)

  const results = params.map((param, i) => {
    if (offset > buf.byteLength) {
      throw new TypeError('used it all up')
    }

    if (param.isDynamic) {
      const length = Number(ab.toHex(buf.slice(offset, (offset += 32))))

      const { value, consumed } = isTuple
        ? param.dec(
            buf.slice(length + 32),
            Number(ab.toHex(buf.slice(length, length + 32))),
          )
        : param.dec(buf.slice(offset), length)

      offset += consumed

      return value
    }

    return param.dec(
      ab.fromView(buf.slice(offset, (offset += param.byteLength))),
    )
  })

  let returnValue

  // Tuple stuff start
  if (results.length === 1) {
    returnValue = results[0]
  } else if (hasNamedOutput) {
    params.forEach((param, i) => {
      results[param.meta.name] = results[i]
    })

    returnValue = results
  } else {
    returnValue = results
  }

  if (isDynamic) {
    return {
      value: returnValue,
      consumed: offset,
    }
  }
  return returnValue
}

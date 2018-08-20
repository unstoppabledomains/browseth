import { TextEncoder, TextDecoder } from 'text-encoding'

export {
  fromView,
  fromBytes,
  fromUtf8,
  fromUInt,
  // fromInt,
  isBytes,
  toHex,
  toUtf8,
  stripStart,
  padStart,
  padEnd,
  concat,
  toTwos,
  bytesRegex,
  hexNumberRegex,
}

const bytesRegex = /^(?:0x)?((?:[\da-fA-F]{2})*)$/
const hexNumberRegex = /^(?:0x)?([\da-fA-F]+)$/

const utf8Encoder = new TextEncoder('utf-8')
const utf8Decoder = new TextDecoder('utf-8')

function fromView(value) {
  if (ArrayBuffer.isView(value)) {
    return value.buffer.slice(
      value.byteOffset,
      value.byteOffset + value.byteLength,
    )
  } else if (value instanceof ArrayBuffer) {
    return value
  }
  throw new TypeError("invalid value '" + value + "'")
}

function isBytes(value, length = -1) {
  if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
    return length === -1 || value.byteLength === length
  }

  if (typeof value === 'string') {
    const match = value.match(bytesRegex)
    return Boolean(match && value.length === length * 2)
  }

  return false
}

function fromBytes(value, length = -1) {
  if (typeof value === 'string') {
    const match = value.match(bytesRegex)
    if (match) {
      if (length !== -1 && length * 2 !== match[1].length) {
        throw new RangeError("invalid length for '" + value + "'")
      }

      const view = new Uint8Array(match[1].length / 2)

      for (let i = 0; i < match[1].length; i += 2) {
        view[i / 2] = parseInt(match[1].substring(i, i + 2), 16)
      }

      return view.buffer
    }
  } else if (value instanceof ArrayBuffer) {
    if (length !== -1 && length !== value.byteLength) {
      throw new RangeError(
        "invalid length '" + value.byteLength + "' of '" + value + "'",
      )
    }
    return value
  } else if (ArrayBuffer.isView(value)) {
    return fromBytes(fromView(value), length)
  } else if (Array.isArray(value)) {
    return fromBytes(new Uint8Array(value))
  }
  throw new TypeError("invalid value '" + value + "'")
}

function fromUtf8(value) {
  if (typeof value !== 'string') {
    throw new TypeError("invalid value '" + value + "' must be string")
  }

  return fromView(utf8Encoder.encode(value))
}

function fromUInt(value) {
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      if (value < 0) {
        throw new TypeError("invalid number '" + value + "' is less than zero")
      }
      const hex = value.toString(16)
      return fromBytes((hex.length % 2 === 1 ? '0' : '') + hex)
    }
  } else if (typeof value === 'string') {
    const match = value.match(hexNumberRegex)
    if (match) {
      return fromBytes((match[1].length % 2 === 1 ? '0' : '') + match[1])
    }
  } else if (value instanceof ArrayBuffer) {
    return value
  } else if (ArrayBuffer.isView(value)) {
    return fromView(value)
  }
  throw new TypeError("invalid value '" + value + "'")
}

function toHex(value) {
  if (value instanceof ArrayBuffer) {
    let out = []
    for (const byte of new Uint8Array(value)) {
      out.push(byte < 16 ? '0' + byte.toString(16) : byte.toString(16))
    }
    return '0x' + out.join('')
  } else if (ArrayBuffer.isView(value)) {
    return toHex(fromView(value))
  }

  throw new TypeError("invalid value '" + value + "'")
}

function toUtf8(value) {
  if (value instanceof ArrayBuffer) {
    return utf8Decoder.decode(value)
  } else if (ArrayBuffer.isView(value)) {
    return toUtf8(fromView(value))
  }

  throw new TypeError("invalid value '" + value + "'")
}

function stripStart(value) {
  const ab = fromBytes(value)

  const ui8ab = new Uint8Array(ab)

  if (ui8ab.length === 0) {
    return ui8ab
  }
  let start = 0
  while (ui8ab[start] === 0) {
    start++
  }

  if (start) {
    return fromView(ui8ab.slice(start))
  }

  return fromView(ui8ab)
}

function padStart(value, length, fillByte = 0x00) {
  const ab = fromBytes(value)

  if (ab.byteLength > length) {
    return ab
  }

  const ui8ab = new Uint8Array(length).fill(fillByte)
  ui8ab.set(new Uint8Array(ab), length - ab.byteLength)
  return fromView(ui8ab)
}

function padEnd(value, length, fillByte = 0x00) {
  const ab = fromBytes(value)

  if (ab.byteLength > length) {
    return ab
  }

  const ui8ab = new Uint8Array(length).fill(fillByte)
  ui8ab.set(new Uint8Array(ab))
  return fromView(ui8ab)
}

function concat(values) {
  if (!Array.isArray(values)) {
    throw new TypeError("invalid value '" + value + "' must be an Array")
  }

  const abs = values.map(v => fromBytes(v))

  const ui8ab = new Uint8Array(abs.reduce((a, v) => a + v.byteLength, 0))

  let offset = 0
  abs.forEach(ab => {
    ui8ab.set(new Uint8Array(ab), offset)
    offset += ab.byteLength
  })

  return fromView(ui8ab)
}

function toTwos(value, size) {
  const ab = fromUInt(value)

  let ui8ab = new Uint8Array(size)

  ui8ab.set(new Uint8Array(ab))

  ui8ab = ui8ab.map(u => ~(u >>> 0))

  for (let i = 0; i < ui8ab.length; i++) {
    if (ui8ab[i] === 255) {
      if (i === ui8ab.length - 1) {
        throw new RangeError()
      }
    } else {
      ui8ab[i] += 1

      return fromView(ui8ab)
    }
  }
}

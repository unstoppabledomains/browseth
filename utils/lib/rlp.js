// Basicly an ArrayBuffer version of encode from https://github.com/ethereumjs/rlp

import * as ab from './ab'

export { encode }

function encode(value) {
  if (Array.isArray(value)) {
    const buf = ab.concat(value.map(encode))
    return ab.concat([encodeLength(buf.byteLength, 192), buf])
  } else {
    const buf = new Uint8Array(
      typeof value === 'number'
        ? ab.fromUInt(value)
        : ab.isBytes(value)
          ? ab.fromBytes(value)
          : ab.fromUtf8(value),
    )
    if (buf.length === 1 && buf[0] < 128) {
      return buf
    } else {
      return ab.concat([encodeLength(buf.length, 128), buf])
    }
  }
}

function encodeLength(len, offset) {
  if (len < 56) {
    return new Uint8Array([len + offset])
  } else {
    const hexLength = new Uint8Array(ab.fromUInt(len))
    if (hexLength[hexLength.length] > 127) {
      throw new RangeError('odd number of nibbles')
    }
    const firstByte = ab.fromUInt(offset + 55 + hexLength.length)

    return ab.concat([firstByte, hexLength])
  }
}

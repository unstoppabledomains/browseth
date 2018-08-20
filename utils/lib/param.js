import * as ab from './ab'

export {
  toData,
  toQuantity,
  toTag,
  isData,
  isQuantity,
  isTag,
  fromData,
  fromQuantity,
  fromTag,
}

function toData(value, length) {
  return ab.toHex(ab.fromBytes(value, length))
}

function toQuantity(value) {
  const hexStr = ab.toHex(ab.fromUInt(value))

  if (hexStr[2] === '0') return '0x' + hexStr.slice(3)
  return hexStr
}

function toTag(value) {
  if (value === 'pending' || value === 'latest' || value === 'earliest') {
    return value
  }
  return toQuantity(value)
}

function isData(value, length = -1) {
  if (typeof value === 'string' && ab.bytesRegex.test(value)) return true
  else if (value instanceof ArrayBuffer || ArrayBuffer.isView(value))
    return length === -1 || length === value.byteLength
  return false
}

function isQuantity(value) {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0)
    return true
  else if (typeof value === 'string' && ab.hexNumberRegex.test(value))
    return true
  return false
}

function isTag(value) {
  if (value === 'pending' || value === 'latest' || value === 'earliest') {
    return true
  }
  return isQuantity(value)
}

function fromData(value, length) {
  return new Uint8Array(ab.fromBytes(value, length))
}

function fromQuantity(value) {
  // change to BigNumber
  return BigInt(value)
}

function fromTag(value) {
  if (value === 'pending' || value === 'latest' || value === 'earliest') {
    return value
  }
  return fromQuantity(value)
}

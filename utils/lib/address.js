import { keccak256 } from './crypto'
import { fromBytes, toHex, fromUInt } from './ab'
import { encode } from './rlp'
// // import * as rlp from './rlp'

export { isValid, from, fromAdderssAndNonce }

const addressLowerRegex = /^0x[\da-f]{40}$/
const addressUpperRegex = /^0x[\dA-F]{40}$/

function isValid(value) {
  try {
    return addressLowerRegex.test(value) || addressUpperRegex.test(value)
  } catch (e) {
    try {
      return value === from(value)
    } catch (e) {
      return false
    }
  }
}

function from(value) {
  if (value == null) {
    return '0x0000000000000000000000000000000000000000'
  }

  const buf = fromBytes(value)

  let address = toHex(buf).substring(2)
  const hash = toHex(keccak256(buf)).substring(2)
  let ret = '0x'

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

function fromAdderssAndNonce(address, nonce) {
  return from(
    keccak256(encode([fromBytes(address), fromUInt(nonce)]).slice(12)),
  )
}

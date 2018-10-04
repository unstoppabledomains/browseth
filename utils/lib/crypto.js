import { Keccak } from 'mipher/dist/sha3'
import { UUID } from 'mipher/dist/uuid'
import { fromBytes, fromUtf8, bytesRegex } from './ab'
export { keccak256, uuid }

const mipherKeccak256 = new Keccak(256, 1)
function keccak256(value) {
  return mipherKeccak256.hash(new Uint8Array(value ? fromBytes(value) : 0))
}

const mipherUuid = new UUID()
function uuid() {
  if (global.crypto && global.crypto.getRandomValues) {
    return mipherUuid.toString(
      mipherUuid.v4(global.crypto.getRandomValues(new Uint8Array(16))),
    )
  }
  return mipherUuid.toString(mipherUuid.v4(require('crypto').randomBytes(16)))
}

import { Keccak } from 'mipher/dist/sha3'
import { UUID } from 'mipher/dist/uuid'
import { fromBytes, fromUtf8, bytesRegex, toHex } from './ab'
export { keccak256, uuid, namehash }

const mipherKeccak256 = new Keccak(256, 1)
function keccak256(value) {
  return mipherKeccak256.hash(new Uint8Array(value ? fromBytes(value) : 0))
}

function namehash(name) {
  const labels = name.split('.')
  if (labels[labels.length - 1] === '') {
    labels.pop()
  }
  if (labels[0] === '') {
    labels.shift()
  }
  return labels.reverse().reduce(
    (a, v) =>
      toHex(
        keccak256(
          Buffer.from(
            a.replace('0x', '') +
              toHex(keccak256(fromUtf8(v))).replace('0x', ''),
            'hex',
          ),
        ),
      ),

    `0x${'0'.repeat(64)}`,
  )
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

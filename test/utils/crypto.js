import { assert, expect } from 'chai'
import { crypto } from '@browseth/utils'

describe('keccak256', () => {
  it('should return keccak256 hash as a uint8array', () => {
    expect(crypto.keccak256(Buffer.from('123123123'))).to.be.a('Uint8Array')
  })
})

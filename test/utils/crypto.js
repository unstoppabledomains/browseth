import { expect } from 'chai'
import { crypto } from '@browseth/utils'

describe('keccak256', () => {
  it('should return keccak256 hash as a uint8array', () => {
    expect(crypto.keccak256(Buffer.from('123123123'))).to.be.a('Uint8Array')
  })
})

describe('namehash', () => {
  it('should return namehash hash as a string', () => {
    expect(crypto.namehash('ryan-le.eth')).to.equal(
      '0xd22199aae12a9820651b06cb6da9f5d4cccc53f925d7f1ec7e07682f8847ec41',
    )
  })
})

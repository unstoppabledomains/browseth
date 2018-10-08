import { expect } from 'chai'
import { address } from '@browseth/utils'

describe('isValid', () => {
  it('should return false', () => {
    expect(address.isValid('0x0')).to.be.false
    expect(address.isValid('0x0112222222222222')).to.be.false
    expect(address.isValid('0xffffffffffffffffffffff')).to.be.false
    expect(address.isValid('0xfffffffffffffffffffffffffffffffffffgffff')).to.be
      .false
    expect(address.isValid('ffffffffffffffffffffffffffffffffffffffff')).to.be
      .false
  })
  it('should return true', () => {
    expect(address.isValid('0x0000000000000000000000000000000000000000')).to.be
      .true
    expect(address.isValid('0xffffffffffffffffffffffffffffffffffffffff')).to.be
      .true
  })
})

describe('from', () => {
  it('should throw TypeError', () => {
    const val = 'asdfasdfasdf'
    expect(() => address.from(val)).to.throw(`invalid value '${val}'`)
  })
  it("should return 0x${'0'.repeat(40)}", () => {
    expect(address.from(null)).to.equal(
      '0x0000000000000000000000000000000000000000',
    )
  })
  it('should convert bytes to hex', () => {
    expect(address.from(new Buffer('asdfasdf'))).to.equal('0x6173646661736466')
    expect(address.from(new Buffer('0x6173646661736466'))).to.equal(
      '0x307836313733363436363631373336343636',
    )
  })
})

describe('fromAddressAndNonce', () => {
  it('should encode address and nonce', () => {
    expect(address.fromAddressAndNonce(new Buffer('asdf'), 12)).to.equal(
      '0xc5D2460186F7233c927E7DB2Dcc703C0E500B653ca82273b7BfAd8045D85a470',
    )
  })
})

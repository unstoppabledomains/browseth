import { expect } from 'chai'
import { ab } from '@browseth/utils'

describe('isBytes', () => {
  it('should be false', () => {
    expect(ab.isBytes('-12')).to.be.false
    expect(ab.isBytes('0x002')).to.be.false
  })
  it('should be true', () => {
    expect(ab.isBytes(new Uint8Array(100))).to.be.true
    expect(ab.isBytes(new Int8Array(100))).to.be.true
    expect(ab.isBytes(new Int16Array(100))).to.be.true
    expect(ab.isBytes(new Int32Array(100))).to.be.true
    expect(ab.isBytes(new Int8Array([100, 12, 32]))).to.be.true
  })
})

describe('stripStart', () => {
  it('should throw invalid value', () => {
    const val = 'aff2222333fff'
    expect(() => ab.stripStart(val)).to.throw(`invalid value '${val}'`)
  })
})

describe('fromBytes', () => {
  it('should throw invalid value', () => {
    const n = '122'
    expect(() => ab.fromBytes(n)).to.throw(`invalid value '${n}'`)
  })
  it('should return ArrayBuffer of byteLength 6', () => {
    const n = '0x000123123123'
    expect(ab.fromBytes(n)).to.be.a('ArrayBuffer')
    expect(ab.fromBytes(n)).to.include({ byteLength: 6 })
  })
})

describe('fromUtf8', () => {
  it('should throw invalid value', () => {
    const n = 12
    expect(() => ab.fromUtf8(n)).to.throw(`invalid value '${n}' must be string`)
  })
})

describe('fromUInt', () => {
  it('should throw invalid number less than zero', () => {
    const n = -12
    expect(() => ab.fromUInt(n)).to.throw(
      `invalid number '${n}' is less than zero`,
    )
  })
  it('should throw invalid value', () => {
    const n = '-12'
    expect(() => ab.fromUInt(n)).to.throw(`invalid value '${n}'`)
  })
})

describe('toHex', () => {
  it('should throw invalid value', () => {
    const n = -12
    expect(() => ab.toHex(n)).to.throw(`invalid value '${n}'`)
  })
})

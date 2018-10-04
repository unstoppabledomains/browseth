import { expect } from 'chai'
import * as units from '@browseth/units'

it('should convert ether to wei', () => {
  expect(units.convert('ether', 1000000000000, 'wei')).to.equal(
    '0xc9f2c9cd04674edea40000000',
  )
  expect(units.convert('ether', '100000020000', 'wei')).to.equal(
    '0x1431e13eaa133ab4004800000',
  )
  expect(units.convert('ether', '1000000000', 'wei')).to.equal(
    '0x33b2e3c9fd0803ce8000000',
  )
  expect(units.convert('ether', 0x12132123231, 'wei')).to.equal(
    '0xfad65210472e95c1c92240000',
  )
})

it('should convert wei to ether', () => {
  expect(units.convert('wei', 1000000000000, 'ether')).to.equal('0.000001')
  expect(units.convert('wei', '100000000000', 'ether')).to.equal('0.0000001')
  expect(units.convert('wei', '1000000000', 'ether')).to.equal('0.000000001')
})

it('should convert finney to ether', () => {
  expect(units.toEther('finney', 1000000000000, 'ether')).to.equal('1000000000')
  expect(units.toEther('finney', '100000020000', 'ether')).to.equal('100000020')
  expect(units.toEther('finney', '1000000000', 'ether')).to.equal('1000000')
})

it('should convert grand to wei', () => {
  expect(units.convert('grand', 1000000000, 'wei')).to.equal(
    '0x314dc6448d9338c15b0a00000000',
  )
  expect(units.convert('grand', '100000020', 'wei')).to.equal(
    '0x4ee2d7dcc85b1d4f21194000000',
  )
  expect(units.convert('grand', '10000000', 'wei')).to.equal(
    '0x7e37be2022c0914b2680000000',
  )
})

it('should convert grand to finney', () => {
  expect(units.convert('grand', '10000000', 'finney')).to.equal(
    '10000000000000000',
  )
  expect(units.convert('grand', 0x9123123, 'finney')).to.equal(
    '152187171000000000',
  )
})

it('should convert einstein to ada', () => {
  expect(units.convert('einstein', '10000000', 'ada')).to.equal('10000000000000000000000000000')
  expect(units.convert('einstein', 0x9123123, 'ada')).to.equal('152187171000000000000000000000')
})

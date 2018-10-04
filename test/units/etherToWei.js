import { expect } from 'chai'
import * as units from '@browseth/units'

it('should convert ether to wei', () => {
  expect(units.etherToWei(1000000000000)).to.equal(
    '0xc9f2c9cd04674edea40000000',
  )
  expect(units.etherToWei('100000020000')).to.equal(
    '0x1431e13eaa133ab4004800000',
  )
  expect(units.etherToWei('1000000000')).to.equal('0x33b2e3c9fd0803ce8000000')
  expect(units.etherToWei(0x12132123231)).to.equal('0xfad65210472e95c1c92240000')
})

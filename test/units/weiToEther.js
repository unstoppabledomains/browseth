import { expect } from 'chai'
import * as units from '@browseth/units'

it('should convert wei to ether', () => {
  expect(units.weiToEther(1000000000000)).to.equal('0.000001')
  expect(units.weiToEther('100000000000')).to.equal('0.0000001')
  expect(units.weiToEther('1000000000')).to.equal('0.000000001')
  expect(units.weiToEther(123222)).to.equal('0.000000000000123222')
  expect(units.weiToEther(0x2aa0022211f)).to.equal('0.000002929169932575')
  expect(units.weiToEther('2312132123123')).to.equal('0.000002312132123123')
  expect(units.weiToEther(0)).to.equal('0')
})

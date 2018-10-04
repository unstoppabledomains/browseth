import { expect } from 'chai'
import * as units from '@browseth/units'

it('should return power of ether', () => {
  expect(units.unitToPow('ether')).to.equal(18)
})
it('should return power of wei', () => {
  expect(units.unitToPow('wei')).to.equal(0)
})
it('should return power of gwei', () => {
  expect(units.unitToPow('gwei')).to.equal(9)
})
it('should return power of kwei', () => {
  expect(units.unitToPow('kwei')).to.equal(3)
})
it('should return power of einstein', () => {
  expect(units.unitToPow('einstein')).to.equal(24)
})

it('should throw invalid unit', () => {
  const invalidUnit = 'asdf'
  expect(() => units.unitToPow(invalidUnit)).to.throw(
    `invalid unit ${invalidUnit}`,
  )
})

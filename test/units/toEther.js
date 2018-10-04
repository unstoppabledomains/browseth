import { expect } from 'chai'
import * as units from '@browseth/units'

it('should convert wei to ether', () => {
  expect(units.toEther('wei', 1000000000000)).to.equal('0.000001')
  expect(units.toEther('wei', '100000000000')).to.equal('0.0000001')
  expect(units.toEther('wei', '1000000000')).to.equal('0.000000001')
})
it('should convert kwei to ether', () => {
  expect(units.toEther('kwei', 1000000000000)).to.equal('0.001')
  expect(units.toEther('kwei', '100000000000')).to.equal('0.0001')
  expect(units.toEther('kwei', '1000000000')).to.equal('0.000001')
})
it('should convert ada to ether', () => {
  expect(units.toEther('ada', 1000000000000)).to.equal('0.001')
  expect(units.toEther('ada', '100000000000')).to.equal('0.0001')
  expect(units.toEther('ada', '1000000000')).to.equal('0.000001')
})
it('should convert femtoether to ether', () => {
  expect(units.toEther('femtoether', 1000000000000)).to.equal('0.001')
  expect(units.toEther('femtoether', '100000000000')).to.equal('0.0001')
  expect(units.toEther('femtoether', '1000000000')).to.equal('0.000001')
})
it('should convert mwei to ether', () => {
  expect(units.toEther('mwei', 1000000000000)).to.equal('1')
  expect(units.toEther('mwei', '100000000000')).to.equal('0.1')
  expect(units.toEther('mwei', '1000000000')).to.equal('0.001')
})
it('should convert babbage to ether', () => {
  expect(units.toEther('babbage', 1000000000000)).to.equal('1')
  expect(units.toEther('babbage', '100000000000')).to.equal('0.1')
  expect(units.toEther('babbage', '1000000000')).to.equal('0.001')
})
it('should convert picoether to ether', () => {
  expect(units.toEther('picoether', 1000000000000)).to.equal('1')
  expect(units.toEther('picoether', '100000000000')).to.equal('0.1')
  expect(units.toEther('picoether', '1000000000')).to.equal('0.001')
})
it('should convert picoether to ether', () => {
  expect(units.toEther('picoether', 1000000000000)).to.equal('1')
  expect(units.toEther('picoether', '100000000000')).to.equal('0.1')
  expect(units.toEther('picoether', '1000000000')).to.equal('0.001')
})
it('should convert gwei to ether', () => {
  expect(units.toEther('gwei', 1000000000000)).to.equal('1000')
  expect(units.toEther('gwei', '100000020000')).to.equal('100.00002')
  expect(units.toEther('gwei', '1000000000')).to.equal('1')
})
it('should convert shannon to ether', () => {
  expect(units.toEther('shannon', 1000000000000)).to.equal('1000')
  expect(units.toEther('shannon', '100000020000')).to.equal('100.00002')
  expect(units.toEther('shannon', '1000000000')).to.equal('1')
})
it('should convert nanoether to ether', () => {
  expect(units.toEther('nanoether', 1000000000000)).to.equal('1000')
  expect(units.toEther('nanoether', '100000020000')).to.equal('100.00002')
  expect(units.toEther('nanoether', '1000000000')).to.equal('1')
})
it('should convert szabo to ether', () => {
  expect(units.toEther('szabo', 1000000000000)).to.equal('1000000')
  expect(units.toEther('szabo', '100000020000')).to.equal('100000.02')
  expect(units.toEther('szabo', '1000000000')).to.equal('1000')
})
it('should convert microether to ether', () => {
  expect(units.toEther('microether', 1000000000000)).to.equal('1000000')
  expect(units.toEther('microether', '100000020000')).to.equal('100000.02')
  expect(units.toEther('microether', '1000000000')).to.equal('1000')
})
it('should convert micro to ether', () => {
  expect(units.toEther('micro', 1000000000000)).to.equal('1000000')
  expect(units.toEther('micro', '100000020000')).to.equal('100000.02')
  expect(units.toEther('micro', '1000000000')).to.equal('1000')
})
it('should convert finney to ether', () => {
  expect(units.toEther('finney', 1000000000000)).to.equal('1000000000')
  expect(units.toEther('finney', '100000020000')).to.equal('100000020')
  expect(units.toEther('finney', '1000000000')).to.equal('1000000')
})
it('should convert milliether to ether', () => {
  expect(units.toEther('milliether', 1000000000000)).to.equal('1000000000')
  expect(units.toEther('milliether', '100000020000')).to.equal('100000020')
  expect(units.toEther('milliether', '1000000000')).to.equal('1000000')
})
it('should convert milli to ether', () => {
  expect(units.toEther('milli', 1000000000000)).to.equal('1000000000')
  expect(units.toEther('milli', '100000020000')).to.equal('100000020')
  expect(units.toEther('milli', '1000000000')).to.equal('1000000')
})
it('should convert ether to ether', () => {
  expect(units.toEther('ether', 1000000000000)).to.equal('1000000000000')
  expect(units.toEther('ether', '100000020000')).to.equal('100000020000')
  expect(units.toEther('ether', '1000000000')).to.equal('1000000000')
})
it('should convert kether to ether', () => {
  expect(units.toEther('kether', 1000000000000)).to.equal('1000000000000000')
  expect(units.toEther('kether', '100000020000')).to.equal('100000020000000')
  expect(units.toEther('kether', '1000000000')).to.equal('1000000000000')
})
it('should convert grand to ether', () => {
  expect(units.toEther('grand', 1000000000)).to.equal('1000000000000000')
  expect(units.toEther('grand', '100000020')).to.equal('100000020000000')
  expect(units.toEther('grand', '10000000')).to.equal('10000000000000')
})
it('should convert einstein to ether', () => {
  expect(units.toEther('einstein', 1000000000)).to.equal('1000000000000000')
  expect(units.toEther('einstein', '100000020')).to.equal('100000020000000')
  expect(units.toEther('einstein', '100000')).to.equal('100000000000')
})
it('should convert mether to ether', () => {
  expect(units.toEther('mether', 1000000)).to.equal('1000000000000000')
  expect(units.toEther('mether', '100020')).to.equal('100020000000000')
  expect(units.toEther('mether', '100')).to.equal('100000000000')
})
it('should convert gether to ether', () => {
  expect(units.toEther('gether', 1000)).to.equal('1000000000000000')
  expect(units.toEther('gether', '120')).to.equal('120000000000000')
  expect(units.toEther('gether', '1')).to.equal('1000000000000')
})
it('should convert tether to ether', () => {
  expect(units.toEther('tether', 0.001)).to.equal('1000000000000')
  expect(units.toEther('tether', '.120')).to.equal('120000000000000')
  expect(units.toEther('tether', '.001')).to.equal('1000000000000')
})

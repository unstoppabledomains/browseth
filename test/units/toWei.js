import { expect } from 'chai'
import * as units from '@browseth/units'

it('should convert wei to wei', () => {
  expect(units.toWei('wei', 1000000000000)).to.equal('0xe8d4a51000')
  expect(units.toWei('wei', 0x174876e800)).to.equal('0x174876e800')
  expect(units.toWei('wei', '0x3b9aca00')).to.equal('0x3b9aca00')
})
it('should convert kwei to wei', () => {
  expect(units.toWei('kwei', 1000000000000)).to.equal('0x38d7ea4c68000')
  expect(units.toWei('kwei', '100000000000')).to.equal('0x5af3107a4000')
  expect(units.toWei('kwei', '1000000000')).to.equal('0xe8d4a51000')
})
it('should convert ada to wei', () => {
  expect(units.toWei('ada', 1000000000000)).to.equal('0x38d7ea4c68000')
  expect(units.toWei('ada', '100000000000')).to.equal('0x5af3107a4000')
  expect(units.toWei('ada', '1000000000')).to.equal('0xe8d4a51000')
})
it('should convert femtoether to wei', () => {
  expect(units.toWei('femtoether', 1000000000000)).to.equal('0x38d7ea4c68000')
  expect(units.toWei('femtoether', '100000000000')).to.equal('0x5af3107a4000')
  expect(units.toWei('femtoether', '1000000000')).to.equal('0xe8d4a51000')
})
it('should convert mwei to wei', () => {
  expect(units.toWei('mwei', 1000000000000)).to.equal('0xde0b6b3a7640000')
  expect(units.toWei('mwei', '100000000000')).to.equal('0x16345785d8a0000')
  expect(units.toWei('mwei', '1000000000')).to.equal('0x38d7ea4c68000')
})
it('should convert babbage to wei', () => {
  expect(units.toWei('babbage', 1000000000000)).to.equal('0xde0b6b3a7640000')
  expect(units.toWei('babbage', '100000000000')).to.equal('0x16345785d8a0000')
  expect(units.toWei('babbage', '1000000000')).to.equal('0x38d7ea4c68000')
})
it('should convert picoether to wei', () => {
  expect(units.toWei('picoether', 1000000000000)).to.equal('0xde0b6b3a7640000')
  expect(units.toWei('picoether', '100000000000')).to.equal('0x16345785d8a0000')
  expect(units.toWei('picoether', '1000000000')).to.equal('0x38d7ea4c68000')
})
it('should convert gwei to wei', () => {
  expect(units.toWei('gwei', 1000000000000)).to.equal('0x3635c9adc5dea00000')
  expect(units.toWei('gwei', '100000020000')).to.equal('0x56bc7705dfff54000')
  expect(units.toWei('gwei', '1000000000')).to.equal('0xde0b6b3a7640000')
})
it('should convert shannon to wei', () => {
  expect(units.toWei('shannon', 1000000000000)).to.equal('0x3635c9adc5dea00000')
  expect(units.toWei('shannon', '100000020000')).to.equal('0x56bc7705dfff54000')
  expect(units.toWei('shannon', '1000000000')).to.equal('0xde0b6b3a7640000')
})
it('should convert nanoether to wei', () => {
  expect(units.toWei('nanoether', 1000000000000)).to.equal(
    '0x3635c9adc5dea00000',
  )
  expect(units.toWei('nanoether', '100000020000')).to.equal(
    '0x56bc7705dfff54000',
  )
  expect(units.toWei('nanoether', '1000000000')).to.equal('0xde0b6b3a7640000')
})
it('should convert szabo to wei', () => {
  expect(units.toWei('szabo', 1000000000000)).to.equal('0xd3c21bcecceda1000000')
  expect(units.toWei('szabo', '100000020000')).to.equal(
    '0x152d030eef2fd6020000',
  )
  expect(units.toWei('szabo', '1000000000')).to.equal('0x3635c9adc5dea00000')
})
it('should convert microether to wei', () => {
  expect(units.toWei('microether', 1000000000000)).to.equal(
    '0xd3c21bcecceda1000000',
  )
  expect(units.toWei('microether', '100000020000')).to.equal(
    '0x152d030eef2fd6020000',
  )
  expect(units.toWei('microether', '1000000000')).to.equal(
    '0x3635c9adc5dea00000',
  )
})
it('should convert micro to wei', () => {
  expect(units.toWei('micro', 1000000000000)).to.equal('0xd3c21bcecceda1000000')
  expect(units.toWei('micro', '100000020000')).to.equal(
    '0x152d030eef2fd6020000',
  )
  expect(units.toWei('micro', '1000000000')).to.equal('0x3635c9adc5dea00000')
})
it('should convert finney to wei', () => {
  expect(units.toWei('finney', 1000000000000)).to.equal(
    '0x33b2e3c9fd0803ce8000000',
  )
  expect(units.toWei('finney', '100000020000')).to.equal(
    '0x52b7d3f25652dbf7d00000',
  )
  expect(units.toWei('finney', '1000000000')).to.equal('0xd3c21bcecceda1000000')
})
it('should convert milliether to wei', () => {
  expect(units.toWei('milliether', 1000000000000)).to.equal(
    '0x33b2e3c9fd0803ce8000000',
  )
  expect(units.toWei('milliether', '100000020000')).to.equal(
    '0x52b7d3f25652dbf7d00000',
  )
  expect(units.toWei('milliether', '1000000000')).to.equal(
    '0xd3c21bcecceda1000000',
  )
})
it('should convert milli to wei', () => {
  expect(units.toWei('milli', 1000000000000)).to.equal(
    '0x33b2e3c9fd0803ce8000000',
  )
  expect(units.toWei('milli', '100000020000')).to.equal(
    '0x52b7d3f25652dbf7d00000',
  )
  expect(units.toWei('milli', '1000000000')).to.equal('0xd3c21bcecceda1000000')
})
it('should convert ether to wei', () => {
  expect(units.toWei('ether', 1000000000000)).to.equal(
    '0xc9f2c9cd04674edea40000000',
  )
  expect(units.toWei('ether', '100000020000')).to.equal(
    '0x1431e13eaa133ab4004800000',
  )
  expect(units.toWei('ether', '1000000000')).to.equal(
    '0x33b2e3c9fd0803ce8000000',
  )
})
it('should convert kether to wei', () => {
  expect(units.toWei('kether', 1000000000000)).to.equal(
    '0x314dc6448d9338c15b0a00000000',
  )
  expect(units.toWei('kether', '100000020000')).to.equal(
    '0x4ee2d7dcc85b1d4f21194000000',
  )
  expect(units.toWei('kether', '1000000000')).to.equal(
    '0xc9f2c9cd04674edea40000000',
  )
})
it('should convert grand to wei', () => {
  expect(units.toWei('grand', 1000000000)).to.equal(
    '0x314dc6448d9338c15b0a00000000',
  )
  expect(units.toWei('grand', '100000020')).to.equal(
    '0x4ee2d7dcc85b1d4f21194000000',
  )
  expect(units.toWei('grand', '10000000')).to.equal(
    '0x7e37be2022c0914b2680000000',
  )
})
it('should convert einstein to wei', () => {
  expect(units.toWei('einstein', 1000000000)).to.equal(
    '0x314dc6448d9338c15b0a00000000',
  )
  expect(units.toWei('einstein', '100000020')).to.equal(
    '0x4ee2d7dcc85b1d4f21194000000',
  )
  expect(units.toWei('einstein', '10000000')).to.equal(
    '0x7e37be2022c0914b2680000000',
  )
})
it('should convert mether to wei', () => {
  expect(units.toWei('mether', 1000000)).to.equal('0x314dc6448d9338c15b0a00000000')
  expect(units.toWei('mether', '100020')).to.equal('0x4ee6e0cde1801f6f44320000000')
  expect(units.toWei('mether', '100')).to.equal('0x1431e0fae6d7217caa0000000')
})
it('should convert gether to wei', () => {
  expect(units.toWei('gether', 1000)).to.equal('0x314dc6448d9338c15b0a00000000')
  expect(units.toWei('gether', '120')).to.equal('0x5ea9ce981a106cf85ce00000000')
  expect(units.toWei('gether', '1')).to.equal('0xc9f2c9cd04674edea40000000')
})
it('should convert tether to wei', () => {
  expect(units.toWei('tether', 0.001)).to.equal('0xc9f2c9cd04674edea40000000')
  expect(units.toWei('tether', '.120')).to.equal('0x5ea9ce981a106cf85ce00000000')
  expect(units.toWei('tether', '.001')).to.equal('0xc9f2c9cd04674edea40000000')
})

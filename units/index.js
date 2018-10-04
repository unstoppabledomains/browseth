import { BigNumber } from 'bignumber.js'

export { unitToPow, convert, etherToWei, gweiToWei, toWei, toEther, weiToEther }

BigNumber.config({ DECIMAL_PLACES: 1000, EXPONENTIAL_AT: [-1000, 1000] })

const units = {
  wei: 0,
  kwei: 3,
  ada: 3,
  femtoether: 3,
  mwei: 6,
  babbage: 6,
  picoether: 6,
  gwei: 9,
  shannon: 9,
  nanoether: 9,
  nano: 9,
  szabo: 12,
  microether: 12,
  micro: 12,
  finney: 15,
  milliether: 15,
  milli: 15,
  ether: 18,
  kether: 21,
  grand: 24,
  einstein: 24,
  mether: 27,
  gether: 30,
  tether: 33,
}

function unitToPow(unit) {
  const lowercasedUnit = unit[0].toLowerCase() + unit.slice(1)

  if (lowercasedUnit in units) return units[lowercasedUnit]

  throw new TypeError('invalid unit ' + unit)
}

function convert(fromUnit, value, toUnit) {
  let fromPow = unitToPow(fromUnit)
  let toPow = unitToPow(toUnit)
  const isSmallerizing = fromPow < toPow
  const scaler = new BigNumber(10).pow(new BigNumber(Math.abs(toPow - fromPow)))
  const result = new BigNumber(value)[isSmallerizing ? 'div' : 'times'](scaler)

  if (toPow === 0) return '0x' + result.toString(16)

  return result.toString()
}

function etherToWei(value) {
  return convert('ether', value, 'wei')
}

function gweiToWei(value) {
  return convert('gwei', value, 'wei')
}

function toWei(fromUnit, value) {
  return convert(fromUnit, value, 'wei')
}

function toEther(fromUnit, value) {
  return convert(fromUnit, value, 'ether')
}

function weiToEther(value) {
  return convert('wei', value, 'ether')
}

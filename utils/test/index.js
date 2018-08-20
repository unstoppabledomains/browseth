const assert = require('assert')
const { ab } = require('..')

const logBin = v => {
  const bin = new Uint8Array(v)
    .toString()
    .split(',')
    .reverse()
    .map(v => ('00000000' + Number(v).toString(2)).slice(-8))
    .join('')
    .split('')
    .reverse()
    .join('')

  console.log(bin)
  console.log(
    parseInt(
      bin
        .split('')
        .reverse()
        .join(''),
      2,
    ),
  )
}

new Array(512).fill().map((v, i) => {
  logBin(ab.padEnd(ab.fromUInt(i + 1), 4))
  const twos = ab.toTwos(ab.fromUInt(i + 1), 4)
  logBin(twos)
  logBin(ab.toTwos(twos, 4))
  console.log('--------------')
})

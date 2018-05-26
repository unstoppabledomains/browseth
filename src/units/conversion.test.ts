import {BN} from 'bn.js';
import Browseth from '../';

describe('Converting from Ether to Wei', () => {
  it('Should convert Eth to Wei, remove leading zeroes, and output in hex', () => {
    expect(Browseth.Units.etherToWei('00012345.678')).toBe('0x' + new BN('12345678000000000000000').toString(16));
  })

  it('Should truncate excess decimals and return a whole number', () => {
    expect(Browseth.Units.etherToWei('12345.12345678912345678909875654321')).toBe('0x' + new BN('12345123456789123456789').toString(16));
  })

  it('Should accept BN as a parameter', () => {
    expect(Browseth.Units.etherToWei(new BN(12345.678))).toBe('0x29d394a5d6305440000');
  })

  it('Should accept hex strings as a parameter', () => {
    expect(Browseth.Units.etherToWei('0x3039')).toBe('0x29d394a5d6305440000');
  })
});

describe('Converting from Gwei to Wei', () => {
  it('Should convert Gwei to Wei, remove decimals, remove leading zeroes', () => {
    expect(Browseth.Units.gweiToWei('00012345.12345678912345678909875654321')).toBe('0xb3a52b2c715');
  })
});

describe('Converting from unit to unit', () => {
  it('Should default to wei when missing "to" param, and be case insensitive', () => {
    expect(Browseth.Units.convert('00012345.678', 'eThEr')).toBe('0x29d42b31acb6afb0000')
  })

  it('Should remove decimal places converting to wei', () => {
    expect(Browseth.Units.convert('12345.12345678912345678909875654321', 'mether')).toBe('0x27e3a5939297a4c757d7b104');
  })

  it('Should be able to convert units other than eth, wei, or gwei, and add zeroes when necessary', () => {
    expect(Browseth.Units.convert('123456789.87654321', 'milli', 'ada')).toBe('123456789876543210000');
  })
  it('Should be able to move decimal place', () => {
    expect(Browseth.Units.convert('123456789.87654321', 'finney', 'micro')).toBe('123456789876.54321');
  })

  it('Should accept hex string as parameter, and return decimal value for non-wei conversions', () => {
    expect(Browseth.Units.convert('0x12345', 'szabo', 'bABbage')).toBe('74565000000');
  })
});

describe('Converting from a smaller unit to a larger unit', () => {
  it('Should accept BN as parameter and be able to return decimal strings', () => {
    expect(Browseth.Units.convert(new BN('12345678987654321'), 'shannon', 'einstein')).toBe('12345.678987654321');
  })

  it('Should accept BN', () => {
    expect(Browseth.Units.convert(new BN('23141321',16), 'wei', 'gwei')).toBe('0.588518177');
  })

  it('Should add leading zeroes to decimal side', () => {
    expect(Browseth.Units.convert('.588518177', 'wei', 'gwEi')).toBe('0.000000000588518177');
  })

  it('Should be able to output zero in hex when going to wei', () => {
    expect(Browseth.Units.convert('000000000000.5885181770000000', 'wei')).toBe('0x0');
  })

  it('Should be able to output zero in decimal', () => {
    expect(Browseth.Units.convert('0', 'gwei', 'gwei')).toBe('0');
  })
});


// WEB3 NOTES
// const Web3 = new web3('https://mainnet.infura.io/mew');
// console.log(Web3.utils.toWei('123.456123123123123123123', 'ether')); // Throws saying too many decimal places
// console.log(Web3.utils.toWei(123)); // Doesn't allow numbers anymore and asks for strings or BN to avoid precision errors. Same for fromwei
// console.log(Web3.utils.toWei('0x3038')); // Doesn't allow hex numbers
// console.log(Web3.utils.toWei('-123123')); // Accepts negative numbers. If BN, returns a negative BN
// console.log(Web3.utils.fromWei('123123.456456')); // Doesn't allow decimals
// console.log(Web3.utils.fromWei('0x51312')); // fromWei allows hex numbers!
// console.log(Web3.utils.fromWei(new BN('10000000000000000000'))); // Always returns a string, even though the docs says it would return a BN
// console.log(Web3.utils.fromWei(new BN('1231321312312312312312312312388888888888888888878787797898999879'))); // Allows any size! Same for just a string too
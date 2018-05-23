import {BN} from 'bn.js';

export interface Units {
  [key:string]: string;
}

export const units: Units = { // need a better name
  wei:        '1',
  kwei:       '1000',
  ada:        '1000',
  femtoether: '1000',
  mwei:       '1000000',
  babbage:    '1000000',
  picoether:  '1000000',
  gwei:       '1000000000',
  shannon:    '1000000000',
  nanoether:  '1000000000',
  nano:       '1000000000',
  szabo:      '1000000000000',
  microether: '1000000000000',
  micro:      '1000000000000',
  finney:     '1000000000000000',
  milliether: '1000000000000000',
  milli:      '1000000000000000',
  ether:      '1000000000000000000',
  kether:     '1000000000000000000000',
  grand:      '1000000000000000000000',
  einstein:   '1000000000000000000000',
  mether:     '1000000000000000000000000',
  gether:     '1000000000000000000000000000',
  tether:     '1000000000000000000000000000000',
}

export function toWei(amount: number | string | BN, unit: string = 'ether') {
  if (!(unit in units)) {
    throw new Error('Not a valid unit'); // Could also just default to ether instead?
  }
  if (typeof amount === 'number') {
    return toWeiStr(amount.toString(), unit.toLowerCase());
  } else if (typeof amount === 'string') {
    return toWeiStr(amount.toLowerCase(), unit.toLowerCase());
  }
  const num = new BN(amount);
  return num.mul(new BN(units[unit.toLowerCase()]));
  // if (typeof(amount) === 'number' || typeof(amount) === 'string') {
  //   return '0x' + res.toString('hex');
  // }
}

export function fromWei(amount: number | string | BN, unit: string = 'ether') {

}

function toWeiStr(amount: string, unit: string) {
  let left;
  let right = '0';
  if (amount.includes('.')) {
    const arr = amount.split('.');
    left = arr[0];
    right = arr[1];
  } else {
    left = amount;
  };
  if (/(0x)[0-9a-f]+/i.test(left)) {
    const num = new BN(left.replace('0x', ''), 16);
    return '0x' + num.mul(new BN(units[unit])).toString(16);
  } else {
    const numLeft = new BN(left).mul(new BN(units[unit]));
    let numRight;
    if (right.length < units[unit].length) {
      numRight = new BN(right).mul(new BN(units[unit].slice(0, -right.length)));
    } else {
      numRight = new BN(right.slice(0, units[unit].length - 1));
    }
    return '0x' + numLeft.add(numRight).toString(16);
  }
}

// export default {}
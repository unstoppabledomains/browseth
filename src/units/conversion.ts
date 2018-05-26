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


export function etherToWei(amountInEther: string | BN) {
  return convert(amountInEther, 'ether');
}

export function gweiToWei(amountInGwei: string | BN) {
  return convert(amountInGwei, 'gwei');
}

/*
 * Returns wei values as hexidecimal string. Returns all other values as decimal string.
 * Truncates excess decimals if too many decimals are given.
 */
export function convert(amount: string | BN, from: string, to: string = 'wei') {
  const fUnit = getUnit(from.toLowerCase());
  const tUnit = getUnit(to.toLowerCase());
  let amt = '';
  if (typeof amount === 'number') {
    throw new Error(`For {${amount}}, please use a string for numbers to avoid precision issues.`);
  } else if (typeof amount === 'string') {
    amt = amount.toLowerCase();
  } else { // if BN
    amt = amount.toString(10);
  }
  if (/^-/.test(amt)) {
    throw new Error(`{${amt}}: Please use a positive number`);
  }
  if (!(/^(\d*\.\d+)|\d+$/.test(amt))) {
    if (!(/^0x[0-9a-f]+$/i.test(amt))) {
      throw new Error(`'${amount}' is not a valid number or hex`);
    }
  }
  if (amt.includes('0x')) {
    amt = new BN(amt.replace('0x', ''), 16).toString(10);
  }
  return doConversion(amt, fUnit, tUnit, to === 'wei' ? true : false);
}

function doConversion(amount: string, from: string, to: string, toWei: boolean) {
  const arr = amount.split('.');
  const left = arr[0].replace(/^[0]+/, '0');
  let right = arr[1] ? arr[1].replace(/[0]+$/, '') : '';

  if (from === to) {
    if (toWei) { // return wei as whole number in hexidecimal
      return '0x' + new BN(left).toString(16);
    }
    return (left ? left : '0') + (right ? `.${right}` : '');
  } else if (from < to) { // convert to larger unit (smaller number)
    const unitLen = new BN(to).div(new BN(from)).toString(10).length - 1;
    if (left.length > unitLen) {
      const res = left.slice(0, left.length - unitLen);
      right = left.slice(left.length - unitLen) + right;
      return (res ? res : '0') + (right ? '.' + right : '');
    } else {
      let zeroes = '';
      for (let i = 0; i < unitLen - left.length; i++) {
        zeroes += '0';
      }
      return '0' + (right || left ? ('.' + zeroes + left + right) : '');
    }
  } else { // convert to smaller unit (bigger number)
    const unitLen = new BN(from).div(new BN(to)).toString(10).length - 1;
    if (right.length > unitLen) {
      const rightL = right.slice(0, unitLen - right.length);
      right = right.slice(unitLen - right.length);
      if (toWei) {
        return '0x' + new BN(left + rightL).toString(16); // return wei as whole number in hexidecimal
      }
      const res = left + rightL;
      return (res ? res : '0') + (right ? '.' + right : '');
    } else { 
      if (toWei) {
        return '0x' + new BN(left + right).mul(new BN(10).pow(new BN(unitLen - right.length))).toString(16);
      }
      return new BN(left + right).mul(new BN(10).pow(new BN(unitLen - right.length))).toString(10);
    }
  }
}

function getUnit(unit: string) {
  if (!(unit in units)) {
    throw new Error(`'${unit}' is not a valid unit`);
  }
  return units[unit];
}
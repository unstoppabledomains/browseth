import {BN} from 'bn.js';
// import {toBuffer} from 'ethereumjs-util';
import createKeccak = require('keccak');

export function keccak256(message: string | Buffer | DataView) {
  return createKeccak('keccak256')
    .update(message)
    .digest();
}

export function toHex(v: any): any {
  if (v == null) {
    return undefined;
  }
  if (typeof v === 'number') {
    return toHex(new BN(v));
  } else if (typeof v === 'string') {
    return /[g-z]/i.test(v) ? v : '0x' + new BN(v).toString(16);
  } else if (v instanceof BN) {
    return '0x' + v.toString(16);
  } else if (typeof v === 'object' || Array.isArray(v)) {
    const ret = {} as any;
    for (const key in v) {
      if (v.hasOwnProperty(key)) {
        ret[key] = toHex(v[key]);
      }
    }
    return ret;
  }
  return v;
}

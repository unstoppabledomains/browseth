import {TextEncoder} from 'text-encoding-shim';
import {keccak256} from './crypto';
import {Block, ChainId, Data, Quantity, Tag} from './types';

const dataRegex = /^0x(?:[\da-fA-F]{2})*$/;

const addressRegex = /^0x[\da-fA-F]{40}$/;
const addressLowerRegex = /^0x[\da-f]{40}$/;
const addressUpperRegex = /^0x[\dA-F]{40}$/;

const hashRegex = /^0x[\da-fA-F]{64}$/;

const quantityRegex = /^0x[1-9a-fA-F][\da-fA-F]*$/;

const chainIdRegex = /^\d+$/;

const textEncoder = new TextEncoder('utf-8');

export function isValidAddress(v: string) {
  return (
    addressLowerRegex.test(v) || addressUpperRegex.test(v) || v === address(v)
  );
}

export function address(v: Data): string {
  let stringified: string;

  try {
    if (typeof v === 'string' && addressRegex.test(v)) {
      stringified = v;
    } else {
      return address(data(v));
    }
  } catch (e) {
    throw new TypeError(`address '${v}' is invalid`);
  }

  if (stringified.startsWith('0x')) {
    stringified = stringified.substring(2);
  }
  stringified = stringified.toLowerCase();

  return (
    '0x' +
    [...keccak256(stringified).substring(2, 42)]
      .map(
        (bit, i) =>
          parseInt(bit, 16) >= 8
            ? stringified[i].toUpperCase()
            : stringified[i],
      )
      .join('')
  );
}

export function data(v: Data, length = -1): string {
  if (typeof v === 'string') {
    if (dataRegex.test(v)) {
      if (length >= 0 && v.length !== length * 2 + 2) {
        throw new TypeError(`data '${v}' is invalid, bad length`);
      }

      return v;
    }
    return data(textEncoder.encode(v), length);
  } else if (v instanceof ArrayBuffer) {
    if (length >= 0 && v.byteLength !== length) {
      throw new TypeError(`data '${v}' is invalid, bad length`);
    }

    let out = '';
    for (const byte of new Uint8Array(v)) {
      out += byte < 16 ? '0' + byte.toString(16) : byte.toString(16);
    }
    return '0x' + out;
  } else if (ArrayBuffer.isView(v)) {
    return data(
      v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength),
      length,
    );
  }
  const stringified = v.toString();
  if (!dataRegex.test(stringified)) {
    throw new TypeError(`data '${v}' is invalid`);
  }
  if (length >= 0 && stringified.length !== length * 2 + 2) {
    throw new TypeError(`data '${v}' is invalid, bad length`);
  }

  return stringified;
}

export function quantity(v: Quantity): string {
  if (typeof v === 'number') {
    if (Number.isInteger(v) && v > 0) {
      return '0x' + v.toString(16);
    }
    throw new TypeError(`quantity '${v}' is invalid, must be integer`);
  } else if (typeof v === 'string') {
    if (quantityRegex.test(v)) {
      return v;
    }
    throw new TypeError(`quantity '${v}' is invalid`);
  }
  return quantity(v.toString());
}

export function block(v: Block): string {
  if (typeof v === 'number') {
    return '0x' + v.toString(16);
  } else if (typeof v === 'string') {
    if (hashRegex.test(v) || quantityRegex.test(v)) {
      return v;
    }
    throw new TypeError(`block '${v}' is invalid`);
  }
  return block(v.toString());
}

export function tag(v: Tag): string {
  if (
    typeof v === 'string' &&
    (v === 'pending' || v === 'latest' || v === 'earliest')
  ) {
    return v;
  }
  try {
    return quantity(v);
  } catch (e) {
    throw new TypeError(`tag '${v}' is invalid`);
  }
}

export function chainId(v: ChainId): string {
  if (typeof v === 'number') {
    if (Number.isInteger(v) && v > 0) {
      return v.toString();
    }
    throw new TypeError(`chain-id '${v}' is invalid`);
  } else if (typeof v === 'string') {
    if (chainIdRegex.test(v)) {
      return v;
    }
    throw new TypeError(`chain-id '${v}' is invalid`);
  }
  return chainId(v.toString());
}

import createKeccak = require('keccak');

export function keccak256(message: string | Buffer | DataView) {
  return createKeccak('keccak256')
    .update(message)
    .digest();
}

function toBuffer(v: any, quantity: boolean) {
  //
}

function toHex(v: any, quantity: boolean) {
  //
}

function toQuantity() {
  //
}

function toData() {
  //
}

function toTag() {
  //
}

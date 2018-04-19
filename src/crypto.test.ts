import {BN} from 'bn.js';
import {toHex} from './crypto';

it('toHex()', () => {
  expect(
    toHex({
      a: 0x7b,
      b: 0,
      c: 1,
      d: '123',
      e: '0x123',
      f: '0x123v',
      g: {y: new BN(0x7b), x: '0x123v', z: 555},
      h: new BN(0x7),
      i: new BN(0x0),
      j: null,
      k: undefined,
      l: '',
    }),
  ).toEqual({
    a: '0x7b',
    b: '0x0',
    c: '0x1',
    d: '0x313233',
    e: '0x0123',
    f: '0x307831323376',
    g: {x: '0x307831323376', y: '0x7b', z: '0x22b'},
    h: '0x7',
    i: '0x0',
    j: '0x',
    k: '0x',
    l: '0x',
  });
});

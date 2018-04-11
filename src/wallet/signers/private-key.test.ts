import {PrivateKey} from './private-key';

const tests = [
  [
    'drift more phone under range fine door suggest boy repeat easily paper',
    '678fdca9b7edadf1f1fa560de39118f7e5bf6847f6e9a8c6001f227f48d4e0c1bd3bbb24a7a0316244cb7dba6a7c18f54be271690f90591504556e849114b45f',
  ],
  [
    'warfare divide diesel hover breeze congress phone rabbit custom lizard high dash',
    '7ede8658489295b952dda02d70df9baa2a3b577e10f456dae598aba867f48734d79afa9ff4bd241aafe253c1631bb6f1e5a641c1093fb3330b353a8235071885',
  ],
  [
    'trial day photo kidney spend eagle frown senior volcano remain lake govern',
    '5521d29a63a4e2f9c423f76d796eff59937443e9ca41c8a22991ff7acdc5ed005c84e7dd7b73a9a23f62315ddfd5e1aa8707d99d2a1a4e56b54b22aa5f03e156',
    'hello',
  ],
  [
    'agent certain cricket club season net arch sample runway river omit will network fashion bird',
    'd21eb7838d9e73b5c2d7418631ab4139c34f3061d19de70e1c48d9ed8f2a642e46c984e56087e794b35972e65b4fad3cd376c17e063189ef0ce4c768444dd5c4',
  ],
];

describe('mnemonic tests', () => {
  tests.forEach(([input, output, pw]) => {
    test(`${input} => ${output}`, () => {
      expect(
        PrivateKey.fromMnemonic(input.split(' '), pw).privateKey.toString(
          'hex',
        ),
      ).toBe(output);
    });
  });
});

const obj1 = {
  version: 3,
  id: 'b919560d-346b-44d4-92a9-8059c6ee7989',
  address: '82137e3b5a4fd84250bbfbad8c58e65a4460f991',
  Crypto: {
    ciphertext:
      'f599218f7155512595ee5f191ae922f2c61ba6560c1ac283a1162569f3f490ba',
    cipherparams: {iv: '629773b80c288af597383d029ce4a24d'},
    cipher: 'aes-128-ctr',
    kdf: 'scrypt',
    kdfparams: {
      dklen: 32,
      salt: 'a41900b88518ffd14ee04bbac893d705e4231d52580c9bc72f3c277e663892cd',
      n: 8192,
      r: 8,
      p: 1,
    },
    mac: '2dd028de90423af0c47549afa819c52a99bd36df2cbf11ad3b386aec79a203ba',
  },
};

// const pk = PrivateKey.fromV3(obj1, '111111111');
// test('simple test for fromV3()', () => {
//   expect(pk.privateKey.toString('hex')).toBe(
//     'ed0137b4b079d340b28290ec11972cf9c6983e83f04fee2351e3709b464f1b2f',
//   );
// });
test('generate new private key, make a keystore from it with toV3() then compare the private keys with toV3()', async () => {
  const newPk = PrivateKey.fromRandomBytes();
  const keystore = await newPk.toV3('password', {});
  const check = PrivateKey.fromV3(keystore, 'password');
  expect(check.toString()).toBe(newPk.toString());
});

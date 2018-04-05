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
];

describe('mnemonic tests', () => {
  tests.forEach(([input, output]) => {
    test(`${input} => ${output}`, () => {
      expect(
        PrivateKey.fromMnemonic(input.split(' ')).privateKey.toString('hex'),
      ).toBe(output);
    });
  });
});

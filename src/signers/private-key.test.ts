import ETx = require('ethereumjs-tx');
import {ecrecover, publicToAddress, toBuffer} from 'ethereumjs-util';
import {encode as rlpEncode} from 'rlp';
import {keccak256} from '../crypto';
import {PrivateKey} from './private-key';

const fromMnemonicTests = [
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

describe('PrivateKey.fromMnemonic()', () => {
  fromMnemonicTests.forEach(([input, output, pw]) => {
    test(`${input} => ${output}`, () => {
      expect(PrivateKey.fromMnemonic(input.split(' '), pw).toString()).toBe(
        output,
      );
    });
  });
});

const keystores: Array<[string, string]> = [
  [
    '{"version":3,"id":"b919560d-346b-44d4-92a9-8059c6ee7989","address":"82137e3b5a4fd84250bbfbad8c58e65a4460f991","Crypto":{"ciphertext":"f599218f7155512595ee5f191ae922f2c61ba6560c1ac283a1162569f3f490ba","cipherparams":{"iv":"629773b80c288af597383d029ce4a24d"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"a41900b88518ffd14ee04bbac893d705e4231d52580c9bc72f3c277e663892cd","n":8192,"r":8,"p":1},"mac":"2dd028de90423af0c47549afa819c52a99bd36df2cbf11ad3b386aec79a203ba"}}',
    '111111111',
  ],
];

const privateKeys = keystores.map(([json, pwd]) =>
  PrivateKey.fromV3(json, pwd),
);

it('PrivateKey.fromV3()', () => {
  expect(privateKeys[0].toString()).toBe(
    'ed0137b4b079d340b28290ec11972cf9c6983e83f04fee2351e3709b464f1b2f',
  );
});

xit('privateKeyInstance.toV3()', async () => {
  const randomPk = PrivateKey.fromRandomBytes();
  const keystore = await randomPk.toV3('password', {});
  const check = PrivateKey.fromV3(keystore, 'password');
  expect(check.toString()).toBe(randomPk.toString());
});

it('privateKeyInstance.getKeyStoreFileName()', () => {
  const filename = privateKeys[0].getKeyStoreFileName();
  // console.log(filename);
});

const signTransactionTests: Array<[number, any, string]> = [
  [
    0,
    '{"nonce":"0x00","gasPrice":"0x00","gasLimit":"0x01","to":"0x0000000000000000000000000000000000000000","value":"0x00","data":"0x00","chainId":1}',
    '0xf85f8080825208940000000000000000000000000000000000000000800025a042c503937fbab7303775841fb4e97009c9126fca9003120a4eead3f9389502daa0526544c37398c8e1c5a3f199b6f0b793516a9b201f00e049876c56e92185f354',
  ],
  [
    0,
    '{"nonce":"0x00","gasPrice":"0x098bca5a00","gasLimit":"0x5208","to":"0x0000000000000000000000000000000000000000","value":"0x0de0b6b3a7640000","data":"0x00","chainId":1}',
    '0xf86c8085098bca5a00825208940000000000000000000000000000000000000000880de0b6b3a76400000026a029e1c2c1befd81ede509d582d07879f3a196b06a553f106bb0f4b36e4b417ccaa0522b16939f277c135317c08a940a9d801c678c0a83ee004803a3e660dd9c1410',
  ],
  [
    0,
    '{"nonce":"0x05","gasPrice":"0x098bca5a00","gasLimit":"0x5208","to":"0x0000000000000000000000000000000000000000","value":"0x00","data":"0x00123456789012345678","chainId":1}',
    '0xf86e0585098bca5a00825208940000000000000000000000000000000000000000808a0012345678901234567825a06a06e9775cc9016036fff92b2e17ffb4d44429fce4342eae8020a545495192a9a03dc2379b487c2d9f42c57f419ce8dab5da4d5f55fe5f3741c3226e4ba4aa4fa6',
  ],
  [
    0,
    '{"nonce":"0x03","gasPrice":"0x33b9","gasLimit":"0x0145a432","to":"0x000000000000000000000000000000000000dead","value":"0x12327dd14627a1f80000","data":"0x1223","chainId":1}',
    '0xf86d038233b982520894000000000000000000000000000000000000dead8a12327dd14627a1f8000082122326a08c3ec503f0c0718b35236568014c0f8d7e91a3eb471f43104c7957bfd7006e95a0597aad839974ad38087675bd665857218ea6cb3dcd23f54d94ba74a8664ce19c',
  ],
  [
    0,
    '{"nonce":"0x00","gasPrice":"0x00","gasLimit":"0x00","to":"0x0000000000000000000000000000000000000000","value":"0x00","data":"0x00","chainId":0}',
    '0xf85f808082520894000000000000000000000000000000000000000080001ca0f76e5c8c045b0e40882f4ba42bfd53899a7296da2a475b55c8bcf8911e9232e2a054b28f12335b3b5ee1d613069bf4648c7a6f9852614cae83c8ba3ec46bec9786',
  ],
];

describe('privateKeyInstance.signTransaction()', () => {
  signTransactionTests.forEach(([privateKeyIndex, tx, result]) => {
    const pk = privateKeys[privateKeyIndex];
    it(`${pk} + ${tx} => ${result}`, async () => {
      const address = await pk.account();
      const rawTransaction = await pk.signTransaction(JSON.parse(tx));
      const etx = new ETx(Buffer.from(rawTransaction.replace('0x', ''), 'hex'));
      etx.verifySignature();
      expect('0x' + etx.from.toString('hex')).toBe(address);
    });
  });
});

const signMessageTests: Array<[number, string]> = [
  [0, 'hello world'],
  [0, 'bla'],
];

describe('privateKeyInstance.signMessage()', () => {
  signMessageTests.forEach(([privateKeyIndex, msg, result]) => {
    const pk = privateKeys[privateKeyIndex];

    it(`${pk} && ${msg}`, async () => {
      const address = await pk.account();
      const hash = keccak256(
        '\u0019Ethereum Signed Message:\n' + msg.length.toString() + msg,
      );

      const sig = Buffer.from(
        (await pk.signMessage(msg)).replace('0x', ''),
        'hex',
      );

      expect(
        '0x' +
          publicToAddress(
            ecrecover(
              hash,
              sig[64] < 27 ? sig[64] + 27 : sig[64],
              sig.slice(0, 32),
              sig.slice(32, 64),
            ),
          ).toString('hex'),
      ).toBe(address.toLowerCase());
    });
  });
});

import * as ABI from 'ethereumjs-abi';
import * as crypto from 'crypto';
import * as eccrypto from 'eccrypto';
import { encrypt, decrypt } from './oracle-ecies';

test('', async () => {
  const ecPrivateKey = crypto.randomBytes(32);
  const ecPublicKey = eccrypto.getPublic(ecPrivateKey);

  const msg =
    'Message--klsdflaknsdlfknasldknfaasdfnklaskndflaknsdlfkanlsdknflaskdnflaksndlasdknf';

  const data = await encrypt(ecPublicKey, msg);
  //const data2 = await encrypt(ecPublicKey.toString('hex'), msg);

  const plainText = await decrypt(ecPrivateKey, data);

  expect(plainText.toString()).toBe(msg);
});

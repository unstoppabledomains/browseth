---
title: Create a Keystore File
category: Example Scripts
order: 3
---

###### Here's a simple script that prompts the user for a password, then generates a random private key and generates a keystore file.

```javascript
const Browseth = require('browseth');
const fs = require('fs');
const cliInteract = require('cli-interact');

const createKeystore = async () => {
  const pk = Browseth.Signers.PrivateKey.fromRandomBytes();
  console.log('Your private key is:', `0x${pk.toString()}`);

  let pw;
  try { // Prompt user for a password
    pw = cliInteract.question('Enter a new password: ');
  } catch (err) {
    console.error(err);
    return;
  }

  console.log('Please wait a few seconds...');
  // Generate keystore object and filename
  const keystore = await pk.toV3(pw).catch(err => {
    console.error(err);
  });
  const filename = pk.getKeyStoreFileName();

  // Write keystore to file
  fs.writeFile(filename, keystore, err => {
    if (err) {
      console.error(err);
    }
    console.log(`Generated Keystorefile '${filename}'\n`);
  });
};

createKeystore();

```

###### Then go to [MyEtherWallet](https://www.myetherwallet.com/) and try it out!
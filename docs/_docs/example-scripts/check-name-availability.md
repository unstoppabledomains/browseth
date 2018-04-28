---
title: Check ENS Name Availability
category: Example Scripts
order: 2
---

Here's a simple script that prompts the user for an Ethereum domain name and
states whether or not the name is available.

#### Code using Browseth

```javascript
const cliInteract = require('cli-interact');
const Web3 = require('web3'); // Needed for Sha3, will be removed on next update
const {Browseth} = require('browseth'); // Browseth needs to be deconstructed when required
const registrarJSON = require('./registrar.json'); // Ethereum Name Registrar

const beth = new Browseth('https://mainnet.infura.io/your_key');

// Add a contract to our beth instance
beth.addContract('registrar', registrarJSON, {
  address: '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef',
});

const checkNameAvailability = async () => {
  // Prompt user for a name
  try {
    const name = cliInteract.question('What is your name? :');
  } catch (e) {
    console.error(e);
    return;
  }

  // Call the 'state' method on the registrar contract
  const state = await beth.contract.registrar.function
    .state(Web3.utils.sha3(name)) // Browseth sha3 will be available on next update
    .call();

  switch (state.toString(10)) {
    case '0':
      console.log(
        `Name: {${name}} is available and the auction hasn't started`,
      );
      return;
    case '1':
      console.log(
        `Name {${name}} is available and the auction has been started`,
      );
      return;
    case '2':
      console.log(`Name {${name}} is taken and currently owned by someone`);
      return;
    case '3':
      console.log(`Name {${name}} is forbidden`);
      return;
    case '4':
      console.log(
        `Name {${name}} is currently in the ‘reveal’ stage of the auction`,
      );
      return;
    case '5':
      console.log(
        `Name {${name}} is not yet available due to the ‘soft launch’ of names.`,
      );
      return;
    default:
      return;
  }
};

checkNameAvailability();
```

#### Output

```
> node checkNameAvailability.js
  What is your name?: browseth
  Name {browseth} is taken and currently owned by someone
> node checkNameAvailability.js
  What is your name?: qweqweqwe
  Name: {qweqweqwe} is available and the auction hasn't started
```

<hr>

**We've made sure that the Browseth development experience is close to that of
Web3 for developers with Web3 experience. Here is a Web3 equivalent of the same
script from above:**

#### Code using Web3

```javascript
const cliInteract = require('cli-interact');
const Web3 = require('web3');
const registrarJSON = require('./registrar.json');

const web3 = new Web3('https://mainnet.infura.io/your_key');

const registrar = new web3.eth.Contract(
  registrarJSON,
  '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef',
);

const checkNameAvailability = async () => {
  try {
    name = cliInteract.question('What is your name? :');
  } catch (e) {
    console.error(e);
    return;
  }
  const state = await registrar.methods.state(Web3.utils.sha3(name)).call();

  switch (state) {
    case '0':
      console.log(
        `Name: {${name}} is available and the auction hasn't started`,
      );
      return;
    case '1':
      console.log(
        `Name {${name}} is available and the auction has been started`,
      );
      return;
    case '2':
      console.log(`Name {${name}} is taken and currently owned by someone`);
      return;
    case '3':
      console.log(`Name {${name}} is forbidden`);
      return;
    case '4':
      console.log(
        `Name {${name}} is currently in the ‘reveal’ stage of the auction`,
      );
      return;
    case '5':
      console.log(
        `Name {${name}} is not yet available due to the ‘soft launch’ of names.`,
      );
      return;
  }
};

checkNameAvailability();
```

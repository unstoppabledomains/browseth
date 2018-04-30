---
title: Offline Wallets
category: Wallet Interaction
order: 3
---

> **new Browseth.Wallet.Offline(rpc, signer)**

##### Parameters

1.  `rpc`: `object`<br> A remote procedure call client that can make function calls and
    send transactions.<br>

2.  `signer`: `object`<br> A `Signer` object that can sign transactions. See [Signers](insert signers link here).

##### Returns

`Wallet`: A new `Wallet` object.

##### Example

```javascript
// PRIVATE KEY EXAMPLE
const Browseth = require('browseth');

// The built-in rpc is used since nothing is passed into the constructor
const beth = new Browseth();

// generates a new Online Wallet using beth's rpc and stores it in beth's wallet.
beth.wallet = new Browseth.Wallets.Offline(beth.rpc, 'SOME_PRIVATE_KEY');
```

```javascript
// LEDGER EXAMPLE
// Returns a new offline wallet with 
beth.wallet = new Browseth.Wallets.Offline(beth.rpc, new Browseth.Signers.Ledger());
```

---
title: Wallets.Offline
category: Wallets - Wallet Interaction
order: 3
---

## Offline Wallets

> **new Browseth.Wallet.Offline(rpc, signer)**

#### Parameters

1.  `rpc`: `object`<br> A remote procedure call client that can make function calls and
    send transactions.<br>

2.  `signer`: `object`<br> A `Signer` object that can sign transactions. See [Signers]({{site.baseurl}}{%link _docs/signers/signers.md%}).

#### Returns

`Wallet`: A new `Wallet` object.


#### Example (Private Key)

###### See [Private Keys]({{site.baseurl}}{%link _docs/signers/privatekey.md%}).

```javascript
const Browseth = require('browseth');

// The built-in rpc is used since nothing is passed into the constructor
const beth = new Browseth();

// generates a new Online Wallet using beth's rpc and stores it in beth's wallet.
// fromHex is needed to convert a string to PrivateKey object.
beth.wallet = new Browseth.Wallets.Offline(beth.rpc, Browseth.Signers.PrivateKey.fromHex('SOME_PRIVATE_KEY'));
```

#### Example (Ledger)

###### See [Ledgers]({{site.baseurl}}{%link _docs/signers/ledger.md%}).

```javascript
// Returns a new offline wallet with 
beth.wallet = new Browseth.Wallets.Offline(beth.rpc, new Browseth.Signers.Ledger());
```

### Methods

###### See [Wallet methods]({{site.baseurl}}{%link _docs/wallets/wallets.md%}).
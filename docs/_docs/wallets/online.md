---
title: Wallets.Online
category: Wallets - Wallet Interaction
order: 2
---

## Online Wallets

#### [Metamask](https://metamask.io/) allows you to run dApps and store value on encrypted **online** wallets. Interact with Metamask using Browseth!

<!-- **Note:** Metamask is currently the only online wallet Browseth supports as it is the most widely used. -->

> **new Browseth.Wallets.Online(rpc)**

#### Parameters

1.  `rpc`: `object`<br> A remote procedure call object.

_**Note:** Browseth instances have an rpc stored on them which can be used when
generating a new Wallet. See example below._

#### Returns

`Wallet`: A new `Wallet` object.

#### Example

```javascript
const Browseth = require('browseth');

// The built-in rpc is used since nothing is passed into the constructor
const beth = new Browseth();

// generates a new Online Wallet using beth's rpc and stores it in beth's wallet.
beth.wallet = new Browseth.Wallets.Online(beth.rpc);
```

### Methods

See [Wallet methods]({{base.url}}{%link _docs/wallets/wallets.md%}) for all other methods.

> .accounts()

Makes a call to the Ethereum JSON-RPC method `eth_accounts`.

#### Returns

`string[]`: An array of accounts owned by the client.

<hr>
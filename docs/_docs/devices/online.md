---
title: Online Wallets
category: Wallet Interaction
order: 2
---

#### [Metamask](https://metamask.io/) allows you to run dApps and store value on encrypted **online** wallets. Interact with Metamask using Browseth!

<!-- **Note:** Metamask is currently the only online wallet Browseth supports as it is the most widely used. -->

<hr>

> new Browseth.Wallets.Online(rpc)

##### Parameters

1.  `rpc`: `object`<br>

**Note:** Browseth comes with an rpc built in that can be used. See example
below.

##### Returns

`Wallet`: A new Online Wallet object.

##### Example

```
const Browseth = require('browseth');
const beth = new Browseth();
beth.wallet = new Browseth.Wallets.Online(beth.rpc);
// generates a new Online Wallet using beth's rpc and stores it in beth's wallet.
```

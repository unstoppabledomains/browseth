---
title: Browseth.Wallets
category: Wallets - Wallet Interaction
order: 1
---

#### Interact with wallets using Browseth

These packages are for account management, sending transactions, and signing
messages for each wallet (current support and planned support below).

* Support:
  * [ ] Digital BitBox
  * [ ] Generic HD Wallet
  * [x] JSON Keystore V3
  * [ ] KeepKey
  * [x] Ledger
  * [x] No-op (dummy endpoint)
  * [ ] Parity Mnemonic
  * [x] Private Key
  * [ ] Tezor
  * [x] Web3

### Generate a new Wallet object

> new Browseth.Wallets.Online(rpc)<br>or<br>new Browseth.Wallets.Offline(rpc, signer)

#### Parameters

See [Online Wallets]({{ site.baseurl }}{% link _docs/wallets/online.md %}) or [Offline Wallets]({{ site.baseurl }}{% link _docs/wallets/offline.md %})

#### Returns

`Wallet`: Object

<hr>

## Methods

- [Account](#account)
- [Send](#send)
- [Call](#call)
- [Gas](#gas)
- [Sign](#sign)

### Account

> .account()

Makes a call to the Ethereum JSON-RPC method `eth_coinbase`.

#### Returns

`string`: The account address in hexidecimal.

### Send

> .send(options)

Makes a call to the JSON-RPC method `eth_sendTransaction` and sends a transaction to be mined and published to the blockchain. This is used
for modifying data on the blockchain. 

#### Parameters

1. `options`: `object`

```
{ // options
  to: string,
  gas?: number | string,
  gasPrice: number | string,
  value: number | string,
  data?: string,
}
```

* `to?`: Address transaction is being sent to.
* `gasPrice`: The gas price in wei. Can be a number or string representation in
  hexidecimal form.
* `gas?`: (optional) The gas limit. Filled with the result from a call to
  `.gas()` by default. Can be a number or string representation in hexidecimal
  form.
* `data`: (optional) For interacting with smart contracts.
<!-- * `from`: Address is filled with the beth instance wallet address by default.
  Cannot be overwritten. -->
<br>
<br>
_**Note**:_`from` _and_ `nonce` _are filled by default and cannot be overwritten._

##### Returns

`string`: Transaction hash in hexidecimal.

### Call

> .call(options, block?)

Makes a call to the Ethereum JSON-RPC method `eth_call`.

#### Parameters

1. `options`: `object`
2. `block?`: `string`<br>
The address of a specific block, `'earliest'`, `'latest'`, or `'pending'`.

```
{ // options
  to: string,
  gas?: number | string,
  gasPrice: number | string,
  value: number | string,
  data?: string,
}
```

* `to?`: Address transaction is being sent to.
* `gasPrice`: The gas price in wei. Can be a number or string representation in
  hexidecimal form.
* `gas?`: (optional) The gas limit. Filled with the result from a call to
  `.gas()` by default. Can be a number or string representation in hexidecimal
  form.
<!-- * `from`: Address is filled with the beth instance wallet address by default.
  Cannot be overwritten. -->
* `data`: (optional) For interacting with smart contracts. Can be overwritten.
<br><br>
_**Note**:_`from` _and_ `nonce` _are filled by default and cannot be overwritten._

### Gas

> .gas(options, block?)

Makes a call to the Ethereum JSON-RPC method `eth_estimateGas`.

#### Parameters

See parameters for `.call()`.

#### Returns

`string`: The gas limit of the transaction in hexidecimal.

### Sign

> .sign(message)

Makes a call to the Ethereum JSON-RPC method `eth_sign`.

#### Parameters

`message`: `string`<br>
Message to sign.

#### Returns

`string`: Signed message.

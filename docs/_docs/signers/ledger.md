---
title: Signers.Ledger
category: Signers - Signing Transactions
order: 3
---

## Ledger Wallets

###### Browseth implements functionality for the [Ledger Nano S](https://www.ledgerwallet.com/).

> **new Browseth.Signers.Ledger(dPath, defaultIndex?)**

#### Parameters

1. `dPath`: `string` <br>
The derivation path (E.G. `m/44'/60'/0'/`). Constructor throws if dPath isn't valid.
2. `defaultIndex?`: `number`<br>
(Optional) The default account number to use. Defaults to zero.

#### Returns

`Signer`: A new Signer object with Ledger functionality.

#### Example

```javascript
const myLedger = new Browseth.Signers.Ledger();
```

<hr>

## Methods

- [Initialize](#initialize)
- [Account](#account)
- [publicKey](#public-key)
- [signTransaction](#sign-transaction)
- [signMessage](#sign-Message)

### Initialize

> **.initialize()**

(Asynchronous) Initializes a local Ledger. This method is called at the start of all other methods on the Ledger class. Because the Ledger is not very adept at doing more than one task at once, this method prevents other methods from being called while another is being executed.

#### Returns

`Promise<object>`

### Account

> **.account(index?)**

(Asynchronous) Gets the account address at the given index. Throws if the Ledger is not connected and not inside the Ethereum app. Browser support must be enabled in the Ethereum app settings if in the browser and vice versa if not.

#### Parameters

`index?`: `number`<br>
(Optional) Which account address to retrieve. Defaults to zero.

#### Returns

`Promise<string>`: A `Promise` that resolves to a string of the account address.

#### Example

```javascript
const myLedger = new Browseth.Signers.Ledger();
/*
 * Logs the account at the 0th index. Catches and 
 * returns 'undefined' if the Ledger isn't plugged in, 
 * isn't in the ethereum app, or if browser support is 
 * on the wrong setting.
 */
const account = await myLedger.account().catch(err => {
  console.error(err);
});
console.log(account);
```

### Public Key

> **.publicKey(index?)**

(Asynchronous) Gets the public key of the account address at the given index. Throws if the Ledger is not connected and not inside the Ethereum app. Browser support must be enabled in the Ethereum app settings if in the browser and vice versa if not.

#### Parameters

`index?`: `number`<br>
(Optional) Which account address to retrieve the public key from. Defaults to zero.

#### Returns

`Promise<string>`: A `Promise` that resolves to a string of the public key with no preprended `0x`.

#### Example

```javascript
const myLedger = new Browseth.Signers.Ledger();
/*
 * Logs the account at the 0th index. Catches and 
 * returns 'undefined' if the Ledger isn't plugged in, 
 * isn't in the ethereum app, or if browser support is 
 * on the wrong setting.
 */
const pubKey = await myLedger.publicKey().catch(err => {
  console.error(err);
});
console.log(pubKey);
```

### Sign Transaction

> **.signTransaction(obj)**

(Asynchronous) Signs a transaction.

#### Parameters

`obj`: `object`

```javascript
{ // obj
  nonce: string | Buffer | number     // default: '0x'
  gasPrice: string | Buffer | number  // default: '0x1'
  gas: string | Buffer | number       // default: '0x5208'
  to: string | Buffer                 // default: '0x'
  value: string | Buffer | number     // default: '0x'
  data: string | Buffer               // default: '0x'
}
```

#### Returns

`Promise<string>`: A `Promise` that resolves to a `string` representation of the transaction receipt.

### Sign Message

> **.signMessage(msg, index)**

(Asynchronous) Signs a message.

#### Parameters

1. `msg`: `string`<br>
The message.
2. `index`: `number`<br>
Defaults to the default index.

#### Returns

`Promise<string>`: A `Promise` that resolves to a `string` representation of the transaction hash.
---
title: Apis.TransactionListener
category: APIs
order: 2
---

## Transaction Listener

> **new Browseth.Apis.TransactionListener(wallet)**

Listens for mined transaction hashes on the blockchain.

#### Parameters

`wallet`: `object`<br>
A wallet object.

#### Returns

`TransactionListener`: A new `TransactionListener` object.

#### Example

```javascript
const beth = new Browseth();

const transactionListener = new Browseth.Apis.EventListener(beth.wallet);
```

<hr>

## Methods

- [startPolling](#start-polling)
- [stopPolling](#stop-polling)
- [removeAllListeners](#remove-all-listeners)
- [resolveTransaction](#resolve-transaction)

### Start Polling

> **.startPolling(interval?)**

Starts polling for all events stored on the listener.

#### Parameters

1. `interval?`: `number`<br>
(Optional) The polling interval in milliseconds. Defaults to 500 milliseconds.

#### Example

`transactionListener.startPolling();`

### Stop Polling

> **.stopPolling()**

Stops polling if the listener is polling.

#### Example

`transactionListener.stopPolling();`

### Remove All Listeners

> **.removeAllListeners()**

Removes all events being listened for on the current listener.

#### Example

`transactionListener.removeAllListeners();`

### Resolve Transaction

> **.resolveTransaction(transactionHash)**

(Asynchronous) Adds a listener for a specific transaction hash onto the transaction listener.

#### Parameters

`transactionHash`: `string`<br>
The transaction hash to look for.

#### Returns
`Promise`: A `Promise` that resolves to the receipt of the transaction hash.

#### Example

```javascript
// You can start polling without any listeners and add after.
transactionListener.startPolling()

const someTx = // some transaction hash
const receipt = await transactionListener.resolveTransaction(someTx);
console.log(receipt);
```
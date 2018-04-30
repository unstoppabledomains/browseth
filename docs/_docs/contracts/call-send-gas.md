---
title: Function Invocation
category: Contracts
order: 2
---

#### Once a contract has been added to a beth instance you can make calls to methods or send transactions to the block from that contract using:<br><b>call(), send(), gas()</b>

### Jump

- [Call](#call)
- [Send](#send)
- [Gas](#gas)
- [Aliases](#aliases)

### Call

> **.call(options?)**

Calls a method on a contract. This is a read-only operation used for retrieving
data from the blockchain.

##### Parameters

1.  `options?`: `object`<br>

```javascript
{ // options
  to?: string,
}
```

* `to?`: (optional) Address of the contract to call the given function from.
  Uses the contract's address by default. Can be overwritten with another
  address.
* `from`: Address is filled with the beth instance wallet address by default.
  Cannot be overwritten.
* `data`: Filled with the function call's data by default. Cannot be
  overwritten.

##### Example

```javascript
// Calls "functionName" on the "myContract" contract
beth.contract.myContract.function
  .functionName(...fParams)
  .call({to: '0x123...'});
```

### Send

> **.send(options)**

Sends a transaction to be mined and published to the blockchain. This is used
for modifying data on the blockchain.

##### Parameters

1.  `options`: `object`<br>

```javascript
{ // options
  to?: string,
  gasPrice: number | string,
  gas?: number | string,
}
```

* `to?`: (optional) Address of the contract to call the given function from.
  Uses the contract's address by default. Can be overwritten with another
  address.
* `gasPrice`: The gas price in wei. Can be a number or string representation in
  hexidecimal form.
* `gas?`: (optional) The gas limit. Filled with the result from a call to
  `.gas()` by default. Can be a number or string representation in hexidecimal
  form. Can be overwritten.
* `from`: Address is filled with the beth instance wallet address by default.
  Cannot be overwritten.
* `data`: Filled with the function call's data by default. Cannot be
  overwritten.

##### Returns

`string`: The transaction hash of the transaction.

##### Example

```javascript
const tx = beth.contract.someContract.function
  .someFunction(...fParams)
  .send({to: '0x321...', gasPrice: '0x123...'});
console.log(tx);
// Check your transaction hash on Etherscan for more info!
```

### Gas

> **.gas()**

Estimates the gas limit to send the given transaction.<br> _**Note:** This is
automatically called when using_ `.send()`.

##### Returns

`string`: The gas limit of the transaction in hexidecimal.

##### Example

```javascript
// Returns the gas limit to send "myFunction"
beth.contract.contractName.function.myFunction().gas();
```

### Aliases

> **contract**

`c`

> **function**

`f` or `methods`

##### Examples

`beth.c.contractName.f.functionName().call();`<br>
`beth.c.contractName.methods.functionName().send();`

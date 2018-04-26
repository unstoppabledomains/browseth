---
title: Function Invocation
category: Contracts
order: 2
---

#### Once a contract has been added to a beth instance you can make calls to methods or send transactions to the block from that contract using:<br><b>call(), send(), gas()</b>

<hr>

> **.call(options?)**

Calls a method on a contract. This is a read-only operation used for retrieving
data from the blockchain.

##### Parameters

1.  `options?`: `object`<br>

```
{ // options
  to?: string,
  from?: string,
  data?: string,
}
```

Takes an optional object that may contain a `to` or `from` address. The `from`
adress is filled with the contract's address by default.

##### Example

```
beth.contract.myContract.function.functionName(...fParams).call({to: '0x123...'});
// Calls "functionName" on the "myContract" contract
```

<hr>

> **.send(options?)**

Sends a transaction to be mined and published to the blockchain. This is used
for modifying data on the blockchain.

##### Parameters

1.  `options?`: `object`<br>

```
{ // options
  to?: string, can be change
  from?: string, cant
  data?: string,cant
  gasPrice: string,needed
  gas?: string,can be changed takes number, this is gas limit
}
```

Takes an optional object that may contain a `to` or `from` address. The `from`
adress is filled with the contract's address by default. `gasPrice` is required
to be filled in. `gas` is filled by a default call to `.gas()` (see below) to
estimate the cost in units of gas.

##### Returns

`string`: The transaction hash of the transaction.

##### Example

```
const tx = beth.contract.someContract.function.someFunction(...fParams).send({to: '0x321...', gasPrice: '0x123...'});
console.log(tx);
// Check your transaction hash on Etherscan for more info!
```

<hr>

> **.gas()**

Estimates the gas limit to send the given transaction.<br> **Note:** This is
automatically called when using `.send()`.

##### Returns

`string`: The gas price of the transaction in hexidecimal.

##### Example

```
beth.contract.contractName.function.myFunction().gas();
// Returns the gas price to send "myFunction"
```

### Aliases

> **contract**

`c`

> **function**

`f` or `methods`

##### Examples

`beth.c.contractName.f.functionName().call();`<br>
`beth.c.contractName.methods.functionName().send();`

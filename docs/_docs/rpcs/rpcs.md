---
title: Browseth.Rpcs
category: RPCs - Sending Requests
order: 1
---

#### RPC = Remote Procedure Call. These allow users to interact with Ethereum nodes by sending requests. Reference the [Ethereum JSON-RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC#json-rpc-methods) to see a list of all methods.

> **new Browseth.Rpcs.Default(transport, endpoint, timeout, headers?)<br>or<br>new Browseth.Rpcs.Web3(provider)**

Creates a new Rpc client. Required to instantiate a new Browseth instance.

#### Parameters

See [Rpcs.Default]({{base.url}}{%link _docs/rpcs/default.md%}) or [Rpcs.Web3]({{base.url}}{%link _docs/rpcs/web3.md%})

#### Returns

`Rpc`: A new `Rpc` object.

<hr>

## Methods

- [Send](#send)
- [Batch](#batch)
- [Promise Batch](#promise-batch)

### Send 

> **.send(method, ...params)**

(**Asynchronous**) Sends a request up to the blockchain and awaits a response.

#### Parameters

1. `method`: `string`<br>
Which method to be called.
2. `...params`: variadic<br>
The parameters required for the given method.

#### Example

Here we use the rpc on our beth instance to get the balance of someone's account. The JSON-RPC [eth_getBalance](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getbalance) takes 2 parameters: an address, and a block number, 'latest', or 'earliest'. We use that information to fill the rest of our send function.

```javascript
const addr = // Public address of an Ethereum account containing Eth

// Returns the balance of 'addr' in wei in hexidecimal
const myBalance = await beth.rpc.send('eth_getBalance', addr, 'latest');
```

### Batch

> **.batch(done, ...requests)**

(**Asynchronous**) Sends multiple requests up to the block chain as one request and awaits a response, then calls the given callback function `done`.

#### Parameters

1. `done`: `function`<br>
A callback function that is called once a response is received.
2. `...requests`: variadic<br>
Any number of requests as individual parameters containing an array that contains an object with the method and parameters needed for that method, and a callback for that request. Method object uses the same formatting as the Ethereum JSON-RPC.

```javascript
[ // requests
  {
    method: string,
    params: any[],
  },
  (err: Error | void, response: any) => void
]
```

  * `method`: A string of the method to call.
  * `params`: An array containing the parameters required for the method.
  * `(err: Error | void, response: any) => void`: A callback that is called after a response is received which is passed through. If there was an error, an error is passed instead.

#### Example

Here we declare two requests and a callback and pass them into batch(). Because the callbacks don't return anything we assign the responses to their respective variables in the callbacks instead. <br>
Check out this example that maps over an array of addresses [here]({{base.url}}{/browseth}{% link _docs/rpcs/map-example.md %}) as well.

```javascript
const request1 = [
  {
    method: 'eth_getBalance',
    params: [addr1, 'latest'],
  },
  (err, response) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Your balance is', response);
    myBalance = response;
  },
];

const request2 = [
  {
    method: 'eth_getTransactionReceipt',
    params: [addr2],
  },
  (err, response) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Your transaction receipt is', response);
    myTxReceipt = response;
  },
];

const doneCallback = () => {
  console.log("All done!");
}

let myBalance;
let myTxReceipt;

// Sets myBalance and myTxReceipt in the callbacks of each request.
beth.rpc.batch(doneCallback, request1, request2);

```

### Promise Batch

> .promiseBatch(resolveFunction, ...requests)

(**Asynchronous**) Calls `.batch()` and wraps each request in a promise and returns a promise.

#### Parameters

1. `resolveFunction`: `function`<br>
A callback function that will resolve an array of promises. Uses `Promise.all` by default if nothing is passed.

2. `...requests`: variadic<br>
Any number of requests as individual parameters containing an object with the method and parameters needed for that method. Method object uses the same formatting as the Ethereum JSON-RPC.

```javascript
  { // requests
    method: string,
    params: any[],
  }
```

  * `method`: A string of the method to call.
  * `params`: An array containing the parameters required for the method.
 
#### Returns

`any[]`: An array of responses.<br>
_**Note**: This is the return value for the default_ `resolveFunction` _that calls_ `Promise.all`. _Keep in mind in_ `Promise.all`_, if one request rejects, then all of them will reject._

#### Example

```javascript
const addr1 = // Some address
const addr2 = // Another address

const requests = [
  {
    method: 'eth_getBalance',
    params: [addr1, 'latest',],
  }, {
    method: 'eth_getBalance',
    params: [addr2, 'latest',]
  },
];

// Returns an array of eth balances in wei in hexidecimal
const responses = await beth.rpc.promiseBatch(...requests);
```

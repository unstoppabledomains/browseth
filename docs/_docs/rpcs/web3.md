---
title: Rpcs.Web3
category: RPCs - Sending Requests
order: 3
---

> **new Browseth.Rpcs.Web3(provider)**

For when interacting with [Metamask](https://metamask.io/). 

#### Parameters

1. `provider`: `any`<br>
Uses the provider in the constructor to create the `.handle()` method called by `.send()` and `.batch()` for sending requests.

#### Returns

`Rpc`: A new `Rpc` object.

#### Example

```javascript
// Uses the provider provided by the web3 injected by Metamask.
const rpc = new Browseth.Rpcs.Web3(window.web3.currentProvider);
```
---
title: The Browseth Object
category: Browseth
order: 1
---

> **new Browseth(rpc?)**

#### Parameters

1.  `rpc?`: `string` | `Rpc` | `Wallet`<br> (optional) Takes a remote procedure
    call client in the form of a `string` http endpoint, an `Rpc` object, or a `Wallet`
    object and saves it in the instance. If given a `Wallet`,
    the wallet's rpc is used. Uses a built-in rpc as a default if nothing is
    passed in.<br><br> _**Note**: The built-in rpc is non-limiting which means
    anything can be sent with it. Use at your own risk!_

#### Example

Here we use [Infura](https://infura.io/) for our RPC Provider endpoint:

```javascript
const Browseth = require(browseth);

const beth = new Browseth('https://mainnet.infura.io/YOUR_API_KEY');
// We use `beth` as browseth for short.
```

<hr>

#### The `Browseth` object also comes with 4 built in classes:

* [**Rpcs**]({{ site.baseurl }}{% link _docs/rpcs/rpcs.md %})
* [**Signers**]({{ site.baseurl }}{% link _docs/signers/signers.md %})
* [**Wallets**]({{ site.baseurl }}{% link _docs/wallets/wallets.md %})
* [**Apis**]({{ site.baseurl }}{% link _docs/rpcs/rpcs.md %})

<hr>

## Methods
<!-- 
- [addContract](#add-contract)
- [addApi](#add-api) -->

#### Add Contract

> **.addContract(contractName, jsonInterface, options?)**

See [Adding a Contract]({{base.url}}{%link _docs/contracts/add-contract.md%})

```javascript
beth.addContract('contractName', contractName.abi, {
  address: '0x1234567890123456789012345678901234567890',
});)
```

<hr>

#### Add Api

> **.addApi()**


---
title: Adding a Contract
category: Contracts
order: 1
---

#### In order to interact with Ethereum Contracts, you can add a contract to a beth instance using:<br><b>addContract()</b>

<hr>
> **.addContract(contractName, jsonInterface, options?)**

Adds given contract to an array of contracts stored on a beth instance.

#### Parameters

1.  `contractName`: `string`<br> Name of the contract.
2.  `jsonInterface`: `object[] | string`<br> Application Binary Interface (abi)
    as an `object` array or `string`.
3.  `options?`: `{address?, bytecode?}`<br> [Optional] Address/Bytecode of
    contract as a `string`.

#### Example:

```javascript
// Adds the 'contractName` contract to our beth instance
beth.addContract('contractName', contractName.abi, {
  address: '0x1234567890123456789012345678901234567890',
});
```

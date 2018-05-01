---
title: Deploying a Contract
category: Contracts
order: 4
---

> **.deploy(...contractParams)**

Deploys a compiled contract to the Ethereum blockchain. `.send()` is required to
send the deployed contract to the blockchain. `.gas()` is also available to
check the cost of deployment.

#### Parameters

1.  `...contractParams`: variadic<br> Takes the parameters required to construct
    the given contract.

#### Example

```javascript
// contract Simple {
//   function Simple(uint256 arg1, bool arg2) public {}
// }

// Deploys the contract
beth.contract.simpleContract.deploy(5, false).send();

// Estimates the gas limit of the contract
beth.contract.simpleContract.deploy(5, false).gas();
```

---
title: Deploying a Contract
category: Contracts
order: 4
---

> **deploy()**

Deploys a compiled contract to the Ethereum blockchain.

```javascript
b.c.Simple.deploy(5, false).send();

contract Simple {
  function Simple(uint256 arg1, bool arg2) public {}
}
```

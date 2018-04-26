---
title: Events
category: Contracts
order: 3
---

> **.event.eventName(filter).logs(data)**

Searches specified blocks on the blockchain for events of the given contract.

##### Parameters

1.  `data`: `object`<br>

```
{ // data
  fromBlock: string;
  toBlock: string;
  address: string;
}
```

Takes an object where the search range can be specified between the `fromBlock`
and `toBlock`. Both are set to `'latest'` by default. `address` uses the
contract's address by default.

<!-- ##### Returns -->

##### Example

```
beth.contract.myContract.event.MyEvent({
  indexedParam2: ['val', 'asdfas'],
}).logs('0x123...', 'latest' , '0x234...');
```

<!-- do i put event listener stuff here too? -->

<!-- contract Simple { event MyEvent1(uint arg1, bool indexed arg2); }

b.c.Simple.e.MyEvent1().logs()

{ arg1: 12345, arg2: false, [0]: 12345, [1]: false } -->

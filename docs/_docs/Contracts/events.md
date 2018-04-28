---
title: Events
category: Contracts
order: 3
---

> **.event.eventName(filter?).logs(data?)**

Searches through specified blocks on the blockchain for events of the given name
on the given contract. <br> The event name's parameter `filter?` contains an
optional object with indexed parameters and values to search for. If no filter
is given, all events found of the given name will be returned.

##### Parameters

1.  `data?`: `object`<br>

```javascript
{ // data
  fromBlock?: string;
  toBlock?: string;
  address?: string;
}
```

* `fromBlock?`: (optional) Address of block to start searching from. `'latest'`
  by default.
* `toBlock?`: (optional) Address of last block to search to. `'latest'` by
  default.
* `address?`: (optional) Address of contract to search for events from. Uses the
  contract's address by default.

<!-- ##### Returns -->

##### Example

```javascript
/*
 * Searches for all events from the block at address '0x123...' to the
 * 'latest' block of 'myEvent' where its indexed parameter, 'indexedParam'
 * contains the value 'hello' OR 'world'.
 */

const logs = beth.contract.myContract.event
  .MyEvent({
    indexedParam: ['hello', 'world'],
  })
  .logs('0x123...');
```

<!-- do i put event listener stuff here too? -->

<!-- contract Simple { event MyEvent1(uint arg1, bool indexed arg2); }

b.c.Simple.e.MyEvent1().logs()

{ arg1: 12345, arg2: false, [0]: 12345, [1]: false } -->

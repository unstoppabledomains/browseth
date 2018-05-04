---
title: Apis.EventListener
category: APIs
order: 2
---

## Event Listener

> **new Browseth.Apis.EventListener(rpc, jsonInterface, isPolling, startingBlock)**

#### Parameters

- `rpc`: `Rpc`<br>
An `Rpc` object.
- `jsonInterface`: `object`<br>
An abi object.
- `isPolling`: `boolean`<br>
Whether the event listener begins polling on construction or not. Defaults to `false`.
- `startingBlock`: `string`<br>
Which block to start searching from. Can be `earliest`, `latest`, or a hexidecimal block. Defaults to `latest`.

#### Returns

`EventListener`: A new `EventListener` object.

#### Example

```javascript
const beth = new Browseth();
const abi = // some json interface

// 
const eventlistener = new Browseth.Apis.EventListener(beth.rpc, abi, false, '0x536400');
```

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

/*
 * Creates a new event listener that will start polling
 * from block '0x512345' once startPolling() is called.
 */
const eventlistener = new Browseth.Apis.EventListener(beth.rpc, abi, false, '0x512345');
```

<hr>

## Methods

[startPolling](#start-polling)

### Start Polling

> **.startPolling(interval?)**

Starts polling for all events stored on the listener.

#### Parameters

1. `interval?`: `number`<br>
(Optional) The polling interval in milliseconds. Defaults to 500 milliseconds.

#### Example

`eventListener.startPolling();`

### Stop Polling

> **.stopPolling()**

Stops polling if the listener is polling.

#### Example

`eventListener.stopPolling();`

### Remove All Listeners

> **.removeAllListeners()**

Removes all listeners stored on the current listeners



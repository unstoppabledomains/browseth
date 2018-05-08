---
title: Apis.EventListener
category: APIs
order: 3
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

- [startPolling](#start-polling)
- [stopPolling](#stop-polling)
- [removeAllListeners](#remove-all-listeners)
- [addEventListener](#add-event-listener)

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

Removes all events being listened for on the current listener.

#### Example

`eventListener.removeAllListeners();`

### Add Event Listener

> **.addEventListener(address, eventName, topics, cb)**

Adds an event to listen for to the current listener.

#### Parameters

1. `address`: `string`<br>
The address of the contract that contains the event to listen for.

2. `eventName`: `string`<br>
The name of the event on the contract to listen for.

3. `topics`: `any[]`<br>
An array of any topics on the event.

4. `cb`: `(logs?: any) => void`<br>
A callback to call once a listener finds the specified event. The resulting logs will be passed into the callback.

#### Returns

`object`: A subscription to the listener. The subscription object contains one method `.remove()` which removes itself from the event listener.

#### Example

```javascript
// You can start polling without any listeners and add after.
eventListener.startPolling()

const subscription = e.addEventListener(
  '0x123...',   // some contract address
  'someEvent',  // name of event on that contract
  [],           // topics
  logs => {     // callback
      console.log(logs);
  },
);

// Removes subscription even while polling 
subscription.remove();
```

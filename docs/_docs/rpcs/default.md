---
title: Rpcs.Default
category: RPCs - Sending Requests
order: 2
---

> **new Browseth.Rpcs.Default(transport, endpoint, timeout, headers?)**

#### Parameters

1. `transport`: `object`
2. `endpoint`: `string`
3. `timeout`: `number`
4. `headers`: `object`

#### Returns

`Rpc`: A new `Rpc` object.

#### Examples

```javascript
// Uses the `transport` static variable on Browseth for the transport parameter
const rpc = new Browseth.Rpcs.Default(Browseth.transport, 'https://mainnet.infura.io/YOU_API_KEY');
```

<hr>

## Methods

> **.handle(payload, callback)**

Called by `.send()` and `.batch()` to handle requests. Calls the transport's `.handle()`.

#### Parameters

1. `payload`: `object` | `string`<br>
Request as an `object` or `string`. Ultimately stringified.
2. `callback`: `function`<br>
Callback function to be called after handling request.
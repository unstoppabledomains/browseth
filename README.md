# Browseth

A library for interacting with ethereum, well suited for the browser.

## Installation

You can use Browseth in a `<script>` tag from a
[CDN](https://unpkg.com/browseth@^0.1.0/build/browser.js), or as the `browseth`
package on [npm](https://www.npmjs.com/package/browseth).

If you want to use Browseth's specialized distributions or inner workings in one
of your projects look at the [list of packages](./PACKAGES.md).

## Example

```javascript
import Browseth from 'browseth'

const eth = new Browseth()

eth.useOnlineAccount()

const txId = eth.send({
  to: 'random-ens-name.eth',
  value: eth.etherToWei(0.1),
})

// NOTE: txId is not a transaction hash.
// Browseth uses a queueing system to send and brodcast transactions, txId is a uuid that Browseth uses internally.

eth.tx
  .resolve(txId)
  .then(receipt => {
    console.log(receipt)
  })
  .catch(() => {
    console.error('failed to mine transaction')
  })
```

## Contributing

If you want to contribute to Browseth you can create an issue or you can take a
look at our [development guide](./DEVELOPMENT.md).

Feel free to reach out directly to myself braden@buyethdomains.com or the team
contact@buyethdomains.com.

### License

Browseth is [MIT licensed](./LICENSE).

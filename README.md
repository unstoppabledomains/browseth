# BrowsEth

### A library for interacting with ethereum, well suited for the browser.

#### [Introducing Browseth a New Library for Interacting with Ethereum](https://medium.com/buyethdomains/introducing-browseth-a-new-library-for-interacting-with-ethereum-795d18e7b87d)

##### [npm package: 0.0.15](https://www.npmjs.com/package/browseth)

## Installation

#### Node.js

`npm install browseth`

#### Yarn

`yarn add browseth`

## Usage

```
const Browseth = require('browseth')
// or
// import Browseth from 'browseth'

const beth = new Browseth();
```

## Structure

* ### `distributions`

  * The intention is to build a few separate packages, one for the front end and
    one for the back end and potentially a testing package. Currently everything
    is all under `/src/index.ts`

* ### `wallet`

  * These packages are for account managment, sending transactions, and signing
    messages for each wallet (current support and planned support below).
  * Support:
    * [ ] Digital BitBox
    * [ ] Generic HD Wallet
    * [x] JSON Keystore V3
    * [ ] KeepKey
    * [x] Ledger
    * [x] No-op (dummy endpoint)
    * [ ] Parity Mnemonic
    * [x] Private Key
    * [ ] Tezor
    * [x] Web3

* ### `transport`

  * These are the packages that manage the raw IO with the ethereum clients.
  * Support:
    * [x] `Fetch` API
    * [x] Node js `http(s)`
    * [ ] `XMLHttpRequest` API
    * [ ] `Websocket` API

* ### `rpc`

  * This package wraps the transports with a strongly typed API for each of the
    different clients.

  * Support:

    * [ ] [Etherscan](https://etherscan.io/apis)
    * [ ] [Ganache (previously `testrpc`)](https://github.com/trufflesuite/ganache)
    * [x] [Generic](https://github.com/ethereum/wiki/wiki/JSON-RPC)
    * [ ] [Geth](https://github.com/ethereum/go-ethereum/wiki/Management-APIs)
    * [x] [Infura (JSONRPC)](https://infura.io)
    * [x] [Metamask Provider Engine](https://github.com/MetaMask/provider-engine)
    * [ ] [MyEtherAPI](https://www.myetherapi.com)
    * [ ] [Parity](https://wiki.parity.io/JSONRPC)

  * Supported Method Sets:
    * [ ] `admin`
    * [x] `db`
    * [ ] `debug`
    * [x] `eth`
    * [ ] `eth_pubsub`
    * [ ] `evm`
    * [ ] `miner`
    * [x] `net`
    * [ ] `parity`
    * [ ] `parity_accounts`
    * [ ] `parity_set`
    * [ ] `personal`
    * [ ] `pubsub`
    * [ ] `secretstore`
    * [ ] `signer`
    * [x] `shh`
    * [ ] `trace`
    * [ ] `txpool`
    * [x] `web3`

* ### `nodes`

  * These packages expose a standard set of functionality that one might need to
    interact with ethereum.
  * Support is tentatively the same as the rpc nodes.

- ### `apis`

  * These packages are for extending the functionality of ethereum beyond simple
    wrappers for ethereum-jsonrpc calls. The intention is to be inclusive by
    supporting these packages as optinoal plug ins.

  * Supported:
    * [x] ENS .eth Registrar
    * [ ] ENS
    * [ ] Storage (ex: Swarm, Filecoin, Storj, etc.)
    * [ ] Trading Protool (ex: 0x, ForkDelta, etc.)

## Current TODOs

* Make the Node transactions event emiters and build out Contract event
  listening capabilities.
* Support More Wallets:

  * Generic HD Wallet
  * Parity Mnemonic

* Favor code generated config-based (jsonschema?) rpc.
* Phase Out `web3-eth-abi` in favor of code generated abi.
* Phase Out `bignumber.js` in favor of `bn.js` to be more in line with the rest
  of the community.

## Contributing

For now we'd like to just create issues. You're welcome to fork the code and
make pull requests, we are aiming to have a fully featured package built over
the summer and will be actively building and maintaining this library going
forward.

Since this is a developer pre-release shared with close friends, also feel more
than free to reach out directly to myself braden@buyethdomains.com or the team
contact@buyethdomains.com.

Thanks for taking a look :-).

# BrowsEth

## Structure

### BrowsEth has 5 major components:

* `core`
  * This is the interface that BrowsEth exposes.
* `wallets`
  * These packages are for account managment, sending transactions, and signing
    messages.
* `transports`
  * These are the packages that manage messaging with ethereum clients.
* `nodes`
  * These packages are for wrapping the connections with different ethereum
    clients. i.e. geth, infura, parity etc.
  * Nodes have the ability to consume wallets and encompase their account
    related abilaties.
* `apis`
  * These packages are for extending the functionality of ethereum beyond simple
    wrappers for ethereum-jsonrpc calls.

## Folder Structure

```
├ node_modules/
├ packages/
│ └ node_modules/
│   └ @browseth/
│     ├ core/
│     │ ├ lib/**
│     │ ├ index.ts
│     │ └ package.json
│     │
│     └ ...other packages
├ package.json
└ ...other linting config
```

#### `packages/`

This is where all the browseth packages live.

#### `packages/node_modules/`

We are exploiting the node resolution algorithm to avoid using a linking tool
like `lerna`. This project structure allows us to install dependacies at the
workspace level but specify versions per package, resolve local dependacnies –
circumventing the need for `lerna bootstrap`, and directly import typescript
files before module bundling. There are a few caviats to this system:

* It doesn't automate publishing like `lerna` does.
* All packages must be named thier package.json "name" and versioned exactly.
* Every local package resolves the other directly not from the built version.

#### `packages/node_modules/@browseth/...`

Most packages have an `index.ts`, `lib/**`, and `package.json`.

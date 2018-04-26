---
title: Wallets
category: Wallet Interaction
order: 1
---

#### Interact with wallets using Browseth

These packages are for account managment, sending transactions, and signing
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

<hr>

#### Generate a new Wallet object

> new Browseth.Wallets.Online()<br>or<br>new Browseth.Wallets.Offline()

import * as utils from '@browseth/utils'
import * as signerUtils from '@browseth/signer-utils'
import * as units from '@browseth/units'
import { JsonRpcRequestBatchQueue } from '@browseth/jsonrpc-request-queue'
import { Explorer } from '@browseth/explorer'
import { Contract } from '@browseth/contract'
import { AbiCodec } from '@browseth/abi'
import AccountReadonly from '@browseth/account-readonly'
import AccountSigner from '@browseth/account-signer'

export { BrowserClient as default, BrowserClient }

function keccak256(value) {
  if (utils.ab.isBytes(value)) {
    return utils.crypto.keccak256(value)
  } else if (typeof value === 'string') {
    return utils.crypto.keccak256(utils.ab.fromUtf8(value))
  } else {
    throw new TypeError('Value must be bytes or string')
  }
}

function tightlyPackedKeccak256() {
  throw new Error('Not available')
}

class BrowserClient {
  // Keccak

  static keccak256 = keccak256
  static keccak = keccak256
  static sha3 = keccak256
  static sha256 = keccak256

  keccak256 = this.constructor.keccak256
  keccak = this.constructor.keccak256
  sha3 = this.constructor.keccak256
  sha256 = this.constructor.keccak256

  // Keccak with speacial abi packing

  static tightlyPackedKeccak256 = tightlyPackedKeccak256
  static tightlyPackedKeccak = tightlyPackedKeccak256
  static tightlyPackedSha3 = tightlyPackedKeccak256
  static tightlyPackedSha256 = tightlyPackedKeccak256
  static soliditySha3 = tightlyPackedKeccak256

  tightlyPackedKeccak256 = this.constructor.tightlyPackedKeccak256
  tightlyPackedKeccak = this.constructor.tightlyPackedKeccak256
  tightlyPackedSha3 = this.constructor.tightlyPackedKeccak256
  tightlyPackedSha256 = this.constructor.tightlyPackedKeccak256
  soliditySha3 = this.constructor.tightlyPackedKeccak256

  // Unit Conversion

  static convert = units.convert
  static toEther = units.toEther
  static toWei = units.toWei
  static gweiToWei = units.gweiToWei
  static etherToWei = units.etherToWei
  static weiToEther = units.weiToEther

  convert = this.constructor.convert
  toEther = this.constructor.toEther
  toWei = this.constructor.toWei
  gweiToWei = this.constructor.gweiToWei
  etherToWei = this.constructor.etherToWei
  weiToEther = this.constructor.weiToEther

  // Address Utils

  static checksum = utils.address.from
  static isValidAddress = utils.address.isValid

  checksum = this.constructor.checksum
  isValidAddress = this.constructor.isValidAddress

  // Account Recovery

  static recover = signerUtils.recover
  static recoverTransaction = signerUtils.recoverTransaction

  recover = this.constructor.recover
  recoverTransaction = this.constructor.recoverTransaction

  // Rlp Codec

  static rlp = utils.rlp

  rlp = this.constructor.rlp

  // simple serializing utils

  static data = utils.param.toData
  static tag = utils.param.toTag
  static quantity = utils.param.toQuantity

  data = this.constructor.data
  tag = this.constructor.tag
  quantity = this.constructor.quantity

  //

  static abi = (abiJsonInterface, options) =>
    new AbiCodec(abiJsonInterface, options)

  abi = this.constructor.abi

  // Explorer

  fallbackAccount = new AccountReadonly(this)

  find = new Explorer(this)

  // tx = new TransactionQueue(this)

  block = new utils.BlockTracker(this)

  request = (...args) => this.jsonrpc.request(...args)

  constructor(urlOrWeb3, options = {}) {
    this.jsonrpc = new JsonRpcRequestBatchQueue(urlOrWeb3, options)
  }

  accounts = []

  useOnlineAccount = () => {}

  useSignerAccount = signer => {
    const newSignerAccount = new AccountSigner(this, signer)
    const from =
      typeof account === 'string'
        ? this.accounts.findIndex(account => account.id === account)
        : this.accounts.findIndex(account => account === account)

    if (from !== -1) {
      this.accounts.splice(0, 0, this.accounts.splice(from, 1)[0])
      return true
    } else if (this.accounts.length < 1 && typeof account !== 'string') {
      this.accounts.unshift(account)
      return true
    }
    return false
  }

  useReadonlyAccount = () => {}

  addOnlineAccount = () => {}

  addSignerAccount = signer => {
    const newSignerAccount = new AccountSigner(this, signer)
    if (
      accounts.findIndex(account => account.id === newSignerAccount.id) === -1
    )
      this.accounts.push(newSignerAccount)
    return newSignerAccount.id
  }

  addReadonlyAccount = () => {}

  useJsonRpc = () => {}

  addAccount = newAccount => {
    if (accounts.findIndex(account => account.id === newAccount.id) === -1)
      this.accounts.push(newAccount)
    return newAccount.id
  }

  useAccount = account => {
    const from =
      typeof account === 'string'
        ? this.accounts.findIndex(account => account.id === account)
        : this.accounts.findIndex(account => account === account)

    if (from !== -1) {
      this.accounts.splice(0, 0, this.accounts.splice(from, 1)[0])
      return true
    } else if (this.accounts.length < 1 && typeof account !== 'string') {
      this.accounts.unshift(account)
      return true
    }
    return false
  }

  simulate = transaction => this.gas(transaction)
  gas = transaction => {
    if (this.accounts.length > 0) return this.accounts[0].gas(transaction)
    return this.fallbackAccount.gas(transaction)
  }

  vm = (transaction, block) => this.call(transaction, block)
  call = (transaction, block) => {
    if (this.accounts.length > 0)
      return this.accounts[0].call(transaction, block)
    return this.fallbackAccount.call(transaction, block)
  }

  sign = message => {
    if (this.accounts.length > 0) return this.accounts[0].sign(message)
    return Promise.reject(
      new Error('an account is required in order to sign messages'),
    )
  }

  send = params => {
    if (this.accounts.length > 0)
      return this.accounts[0].send({
        ...params,
        UNSAFE_nonce: params.nonce,
        UNSAFE_gasPrice: params.gasPrice,
        UNSAFE_gas: params.gas,
        UNSAFE_gasLimit: params.gasLimit,
        UNSAFE_from: params.from,
        UNSAFE_data: params.data,
        UNSAFE_chainId: params.chainId,
      })
    return Promise.reject(
      new Error('an account is required in order to send transactions'),
    )
  }

  contract = (abiJsonInterface, options) =>
    new Contract(this, abiJsonInterface, options)
}
// const eth = new BrowserClient()

// // claimed
// // fill(.start)
// // fill.success/full
// // fill.gracefulFailure // prolly not any
// // fill.criticalFailure
// // brodcast(.start)
// // brodcast.success/brodcasted
// // brodcast.criticalFailure
// // brodcast.gracefulFailure
// // mined
// // canceled
// // dropped
// // expired
// // criticalFailure

// const txId = eth.transaction()

// eth.tx.enqueue(txId)
// eth.tx.track(txId)
// eth.tx.get(txId)
// eth.tx.cancel(txId)
// eth.tx.drop(txId)
// eth.tx.setPriority(txId, 1)
// eth.tx.get(txId).attempts
// eth.tx.resolveHash(txId, attempt /* ? */)
// eth.tx.resolve(txId, attempt /* ? */)

// const addresses = await eth.addresses()
// eth.accounts[0].address()

// const c = eth.contract([], opts)

// eth.signerAccount(new SignerPrivateKey())
// // eth.privateKeyAccount('0x123456789...')
// eth.onlineAccount('http://localhost:8545')
// eth.readonlyAccount('0x1234...')

// const account = eth.addAccount(new SignerAccount(new SignerPrivateKey()))
// const account = eth.addAccount(
//   new OnlineAccount('http://localhost:8545' || web3),
// )
// const account = eth.addAccount(
//   new ReadonlyAccount('0x0000000000000000000000000000000000000000'),
// )

// eth.useAccount(account || account.id || address)

// const txId = contract.fn.a().send({
//   UNSAFE_nonce,
//   UNSAFE_gasPrice,
//   UNSAFE_gas,
//   UNSAFE_from,
//   UNSAFE_data,
//   UNSAFE_chainId,
//   to, // account || ensname
//   value,
//   expiresAt,
//   ttl,
//   attempts: 1,
//   priority: 100,
// })

// const { on, off, dispose } = eth.tx.track(txId)

// contract.fn.a().abi
// contract.fn.a().gas()
// contract.fn.a().call()

// const { on, off, dispose } = contract.ev.Bla().subscription()

// on(console.log)
// off(console.log)
// dispose()

// const logs = contract.ev.Bla().logs()

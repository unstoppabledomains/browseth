export = BrowserNamespace
export as namespace BrowserNamespace

import { Explorer } from '@browseth/explorer'
import { BufferedJsonRpcRequestQueue } from '@browseth/jsonrpc-request-queue'
import { AbiCodec /* tightlyPackedKeccak256 */ } from '@browseth/abi'
import { Contract } from '@browseth/contract'
import { AccountReadonly } from '@browseth/account-readonly'
import { crypto } from '@browseth/utils'
import units from '@browseth/units'
import signerUtils from '@browseth/signer-utils'

declare namespace BrowserNamespace {
  export { BrowserClient as default, BrowserClient }

  class BrowserClient {
    static keccak256: crypto.keccak256
    static keccak: crypto.keccak256
    static sha3: crypto.keccak256
    static sha256: crypto.keccak256

    keccak256: crypto.keccak256
    keccak: crypto.keccak256
    sha3: crypto.keccak256
    sha256: crypto.keccak256

    static tightlyPackedKeccak256: tightlyPackedKeccak256
    static tightlyPackedKeccak: tightlyPackedKeccak256
    static tightlyPackedSha3: tightlyPackedKeccak256
    static tightlyPackedSha256: tightlyPackedKeccak256
    static soliditySha3: tightlyPackedKeccak256

    tightlyPackedKeccak256: tightlyPackedKeccak256
    tightlyPackedKeccak: tightlyPackedKeccak256
    tightlyPackedSha3: tightlyPackedKeccak256
    tightlyPackedSha256: tightlyPackedKeccak256
    soliditySha3: tightlyPackedKeccak256

    static convert: units.convert
    static toEther: units.toEther
    static toWei: units.toWei
    static gweiToWei: units.gweiToWei
    static etherToWei: units.etherToWei
    static weiToEther: units.weiToEther

    convert: units.convert
    toEther: units.toEther
    toWei: units.toWei
    gweiToWei: units.gweiToWei
    etherToWei: units.etherToWei
    weiToEther: units.weiToEther

    static checksum: utils.address.from
    static isValidAddress: utils.address.isValid

    checksum: utils.address.from
    isValidAddress: utils.address.isValid

    static recover: signerUtils.recover
    static recoverTransaction: signerUtils.recoverTransaction

    recover: signerUtils.recover
    recoverTransaction: signerUtils.recoverTransaction

    static rlp: utils.rlp

    rlp: utils.rlp

    static data: utils.param.toData
    static tag: utils.param.toTag
    static quantity: utils.param.toQuantity

    data: utils.param.toData
    tag: utils.param.toTag
    quantity: utils.param.toQuantity

    jsonrpc: BufferedJsonRpcRequestQueue
    request(...args): Promise<any>
    find: Explorer
    abi(abiJsonInterface: object[]): AbiCodec
    contract(
      abiJsonInterface: object[],
      options: {
        bin: string | ArrayBuffer | ArrayBufferView
        address: string | ArrayBuffer | ArrayBufferView
      },
    ): Contract
    fallbackAccount: AccountReadonly
    keccak256: Utils
  }
}

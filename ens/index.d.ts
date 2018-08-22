export = Ens
export as namespace Ens

import { AbiCodec } from '@browseth/abi'

declare namespace Ens {
  export { EnsLookup as default, EnsLookup }

  class EnsLookup {
    static interfaceIds: { [interface: string]: string }
    static cache: {
      [resolverAddress: string]: { [interfaceId: number]: boolean }
    }
    static nodeCache: { [node: string]: string }
    static resolver: AbiCodec
    static ens: AbiCodec

    interfaceIds: { [interface: string]: string }

    constructor(ethRef)

    text(
      node: string | ArrayBuffer | ArrayBufferView,
      key: string,
    ): Promise<string>

    pubkey(
      node: string | ArrayBuffer | ArrayBufferView,
    ): Promise<{
      x: ArrayBuffer
      y: ArrayBuffer
    }>

    abi(
      node: string | ArrayBuffer | ArrayBufferView,
      contentTypes: number | string,
    ): Promise<{
      data: ArrayBuffer
      contentTypes: string
    }>

    name(node: string | ArrayBuffer | ArrayBufferView): Promise<string>

    content(node: string | ArrayBuffer | ArrayBufferView): Promise<ArrayBuffer>

    multihash(
      node: string | ArrayBuffer | ArrayBufferView,
    ): Promise<ArrayBuffer>

    address(node: string | ArrayBuffer | ArrayBufferView): Promise<ArrayBuffer>

    info(
      node: string | ArrayBuffer | ArrayBufferView,
    ): Promise<{
      pubkey: { x: string; y: string }
      name: string
      content: ArrayBuffer
      multihash: ArrayBuffer
      addr: ArrayBuffer
    }>

    supportsInterface(
      node: string | ArrayBuffer | ArrayBufferView,
      interfaceId: number | string,
    ): Promise<boolean>

    supportsAllInterfaces(
      node: string | ArrayBuffer | ArrayBufferView,
      ids: Array<number | string>,
    ): Promise<boolean[]>

    resolverAddress(
      node: string | ArrayBuffer | ArrayBufferView,
    ): Promise<ArrayBuffer>
  }
}

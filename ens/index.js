// import * as utils from '@browseth/utils'
import { AbiCodec } from '@browseth/abi'
export { EnsLookup as default, EnsLookup }

class EnsLookup {
  static interfaceIds = {
    addr: '0x3b3b57de',
    name: '0x691f3431',
    content: '0xd8389dc5',
    abi: '0x223ab56',
    pubkey: '0xc8690233',
    text: '0x59d1d43c',
    multihash: '0xe89401a1',
  }

  interfaceIds = this.constructor.interfaceIds

  static cache = {}
  static nodeCache = {}

  static resolver = new AbiCodec([
    {
      constant: true,
      inputs: [{ name: 'interfaceID', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'contentTypes', type: 'uint256' },
      ],
      name: 'ABI',
      outputs: [
        { name: 'contentType', type: 'uint256' },
        { name: 'data', type: 'bytes' },
      ],
      payable: false,
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'node', type: 'bytes32' }],
      name: 'content',
      outputs: [{ name: 'ret', type: 'bytes32' }],
      payable: false,
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'node', type: 'bytes32' }],
      name: 'addr',
      outputs: [{ name: 'ret', type: 'address' }],
      payable: false,
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { name: 'node', type: 'bytes32' },
        { name: 'key', type: 'string' },
      ],
      name: 'text',
      outputs: [{ name: 'ret', type: 'string' }],
      payable: false,
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'node', type: 'bytes32' }],
      name: 'name',
      outputs: [{ name: 'ret', type: 'string' }],
      payable: false,
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'node', type: 'bytes32' }],
      name: 'pubkey',
      outputs: [{ name: 'x', type: 'bytes32' }, { name: 'y', type: 'bytes32' }],
      payable: false,
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'node', type: 'bytes32' }],
      name: 'multihash',
      outputs: [{ name: 'multihash', type: 'bytes' }],
      payable: false,
      type: 'function',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'node', type: 'bytes32' },
        { indexed: false, name: 'a', type: 'address' },
      ],
      name: 'AddrChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'node', type: 'bytes32' },
        { indexed: false, name: 'hash', type: 'bytes32' },
      ],
      name: 'ContentChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'node', type: 'bytes32' },
        { indexed: false, name: 'multihash', type: 'bytes' },
      ],
      name: 'MultihashChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'node', type: 'bytes32' },
        { indexed: false, name: 'name', type: 'string' },
      ],
      name: 'NameChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'node', type: 'bytes32' },
        { indexed: true, name: 'contentType', type: 'uint256' },
      ],
      name: 'ABIChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'node', type: 'bytes32' },
        { indexed: false, name: 'x', type: 'bytes32' },
        { indexed: false, name: 'y', type: 'bytes32' },
      ],
      name: 'PubkeyChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'node', type: 'bytes32' },
        { indexed: true, name: 'indexedKey', type: 'string' },
        { indexed: false, name: 'key', type: 'string' },
      ],
      name: 'TextChanged',
      type: 'event',
    },
  ])

  static ens = new AbiCodec([
    {
      constant: true,
      inputs: [{ name: 'node', type: 'bytes32' }],
      name: 'resolver',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      type: 'function',
    },
  ])

  constructor(ethRef) {
    this.ethRef = ethRef
  }

  text = (node, key) =>
    this.supportsInterface(node, this.interfaceIds.text).then(
      isSupported =>
        isSupported
          ? this.resolverAddress(node).then(resolverAddress =>
              this.ethRef
                .request(
                  'eth_call',
                  {
                    data: this.constructor.resolver.fn.text.enc(node, key),
                    to: resolverAddress,
                  },
                  'latest',
                )
                .then(this.constructor.resolver.fn.text.dec),
            )
          : null,
    )

  pubkey = node =>
    this.supportsInterface(node, this.interfaceIds.pubkey).then(
      isSupported =>
        isSupported
          ? this.resolverAddress(node).then(resolverAddress =>
              this.ethRef
                .request(
                  'eth_call',
                  {
                    data: this.constructor.resolver.fn.pubkey.enc(node),
                    to: resolverAddress,
                  },
                  'latest',
                )
                .then(this.constructor.resolver.fn.pubkey.dec),
            )
          : null,
    )

  abi = (node, contentTypes) =>
    this.supportsInterface(node, this.interfaceIds.abi).then(
      isSupported =>
        isSupported
          ? this.resolverAddress(node).then(resolverAddress =>
              this.ethRef
                .request(
                  'eth_call',
                  {
                    data: this.constructor.resolver.fn.ABI.enc({
                      node,
                      contentTypes,
                    }),
                    to: resolverAddress,
                  },
                  'latest',
                )
                .then(this.constructor.resolver.fn.ABI.dec),
            )
          : null,
    )

  name = node =>
    this.supportsInterface(node, this.interfaceIds.name).then(
      isSupported =>
        isSupported
          ? this.resolverAddress(node).then(resolverAddress =>
              this.ethRef
                .request(
                  'eth_call',
                  {
                    data: this.constructor.resolver.fn.name.enc(node),
                    to: resolverAddress,
                  },
                  'latest',
                )
                .then(this.constructor.resolver.fn.name.dec),
            )
          : null,
    )

  content = node =>
    this.supportsInterface(node, this.interfaceIds.content).then(
      isSupported =>
        isSupported
          ? this.resolverAddress(node).then(resolverAddress =>
              this.ethRef
                .request(
                  'eth_call',
                  {
                    data: this.constructor.resolver.fn.content.enc(node),
                    to: resolverAddress,
                  },
                  'latest',
                )
                .then(this.constructor.resolver.fn.content.dec),
            )
          : null,
    )

  multihash = node =>
    this.supportsInterface(node, this.interfaceIds.multihash).then(
      isSupported =>
        isSupported
          ? this.resolverAddress(node).then(resolverAddress =>
              this.ethRef
                .request(
                  'eth_call',
                  {
                    data: this.constructor.resolver.fn.multihash.enc(node),
                    to: resolverAddress,
                  },
                  'latest',
                )
                .then(this.constructor.resolver.fn.multihash.dec),
            )
          : null,
    )

  address = node =>
    this.supportsInterface(node, this.interfaceIds.addr).then(
      isSupported =>
        isSupported
          ? this.resolverAddress(node).then(resolverAddress =>
              this.ethRef
                .request(
                  'eth_call',
                  {
                    data: this.constructor.resolver.fn.addr.enc(node),
                    to: resolverAddress,
                  },
                  'latest',
                )
                .then(this.constructor.resolver.fn.addr.dec),
            )
          : null,
    )

  allABIs = (node, contentType) =>
    this.constructor.resolver.e
      .ABIChanged({
        node,
        contentType,
      })
      .logs('earliest')

  allTexts = (node, key) =>
    this.constructor.resolver.e
      .textChanged({
        node,
        key,
      })
      .logs('earliest')
  info = node =>
    Promise.all([
      this.pubkey(node),
      this.name(node),
      this.content(node),
      this.multihash(node),
      this.address(node),
    ]).then(([pubkey, name, content, multihash, addr]) => ({
      pubkey,
      name,
      content,
      multihash,
      addr,
    }))

  supportsInterface = async (node, interfaceId) => {
    const resolverAddress = await this.resolverAddress(node)

    if (this.constructor.cache[resolverAddress] == null)
      this.constructor.cache[resolverAddress] = {}
    if (interfaceId in this.constructor.cache[resolverAddress]) {
      return this.constructor.cache[resolverAddress][interfaceId]
    } else {
      const isSupported = this.constructor.resolver.fn.supportsInterface.dec(
        await this.ethRef.request(
          'eth_call',
          {
            data: this.constructor.resolver.fn.supportsInterface.enc(
              interfaceId,
            ),
            to: resolverAddress,
          },
          'latest',
        ),
      )

      this.constructor.cache[resolverAddress][interfaceId] = isSupported
      return this.constructor.cache[resolverAddress][interfaceId]
    }
  }

  supportsAllInterfaces = (node, ids) =>
    Promise.all(ids.map(id => this.supportsInterface(node, id)))

  resolverAddress = async node => {
    if (node in this.constructor.nodeCache) {
      return this.constructor.nodeCache[node]
    } else {
      const resolverAddress = this.constructor.ens.fn.resolver.dec(
        await this.ethRef.request(
          'eth_call',
          {
            data: this.constructor.ens.fn.resolver.enc(node),
            to: '0x314159265dD8dbb310642f98f50C066173C1259b',
          },
          'latest',
        ),
      )
      this.constructor.nodeCache[node] = resolverAddress
      return resolverAddress
    }
  }
}

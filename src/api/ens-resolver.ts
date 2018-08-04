import {Contract} from '../contract';
import {Wallet} from '../wallet';

type Data = any; // bytes32

export interface EnsResolver {
  getText(node: Data, key: string): string;
  getPublicKey(node: Data): [Data, Data];
  getAbi(node: Data, contentTypes: number): [number, Data];
  getName(node: Data): string;
  getContent(node: Data): Data;
  getMultihash(node: Data): Data;
  getAddress(node: Data): string;
  getInfo(node: Data): object;
  getAllText(node: Data): object;
  getAllAbis(node: Data): object[];
  supportsInterface(interfaceId: Data): boolean;
  supportsAllInterfaces(ids: number[]): boolean[];
}

class EnsLookup {
  /*
  bytes4 constant INTERFACE_META_ID = 0x01ffc9a7;
   */

  public static interfaceIds = {
    addr: 0x3b3b57de,
    name: 0x691f3431,
    content: 0xd8389dc5,
    abi: 0x223ab56,
    pubkey: 0xc8690233,
    text: 0x59d1d43c,
    multihash: 0xe89401a1,
  };

  public static cache: {
    [address: string]: {
      [interfaceId: number]: boolean;
    };
  } = {};

  public static nodeCache: {
    [node: string]: string;
  } = {};

  public interfaceIds = EnsLookup.interfaceIds;
  private _wallet: Wallet;
  private resolver: Contract;
  private ens: Contract;

  public constructor(wallet: Wallet, resolver?: Contract) {
    this._wallet = wallet;
    this.ens = new Contract(wallet, [
      {
        constant: false,
        inputs: [{name: '_node', type: 'bytes32'}],
        name: 'owner',
        outputs: [{name: '', type: 'address'}],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ]);
    if (resolver) {
      this.resolver = resolver;
    } else {
      this.resolver = new Contract(wallet, [
        {
          constant: true,
          inputs: [{name: 'interfaceID', type: 'bytes4'}],
          name: 'supportsInterface',
          outputs: [{name: '', type: 'bool'}],
          payable: false,
          stateMutability: 'pure',
          type: 'function',
        },
        {
          constant: true,
          inputs: [
            {name: 'node', type: 'bytes32'},
            {name: 'contentTypes', type: 'uint256'},
          ],
          name: 'ABI',
          outputs: [
            {name: 'contentType', type: 'uint256'},
            {name: 'data', type: 'bytes'},
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: true,
          inputs: [{name: 'node', type: 'bytes32'}],
          name: 'content',
          outputs: [{name: '', type: 'bytes32'}],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: true,
          inputs: [{name: 'node', type: 'bytes32'}],
          name: 'addr',
          outputs: [{name: '', type: 'address'}],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: true,
          inputs: [
            {name: 'node', type: 'bytes32'},
            {name: 'key', type: 'string'},
          ],
          name: 'text',
          outputs: [{name: '', type: 'string'}],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: true,
          inputs: [{name: 'node', type: 'bytes32'}],
          name: 'name',
          outputs: [{name: '', type: 'string'}],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: true,
          inputs: [{name: 'node', type: 'bytes32'}],
          name: 'pubkey',
          outputs: [{name: 'x', type: 'bytes32'}, {name: 'y', type: 'bytes32'}],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          constant: true,
          inputs: [{name: 'node', type: 'bytes32'}],
          name: 'multihash',
          outputs: [{name: '', type: 'bytes'}],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [{name: 'ensAddr', type: 'address'}],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          anonymous: false,
          inputs: [
            {indexed: true, name: 'node', type: 'bytes32'},
            {indexed: false, name: 'a', type: 'address'},
          ],
          name: 'AddrChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {indexed: true, name: 'node', type: 'bytes32'},
            {indexed: false, name: 'hash', type: 'bytes32'},
          ],
          name: 'ContentChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {indexed: true, name: 'node', type: 'bytes32'},
            {indexed: false, name: 'name', type: 'string'},
          ],
          name: 'NameChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {indexed: true, name: 'node', type: 'bytes32'},
            {indexed: true, name: 'contentType', type: 'uint256'},
          ],
          name: 'ABIChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {indexed: true, name: 'node', type: 'bytes32'},
            {indexed: false, name: 'x', type: 'bytes32'},
            {indexed: false, name: 'y', type: 'bytes32'},
          ],
          name: 'PubkeyChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {indexed: true, name: 'node', type: 'bytes32'},
            {indexed: false, name: 'indexedKey', type: 'string'},
            {indexed: false, name: 'key', type: 'string'},
          ],
          name: 'TextChanged',
          type: 'event',
        },
        {
          anonymous: false,
          inputs: [
            {indexed: true, name: 'node', type: 'bytes32'},
            {indexed: false, name: 'hash', type: 'bytes'},
          ],
          name: 'MultihashChanged',
          type: 'event',
        },
      ]);
    }
  }

  set wallet(newWallet: Wallet) {
    this._wallet = newWallet;
    this.resolver.wallet = newWallet;
  }

  get wallet() {
    return this._wallet;
  }

  public async getText(node: Data, key: string): Promise<string | undefined> {
    const isSupported = await this.supportsInterface(
      node,
      this.interfaceIds.text,
    );
    if (isSupported) {
      return await this.resolver.f.text(node, key).call();
    } else {
      return;
    }
  }

  public async getPublicKey(node: Data): Promise<[Data, Data] | undefined> {
    const isSupported = await this.supportsInterface(
      node,
      this.interfaceIds.pubkey,
    );
    if (isSupported) {
      return await this.resolver.f.pubkey(node).call();
    } else {
      return;
    }
  }

  public async getAbi(
    node: Data,
    contentTypes: number,
  ): Promise<[number, Data] | undefined> {
    const isSupported = await this.supportsInterface(
      node,
      this.interfaceIds.abi,
    );
    if (isSupported) {
      return await this.resolver.f.ABI(node, contentTypes).call();
    } else {
      return;
    }
  }

  public async getName(node: Data): Promise<string | undefined> {
    const isSupported = await this.supportsInterface(
      node,
      this.interfaceIds.name,
    );
    if (isSupported) {
      return this.resolver.f.name(node).call();
    } else {
      return;
    }
  }

  public async getContent(node: Data): Promise<Data | undefined> {
    const isSupported = await this.supportsInterface(
      node,
      this.interfaceIds.content,
    );
    if (isSupported) {
      return this.resolver.f.content().call();
    } else {
      return;
    }
  }

  public async getMultihash(node: Data): Promise<Data | undefined> {
    const isSupported = await this.supportsInterface(
      node,
      this.interfaceIds.multihash,
    );
    if (isSupported) {
      return await this.resolver.f.multihash(node).call();
    } else {
      return;
    }
  }

  public async getAddress(node: Data): Promise<string | undefined> {
    const isSupported = await this.supportsInterface(
      node,
      this.interfaceIds.multihash,
    );
    if (isSupported) {
      return await this.resolver.f.addr(node).call();
    } else {
      return;
    }
  }

  public getAllABIs(node: Data, contentType?: number) {
    this.resolver.e
      .ABIChanged({
        node,
        contentType,
      })
      .logs('earliest');
  }

  public getAllTexts(node: Data, key?: string) {
    this.resolver.e
      .textChanged({
        node,
        key,
      })
      .logs('earliest');
  }

  public async getInfo(
    node: Data,
  ): Promise<{
    pubkey: [Data, Data] | undefined;
    name: string | undefined;
    content: Data | undefined;
    multihash: Data | undefined;
    addr: string | undefined;
  }> {
    return {
      pubkey: await this.getPublicKey(node),
      name: await this.getName(node),
      content: await this.getContent(node),
      multihash: await this.getMultihash(node),
      addr: await this.getAddress(node),
    };
  }

  public async supportsInterface(
    node: Data,
    interfaceId: Data,
  ): Promise<boolean> {
    const resolverAddress = await this.getResolverAddress(node);

    if (interfaceId in EnsLookup.cache[resolverAddress]) {
      return EnsLookup.cache[resolverAddress][interfaceId];
    } else {
      const isSupported = await this.resolver.f
        .supportsInterface(interfaceId)
        .call();
      EnsLookup.cache[resolverAddress][interfaceId] = isSupported;
      return EnsLookup.cache[resolverAddress][interfaceId];
    }
  }

  public supportsAllInterfaces(node: Data, ids: Data[]): boolean[] {
    const res: boolean[] = [];
    ids.map(async id => {
      res.push(await this.supportsInterface(node, id));
    });
    return res;
  }

  public async getResolverAddress(node: Data): Promise<string> {
    if (node in EnsLookup.nodeCache) {
      return EnsLookup.nodeCache[node];
    } else {
      const resolverAddress = await this.ens.f.resolver(node).call();
      EnsLookup.nodeCache[node] = resolverAddress;
      return EnsLookup.nodeCache[node];
    }
  }
}

export default EnsLookup;

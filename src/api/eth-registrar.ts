import {keccak256} from 'js-sha3';
import {Contract} from '../contract/index';
import {Base} from '../wallet/index';
import * as DeedConfig from './config/deed';
import * as RegistrarConfig from './config/simple-hash-registrar';

export class EthRegistrar {
  private static assertIsValidLabel(label: string) {
    // TODO(bp): punny code support
    if (!/^[\d\w-]{7,}$/.test(label)) {
      throw new TypeError(`label<${label}> is invalid`);
    }
  }

  private deed: Contract;
  private registrar: Contract;
  private client: Base;

  constructor(client: Base, public strict = false) {
    this.client = client;
    this.deed = new Contract(client, DeedConfig.jsonInterface);
    this.registrar = new Contract(client, RegistrarConfig.jsonInterface);
  }

  public async isOwner(label: string) {
    EthRegistrar.assertIsValidLabel(label);

    const shaLabel = keccak256(label);

    const entries = await this.registrar.methods.entries.call(
      {to: RegistrarConfig.address},
      'pending',
      shaLabel,
    );

    if (entries[0] !== '4') {
      return false;
    }

    const deedOwner = await this.deed.methods.owner.call(
      {to: entries[1]},
      'pending',
    );

    return deedOwner === (await this.client.getAccount());
  }

  public async isAuctionAvailable(label: string) {
    EthRegistrar.assertIsValidLabel(label);

    const shaLabel = keccak256(label);

    const labelState = await this.registrar.methods.state.call(
      {
        to: RegistrarConfig.address,
      },
      'pending',
      shaLabel,
    );

    const isOpen =
      labelState === '0' && (this.strict === false || labelState === '1');

    return isOpen;
  }

  public async areAllAuctionsAvailable(labels: string[] = []) {
    labels.forEach(EthRegistrar.assertIsValidLabel);

    for (const isOpen of await Promise.all(
      labels.map(async label => this.isAuctionAvailable(label)),
    )) {
      if (!isOpen) {
        return false;
      }
    }
    return true;
  }

  public async startAuctions(labels: string[] = []) {
    labels.forEach(EthRegistrar.assertIsValidLabel);

    const openLabels = await this.filterOpenAuctions(labels);

    return this.registrar.methods.startAuctions.send(
      {
        to: RegistrarConfig.address,
      },
      openLabels.map(keccak256),
    );
  }

  public async bid(
    label: string,
    chaff: string[] = [],
    value = 10000000000000000,
    salt = new Uint8Array(64),
  ) {
    EthRegistrar.assertIsValidLabel(label);
    chaff.forEach(EthRegistrar.assertIsValidLabel);

    const shaLabel = keccak256(label);

    if (value < 10000000000000000) {
      throw new Error('value must be at least 10000000000000000 wei');
    }

    const labelState = await this.registrar.methods.state.call(
      {
        to: RegistrarConfig.address,
      },
      'pending',
      shaLabel,
    );

    if (labelState !== '0' && labelState !== '1') {
      throw new Error(`'${label}' is unavailable for bidding`);
    }

    const shaBid = await this.registrar.methods.shaBid.call(
      {
        to: RegistrarConfig.address,
      },
      'pending',
      shaLabel,
      await this.client.getAccount(),
      value,
      keccak256(salt),
    );

    if (labelState === '0') {
      const openChaffLabels = await this.filterOpenAuctions(chaff);

      return this.registrar.methods.startAuctionsAndBid.send(
        {
          to: RegistrarConfig.address,
          value,
        },
        openChaffLabels.map(keccak256),
        shaBid,
      );
    }

    return this.registrar.methods.newBid.send(
      {
        to: RegistrarConfig.address,
        value,
      },
      shaBid,
    );
  }

  public async unseal(
    label: string,
    value = 10000000000000000,
    salt = new Uint8Array(64),
  ) {
    EthRegistrar.assertIsValidLabel(label);

    const shaLabel = keccak256(label);

    if (value < 10000000000000000) {
      throw new Error('value must be at least 10000000000000000 wei');
    }

    const labelState = await this.registrar.methods.state.call(
      {to: RegistrarConfig.address},
      'pending',
      shaLabel,
    );

    if (labelState !== '4') {
      throw new Error(`'${label}' is not in 'reveal' phase`);
    }

    return this.registrar.methods.unsealBid.send(
      {to: RegistrarConfig.address},
      shaLabel,
      value,
      keccak256(salt),
    );
  }

  public async finalize(label: string) {
    EthRegistrar.assertIsValidLabel(label);

    const isOwner = await this.isOwner(label);

    if (!isOwner) {
      throw new Error(`you don\'t own '${label}'`);
    }

    const shaLabel = keccak256(label);

    return this.registrar.methods.finalizeAuction.send(
      {to: RegistrarConfig.address},
      shaLabel,
    );
  }

  public async transfer(label: string, newOwner: ArrayBuffer | string) {
    EthRegistrar.assertIsValidLabel(label);

    if (typeof newOwner === 'string') {
      if (!/^0x[\da-fA-F]$/.test(newOwner)) {
        throw new TypeError(`newOwner<${newOwner}> is invalid`);
      }
    } else if (newOwner.byteLength !== 20) {
      throw new TypeError(`newOwner<${newOwner}> is invalid`);
    }

    const isOwner = await this.isOwner(label);

    if (!isOwner) {
      throw new Error(`you don\'t own '${label}'`);
    }

    const shaLabel = keccak256(label);

    return this.registrar.methods.finalizeAuction.send(
      {to: RegistrarConfig.address},
      shaLabel,
      newOwner,
    );
  }

  public async releaseDeed(label: string) {
    EthRegistrar.assertIsValidLabel(label);

    const isOwner = await this.isOwner(label);

    if (!isOwner) {
      throw new Error(
        `you must be the owner of '${label}' to release the deed`,
      );
    }

    const shaLabel = keccak256(label);

    const entries = await this.registrar.methods.entries.call(
      {to: RegistrarConfig.address},
      'pending',
      shaLabel,
    );

    if (
      parseInt(entries[2], 10) <
      Math.round(new Date().valueOf() / 1000) + 60 * 60 * 24 * 365
    ) {
      throw new Error(
        `${label} can only be released one year after the registration date. wait until ${new Date(
          parseInt(entries[2], 10) * 1000,
        ).toUTCString()}`,
      );
    }

    return this.registrar.methods.releaseDeed.send(
      {to: RegistrarConfig.address},
      shaLabel,
    );
  }

  private async filterOpenAuctions(labels: string[] = []) {
    const openLabels: string[] = [];

    if (this.strict) {
      const areAllOpen = await this.areAllAuctionsAvailable(labels);

      if (areAllOpen) {
        openLabels.push(...labels);
      } else {
        throw new Error('all labels must be available in strict mode');
      }
    } else {
      await Promise.all(
        labels.map(async label => {
          const isOpen = await this.isAuctionAvailable(label);

          if (isOpen) {
            openLabels.push(label);
          }
        }),
      );
    }

    return openLabels;
  }
}

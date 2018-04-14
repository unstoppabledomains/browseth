import {BN} from 'bn.js';
import {keccak_256} from 'js-sha3';
import {Contract} from '../contract';
import {Wallet} from '../wallet';

export class EthRegistrar {
  private static assertIsValidLabel(label: string) {
    // TODO(bp): punny code support
    if (!/^[\d\w-]{7,}$/.test(label)) {
      throw new TypeError(`label<${label}> is invalid`);
    }
  }

  private deed: Contract;
  private registrar: Contract;
  private _wallet: Wallet;

  constructor(wallet: Wallet, public strict = false) {
    this._wallet = wallet;
    this.deed = new Contract(
      wallet,
      JSON.parse(
        '[{"constant":true,"inputs":[],"name":"creationDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"destroyDeed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"registrar","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"previousOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"},{"name":"throwOnFailure","type":"bool"}],"name":"setBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"refundRatio","type":"uint256"}],"name":"closeDeed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newRegistrar","type":"address"}],"name":"setRegistrar","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"DeedClosed","type":"event"}]',
      ),
    );
    this.registrar = new Contract(
      wallet,
      JSON.parse(
        '[{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"releaseDeed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getAllowedTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"unhashedName","type":"string"}],"name":"invalidateName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"},{"name":"owner","type":"address"},{"name":"value","type":"uint256"},{"name":"salt","type":"bytes32"}],"name":"shaBid","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"bidder","type":"address"},{"name":"seal","type":"bytes32"}],"name":"cancelBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"entries","outputs":[{"name":"","type":"uint8"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_salt","type":"bytes32"}],"name":"unsealBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"transferRegistrars","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"sealedBids","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"newOwner","type":"address"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_timestamp","type":"uint256"}],"name":"isAllowed","outputs":[{"name":"allowed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"finalizeAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"registryStarted","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"launchLength","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sealedBid","type":"bytes32"}],"name":"newBid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"labels","type":"bytes32[]"}],"name":"eraseNode","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hashes","type":"bytes32[]"}],"name":"startAuctions","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"deed","type":"address"},{"name":"registrationDate","type":"uint256"}],"name":"acceptRegistrarTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"startAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rootNode","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"hashes","type":"bytes32[]"},{"name":"sealedBid","type":"bytes32"}],"name":"startAuctionsAndBid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"_ens","type":"address"},{"name":"_rootNode","type":"bytes32"},{"name":"_startDate","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"AuctionStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"bidder","type":"address"},{"indexed":false,"name":"deposit","type":"uint256"}],"name":"NewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"status","type":"uint8"}],"name":"BidRevealed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"HashRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"HashReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"name","type":"string"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"HashInvalidated","type":"event"}]',
      ),
      {
        address: '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef',
      },
    );
  }

  set wallet(newWallet: Wallet) {
    this._wallet = newWallet;
    this.registrar.wallet = newWallet;
    this.deed.wallet = newWallet;
  }

  get wallet() {
    return this._wallet;
  }

  public async isOwner(label: string) {
    EthRegistrar.assertIsValidLabel(label);

    const shaLabel = keccak_256(label);

    const entries = await this.registrar.function.entries(shaLabel).call();

    if (entries[0].toNumber() !== 4) {
      return false;
    }

    const deedOwner = await this.deed.function.owner().call({to: entries[1]});

    return deedOwner === (await this.wallet.account());
  }

  public async isAuctionAvailable(label: string) {
    EthRegistrar.assertIsValidLabel(label);

    const shaLabel = keccak_256(label);

    const labelState = await this.registrar.function.state(shaLabel).call();

    const isOpen =
      labelState === 0 && (this.strict === false || labelState === 1);

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

    return this.registrar.function
      .startAuctions(openLabels.map(keccak_256))
      .send();
  }

  public async bid(
    label: string,
    chaff: string[] = [],
    value = 10000000000000000,
    salt = '',
  ) {
    EthRegistrar.assertIsValidLabel(label);
    chaff.forEach(EthRegistrar.assertIsValidLabel);

    const shaLabel = keccak_256(label);

    if (value < 10000000000000000) {
      throw new Error('value must be at least 10000000000000000 wei');
    }

    const labelState = (await this.registrar.function
      .state(shaLabel)
      .call()).toNumber();

    if (labelState !== 0 && labelState !== 1) {
      throw new Error(`'${label}' is unavailable for bidding`);
    }

    const shaBid = await this.registrar.function
      .shaBid(shaLabel, await this.wallet.account(), value, keccak_256(salt))
      .call();

    if (labelState === 0) {
      const openChaffLabels = await this.filterOpenAuctions(chaff);

      return this.registrar.function
        .startAuctionsAndBid(openChaffLabels.map(keccak_256), shaBid)
        .send({value});
    }

    return this.registrar.function.newBid(shaBid).send({value});
  }

  public async unseal(label: string, value = 10000000000000000, salt = '') {
    EthRegistrar.assertIsValidLabel(label);

    const shaLabel = keccak_256(label);

    if (value < 10000000000000000) {
      throw new Error('value must be at least 10000000000000000 wei');
    }

    const labelState = (await this.registrar.function
      .state(shaLabel)
      .call()).toNumber();

    if (labelState !== 4) {
      throw new Error(`'${label}' is not in 'reveal' phase`);
    }

    return this.registrar.function
      .unsealBid(shaLabel, value, keccak_256(salt))
      .send();
  }

  public async finalize(label: string) {
    EthRegistrar.assertIsValidLabel(label);

    const isOwner = await this.isOwner(label);

    if (!isOwner) {
      throw new Error(`you don\'t own '${label}'`);
    }

    const shaLabel = keccak_256(label);

    return this.registrar.function.finalizeAuction(shaLabel).send();
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

    const shaLabel = keccak_256(label);

    return this.registrar.function.finalizeAuction(shaLabel, newOwner).send();
  }

  public async releaseDeed(label: string) {
    EthRegistrar.assertIsValidLabel(label);

    const isOwner = await this.isOwner(label);

    if (!isOwner) {
      throw new Error(
        `you must be the owner of '${label}' to release the deed`,
      );
    }

    const shaLabel = keccak_256(label);

    const entries = await this.registrar.function.entries(shaLabel).call();

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

    return this.registrar.function.releaseDeed(shaLabel).send();
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

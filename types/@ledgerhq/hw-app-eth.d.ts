declare module '@ledgerhq/hw-app-eth' {
  import Transport from '@ledgerhq/hw-transport';

  export default class Eth {
    transport: Transport;

    constructor(transport: Transport);

    getAddress(
      path: string,
      boolDisplay?: boolean,
      boolChaincode?: boolean,
    ): Promise<{publicKey: string; address: string; chainCode?: string}>;

    signTransaction(
      path: string,
      rawTxHex: string,
    ): Promise<{s: string; v: string; r: string}>;

    getAppConfiguration(): Promise<{
      arbitraryDataEnabled: number;

      version: string;
    }>;

    signPersonalMessage(
      path: string,
      messageHex: string,
    ): Promise<{v: number; s: string; r: string}>;
  }
}

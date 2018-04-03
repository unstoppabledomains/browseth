declare module '@ledgerhq/hw-transport-node-hid' {
  import {HID} from 'node-hid';
  import Transport, {
    TransportError,
    Observer,
    DescriptorEvent,
    Subscription,
  } from '@ledgerhq/hw-transport';

  export default class TransportNodeHid extends Transport {
    static list(): Promise<string[]>;

    static listen(observer: Observer<DescriptorEvent<string>>): Subscription;

    static open(path: string): Promise<TransportNodeHid>;

    device: HID;

    ledgerTransport: boolean;

    timeout: number;

    debug: boolean;

    exchangeStack: any[];

    constructor(
      device: HID,
      ledgerTransport: boolean,
      timeout: number,
      debug: boolean,
    );
  }
}

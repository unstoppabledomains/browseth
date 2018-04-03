declare module '@ledgerhq/hw-transport' {
  export type Subscription = {unsubscribe(): void};

  export type Device = Object;

  export interface DescriptorEvent<T = any> {
    type: 'add' | 'remove';

    descriptor: T;

    device?: Device;
  }

  export type Observer<Ev> = Readonly<{
    next(event: Ev): any;

    error(e: any): any;

    complete(): any;
  }>;

  export const StatusCodes: {[k: string]: number};

  export function getAltStatusMessage(code: number): string | undefined;

  export interface TransportError extends Error {
    name: 'TransportError';

    message: string;

    id: string;

    (message: string, id: string): void;
  }

  export interface TransportStatusError extends Error {
    name: 'TransportStatusError';

    message: string;

    statusCode: number;

    statusText: string;

    (statusCode: number): void;
  }

  export default class Transport {
    static ErrorMessage_ListenTimeout: 'No Ledger device found (timeout)';

    static ErrorMessage_NoDeviceFound: 'No Ledger device found';

    static isSupported(): Promise<boolean>;

    static list(): Promise<any[]>;

    static listen(observer: Observer<DescriptorEvent>): Subscription;

    static open(descriptor: any, timeout?: number): Promise<Transport>;

    static create(
      openTimeout?: number,
      listenTimeout?: number,
    ): Promise<Transport>;

    debug: boolean;

    exchangeTimeout: number;

    exchange(apdu: Buffer): Promise<Buffer>;

    setScrambleKey(key: string): void;

    close(): Promise<void>;

    on(eventName: string, cb: Function): void;

    off(eventName: string, cb: Function): void;

    emit(event: string, ...args: any[]): void;

    setDebugMode(debug: boolean): void;

    setExchangeTimeout(exchangeTimeout: number): void;

    send(
      cla: number,
      ins: number,
      p1: number,
      p2: number,
      data: Buffer,
      statusList: Array<number>,
    ): Promise<Buffer>;

    decorateAppAPIMethods(
      self: Object,
      methods: Array<string>,
      scrambleKey: string,
    ): void;

    decorateAppAPIMethod<R>(
      methodName: string,
      f: (...args: any[]) => Promise<R>,
      ctx: any,
      scrambleKey: string,
    ): (...args: any[]) => Promise<R>;
  }
}

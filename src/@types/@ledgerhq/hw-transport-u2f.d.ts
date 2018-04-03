declare module '@ledgerhq/hw-transport-u2f' {
  import Transport, {TransportError} from '@ledgerhq/hw-transport';

  export default class TransportU2F extends Transport {
    static list(): Promise<[null] | never[]>;
  }
}

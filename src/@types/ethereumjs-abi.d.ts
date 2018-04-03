declare module 'ethereumjs-abi' {
  import BN = require('bn.js');

  type Value = string | BN | boolean | Array<string | BN | boolean>;

  const ABI: {
    eventID(name: string, types: string[]): Buffer;

    methodID(name: string, types: string[]): Buffer;

    rawEncode(types: string[], values: Value[]): Buffer;

    rawDecode(types: string[], data: Buffer): Value[];

    simpleEncode(method: string, ...args: string[]): Buffer;

    simpleDecode(method: string, data: string): Value[];

    stringify(types: string[], values: Value[]): string;

    solidityPack(types: string[], values: Value[]): Buffer;

    soliditySHA3(types: string[], values: Value[]): Buffer;

    soliditySHA256(types: string[], values: Value[]): Buffer;

    solidityRIPEMD160(types: string[], values: Value[]): Buffer;

    fromSerpent(sig: string): string[];

    toSerpent(types: string[]): string;

    (): void;
  };

  export = ABI;
}

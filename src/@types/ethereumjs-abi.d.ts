declare module 'ethereumjs-abi' {
  import {BN} from 'bn.js';

  type Value = string | BN | boolean | Array<string | BN | boolean>;

  export function eventID(name: string, types: string[]): Buffer;

  export function methodID(name: string, types: string[]): Buffer;

  export function rawEncode(types: string[], values: Value[]): Buffer;

  export function rawDecode(types: string[], data: Buffer): Value[];

  export function simpleEncode(method: string, ...args: string[]): Buffer;

  export function simpleDecode(method: string, data: string): Value[];

  export function stringify(types: string[], values: Value[]): string;

  export function solidityPack(types: string[], values: Value[]): Buffer;

  export function soliditySHA3(types: string[], values: Value[]): Buffer;

  export function soliditySHA256(types: string[], values: Value[]): Buffer;

  export function solidityRIPEMD160(types: string[], values: Value[]): Buffer;

  export function fromSerpent(sig: string): string[];

  export function toSerpent(types: string[]): string;
}

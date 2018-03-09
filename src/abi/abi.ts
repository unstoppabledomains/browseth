import {
  JsonInterface,
  FunctionElement,
  EventElement,
  ConstructorElement,
} from './types';
import * as web3EthABI from 'web3-eth-abi';

export interface AbiFunction extends FunctionElement {
  sig: string;
  enc: (...params: any[]) => string;
  dec: (raw: string) => any;
}

export interface AbiContstructor extends ConstructorElement {
  enc: (...params: any[]) => string;
}

export interface AbiEvent extends EventElement {
  sig: string;
  enc: (...params: any[]) => string;
  dec: (raw: string) => any;
}

export class Abi {
  public f: AbiFunction[] = [];

  constructor(ji: JsonInterface) {
    ji.forEach(v => {
      if (v.type === 'function') {
        const method: AbiFunction = {
          ...v,
          sig: web3EthABI.encodeFunctionSignature(v).replace('0x', ''),
          enc: (params: any[]) => {
            return web3EthABI.encodeFunctionCall(v, [
              '0x' + params[0],
            ]) as string;
          },
          dec: (raw: ArrayBuffer | string) => {
            if (raw instanceof ArrayBuffer) {
              return web3EthABI.decodeParameters(
                v.outputs!,
                /* 'TextDecoder' in window
                  ? new TextDecoder('utf8').decode(new DataView(raw)) // this is better maybe polyfill if really buggy
                  : */ String.fromCharCode.apply(
                  null,
                  new Uint8Array(raw),
                ),
              );
            }
            const results = web3EthABI.decodeParameters(v.outputs!, raw);

            if (results.__length__ === 1) {
              return results[0];
            } else {
              delete results.__length__;
              const newArray = [];
              for (const i of Object.keys(results)) {
                const idx = parseInt(i, 10);
                newArray[idx] = results[idx];
              }
              return newArray;
            }
          },
        };

        this.f.push(method);
      }
    });
  }
}

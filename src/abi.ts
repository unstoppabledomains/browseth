import Abi = require('ethereumjs-abi');

export interface Param {
  name: string;
  type: string;
}

export interface FallbackElement {
  type: 'fallback';
  payable?: boolean;
  stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
  constant?: boolean;
}

export interface ConstructorElement {
  type: 'constructor';
  inputs: Param[];
  payable?: boolean;
  stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
  constant?: boolean;
}

export interface FunctionElement {
  type: 'function';
  name: string;
  inputs: Param[];
  outputs: Param[];
  payable?: boolean;
  stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
  constant?: boolean;
}

export type MethodElement =
  | FunctionElement
  | ConstructorElement
  | FallbackElement;

export interface EventParam extends Param {
  indexed: boolean;
}

export interface EventElement {
  type: 'event';
  name: string;
  inputs: EventParam[];
  anonymous: boolean;
}

export type JsonInterface = Array<MethodElement | EventElement>;

export interface AbiCodec {
  constructor: ConstructorElement & {
    encode?(bytecode: string, ...params: any[]): string;
  };
  event: {
    [k: string]: EventElement & {
      signiture: string;
      encode(topics: {[k: string]: any}): string;
      decode(raw: string): any;
    };
  };
  function: {
    [k: string]: FunctionElement & {
      signiture: string;
      encode(...params: any[]): string;
      decode(raw: string): any;
    };
  };
}

export function createAbiCodec(jsonInterface: JsonInterface): AbiCodec {
  const abi: any = {
    constructor: {},
    event: {},
    function: {},
  };

  jsonInterface.forEach(element => {
    switch (element.type) {
      case 'constructor': {
        const types = element.inputs.map(i => i.type);

        abi.constructor = {
          ...element,
          encode(bytecode: string, ...params: any[]) {
            return (
              '0x' + bytecode + Abi.rawEncode(types, params).toString('hex')
            );
          },
        };
        break;
      }
      case 'event': {
        const types = element.inputs.map(i => i.type);
        const signiture = Abi.eventID(element.name, types).toString('hex');

        const codec = {
          ...element,
          signiture,
          encode(topics: {[k: string]: any}) {
            const encodedTopics = [] as any[];

            if (!element.anonymous) {
              encodedTopics.push('0x' + signiture);
            }

            element.inputs.forEach(i => {
              if (i.indexed && topics[i.name]) {
                if (Array.isArray(topics[i.name])) {
                  const encodedTopicArray: string[] = [];

                  topics[i.name].forEach(t => {
                    const ete = Abi.rawEncode([i.type], t).toString('hex');

                    encodedTopicArray.push(
                      '0x' +
                        (ete.length > 32
                          ? Abi.soliditySHA3([i.type], topics[i.name]).toString(
                              'hex',
                            )
                          : ete),
                    );
                  });

                  encodedTopics.push(encodedTopicArray);
                  return;
                }

                const encodedTopic = Abi.rawEncode(
                  [i.type],
                  topics[i.name],
                ).toString('hex');

                encodedTopics.push(
                  '0x' +
                    (encodedTopic.length > 32
                      ? Abi.soliditySHA3([i.type], topics[i.name])
                      : encodedTopic),
                );
              }
            });

            return encodedTopics;
          },
          decode(raw: string) {
            console.log(raw);

            return Abi.rawDecode(
              types,
              Buffer.from(raw.replace('0x', ''), 'hex'),
            );
          },
        };

        abi.event[element.name] = codec;
        abi.event[signiture] = codec;
        break;
      }
      case 'function': {
        const iTypes = element.inputs.map(i => i.type);
        const oTypes = element.outputs.map(i => i.type);
        const signiture = Abi.methodID(element.name, iTypes).toString('hex');

        const codec = {
          ...element,
          signiture,
          encode(...params: any[]) {
            return (
              '0x' + signiture + Abi.rawEncode(iTypes, params).toString('hex')
            );
          },
          decode(raw: string) {
            return Abi.rawDecode(
              oTypes,
              Buffer.from(raw.replace('0x', ''), 'hex'),
            ).map((v, i) => (oTypes[i] === 'address' ? '0x' + v : v));
          },
        };

        abi.function[element.name] = codec;
        abi.function[signiture] = codec;
        break;
      }
    }
  });

  return abi;
}

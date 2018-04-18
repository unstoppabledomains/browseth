import * as Abi from 'ethereumjs-abi';

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
      decode(raw: string[]): any;
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
              // console.log(i.indexed, topics[i.name]);
              if (i.indexed && topics[i.name]) {
                /*
                  if (Array.isArray(topics[i.name])) {
                    const encodedTopicArray: string[] = [];

                    topics[i.name].forEach((t: any) => {
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
                */
                // console.log([i.type], [topics[i.name]]);
                const encodedTopic = Abi.rawEncode(
                  [i.type],
                  [topics[i.name]],
                ).toString('hex');
                // console.log(encodedTopic);
                encodedTopics.push(
                  '0x' +
                    (encodedTopic.length > 64
                      ? Abi.soliditySHA3([i.type], [topics[i.name]])
                      : encodedTopic),
                );
                // encodedTopics.push(topics[i.name]);
              }
            });

            return encodedTopics;
          },
          decode(log: any) {
            // console.log(log);
            if (!element.anonymous) {
              log.topics.shift();
            }

            const unIndexedInputs = element.inputs.filter(i => !i.indexed);
            // console.log(
            //   unIndexedInputs.map(i => i.type),
            //   Buffer.from(log.data.replace('0x', ''), 'hex'),
            // );
            const raw = Abi.rawDecode(
              unIndexedInputs.map(i => i.type),
              Buffer.from(log.data.replace('0x', '')),
            );

            return {
              ...element.inputs.filter(i => i.indexed).reduce(
                (a, v, i) => ({
                  ...a,
                  // [i]: raw[i],
                  [v.name]: log.topics[i],
                }),
                {},
              ),
              ...unIndexedInputs.reduce(
                (a, v, i) => ({
                  ...a,
                  // [i]: raw[i],
                  [v.name]: raw[i],
                }),
                {},
              ),
            };
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
            const decoded = Abi.rawDecode(
              oTypes,
              Buffer.from(raw.replace('0x', ''), 'hex'),
            ).map(
              (v: any, i: number) => (oTypes[i] === 'address' ? '0x' + v : v),
            );

            return decoded.length === 1 ? decoded[0] : decoded;
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

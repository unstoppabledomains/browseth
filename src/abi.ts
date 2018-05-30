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
      signature: string;
      encode(topics: {[k: string]: any}): Array<string | string[]>;
      decode(raw: string[]): any;
    };
  };
  function: {
    [k: string]: FunctionElement & {
      signature: string;
      encode(...params: any[]): string;
      decode(raw: string): any;
    };
  };
}

export function createAbiCodec(jsonInterface: JsonInterface): AbiCodec {
  const abi: any = {
    constructor: {
      encode(bytecode: string, ...params: any[]) {
        return '0x' + bytecode;
      },
    },
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
        const signature = Abi.eventID(element.name, types).toString('hex');

        const codec = {
          ...element,
          signature,
          encode(topics: {[k: string]: any}) {
            const encodedTopics = [] as any[];

            // [keccak('Test(uint256,string)')]
            if (!element.anonymous) {
              encodedTopics.push('0x' + signature);
            }

            // {
            //   anonymous: false,
            //   inputs: [
            //     {indexed: true, name: 'test', type: 'bytes32'},
            //     {indexed: true, name: 'someNumber', type: 'bytes32'},
            //     {indexed: true, name: 'value', type: 'uint256'},
            //   ],
            //   name: 'Test',
            //   type: 'event',
            // },

            element.inputs.forEach(i => {
              if (i.indexed && topics[i.name]) {
                if (Array.isArray(topics[i.name])) {
                  const encodedTopicArray: string[] = [];

                  topics[i.name].forEach((t: any) => {
                    const encodedTopicElement = Abi.rawEncode(
                      [i.type],
                      [t],
                    ).toString('hex');

                    encodedTopicArray.push(
                      '0x' +
                        (encodedTopicElement.length > 64
                          ? Abi.soliditySHA3([i.type], [t]).toString('hex')
                          : encodedTopicElement),
                    );
                  });

                  encodedTopics.push(encodedTopicArray);
                } else {
                  const encodedTopic = Abi.rawEncode(
                    [i.type],
                    [topics[i.name]],
                  ).toString('hex');

                  encodedTopics.push(
                    '0x' +
                      (encodedTopic.length > 64
                        ? Abi.soliditySHA3([i.type], [topics[i.name]]).toString(
                            'hex',
                          )
                        : encodedTopic),
                  );
                }
              } else {
                encodedTopics.push(null);
              }
            });

            return encodedTopics;
          },
          decode(log: any) {
            if (!element.anonymous) {
              log.topics.shift();
            }

            const indexedInputs = element.inputs
              .map((v, i) => ({v, i}))
              .filter(({v}) => v.indexed);

            const indexedDecoded = indexedInputs.map(({v}, i) => {
              // console.log(v, i);
              return Abi.rawDecode(
                [
                  v.type === 'string' || v.type === 'bytes'
                    ? 'bytes32'
                    : v.type,
                ],
                Buffer.from(log.topics[i].replace('0x', ''), 'hex'),
              )[0];
            });

            const unIndexedInputs = element.inputs
              .map((v, i) => ({v, i}))
              .filter(({v}) => !v.indexed);
            const unIndexedDecoded = Abi.rawDecode(
              unIndexedInputs.map(({v}) => v.type),
              Buffer.from(log.data.replace('0x', ''), 'hex'),
            );

            return {
              ...indexedInputs.reduce(
                (a, {v, i: originalIndex}, i) => ({
                  ...a,
                  [originalIndex]: indexedDecoded[i],
                  [v.name]: indexedDecoded[i],
                }),
                {},
              ),
              ...unIndexedInputs.reduce(
                (a, {v, i: originalIndex}, i) => ({
                  ...a,
                  [originalIndex]: unIndexedDecoded[i],
                  [v.name]: unIndexedDecoded[i],
                }),
                {},
              ),
            };
          },
        };

        abi.event[element.name] = codec;
        abi.event[signature] = codec;
        break;
      }
      case 'function': {
        const iTypes = element.inputs.map(i => i.type);
        const oTypes = element.outputs.map(i => i.type);
        const signature = Abi.methodID(element.name, iTypes).toString('hex');

        const codec = {
          ...element,
          signature,
          encode(...params: any[]) {
            return (
              '0x' + signature + Abi.rawEncode(iTypes, params).toString('hex')
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
        abi.function[signature] = codec;
        break;
      }
    }
  });

  // if abi.constructor then return or if not abi constructor then

  return abi;
}

import * as ABI from 'ethereumjs-abi';

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
  inputs?: Param[];
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

export interface ElementParam extends Param {
  indexed: boolean;
}

export interface EventElement {
  type: 'event';
  name: string;
  inputs?: ElementParam[];
  anonymous: boolean;
}

export type JsonInterface = Array<MethodElement | EventElement>;

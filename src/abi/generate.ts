// import BN from 'bn.js';
// import * as ABI from 'ethereumjs-abi';
// import {
//   EventElement,
//   FunctionElement,
//   MethodElement,
//   ConstructorElement,
//   FallbackElement,
//   JsonInterface,
// } from './types';

// export function generateAbiFunction(abi: FunctionElement) {
//   const inputTypes = abi.inputs.map(v => v.type);
//   const outputTypes = abi.inputs.map(v => v.type);

//   const template = (name: string) =>
//     `${name}(args: ${inputTypes.map(v => {
//       ABI;
//     })}) {}`;
//   return (
//     template(abi.name) + '\n' + template(ABI.methodID(abi.name, inputTypes))
//   );
// }

// export function generateAbi(abi: JsonInterface) {
//   const methods = abi.map(v => {
//     switch (v.type) {
//       case 'function': {
//         return generateAbiFunction(v);
//       }
//       case 'fallback': {
//         if (v.payable) {
//         }
//         return;
//       }
//       case 'constructor': {
//         // return generateAbiFunction(v);
//         return;
//       }
//       case 'event': {
//         return;
//       }
//       default:
//         throw new TypeError('abi contains invalid element type.');
//     }
//   });

//   return `
// export default class {
//   static public jsonInterface: JsonInterface = ${abi};

// }

//     `;
// }

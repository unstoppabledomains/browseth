const assert = require('assert')

const { param, AbiEvent, AbiCodec } = require('..')

const { ab } = require('@browseth/utils')

// const boolInput = { type: 'bool', name: 'mybool' }
// const bool = param.parse(boolInput)

// console.log(bool)
// console.log(ab.toHex(bool.enc(false)))
// console.log(ab.toHex(bool.enc(true)))
// console.log()

// const addressInput = { type: 'address', name: 'myaddress' }
// const address = param.parse(addressInput)

// console.log(address)
// console.log(ab.toHex(address.enc(null)))
// console.log(ab.toHex(address.enc('0x1234567890123456789012345678901234567890')))
// console.log(ab.toHex(address.enc(new Uint32Array([1, 2, 3, 4, 5]))))
// console.log()

// const dynoBytesInput = { type: 'bytes', name: 'mybytes' }
// const dynoBytes = param.parse(dynoBytesInput)

// console.log(dynoBytes)
// console.log(ab.toHex(dynoBytes.enc('0x').value))
// console.log(ab.toHex(dynoBytes.enc('0x1234').value))
// console.log(ab.toHex(dynoBytes.enc(new Uint8Array([1, 2, 3])).value))
// console.log()

// const fixedBytesInput = { type: 'bytes3', name: 'myfixedbytes' }
// const fixedBytes = param.parse(fixedBytesInput)

// console.log(fixedBytes)
// console.log(fixedBytes.dec(fixedBytes.enc('0x123456')))
// console.log(fixedBytes.dec(fixedBytes.enc(new Uint8Array([1, 2, 3]))))
// console.log()

// const funcInput = { type: 'function', name: 'myfunc' }
// const func = param.parse(funcInput)

// console.log(func)
// console.log(
//   ab.toHex(
//     func.enc({
//       address: null,
//       selector: '0x12345678',
//     }),
//   ),
// )
// console.log(
//   ab.toHex(
//     func.enc({
//       address: '0x1234567890123456789012345678901234567890',
//       selector: '0x12345678',
//     }),
//   ),
// )
// console.log()

// const uintInput = { type: 'uint24', name: 'myuint' }
// const uint = param.parse(uintInput)

// console.log(uint)
// console.log(uint.dec(uint.enc(0x123)))
// console.log(uint.dec(uint.enc('0x123')))
// console.log()

// const intInput = { type: 'int16', name: 'myint' }
// const int = param.parse(intInput)

// console.log(int)
// console.log(ab.toHex(int.enc(-0xffff)))
// console.log(int.dec(int.enc(-0xffff)))
// console.log(ab.toHex(int.enc(-0xfffe)))
// console.log(int.dec(int.enc(-0xfffe)))
// console.log(ab.toHex(int.enc(-0x1234)))
// console.log(int.dec(int.enc(-0x1234)))
// console.log(ab.toHex(int.enc(0)))
// console.log(int.dec(int.enc(0)))
// console.log(ab.toHex(int.enc(0x1234)))
// console.log(int.dec(int.enc(0x1234)))
// console.log(ab.toHex(int.enc(0xfffe)))
// console.log(int.dec(int.enc(0xfffe)))
// // console.log(ab.toHex(int.enc(0xffff)))
// // console.log(int.dec(int.enc(0xffff)))
// console.log()

// const stringInput = { type: 'string', name: 'mystring' }
// const string = param.parse(stringInput)

// console.log(string)
// console.log(string.dec(string.enc('hello world')))
// console.log(string.dec(string.enc('😊')))
// console.log(string.dec(string.enc(new Uint8Array([48]))))
// console.log()

// const tupleInput = {
//   type: 'tuple',
//   name: 'mytuple',
//   components: [
//     { type: 'uint' },
//     { type: 'uint32[]' },
//     { type: 'bytes10' },
//     { type: 'bytes' },
//     { type: 'string' },
//     { type: 'bool' },
//     { type: 'address' },
//     { type: 'address' },
//     { type: 'function' },
//   ],
// }
// const tuple = param.parse(tupleInput)

// console.log(tuple)

// const data = tuple.enc([
//   0x123,
//   [0x456, 0x789],
//   ab.fromBytes('12345678901234567890', 10),
//   ab.fromUtf8('Hello, world!'),
//   'Hello, world! 😊',
//   true,
//   null,
//   '0x1234567890123456789012345678901234567890',
//   {
//     address: null,
//     selector: new Uint8Array(4),
//   },
// ])
// console.log(ab.toHex(data))
// console.log()
// console.log(tuple.dec(data))

// const fn = new AbiFunction({
//   type: 'function',
//   name: 'myfn',
//   inputs: [
//     {
//       type: 'tuple[]',
//       components: [
//         { type: 'bytes2[]', name: 'barr' },
//         { type: 'bytes2', name: 'b' },
//       ],
//     },
//   ],
//   outputs: [
//     {
//       type: 'tuple[]',
//       components: [
//         { type: 'bytes2[]', name: 'asdf' },
//         { type: 'bytes2', name: 'b' },
//       ],
//     },
//   ],
// })

// const data = fn.enc([
//   {
//     barr: ['0x1234', '0x5678'],
//     b: '0x9012',
//   },
// ])

// // dynamicOffset
// 0x0000000000000000000000000000000000000000000000000000000000000020

// // tuple[] length
// 0x0000000000000000000000000000000000000000000000000000000000000001

// // tuple[0] byteSize
// 0x00000000000000000000000000000000000000000000000000000000000000a0

// // tuple[0] bytes[] dynamicOffset
// 0x0000000000000000000000000000000000000000000000000000000000000040

// // bytes4
// 0x9012000000000000000000000000000000000000000000000000000000000000

// // tuple[0] bytes[] length
// 0x0000000000000000000000000000000000000000000000000000000000000002

// // tuple[0] bytes[0]
// 0x1234000000000000000000000000000000000000000000000000000000000000

// // tuple[0] bytes[1]
// 0x5678000000000000000000000000000000000000000000000000000000000000

// console.log(fn.dec(data.slice(4)))

// const event = new AbiEvent({
//   name: 'MyEvent',
//   anonymous: false,
//   inputs: [
//     {
//       name: 'bla',
//       type: 'uint256',
//       indexed: true,
//     },
//     {
//       name: 'asdf',
//       type: 'uint256',
//       indexed: true,
//     },
//   ],
// })

// console.log(event)
// console.log(event.enc([123, 456]))
// event = new AbiEvent({
//   name: 'MyEvent',
//   anonymous: false,
//   inputs: [
//     {
//       name: 'bla',
//       type: 'uint256',
//       indexed: true,
//     },
//     {
//       name: 'asdf',
//       type: 'uint256',
//       indexed: true,
//     },
//   ],
// })

// console.log(event)
// console.log(event.enc([123, 456]))

console.log(
  new AbiCodec([
    {
      type: 'event',
      name: 'Event',
      inputs: [
        {
          name: 'b',
          type: 'uint',
        },
      ],
    },
    {
      type: 'function',
      name: 'func',
      inputs: [
        {
          name: 'b',
          type: 'string',
        },
      ],
    },
  ]).ev.Event(),
)

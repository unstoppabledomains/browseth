import { expect } from 'chai'
import testContractJson from './testContract'
import Contract from '@browseth/contract'
import Browseth from '@browseth/browser'
import PrivateKeySigner from '@browseth/signer-private-key'
import AccountSigner from '@browseth/account-signer'
import * as units from '@browseth/units'

const beth = new Browseth('https://ropsten.infura.io/mew')
const privateKey =
  '72307ba0c2225b6ad2f307f1c9449478a358589b83e19dcc562de189518e102d'
beth.useAccount(new AccountSigner(beth, new PrivateKeySigner(privateKey)))

let testContractInstance = null
let contractAddress = ''

describe('constructor()', () => {
  it('should throw TypeError object', () => {
    expect(
      () =>
        new Contract(beth, 'not a valid abi', {
          bin: testContractJson.bin,
        }),
    ).to.throw(`invalid name 'undefined'`)
  })
  it('should create Contract object', () => {
    testContractInstance = new Contract(beth, testContractJson.abi, {
      bin: testContractJson.bin,
    })
    expect(testContractInstance).to.have.property('construct')
    expect(testContractInstance).to.have.property('fallback')
  })
})

describe('construct()', () => {
  describe('gas()', () => {
    it('should estimate gas', async function() {
      expect(
        await testContractInstance.construct(12, 12).gas({
          chainId: 3,
          gasPrice: units.gweiToWei(10),
        }),
      ).to.equal('0x97b4')
    })
  })

  // describe('send()', () => {
  //   it('should create and send transaction', async function() {
  //     this.timeout(105300)
  //     expect(
  //       await testContractInstance
  //         .construct(12, 12)
  //         .send({
  //           chainId: 3,
  //           gasPrice: units.gweiToWei(40),
  //         })
  //         .then(txHash => txHash),
  //     ).to.match(/^0x[\da-f]{64}$/)
  //   })
  // })

  // need to get contractAddress from txHash
})

// describe('call()', () => {
//   it('should h=', async function() {
//     console.log(
//       await testContractInstance.fn.getA().call({
//         to:
//           '0x7c17738bb674157a449f3328ae6c9e1bbe1b6a40028aa6a6499ef0c46994b46f',
//       }),
//     )
//   })
// })

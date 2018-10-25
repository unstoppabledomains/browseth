import { expect } from 'chai'
import testContractJson from './testContract'
import Contract from '@browseth/contract'
import Browseth from '@browseth/browser'
import PrivateKeySigner from '@browseth/signer-private-key'
import AccountSigner from '@browseth/account-signer'
import * as units from '@browseth/units'
import { TxListener } from '@browseth/utils'

const beth = new Browseth()
beth.useOnlineAccount()

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
          gasPrice: units.gweiToWei(10),
        }),
      ).to.match(/^0x[\da-f]+/)
    })
  })

  describe('send()', () => {
    it('should deploy contract', async function() {
      this.timeout(205300)

      expect(
        await testContractInstance
          .construct(10, 12)
          .send({
            UNSAFE_gasPrice: units.gweiToWei(30),
          })
          .then(async txHash => {
            const txListener = new TxListener(beth)
            const receipt = await txListener.listen(txHash)
            contractAddress = receipt.contractAddress
            return txHash
          }),
      ).to.match(/^0x[\da-f]{64}$/)
    })
  })
})

describe('call()', () => {
  it('should read value in contract', async function() {
    const val = await testContractInstance.fn.getA().call({
      to: contractAddress,
    })
    expect(val).to.be.equal(BigInt(10))
  })
})

describe('send()', () => {
  it('should write to contract', async function() {
    this.timeout(30000)
    const newA = 0x123123123
    const newB = 0x80000085
    const txHash = await testContractInstance.fn.setAB(newA, newB).send({
      to: contractAddress,
    })
    const txListener = new TxListener(beth)
    const receipt = await txListener.listen(txHash)
    const val = await testContractInstance.fn.getA().call({
      to: contractAddress,
    })
    expect(val).to.be.equal(BigInt(newA))
  })
})

describe('event()', () => {
  it('should read event from contract', async function() {
    const eventLog = (await testContractInstance.ev
      .ASet({ a: 0x123123123 })
      .logs('earliest', 'latest', contractAddress))[0]
    expect(eventLog[0].toString()).to.be.equal('4883362083')
    expect(eventLog[1].toString()).to.be.equal('2147483781')
    expect(eventLog[3].toString()).to.be.equal('10486940869992875823')
    expect(eventLog.aTimesB.toString()).to.be.equal('10486940869992875823')
    expect(eventLog['aPlusB'].toString()).to.be.equal('7030845864')
  })
  it('should read event from contract', async function() {
    const eventLog = (await testContractInstance.ev
      .ASet()
      .logs('earliest', 'latest', contractAddress))[0]
    expect(eventLog[0].toString()).to.be.equal('4883362083')
    expect(eventLog[1].toString()).to.be.equal('2147483781')
    expect(eventLog[3].toString()).to.be.equal('10486940869992875823')
    expect(eventLog.aTimesB.toString()).to.be.equal('10486940869992875823')
    expect(eventLog['aPlusB'].toString()).to.be.equal('7030845864')
  })
})

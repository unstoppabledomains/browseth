import { expect } from 'chai'
import PrivateKeySigner from '@browseth/signer-private-key'
import { ab } from '@browseth/utils'
import ETx from 'ethereumjs-tx'

describe('constructor()', () => {
  it('should throw type error', () => {
    const badPrivateKey =
      '72307ba0c2225b6ad2f307f1c9449478a358589b83e19dcc562de189518e10d'
    expect(() => new PrivateKeySigner(badPrivateKey)).to.throw(
      `invalid value '${badPrivateKey}'`,
    )
  })
})

describe('address()', () => {
  it('should return address', () => {
    const signer = new PrivateKeySigner(
      '72307ba0c2225b6ad2f307f1c9449478a358589b83e19dcc562de189518e102d',
    )
    expect(signer.address()).to.equal(
      '0xF03fA1e4C00329e1232A887DB834bFFa54F1B1D7',
    )
  })
})

describe('signMessage()', () => {
  it('should sign message', () => {
    const signer = new PrivateKeySigner(
      '72307ba0c2225b6ad2f307f1c9449478a358589b83e19dcc562de189518e102d',
    )
    expect(ab.toHex(signer.signMessage('testMessage'))).to.equal(
      '0xbdac52088e58cb06a1000002df6152f6c314cdfedaa46c39456dedeabc1e60fd46e19dcf82463373a6a720eae21e5a1930ffafa46fc90f3bd347a7611e461f6d1b',
    )
  })
})

describe('signTransaction()', () => {
  it('should sign transaction', () => {
    const params = {
      nonce: 0x0,
      gasPrice: 1000000,
      gas: 0x5208,
      to: Buffer.from(new ArrayBuffer(0)),
      value: 10000000,
      data: Buffer.from(new ArrayBuffer(0)),
      chainId: 3,
    }
    const privateKey =
      '72307ba0c2225b6ad2f307f1c9449478a358589b83e19dcc562de189518e102d'

    testSignTx({ ...params, chainId: 123123123123 }, privateKey)
    testSignTx({ ...params, chainId: 1 }, privateKey)
    testSignTx({ ...params, chainId: 123020320112312331 }, privateKey)
    testSignTx({ ...params, to: Buffer.from(new ArrayBuffer(20)) }, privateKey)
  })
})

const testSignTx = (params, privateKey) => {
  const tx = new ETx(params)
  tx.sign(Buffer.from(privateKey, 'hex'))
  const signedTx = '0x' + tx.serialize().toString('hex')

  const signer = new PrivateKeySigner(privateKey)
  expect(ab.toHex(signer.signTransaction(params))).to.equal(signedTx)
}

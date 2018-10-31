import { expect } from 'chai'
import SignerLedger from '@browseth/signer-ledger'
import { ab } from '@browseth/utils'
import ETx from 'ethereumjs-tx'

describe('address()', () => {
  it('should return address', async function() {
    this.timeout(20000000)
    const signer = new SignerLedger()
    const address = (await signer.address()).address
    expect(address).to.equal('0xc3c482d9579C7cce15A9BCcCD7F2A8148Ad0109A')
  })
})

describe('signMessage()', () => {
  it('should sign message', async function() {
    this.timeout(20000000)
    const signer = new SignerLedger()

    expect(ab.toHex(await signer.signMessage('testMessage'))).to.equal(
      '0xfc18a1ca0a65d4e9e0f87e1d5d126f8d0606e05938379bd11ed1d75bb43bfbb925b400dc7dbf813355f96fb9bc29f174ade96c67bd5072b266f9754932d1bc7600',
    )
  })
})

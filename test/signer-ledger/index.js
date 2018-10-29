import { expect } from 'chai'
import SignerLedger from '@browseth/signer-ledger'
import { ab } from '@browseth/utils'
import ETx from 'ethereumjs-tx'

describe('address()', () => {
  it('should return address', async function() {
    this.timeout(20000000)
    const signer = new SignerLedger()
    expect(await signer.address()).to.equal(
      '0xF03fA1e4C00329e1232A887DB834bFFa54F1B1D7',
    )
  })
})

describe('signMessage()', () => {
  it('should sign message', async function() {
    this.timeout(20000000)
    const signer = new SignerLedger()

    console.log(await signer.signMessage('testMessage'))
  })
})

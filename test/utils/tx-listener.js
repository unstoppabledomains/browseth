import { expect } from 'chai'
import { address } from '@browseth/utils'
import { TxListener } from '@browseth/utils'
import Browseth from '@browseth/browser'
import Contract from '@browseth/contract'
import PrivateKeySigner from '@browseth/signer-private-key'
import * as units from '@browseth/units'

const beth = new Browseth()

beth.useOnlineAccount()

describe('listen()', () => {
  it('should resolve txHash with receipt', async function() {
    this.timeout(317250)
    const txHash = await beth.send({
      to: '0x89a8f5f337304EaA7caEd7AA1D88b791f3d8B51D',
      value: 124,
      gasPrice: units.gweiToWei(12),
    })
    const txListener = new TxListener(beth)
    const receipt = await txListener.listen(txHash)
    expect(receipt.status).to.equal('0x1')
  })

  it('should reject with not transaction found', function(done) {
    this.timeout(20000)
    const txListener = new TxListener(beth)
    txListener
      .listen(
        '0x6685ba3188f5181ccf90e95ba6e38d154ddcfdfba7835e75780e30ef6fa90dc3',
      )
      .then(() => done('Should not have found transaction'))
    setTimeout(done, 6000)
  })
})

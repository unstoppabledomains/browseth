import { expect } from 'chai'
import { address } from '@browseth/utils'
import { TxListener } from '@browseth/utils'
import Browseth from '@browseth/browser'
import Contract from '@browseth/contract'
import PrivateKeySigner from '@browseth/signer-private-key'
import * as units from '@browseth/units'

const beth = new Browseth('https://ropsten.infura.io/mew')
const privateKey =
  '72307ba0c2225b6ad2f307f1c9449478a358589b83e19dcc562de189518e102d'

beth.useSignerAccount(new PrivateKeySigner(privateKey))

describe('listen()', () => {
  it('should resolve txHash with receipt', async function() {
    this.timeout(317250)
    const txHash = await beth.send({
      to: '0x89a8f5f337304EaA7caEd7AA1D88b791f3d8B51D',
      value: 1223,
      chainId: 3,
      gasPrice: units.gweiToWei(10),
    })
    const txListener = new TxListener(beth)
    const receipt = await txListener.listen(txHash)
    expect(receipt.status).to.equal('0x1')
  })
})

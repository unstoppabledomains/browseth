import Browseth from '@browseth/browser'
import PrivateKeySigner from '@browseth/signer-private-key'
import AccountSigner from '@browseth/account-signer'

import 'isomorphic-fetch'

describe('test', () => {
  it('shoudl run test', async function() {
    this.timeout(50000)
    const testContractAbi = [
      {
        constant: false,
        inputs: [],
        name: 'getB',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'getA',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'getATimesB',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { name: '_a', type: 'uint256' },
          { name: '_b', type: 'uint256' },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
    ]
    const beth = new Browseth('https://mainnet.infura.io/mew')
    const testContract = beth.contract(testContractAbi)
    const signer = new PrivateKeySigner(
      '72307ba0c2225b6ad2f307f1c9449478a358589b83e19dcc562de189518e102d',
    )

    beth.useAccount(new AccountSigner(beth, signer))
    testContract.construct(12, 12).send()

      await beth
        .send({
          UNSAFE_chainId: 3,
          UNSAFE_gasPrice: 1000000,
          to: '0x89a8f5f337304eaa7caed7aa1d88b791f3d8b51d',
          value: 10000000,
        })
        .then(console.log)
        .catch(console.log)
  })
})

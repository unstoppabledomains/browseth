import { expect } from 'chai'
import { crypto } from '@browseth/utils'
import EnsLookup from '@browseth/ens'
import Browseth from '@browseth/browser'

const beth = new Browseth('https://mainnet.infura.io/mew')
const ensLookup = new EnsLookup(beth)

const node =
  '0xd22199aae12a9820651b06cb6da9f5d4cccc53f925d7f1ec7e07682f8847ec41'

describe('address()', () => {
  it('should return address set in resolver', async function() {
    this.timeout(20000)

    expect(await ensLookup.address(node)).to.equal(
      '0x89a8f5f337304eaa7caed7aa1d88b791f3d8b51d',
    )
  })
})

describe('resolverAddress()', () => {
  it('should return resolver address', async function() {
    this.timeout(20000)

    expect(await ensLookup.resolverAddress(node)).to.equal(
      '0x63821ad02f2149977b1f362cdc2f0cd7705efe2a',
    )
  })
})

// describe('allTexts()', () => {
//   it('should return all text changes on key', async function() {
//     this.timeout(20000)

//     console.log(await ensLookup.allTexts(node, 'twitter'))
//     // ens events not working
//     // abi codec for events is broken in @browseth/ens
//   })
// })

describe('text()', () => {
  it('should return current twitter text', async function() {
    this.timeout(20000)

    expect(await ensLookup.text(node, 'twitter')).to.equal('ryan_cle')
  })
})

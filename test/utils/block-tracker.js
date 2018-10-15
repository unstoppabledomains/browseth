import { expect } from 'chai'
import { address } from '@browseth/utils'
import { BlockTracker } from '@browseth/utils'
import Browseth from '@browseth/browser'

// describe('syncBlockNumber', function() {
//   it('should get latest block', function(done) {
//     const beth = new Browseth('https://ropsten.infura.io/mew')
//     beth.useOnlineAccount()
//     const blockTracker = new BlockTracker(beth)
//     clearInterval(blockTracker.blockNumberInterval)
//     clearInterval(blockTracker.blocksInterval)
//     blockTracker.emitter.on('block.number', function(blockNumber) {
//       try {
//         expect(blockNumber).to.be.greaterThan(4226205)
//         done()
//       } catch (e) {
//         done(e)
//       }
//     })
//     blockTracker.syncBlockNumber()
//   })
// })  // chai is waiting for this test even though it's calling done().
// Must be a binding issue with how the Emitter calls the callback

describe('addTracker', () => {
  it('should add tracker', () => {
    const beth = new Browseth('https://ropsten.infura.io/mew')
    beth.useOnlineAccount()
    const blockTracker = new BlockTracker(beth)
    const tracker = { confirmationDelay: 0, synced: 4226220, isSyncing: false }
    const key = 'test'
    blockTracker.addTracker(key, tracker)
    expect(blockTracker.trackers['_c'].get(key)).to.deep.equal(tracker)
  })
})

describe('syncBlocks', () => {
  it('should get block', function(done) {
    this.timeout(2000000)
    const beth = new Browseth('https://ropsten.infura.io/mew')
    beth.useOnlineAccount()
    const block = 0x408ee5
    const blockTracker = new BlockTracker(beth)
    const tracker = { confirmationDelay: 0, synced: block, isSyncing: false }
    const key = 'test'
    // clearInterval(blockTracker.blockNumberInterval)
    // clearInterval(blockTracker.blocksInterval)

    blockTracker.addTracker(key, tracker)
    blockTracker.latest = block
    blockTracker.emitter.on('block', block => {
      try {
        console.log(block)
        expect(block.transactions).to.include(
          '0x564c679898b0bd142da797bbd9146e9d0b5b05b1967ff2ef14c164914363dd08',
        )
        expect(block.transactions).to.include(
          '0x51cfc687797a839ed088f477617c5915b130d6fc6e7eb7916ca1d6c239b1dd75',
        )
        done()
      } catch (e) {
        done(e)
      }
    })
    blockTracker.syncBlocks()
  })
})

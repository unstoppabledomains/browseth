import { setUnrefedInterval, setUnrefedTimeout } from './interval'
import { Emitter } from './emitter'

export { BlockTracker as default, BlockTracker }

class BlockTracker {
  static BLOCK = Symbol('BLOCK')
  BLOCK = this.constructor.BLOCK

  emitter = new Emitter()

  latest = -1
  trackers = new Map([[this.BLOCK, { confirmationDelay: 0, synced: -1 }]])

  constructor(requestQueue, { confirmationDelay = 0 } = {}) {
    this.requestQueue = requestQueue
    this.defaultConfirmationDelay = confirmationDelay

    this.addTracker(this.BLOCK, { confirmationDelay })

    this.blockNumberInterval = setUnrefedInterval(this.syncBlockNumber, 5000)
    this.blocksInterval = setUnrefedInterval(this.syncBlocks, 15000)
  }

  addTracker = (
    key,
    { synced = this.latest, confirmationDelay = this.defaultConfirmationDelay },
  ) => {
    const tracker = {
      confirmationDelay,
      synced,
      isSyncing: false,
    }

    if (tracker.synced === 'latest' || tracker.synced == null)
      tracker.synced = this.latest
    else if (tracker.synced === 'earliest') tracker.synced = 0
    else tracker.synced = Number(tracker.synced)

    this.trackers.set(key, tracker)
  }

  syncBlockNumber = () =>
    this.requestQueue.request('eth_blockNumber').then(result => {
      const newBlockNumber = Number(result)

      if (this.latest < newBlockNumber) {
        this.latest = newBlockNumber
        this.trackers.forEach(v => {
          if (v.synced === -1) v.synced = newBlockNumber
        })

        this.emitter.emit('block.number', this.latest)
      }
    })
  // .catch(console.error)

  syncBlocks = async () => {
    const blockTracker = this.trackers.get(this.BLOCK)

    if (blockTracker.isSyncing || blockTracker.synced === -1) return
    blockTracker.isSyncing = true

    const lookup = () =>
      this.requestQueue
        .request(
          'eth_getBlockByNumber',
          '0x' + blockTracker.synced.toString(16),
          false,
        )
        .then(
          result =>
            result
              ? result
              : new Promise(r => setUnrefedTimeout(r, 1000)).then(lookup),
        )

    try {
      for (
        ;
        blockTracker.synced + blockTracker.confirmationDelay <= this.latest;
        blockTracker.synced++
      ) {
        const block = await lookup()

        this.emitter.emit('block', block)
      }
    } finally {
      blockTracker.isSyncing = false
    }
  }

  cleanup = () => {
    this.requestQueue.request('eth_blockNumber')
  }
}

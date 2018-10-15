import BlockTracker from './block-tracker'
export { TxListener as default, TxListener }

class TxListener {
  constructor(ethRef) {
    this.blockTracker = new BlockTracker(ethRef)
    this.ethRef = ethRef
  }

  listen = txHash =>
    new Promise((resolve, reject) => {
      this.blockTracker.emitter.on('block', block => {
        if (block.transactions.includes(txHash)) {
          this.ethRef
            .request('eth_getTransactionReceipt', txHash)
            .then(resolve)
            .catch(reject)
        }
      })
    })
}

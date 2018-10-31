import { setUnrefedInterval, setUnrefedTimeout } from './interval'
export { TxListener as default, TxListener }

class TxListener {
  constructor(ethRef) {
    this.ethRef = ethRef
  }

  listen = txHash =>
    new Promise((resolve, reject) => {
      this.interval = setUnrefedInterval(() => {
        this.ethRef
          .request('eth_getTransactionReceipt', txHash)
          .then(receipt => {
            if (!receipt) {
              return
            }
            clearInterval(this.interval)
            if (receipt.status === 0) {
              reject('Transaction not found')
            } else {
              resolve(receipt)
            }
          })
      }, 5000)
      setUnrefedTimeout(
        () => clearInterval(interval) && reject('Transaction dropped'),
        18000000,
      )
    })

  cleanup = () => clearInterval(this.interval)
}

import { address } from '@browseth/utils'
import { tag } from '@browseth/utils/lib/param'

class LightClient {
  request() {}

  logs = ({
    topics = [],
    fromBlock = 'latest',
    toBlock = 'latest',
    address: addresses,
  }) =>
    this.request('eth_getLogs', {
      fromBlock: tag(fromBlock),
      toBlock: tag(toBlock),
      topics: topics.map(
        topic => (Array.isArray(topic) ? topic.map(v => data(v)) : data(topic)),
      ),
      address: Array.isArray(addresses)
        ? addresses.map(v => data(v, 20))
        : data(addresses, 20),
    })

  send = () => Promise.resolve({})
  gas = () => Promise.resolve({})
  call = () => Promise.resolve({})
}

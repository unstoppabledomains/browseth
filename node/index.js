import { ab } from '@browseth/utils'

export { NodeClient as default, NodeClient }

class NodeClient extends LightClient {
  constructor(
    config = {
      codec: {
        data: {
          to: value => Buffer.from(value),
        },
        quantity: {
          to: value => BigInt(ab.toHex(value)),
          from: value => '0x' + value.toString(16),
        },
      },
    },
  ) {}
}

import { ab, crypto } from '@browseth/utils'

export { AccountOnline as default, AccountOnline }

class AccountOnline {
  id = crypto.uuid()

  cachedAddresses = {
    timestamp: -Infinity,
    values: null,
  }

  constructor(ethRef, { addressTtl = 0 } = {}) {
    this.ethRef = ethRef
    this.addressTtl = addressTtl
  }

  address = noCache => this.addresses(noCache).then(([coinbase]) => coinbase)
  addresses = noCache => {
    return noCache === true ||
      this.cachedAddresses.values == null ||
      this.cachedAddresses.timestamp + this.addressTtl < Date.now()
      ? this.ethRef.request('eth_accounts').then(addresses => {
          this.cachedAddresses = {
            timestamp: Date.now(),
            values: addresses,
          }
          return addresses
        })
      : Promise.resolve(this.cachedAddresses.values)
  }

  gas = async ({ UNSAFE_gasPrice, UNSAFE_from, UNSAFE_data, to, value }) =>
    this.ethRef.request('eth_estimateGas', {
      gasPrice: UNSAFE_gasPrice
        ? this.ethRef.quantity(UNSAFE_gasPrice)
        : undefined,
      data: UNSAFE_data ? this.ethRef.data(UNSAFE_data) : undefined,
      to: to ? this.ethRef.data(to, 20) : undefined,
      value: value ? this.ethRef.quantity(value) : undefined,
      from: UNSAFE_from
        ? this.ethRef.data(UNSAFE_from, 20)
        : await this.address(),
    })

  call = async (
    {
      UNSAFE_gasPrice,
      UNSAFE_gas,
      UNSAFE_gasLimit,
      UNSAFE_from,
      UNSAFE_data,
      to,
      value,
    },
    block = 'latest',
  ) =>
    this.ethRef.request(
      'eth_call',
      {
        gasPrice: UNSAFE_gasPrice
          ? this.ethRef.quantity(UNSAFE_gasPrice)
          : undefined,
        gas:
          UNSAFE_gas || UNSAFE_gasLimit
            ? this.ethRef.quantity(UNSAFE_gas || UNSAFE_gasLimit)
            : undefined,
        data: UNSAFE_data ? this.ethRef.data(UNSAFE_data) : undefined,
        to: to ? this.ethRef.data(to, 20) : undefined,
        value: value ? this.ethRef.quantity(value) : undefined,
        from: UNSAFE_from
          ? this.ethRef.data(UNSAFE_from, 20)
          : await this.address(),
      },
      this.ethRef.tag(block),
    )

  send = async ({
    UNSAFE_nonce,
    UNSAFE_gasPrice,
    UNSAFE_gas,
    UNSAFE_chainId,
    UNSAFE_gasLimit,
    UNSAFE_from,
    UNSAFE_data,
    to,
    value,
    expiresAt,
    ttl,
    attempts,
    priority,
  }) =>
    this.ethRef.request('eth_sendTransaction', {
      nonce: UNSAFE_nonce ? this.ethRef.quantity(UNSAFE_nonce) : undefined,
      gasPrice: UNSAFE_gasPrice
        ? this.ethRef.quantity(UNSAFE_gasPrice)
        : undefined,
      gas:
        UNSAFE_gas || UNSAFE_gasLimit
          ? this.ethRef.quantity(UNSAFE_gas || UNSAFE_gasLimit)
          : await this.gas({
              UNSAFE_gasPrice,
              UNSAFE_from,
              UNSAFE_data,
              UNSAFE_chainId,
              to,
              value,
            }),
      data: UNSAFE_data ? this.ethRef.data(UNSAFE_data) : undefined,
      chainId: UNSAFE_chainId ? UNSAFE_chainId : undefined,
      to: to ? this.ethRef.data(to, 20) : undefined,
      value: value ? this.ethRef.quantity(value) : undefined,
      from: UNSAFE_from
        ? this.ethRef.data(UNSAFE_from, 20)
        : await this.address(),
    })

  sign = async message =>
    this.ethRef.request(
      'eth_sign',
      await this.address(),
      ab.toHex(ab.fromUtf8(message)),
    )
}

import { crypto, ab } from '@browseth/utils'
export { AccountSigner as default, AccountSigner }

class AccountSigner {
  id = crypto.uuid()

  constructor(ethRef, signer) {
    this.ethRef = ethRef
    this.signer = signer
  }

  address = () => Promise.resolve().then(this.signer.address)

  send = async ({
    UNSAFE_nonce,
    UNSAFE_gasPrice,
    UNSAFE_gas,
    UNSAFE_gasLimit,
    UNSAFE_from,
    UNSAFE_data,
    UNSAFE_chainId,
    to,
    value,
  }) => {
    const from = await this.address()
    if (UNSAFE_from && UNSAFE_from !== from)
      throw new Error(
        "UNSAFE_from and this signer don't match you probably sent to the wrong account",
      )
      
    return this.ethRef.request(
      'eth_sendRawTransaction',
      ab.toHex(
        this.signer.signTransaction({
          gas:
            UNSAFE_gas || UNSAFE_gasLimit
              ? this.ethRef.quantity(UNSAFE_gas || UNSAFE_gasLimit)
              : await this.gas({
                  UNSAFE_gasPrice,
                  UNSAFE_from: from,
                  UNSAFE_data,
                  to,
                  value,
                }),
          nonce:
            UNSAFE_nonce ||
            (await this.ethRef.request(
              'eth_getTransactionCount',
              from,
              'latest',
            )),
          gasPrice: UNSAFE_gasPrice,
          from,
          data: UNSAFE_data,
          chainId: UNSAFE_chainId,
          to,
          value,
        }),
      ),
    )
  }

  sign = message =>
    Promise.resolve().then(() => this.signer.signMessage(message))

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
}

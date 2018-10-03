import { crypto } from '@browseth/utils'
export { AccountReadonly as default, AccountReadonly }

class AccountReadonly {
  id = crypto.uuid()

  constructor(ethRef, { from } = {}) {
    this.ethRef = ethRef
    this.from = from
  }

  address = () =>
    /*  this.from == null
      ? Promise.reject(new Error('no address specified'))
      :  */
    Promise.resolve(this.from)

  gas = async ({ UNSAFE_gasPrice, UNSAFE_from, UNSAFE_data, to, value }) =>
    this.ethRef.request('eth_estimateGas', {
      gasPrice: UNSAFE_gasPrice
        ? this.ethRef.quantity(UNSAFE_gasPrice)
        : undefined,
      data: UNSAFE_data ? this.ethRef.data(UNSAFE_data) : undefined,
      to: to
        ? this.ethRef.data(
            to, // this.ethRef.isValidAddress(to)
            //   ? to
            //   : /* await this.ethRef.ens.resolveTo(to) */ '0x0000000000000000000000000000000000000000',
            20,
          )
        : undefined,
      value: value ? this.ethRef.quantity(value) : undefined,
      from: UNSAFE_from ? this.ethRef.data(UNSAFE_from, 20) : this.from,
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
        to: to
          ? this.ethRef.data(
              to, // this.ethRef.isValidAddress(to)
              //   ? to
              //   : /* await this.ethRef.ens.resolveTo(to) */ '0x0000000000000000000000000000000000000000',
              20,
            )
          : undefined,
        value: value ? this.ethRef.quantity(value) : undefined,
        from: UNSAFE_from ? this.ethRef.data(UNSAFE_from, 20) : this.from,
      },
      this.ethRef.tag(block),
    )

  send = () => Promise.reject("can't send from a readonly account")
  sign = () => Promise.reject("can't sign message with a readonly account")
}

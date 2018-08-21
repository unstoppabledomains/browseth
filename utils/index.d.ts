export = Utils
export as namespace Utils

declare namespace Utils {
  export { ab, address, crypto, param, Association, rlp }

  const ab: {
    fromView(value: ArrayBuffer | ArrayBufferView): ArrayBuffer
    fromBytes(value: string | ArrayBuffer | ArrayBufferView): ArrayBuffer
    fromUtf8(value: string): ArrayBuffer
    fromUInt(value: number | string): ArrayBuffer
    fromInt(value): ArrayBuffer
    toHex(value: ArrayBuffer | ArrayBufferView): string
    toUtf8(value: ArrayBuffer | ArrayBufferView): string
    stripStart(value: string | ArrayBuffer | ArrayBufferView): ArrayBuffer
    padStart(
      value: string | ArrayBuffer | ArrayBufferView,
      size: number,
    ): ArrayBuffer
    padEnd(
      value: string | ArrayBuffer | ArrayBufferView,
      size: number,
    ): ArrayBuffer
    concat(values: Array<string | ArrayBuffer | ArrayBufferView>): ArrayBuffer
    toTwos(
      value: string | ArrayBuffer | ArrayBufferView,
      size: number,
    ): ArrayBuffer
    fromTwos(
      value: string | ArrayBuffer | ArrayBufferView,
      size: number,
    ): ArrayBuffer
  }
  const address: {
    isValid(value: any): boolean
    from(value: string | ArrayBuffer | ArrayBufferView): string
  }
  const crypto: {
    /** Implicitly supports hex string */
    keccak256(value: string | ArrayBuffer | ArrayBufferView): ArrayBuffer
  }
  const param: {
    data(): void
    quantity(): void
    tag(): void
  }

  class Association {
    get(aOrB): any
    set(a, b): void
    delete(aOrB): void
    has(aOrB): boolean
  }

  const rlp: {
    encode(
      value:
        | string
        | ArrayBuffer
        | ArrayBufferView
        | Array<string | ArrayBuffer | ArrayBufferView>,
    ): ArrayBuffer
  }
}

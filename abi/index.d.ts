// export = Abi
export as namespace Abi

declare namespace Abi {
  class AbiFunction {}
  class AbiEvent {}

  namespace Param {
    abstract class AbiParam<InputT = any, OutputT = any> {
      meta: any
      constructor(object: any)
      enc(value: InputT): ArrayBuffer
      dec(value: AB): OutputT
    }

    class AbiParamBoolean extends AbiParam<boolean, boolean> {}
    class AbiParamNumber extends AbiParam<number | AB, BigInt> {}
    class AbiParamFixedBytes extends AbiParam<string | AB, Uint8Array> {}
    class AbiParamAddress extends AbiParam<
      undefined | null | string | AB,
      string
    > {}
    class AbiParamDynamicBytes extends AbiParam<string | AB, Uint8Array> {}
    class AbiParamString extends AbiParam<string | AB, Uint8Array> {}
    // class AbiParamFixedPoint {}
    class AbiParamFunction extends AbiParam<
      {
        address: undefined | null | string | AB
        selector: string | AB
      },
      { address: null | string | AB; selector: string | AB }
    > {}
    class AbiParamArray extends AbiParam<any[], any[]> {}
    class AbiParamTuple extends AbiParam {}

    function parse(
      object: object,
    ):
      | AbiParamBoolean
      | AbiParamNumber
      | AbiParamFixedBytes
      | AbiParamAddress
      | AbiParamDynamicBytes
      | AbiParamString
      // | AbiParamFixedPoint
      | AbiParamFunction
      | AbiParamArray
      | AbiParamTuple
  }
}

type AB = ArrayBuffer | ArrayBufferView
type BigInt = any

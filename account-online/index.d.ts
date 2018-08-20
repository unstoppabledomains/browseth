export = SignerUtils
export as namespace SignerUtils

declare namespace SignerUtils {
  function recover(object: {
    hash: string | ArrayBuffer | ArrayBufferView
    r: string | ArrayBuffer | ArrayBufferView
    s: string | ArrayBuffer | ArrayBufferView
    v: string | ArrayBuffer | ArrayBufferView
  }): string
}

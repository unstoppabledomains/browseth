export = Utils
export as namespace Utils

declare namespace Utils {
  export { convert, etherToWei, gweiToWei, toWei, toEther, weiToEther }

  type Unit =
    | 'wei'
    | 'kwei'
    | 'ada'
    | 'femtoether'
    | 'mwei'
    | 'babbage'
    | 'picoether'
    | 'gwei'
    | 'shannon'
    | 'nanoether'
    | 'nano'
    | 'szabo'
    | 'microether'
    | 'micro'
    | 'finney'
    | 'milliether'
    | 'milli'
    | 'ether'
    | 'kether'
    | 'grand'
    | 'einstein'
    | 'mether'
    | 'gether'
    | 'tether'

  function convert(fromUnit: Unit, value: number | string, toUnit: Unit): string
  function etherToWei(value: number | string): string
  function gweiToWei(value: number | string): string
  function toWei(fromUnit: Unit, value: number | string): string
  function toEther(fromUnit: Unit, value: number | string): string
  function weiToEther(value: number | string): string
}

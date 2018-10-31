function importTest(name, path) {
  describe(name, () => {
    require(path)
  })
}

// importTest('Utils', './utils')
// importTest('Units', './units')
// importTest('Private Key Signer', './signer-private-key')
importTest('Ledger Signer', './signer-ledger')
// importTest('ENS', './ens')
// importTest('Contract', './contract')

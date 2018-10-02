function importTest(name, path) {
  describe(name, () => {
    require(path)
  })
}

describe('Utils', () => {
  importTest('ab', './ab')
  importTest('address', './address')
  importTest('crypto', './crypto')
  importTest('observable', './observable')
  // importTest('crypto', './crypto')
  importTest('emitter', './emitter')
  // importTest('interval', './interval')
  // importTest('observable', './observable')
  // importTest('param', './param')
  // importTest('rlp', './rlp')
})

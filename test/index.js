function importTest(name, path) {
  describe(name, () => {
    require(path)
  })
}

// importTest('Utils', './utils')
importTest('Units', './units')

function importTest(name, path) {
  describe(name, () => {
    require(path)
  })
}

importTest('toEther()', './toEther')
importTest('toWei()', './toWei')
importTest('weiToEther()', './weiToEther')
importTest('gweiToWei()', './gweiToWei')
importTest('etherToWei()', './etherToWei')
importTest('convert()', './convert')
importTest('unitToPow()', './unitToPow')
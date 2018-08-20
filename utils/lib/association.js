export { Association as default, Association }

class Association {
  pairWM = new WeakMap()

  get = aOrB => this.pairsWM.get(aOrB)

  set = (a, b) => {
    this.pairsWM.set(a, b)
    this.pairsWM.set(b, a)
  }

  delete = aOrB => {
    this.pairsWM.delete(aOrB)
    this.pairsWM.delete(aOrB)
  }

  has = aOrB => this.pairsWM.has(aOrB)
}

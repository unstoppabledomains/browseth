export { Observable, Observable as default }

class Observable {
  static from(subject) {
    return new Observable(subject)
  }

  fns = new Set()

  constructor(value) {
    this.value = value
  }

  set = newValue => {
    this.value = newValue

    for (const fn of this.fns.values()) {
      if (fn) {
        setImmediate(fn.bind(this, this.value))
      }
    }

    return this
  }

  get = () => this.value

  subscribe = fn => {
    this.fns.add(fn)

    return () => {
      this.fns.delete(fn)
    }
  }
}

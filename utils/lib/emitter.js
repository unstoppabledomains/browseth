export { emit, off, on, onEvery, Emitter, Emitter as default }

const emitterWM = new WeakMap()

class Emitter {
  static EVERY = Symbol('EVERY')
  EVERY = this.constructor.EVERY

  constructor() {
    emitterWM.set(this, new Map().set(this.EVERY, new Set()))
  }

  on = (event, fn) => {
    let eventM = emitterWM.get(this)

    if (eventM.has(event)) {
      eventM.get(event).add(fn)
    } else {
      eventM.set(event, new Set().add(fn))
    }
  }

  onEvery = fn => this.on(this.EVERY, fn)

  off = (event, fn) => {
    const eventM = emitterWM.get(this)

    if (fn) {
      if (eventM.has(event)) {
        eventM[event].delete(fn)
      }
    } else if (event) {
      eventM.delete(event)
    } else {
      emitterWM.set(this, new Map())
    }
  }

  emit = (event, ...params) => {
    const eventM = emitterWM.get(this)

    for (const fn of eventM.get(Emitter.EVERY)) {
      fn.call(this, { event, params })
    }

    if (eventM.has(event)) {
      for (const fn of eventM.get(event)) {
        fn.apply(this, params)
      }
    }
  }
}

const globalEmitter = new Emitter()
const { on, off, emit, onEvery } = globalEmitter

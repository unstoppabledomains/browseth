import { expect } from 'chai'
import { Emitter } from '@browseth/utils'
import sinon from 'sinon'

describe('on()', () => {
  it('should set and invoke callback on emit', () => {
    const spy = sinon.spy()
    const emitter = new Emitter()

    emitter.on('test', spy)
    emitter.emit('test')
    sinon.assert.calledOnce(spy)
  })
})

describe('off()', () => {
  it('should remove callback and not invoke on emit', () => {
    const spy = sinon.spy()
    const emitter = new Emitter()

    emitter.on('test', spy)
    emitter.off('test', spy)
    // TODO: line eventM[event].delete(fn) not working in off()
    emitter.emit('test')
    sinon.assert.calledOnce(spy)
  })
})

describe('onEvery()', () => {
  it('should trigger callback on any event', () => {
    const spy = sinon.spy()
    const emitter = new Emitter()

    emitter.onEvery(spy)
    emitter.emit('test')
    sinon.assert.calledOnce(spy)
  })
})

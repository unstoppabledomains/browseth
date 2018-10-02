import { assert, expect } from 'chai'
import { Observable } from '@browseth/utils'
import sinon from 'sinon'

describe('constructor()', () => {
  it('should set value in constructor', () => {
    const observable = new Observable('123')
    expect(observable.get()).to.equal('123')
  })
})

describe('set()', () => {
  it('should set value on set', () => {
    const observable = new Observable('123')
    observable.set('333')
    expect(observable.get()).to.equal('333')
  })
})

describe('subscribe()', () => {
  it('should invoke callback on set', done => {
    const spy = sinon.spy()
    const observable = new Observable('123')
    const unsubscribe = observable.subscribe(() => spy())
    observable.set('333')
    setTimeout(() => {
      sinon.assert.calledOnce(spy)
      done()
    }, 300)
  }).timeout(500)
})

describe('unsubscribe()', () => {
  it('should not invoke callback on set', done => {
    const spy = sinon.spy()
    const observable = new Observable('123')
    const unsubscribe = observable.subscribe(spy)
    unsubscribe()
    observable.set('333')
    setTimeout(() => {
      sinon.assert.notCalled(spy)
      done()
    }, 300)
  }).timeout(500)
})

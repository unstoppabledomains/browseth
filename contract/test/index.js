const { Contract } = require('..')

const c = new Contract({}, [])

const tracker = c.ev.a().subscribe()
tracker.on(() => {})
tracker.dispose()

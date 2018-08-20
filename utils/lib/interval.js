export { setUnrefedInterval, setUnrefedTimeout }

function setUnrefedInterval(fn, delay, ...args) {
  const interval = setInterval(fn, delay, ...args)
  if (typeof interval.unref === 'function') {
    interval.unref()
  }
  return interval
}

function setUnrefedTimeout(fn, delay, ...args) {
  const timeout = setTimeout(fn, delay, ...args)
  if (typeof timeout.unref === 'function') {
    timeout.unref()
  }
  return timeout
}

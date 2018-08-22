export {
  JsonRpcRequestBatchQueue as default,
  JsonRpcRequestBatchQueue,
  JsonRpcRequestQueue,
}

class JsonRpcRequestBatchQueue {
  id = 0
  requests = new Set()

  constructor(
    url = 'http://localhost:8545',
    { timeout = 100, maxBufferSize = 25, headers = {} } = {},
  ) {
    if (typeof url === 'string') {
      this.url = url
      this.headers = headers
    } else {
      this.send =
        typeof url.currentProvider.sendAsync === 'function'
          ? url.currentProvider.sendAsync.bind(url.currentProvider)
          : (payload, fn) => {
              try {
                fn(null, url.currentProvider.send(payload))
              } catch (error) {
                fn(error)
              }
            }
    }

    this.maxBufferSize = maxBufferSize
    this.timeout = timeout

    this.interval = setInterval(this.flush, this.timeout)
    if (typeof this.interval.unref === 'function') this.interval.unref()
  }

  request = (method, ...params) =>
    new Promise((resolve, reject) => {
      this.requestCb({ method, params }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
    })

  batch = () => {
    const payloads = []
    const fns = []
    let hasSent = false

    const requestCb = ({ method, params }, fn) => {
      const payload = {
        method: method,
        id: (this.id += 1),
        params: params || [],
        jsonrpc: '2.0',
      }

      payloads.push(payload)

      fns.push(fn)

      return payload.id
    }

    return {
      request(method, ...params) {
        return new Promise((resolve, reject) => {
          requestCb({ method, params }, (error, result) => {
            if (error) reject(error)
            else resolve(result)
          })
        })
      },
      requestCb,
      send: () => {
        if (hasSent) return Promise.reject(new Error("can't send twice"))
        hasSent = true
        return this.sendBatch(payloads, fns).catch()
      },
    }
  }

  requestCb = ({ method, params }, fn) => {
    const payload = {
      method: method,
      id: (this.id += 1),
      params: params || [],
      jsonrpc: '2.0',
    }

    this.requests.add({ payload, fn })

    return payload.id
  }

  flush = () => {
    const buffers = [{ payloads: [], fns: [] }]

    this.requests.forEach(request => {
      this.requests.delete(request)

      const buffer = buffers[buffers.length - 1]

      buffer.payloads.push(request.payload)
      buffer.fns.push(request.fn)

      if (buffer.payloads.length === this.maxBufferSize)
        buffers.push({ payloads: [], fns: [] })
    })

    buffers.forEach(({ payloads, fns }) =>
      this.sendBatch(payloads, fns).catch(),
    )
  }

  send = (payload, fn) =>
    fetch(this.url, {
      body: JSON.stringify(payload),
      headers: new Headers({
        'Content-Type': 'application/json',
        ...this.headers,
      }),
      method: 'POST',
    })
      .then(resp => {
        if (!resp.ok) {
          const error = new Error('invalid jsonrpc response')
          error.resp = resp
          throw error
        }
        return resp.json()
      })
      .then(result => fn(null, result))
      .catch(fn)

  sendBatch = (payloads, fns) => {
    const requestM = new Map(
      payloads.map((payload, i) => [payload.id, { payload, fn: fns[i] }]),
    )

    return new Promise((resolve, reject) => {
      this.send(payloads, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
    })
      .then(responses => {
        responses.forEach(response => {
          if (requestM.has(response.id)) {
            const { fn, payload } = requestM.get(response.id)
            requestM.delete(response.id)

            if (response.jsonrpc !== '2.0') {
              const error = new Error('invalid jsonrpc response')
              error.payload = payload
              error.response = response
              setImmediate(fn, error)
              return
            }

            if (response.error) {
              const error = new Error(response.error.message)
              error.code = response.error.code
              error.data = response.error.data
              error.payload = payload
              error.response = response
              setImmediate(fn, error)
              return
            }

            setImmediate(fn, null, response.result)
          }
        })

        requestM.forEach((fn, key) => {
          requestM.delete(key)
          setImmediate(
            fn,
            new Error("buffer did't contain a matching request id"),
          )
        })
      })
      .catch(error => {
        requestM.forEach(fn => {
          setImmediate(fn, error)
        })
        throw error
      })
  }

  cleanup = () => {
    clearInterval(this.interval)
  }
}

class JsonRpcRequestQueue {
  id = 0

  constructor(url = 'http://localhost:8545', { headers = {} } = {}) {
    if (typeof url === 'string') {
      this.url = url
      this.headers = headers
    } else {
      this.send =
        typeof url.currentProvider.sendAsync === 'function'
          ? url.currentProvider.sendAsync.bind(url.currentProvider)
          : (payload, fn) => {
              try {
                fn(null, url.currentProvider.send(payload))
              } catch (error) {
                fn(error)
              }
            }
    }
  }

  request = (method, ...params) =>
    new Promise((resolve, reject) => {
      console.log(method, params)
      this.requestCb({ method, params }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
    })

  requestCb = ({ method, params }, fn) => {
    const payload = {
      method: method,
      id: (this.id += 1),
      params: params || [],
      jsonrpc: '2.0',
    }

    new Promise((resolve, reject) => {
      this.send(payload, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
    })
      .then(response => {
        if (response.jsonrpc !== '2.0') {
          const error = new Error('invalid jsonrpc response')
          error.payload = payload
          error.response = response
          setImmediate(fn, error)
          return
        }

        if (response.error) {
          const error = new Error(response.error.message)
          error.code = response.error.code
          error.data = response.error.data
          error.payload = payload
          error.response = response
          setImmediate(fn, error)
          return
        }

        setImmediate(fn, null, response.result)
      })
      .catch(error => {
        setImmediate(fn, error)
      })

    return payload.id
  }

  send = (payload, fn) =>
    fetch(this.url, {
      body: JSON.stringify(payload),
      headers: new Headers({
        'Content-Type': 'application/json',
        ...this.headers,
      }),
      method: 'POST',
    })
      .then(resp => {
        if (!resp.ok) {
          const error = new Error('invalid jsonrpc response')
          error.resp = resp
          throw error
        }
        return resp.json()
      })
      .then(result => fn(null, result))
      .catch(fn)

  cleanup = () => {
    clearInterval(this.interval)
  }
}

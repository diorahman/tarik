const fetch = require('teh')
const qs = require('querystring')
const UA = 'Tarik/' + require('./package.json').version

const request = (options) => {
  options.headers = options.headers || {}
  if (options.body) {
    if (typeof options.body === 'object') {
      options.headers['Content-Type'] = options.json ? 'application/json' : options.headers['Content-Type']
      if (/json/.test(options.headers['Content-Type'])) {
        // FIXME: if it has scheme, use fast-json-stringify
        options.body = JSON.stringify(options.body)
      } else {
        options.body = qs.stringify(options.body)
      }
    }

    options.headers['Content-Length'] = Buffer.byteLength(options.body)
  }

  const query = options.query || options.qs
  options.uri = options.uri || options.url
  options.uri = query ? (options.uri + '?' + qs.stringify(query)) : options.uri

  return new Promise((resolve, reject) => {
    const r = fetch(options)
    if (r.request.duplex) {
      r.end(options.body)
    }

    let data = []
    let result = {}

    r.on('error', (err) => {
      return reject(r.timeout || err)
    })

    r.on('response', (response) => {
      result.statusCode = response.statusCode
      result.headers = response.headers
    })

    r.on('data', (chunk) => {
      data.push(chunk)
    })

    r.on('end', () => {
      const str = Buffer.concat(data).toString()
      result.body = /json/.test(result.headers['content-type']) ? JSON.parse(str) : str
      resolve(result)
    })
  })
}

const make = (method, uri, body, options) => {
  const query = options ? (options.query || options.qs) : null
  const settings = {
    method,
    uri: query ? (uri + '?' + qs.stringify(query)) : uri
  }

  if (body) {
    settings.body = body
    settings.headers = {
      'Content-Type': (options && options.json) ? 'application/json' : 'application/x-www-form-urlencoded',
      'User-Agent': UA
    }

    if (options && options.headers) {
      Object.assign(settings.headers, options.headers)
      delete options.headers
    }
  }

  Object.assign(settings, options)
  return request(settings)
}

request.post = (uri, body, options) => {
  return make('POST', uri, body, options)
}

request.patch = (uri, body, options) => {
  return make('PATCH', uri, body, options)
}

request.put = (uri, body, options) => {
  return make('PUT', uri, body, options)
}

request.get = (uri, options) => {
  return make('GET', uri, null, options)
}

request.delete = (uri, options) => {
  return make('DELETE', uri, null, options)
}

module.exports = request

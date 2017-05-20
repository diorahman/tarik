const test = require('ava')
const request = require('../')

async function create () {
  const {body} = await request.post('https://requestb.in/api/v1/bins')
  return {
    url: `https://requestb.in/${body.name}`,
    name: body.name
  }
}

async function get (name) {
  const {body} = await request.get(`https://requestb.in/api/v1/bins/${name}/requests`)
  return body.pop()
}

test('urlencoded', async t => {
  const payload = {
    email: 'kayden75@yahoo.com'
  }

  const {url, name} = await create()
  const {statusCode} = await request.post(url, payload)
  const sent = await get(name)

  t.deepEqual(statusCode, 200)
  t.deepEqual(sent.method, 'POST')
  t.deepEqual(sent.headers['Content-Type'], 'application/x-www-form-urlencoded')
  t.deepEqual(sent.form_data, { email: [ payload.email ] })
})

test('put', async t => {
  const payload = {
    email: 'kayden75@yahoo.com'
  }

  const {url} = await create()
  const {statusCode} = await request.put(url, payload)

  t.deepEqual(statusCode, 200)
})

test('patch', async t => {
  const payload = {
    email: 'kayden75@yahoo.com'
  }

  const {url} = await create()
  const {statusCode} = await request.patch(url, payload)
  t.deepEqual(statusCode, 200)
})

test('delete', async t => {
  const payload = {
    email: 'kayden75@yahoo.com',
    dump: 1
  }

  const {url} = await create()
  const {statusCode} = await request.delete(url, { query: payload })
  t.deepEqual(statusCode, 200)
})

test('get', async t => {
  const payload = {
    email: 'kayden75@yahoo.com',
    dump: 1
  }

  const {url} = await create()
  const {statusCode} = await request.get(url, { query: payload })
  t.deepEqual(statusCode, 200)
})

test('json', async t => {
  const payload = {
    service: 'HAHA',
    email: 'kayden75@yahoo.com',
    paymentMethodInfo: {
      label: 'HAHA',
      transactionReferenceMsg: {
        amount: '123456',
        txID: '1234567',
        txMsg: 'Success'
      }
    }
  }

  const {url, name} = await create()
  const {statusCode} = await request.post(url, payload, { json: true, headers: { OK: 1 } })
  const sent = await get(name)
  t.deepEqual(statusCode, 200)
  t.deepEqual(typeof sent.body === 'string' ? JSON.parse(sent.body) : sent.body, payload)
})

test('timeout', async t => {
  const payload = {
    service: 'HAHA',
    email: 'kayden75@yahoo.com',
    paymentMethodInfo: {
      label: 'HAHA',
      transactionReferenceMsg: {
        amount: '123456',
        txID: '1234567',
        txMsg: 'Success'
      }
    }
  }

  const uri = 'http://posttestserver.com/post.php?dump'
  try {
    await request.post(uri, payload, { json: true, timeout: 5 })
  } catch (err) {
    t.deepEqual(err.code, 'ETIMEDOUT')
  }
})

test('get with qs', async t => {
  const {url, name} = await create()
  const {statusCode} = await request({
    method: 'GET',
    url,
    qs: {
      dump: 1
    }
  })
  const sent = await get(name)
  t.deepEqual(statusCode, 200)
  t.deepEqual(sent.query_string, { dump: [ '1' ] })
})

test('get with qs with get', async t => {
  const uri = 'http://posttestserver.com/post.php'
  const {body} = await request.get(uri, {
    qs: {
      dump: 1
    }
  })
  t.truthy(body.indexOf('REQUEST_URI') >= 0)

  const realUri = body.match(/REQUEST_URI = (.+)/)[1] || ''
  t.deepEqual(realUri.match(/dump=1/g).length, 1)
})

test('custom ua', async t => {
  const uri = 'http://posttestserver.com/post.php?dump'
  const {body} = await request.post(uri, {ok: 1}, {headers: {'User-Agent': 'Hihi'}})
  t.true(body.indexOf('HTTP_USER_AGENT = Hihi') >= 0)
})

test('https', async t => {
  const uri = 'https://rest.bandsintown.com/artists'
  const {body} = await request.get(uri)
  t.truthy(body.message)
})

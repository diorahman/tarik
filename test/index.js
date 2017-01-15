const test = require('ava')
const request = require('../')

test('urlencoded', async t => {
  const payload = {
    email: 'kayden75@yahoo.com'
  }

  const uri = 'http://posttestserver.com/post.php?dump'
  const {statusCode} = await request.post(uri, payload)
  t.deepEqual(statusCode, 200)
})

test('put', async t => {
  const payload = {
    email: 'kayden75@yahoo.com'
  }

  const uri = 'http://posttestserver.com/post.php?dump'
  const {statusCode} = await request.put(uri, payload)
  t.deepEqual(statusCode, 200)
})

test('patch', async t => {
  const payload = {
    email: 'kayden75@yahoo.com'
  }

  const uri = 'http://posttestserver.com/post.php?dump'
  const {statusCode} = await request.patch(uri, payload)
  t.deepEqual(statusCode, 200)
})

test('delete', async t => {
  const payload = {
    email: 'kayden75@yahoo.com',
    dump: 1
  }

  const uri = 'http://posttestserver.com/post.php?dump'
  const {statusCode} = await request.delete(uri, { query: payload })
  t.deepEqual(statusCode, 200)
})

test('get', async t => {
  const payload = {
    email: 'kayden75@yahoo.com',
    dump: 1
  }

  const uri = 'http://posttestserver.com/post.php?dump'
  const {statusCode} = await request.get(uri, { query: payload })
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

  const uri = 'http://posttestserver.com/post.php?dump'
  const {statusCode} = await request.post(uri, payload, { json: true, headers: { OK: 1 } })
  t.deepEqual(statusCode, 200)
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
  const uri = 'http://posttestserver.com/post.php'
  const {body} = await request({
    method: 'GET',
    uri,
    qs: {
      dump: 1
    }
  })
  t.truthy(body.indexOf('REQUEST_URI') >= 0)
})

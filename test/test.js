const test = require('tape')
const collectAll = require('../')

test('collectAll', function (t) {
  const stream = collectAll()
  stream.on('readable', function () {
    const chunk = this.read()
    if (chunk) {
      t.strictEqual(chunk, 'onetwo')
      t.end()
    }
  })
  stream.setEncoding('utf8')
  stream.write('one')
  stream.write('two')
  stream.end()
})

test('.collectAll(through)', function (t) {
  const stream = collectAll(function (data) {
    return data + 'yeah?'
  })

  stream.on('readable', function () {
    const chunk = this.read()
    if (chunk) {
      t.strictEqual(chunk, 'cliveyeah?')
      t.end()
    }
  })
  stream.setEncoding('utf8')
  stream.end('clive')
})

test('.collectAll(through): object mode', function (t) {
  function through (collected) {
    collected.forEach(function (object) {
      object.received = true
    })
    return collected
  }
  const stream = collectAll(through, { objectMode: true })

  stream.on('readable', function () {
    const collected = this.read()
    if (collected) {
      t.deepEqual(collected, [ { received: true }, { received: true } ])
      t.end()
    }
  })
  stream.write({})
  stream.end({})
})

test('collect(through): readable object mode', function (t) {
  const stream = collectAll(
    function (data) {
      t.strictEqual(data.toString(), 'yeah')
      return { ok: true }
    },
    { readableObjectMode: true }
  )
  stream.end('yeah')
  t.end()
})

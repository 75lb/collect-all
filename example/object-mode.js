const collectAll = require('../')

function onAllCollected (collected) {
  console.log('Objects collected: ' + collected.length)
  return 1
}

const stream = collectAll(onAllCollected, { objectMode: true })
stream.write({})
stream.write({})
stream.end({}) // outputs 'Objects collected: 3'


var ObjectTree = require('../index.js')
var assert = require('assert')

describe('set value', function() {

  it('simple value', function() {

    var obj = {}

    var ot = new ObjectTree()
    assert.ok(ot.set('attr1', true, obj))
    assert.equal(obj.attr1, true)

  })

  it('no change', function() {

    var obj = {attr1: false}

    var ot = new ObjectTree()
    assert.ok(!ot.set('attr1', false, obj))
    assert.equal(obj.attr1, false)

  })

  it('nested value', function() {

    var obj = {attr1: false}

    var now = Date.now()
    var ot = new ObjectTree()
    assert.ok(ot.set('attr2.nested1.nested2', now, obj))

    assert.equal(obj.attr1, false)
    assert.equal(obj.attr2.nested1.nested2, now)

  })

  it('replace nested value', function() {

    var obj = {attr1: false, attr2: true}

    var now = Date.now()
    var ot = new ObjectTree()
    assert.ok(ot.set('attr2.nested1.nested2', now, obj))

    assert.equal(obj.attr1, false)
    assert.equal(obj.attr2.nested1.nested2, now)

  })

  it('replace nested value (obj)', function() {

    var obj = {attr1: false, attr2: {nestedA: true}}

    var now = Date.now()
    var ot = new ObjectTree()
    assert.ok(ot.set('attr2.nested1.nested2', now, obj))

    assert.equal(obj.attr1, false)
    assert.equal(obj.attr2.nested1.nested2, now)
    assert.equal(obj.attr2.nestedA, true)

  })


})

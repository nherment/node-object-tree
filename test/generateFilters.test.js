
var ObjectTree = require('../index.js')
var assert = require('assert')

describe('generate filters', function() {

  it('empty tree', function(done) {

    var ot = new ObjectTree()
    var eventBus = ot.generateFilters({})
    eventBus.on('filter', function(value, filter, attrList) {
      assert.fail('expected no filter to be emitted')
    })
    eventBus.on('end', function() {
      done()
    })

  })

  it('happy scenario', function(done) {

    var tree = {
      the: {
        barn: {
          is: {
            free: 0
          }
        },
        food: {
          is: {
            tasty: 1
          }
        }
      }

    }

    var ot = new ObjectTree()
    var eventBus = ot.generateFilters(tree)
    var callCount = 0
    eventBus.on('filter', function(value, filter, attrList) {
      callCount ++
      if(value === 0) {
        assert.deepEqual(filter, {the: 'barn', is: 'free'})
        assert.deepEqual(attrList, ['the', 'barn', 'is', 'free'])
      } else if(value === 1) {
        assert.deepEqual(filter, {the: 'food', is: 'tasty'})
        assert.deepEqual(attrList, ['the', 'food', 'is', 'tasty'])
      } else {
        assert.fail('unexpected filter: '+JSON.stringify(filter))
      }
    })
    eventBus.on('end', function() {
      done()
    })

  })

  it('wildcard', function(done) {

    var tree = {
      the: {
        barn: {
          '*': 0,
          is: {
            free: 1
          }
        },
        food: {
          is: {
            tasty: 2
          }
        }
      }
    }

    var ot = new ObjectTree({wildcard: '*'})

    var eventBus = ot.generateFilters(tree)
    var callCount = 0
    eventBus.on('filter', function(value, filter, attrList) {
      callCount ++
      if(value === 0) {
        assert.deepEqual(filter, {the: 'barn'})
        assert.deepEqual(attrList, ['the', 'barn'])
      } else if(value === 1) {
        assert.deepEqual(filter, {the: 'barn', is: 'free'})
        assert.deepEqual(attrList, ['the', 'barn', 'is', 'free'])
      } else if(value === 2) {
        assert.deepEqual(filter, {the: 'food', is: 'tasty'})
        assert.deepEqual(attrList, ['the', 'food', 'is', 'tasty'])
      } else {
        assert.fail('unexpected filter: '+JSON.stringify(filter))
      }
    })
    eventBus.on('end', function() {
      done()
    })

  })

})

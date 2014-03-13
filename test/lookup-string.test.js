
var ObjectTree = require('../index.js')
var assert = require('assert')

describe('lookup string', function() {

  it('empty', function() {

    var expected = {food: 'caramel'}

    var ot = new ObjectTree()
    var actual = ot.lookup('', expected)

    assert.equal(actual, expected)

  })

  it('single element', function() {

    var ot = new ObjectTree()
    var actual = ot.lookup('food.caramel', {food: {'caramel': 1.234}})

    assert.equal(actual, 1.234)

  })


  it('multi element', function() {

    var ot = new ObjectTree()
    var actual = ot.lookup('food.caramel.tastes.chocolate', {
        food: {
          'caramel': {
            tastes: {
              'chocolate': 1.234
            }
          }
        }
      }
    )

    assert.equal(actual, 1.234)

  })

  it('custom separator', function() {

    var ot = new ObjectTree({separator: '|'})
    var actual = ot.lookup('food|caramel|tastes|chocolate', {
        food: {
          'caramel': {
            tastes: {
              'chocolate': 1.234
            }
          }
        }
      }
    )

    assert.equal(actual, 1.234)

  })


  it('extra element', function() {

    var ot = new ObjectTree()
    var actual = ot.lookup('food.caramel.tastes.chocolate.smells.code', {
        food: {
          caramel: {
            tastes: {
              chocolate: 1.234
            }
          }
        }
      }
    )

    assert.equal(actual, undefined)

  })




})

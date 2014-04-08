
var ObjectTree = require('../index.js')
var assert = require('assert')

describe('lookup template', function() {

  describe('templates', function() {

    it('empty', function() {

      var tree = {food: 'caramel'}

      var ot = new ObjectTree()
      var actual = ot.lookupTemplate('', tree)

      assert.equal(actual, '')

    })

    it('single element', function() {

      var ot = new ObjectTree()
      var actual = ot.lookupTemplate('{food.caramel}', {food: {'caramel': 1.234}})

      assert.equal(actual, 1.234)

    })

    it('multi element', function() {

      var ot = new ObjectTree()
      var actual = ot.lookupTemplate('{food.caramel.tastes.chocolate}', {
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
      var actual = ot.lookupTemplate('{food|caramel|tastes|chocolate}', {
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
      var actual = ot.lookupTemplate('{food.caramel.tastes.chocolate.smells.code}', {
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

  describe('non templates', function() {


    it('at all', function() {

      var value = 'food.caramel.tastes.chocolate.smells.code'
      var ot = new ObjectTree()
      var actual = ot.lookupTemplate(value.slice(0), {
          food: {
            caramel: {
              tastes: {
                chocolate: 1.234
              }
            }
          }
        }
      )

      assert.equal(actual, value)

    })

    it('middle', function() {

      var value = 'food.caramel.{tastes.chocolate}.smells.code'
      var ot = new ObjectTree()
      var actual = ot.lookupTemplate(value.slice(0), {
          food: {
            caramel: {
              tastes: {
                chocolate: 1.234
              }
            }
          }
        }
      )

      assert.equal(actual, value)

    })

    it('half (left)', function() {

      var value = '{food.caramel.tastes.chocolate.smells.code'
      var ot = new ObjectTree()
      var actual = ot.lookupTemplate(value.slice(0), {
          food: {
            caramel: {
              tastes: {
                chocolate: 1.234
              }
            }
          }
        }
      )

      assert.equal(actual, value)

    })

    it('half (left-middle)', function() {
      var value = '{food.caramel}.tastes.chocolate.smells.code'
      var ot = new ObjectTree()
      var actual = ot.lookupTemplate(value.slice(0), {
          food: {
            caramel: {
              tastes: {
                chocolate: 1.234
              }
            }
          }
        }
      )

      assert.equal(actual, value)

    })

    it('half (right)', function() {
      var value = 'food.caramel.tastes.chocolate.smells.code}'
      var ot = new ObjectTree()
      var actual = ot.lookupTemplate(value.slice(0), {
          food: {
            caramel: {
              tastes: {
                chocolate: 1.234
              }
            }
          }
        }
      )

      assert.equal(actual, value)

    })

    it('half (middle-right)', function() {

      var value = 'food.caramel.tastes.{chocolate.smells.code}'
      var ot = new ObjectTree()
      var actual = ot.lookupTemplate(value.slice(0), {
          food: {
            caramel: {
              tastes: {
                chocolate: 1.234
              }
            }
          }
        }
      )

      assert.equal(actual, value)

    })
  })




  describe('custom template', function() {

    it('custom template delimiter', function() {

      var ot = new ObjectTree({
        separator: '|',
        template: {
          left: '<',
          right: '>'
        }
      })
      var actual = ot.lookupTemplate('<food|caramel|tastes|chocolate>', {
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

    it('custom template delimiter different length', function() {

      var ot = new ObjectTree({
        separator: '|',
        template: {
          left: '<',
          right: '}}'
        }
      })
      var actual = ot.lookupTemplate('<food|caramel|tastes|chocolate}}', {
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

    it('half custom template delimiter (left)', function() {

      var ot = new ObjectTree({
        separator: '|',
        template: {
          left: '<<<'
        }
      })
      var actual = ot.lookupTemplate('<<<food|caramel|tastes|chocolate}', {
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

    it('half custom template delimiter (right)', function() {

      var ot = new ObjectTree({
        separator: '|',
        template: {
          left: '<<<'
        }
      })
      var actual = ot.lookupTemplate('<<<food|caramel|tastes|chocolate}', {
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
  })

})


[![Build Status](https://api.travis-ci.org/nherment/node-object-tree.png?branch=master)](https://travis-ci.org/nherment/node-object-tree)


```npm install --save object-tree```

# value lookup

### string

    var data = {
      food: {
        caramel: {
          tastes: {
            chocolate: 1.234
          }
        }
      }
    }

    var ot = new ObjectTree()

    var actual = ot.lookup('food.caramel.tastes.chocolate', data)
    console.log(actual) // 1.234

### string with custom separator

    var data = {
      food: {
        caramel: {
          tastes: {
            chocolate: 1.234
          }
        }
      }
    }

    var ot = new ObjectTree({seperator: '::'})

    var actual = ot.lookup('food::caramel::tastes::chocolate', data)
    console.log(actual) // 1.234


### array

    var data = {
      food: {
        caramel: {
          tastes: {
            chocolate: 1.234
          }
        }
      }
    }

    var ot = new ObjectTree()

    var actual = ot.lookup(['food','caramel','tastes','chocolate','smells','code'], data)
    console.log(actual) // 1.234

### filter

    var data = {
      food: {
        caramel: {
          tastes: {
            chocolate: 1.234
          }
        }
      }
    }

    var ot = new ObjectTree()

    var actual = ot.lookup({'food':'caramel','tastes':'chocolate'}, data)
    console.log(actual) // 1.234

### filter with wildcard

    var data = {
      food: {
        caramel: {
          tastes: {
            '*': 444,
            chocolate: 1.234
          }
        }
      }
    }

    var ot = new ObjectTree({
      wildcard: '*'
    })

    var actual = ot.lookup({'food':'caramel','tastes':'flower'}, data)
    console.log(actual) // 444

### template only

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

### template with custom delimiter

    var ot = new ObjectTree({
      template: {
        left: '<',
        right: '>'
      }
    })

    var actual = ot.lookupTemplate('<food.caramel.tastes.chocolate>', {
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

# reverse lookup (generate a tree)

### generate filters from the tree

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

    eventBus.on('filter', function(value, filter, attrList) {
      will be called 3 times:
      // value=0, filter={the: 'barn'}, attrList=['the', 'barn']
      // value=1, filter={the: 'barn', is: 'free'}, attrList=['the', 'barn', 'is', 'free']
      // value=2, filter={the: 'food', is: 'tasty'}, attrList=['the', 'food', 'is', 'tasty']
    })
    eventBus.on('end', function() {
      // no more 'filter' events
    })

# set value

    var obj = {attr1: false, attr2: true}

    ot.set('attr2.nested1.nested2', Date.now(), obj)) // true

set returns true if the object was modified


[![Build Status](https://api.travis-ci.org/nherment/node-object-tree.png?branch=master)](https://travis-ci.org/nherment/node-object-tree)

### string lookup

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

### string lookup, custom separator

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


### array lookup

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

### filter lookup

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

### filter lookup with wildcard

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

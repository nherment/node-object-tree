var _ = require('underscore')

function ObjectTree(options) {
  this._options = options || {}
}

ObjectTree.prototype.lookup = function(filter, tree) {
  if(!filter || !_.isObject(tree)) {
    return tree
  } else if(_.isString(filter)) {
    var separator = this._options.separator || '.'
    return this._resolveFromArray(filter.split(separator), tree, /*trace*/undefined)
  } else if(_.isArray(filter)) {
    return this._resolveFromArray(filter, tree, /*trace*/undefined)
  } else if(_.isObject(filter)) {
    return this._resolveFromFilter(filter, tree, /*trace*/undefined)
  } else {
    return tree[filter]
  }

}

ObjectTree.prototype._resolveFromFilter = function(filter, tree, trace) {
  for(var attr in filter) {
    if(tree && tree.hasOwnProperty(attr)) {
      tree = tree[attr]
      if(tree && !tree.hasOwnProperty(filter[attr]) && this._hasWildcard(tree)) {
        // go get the wildcard
        break
      } else {

        tree = tree[filter[attr]]
        delete filter[attr]

        if(!trace) {
          trace = attr
        } else {
          trace += '.' + attr
        }

        return this._resolveFromFilter(filter, tree, trace)
      }
    }
  }

  // could not find a match, look for the wildcard
  if(this._hasWildcard(tree)) {
    return tree[this._options.wildcard]
  } else if(tree !== undefined) {
    return tree
  }
}

ObjectTree.prototype._resolveFromArray = function(array, tree, trace) {

  for(var i = 0 ; i < array.length ; i++) {
    if(!trace) {
      trace = array[i]
    } else {
      trace += '.' + array[i]
    }
    if(tree && tree.hasOwnProperty(array[i])) {
      tree = tree[array[i]]
    } else {
      return undefined
    }
  }

  return tree

}

ObjectTree.prototype._hasWildcard = function(obj) {
  return this._options.hasOwnProperty('wildcard') && obj && obj.hasOwnProperty(this._options.wildcard)
}

module.exports = ObjectTree

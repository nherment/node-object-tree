

var _ = require('lodash')
var EventEmitter = require('events').EventEmitter

function ObjectTree(options) {
  this._options = options || {}


  var left = '{'
  var right = '}'

  if(this._options.template && this._options.template.left) {
    left = this._options.template.left
  }
  if(this._options.template && this._options.template.right) {
    right = this._options.template.right || '}'
  }
  this._templateRightLength = right.length
  this._templateLeftLength = left.length
  this._templateRegExp = new RegExp('^' + left + '.*' + right + '$', 'm')

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

ObjectTree.prototype.generateFilters = function(tree) {
  var eventBus = new EventEmitter()
  var self = this
  // some event listeners are synchronous. Just in case, defer the tree parsing so that the code has a chance to attach
  // his event listeners
  setImmediate(function() {
    self._generateFiltersFromTree(eventBus, {}, [], tree)
    eventBus.emit('end')
  })
  return eventBus
}


ObjectTree.prototype._generateFiltersFromTree = function(eventBus, filter, attrList, tree) {

  for(var attr in tree) {
    if(this._options.wildcard && attr === this._options.wildcard) {
      eventBus.emit('filter', tree[attr], filter, attrList)
    } else {
      for(var attrValue in tree[attr]) {
        var f = _.clone(filter)

        var attrs = _.clone(attrList)
        attrs.push(attr)
        attrs.push(attrValue)

        f[attr] = attrValue

        if(_.isObject(tree[attr][attrValue])) {
          this._generateFiltersFromTree(eventBus, f, attrs, tree[attr][attrValue])
        } else {
          eventBus.emit('filter', tree[attr][attrValue], f, attrs)
        }
      }
    }

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

ObjectTree.prototype.lookupTemplate = function(template, tree) {

  if(typeof template === 'string' && this.isTemplate(template)) {

    var reference = template.substring(this._templateLeftLength, template.length - this._templateRightLength)
    return this.lookup(reference, tree)

  } else {
    return template
  }
}

ObjectTree.prototype.isTemplate = function(template) {
  return this._templateRegExp.test(template)
}

ObjectTree.prototype.set = function(attr, value, tree) {
  var separator = this._options.separator || '.'
  var nestedAttrs = attr.split(separator)
  var modified = false
  for(var i = 0 ; i < nestedAttrs.length ; i++) {
    if(i === (nestedAttrs.length -1)) {
      if(tree[nestedAttrs[i]] !== value) {
        tree[nestedAttrs[i]] = value
        modified = true
      }
    } else if(!tree.hasOwnProperty(nestedAttrs[i]) || !_.isObject(tree[nestedAttrs[i]])) {
      tree[nestedAttrs[i]] = {}
      tree = tree[nestedAttrs[i]]
      modified = true
    } else {
      tree = tree[nestedAttrs[i]]
    }
  }
  return modified
}

ObjectTree.prototype._hasWildcard = function(obj) {
  return this._options.hasOwnProperty('wildcard') && obj && obj.hasOwnProperty(this._options.wildcard)
}

module.exports = ObjectTree

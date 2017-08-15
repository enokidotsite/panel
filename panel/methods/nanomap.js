var isArray = Array.isArray

function Nanomap (opts, Callback) {
  if (!(this instanceof Nanomap)) return new Nanomap()
  if (typeof opts === 'function') {
    Callback = opts
    opts = {}
  }
  opts = Object.assign({
    new: true
  }, opts)
  this.new = opts.new // call Callback using new
  this.cache = {}
  this.Callback = Callback
}

/*
array = {
  id: id,
  opts: options object to instance with,
  arguments: value || array of values
}
callback = function (opts) {
  return instance of component with a .render method
}
OR
*/

Nanomap.prototype.map = function (array) {
  var instance
  var args
  var Callback = this.Callback
  var newCache = {}
  var elements = new Array(array.length)
  for (var i = 0; i < array.length; i++) {
    args = isArray(array[i].arguments) ? array[i].arguments : [array[i].arguments]
    if (this.cache[array.id]) {
      instance = newCache[array.id] = this.cache[array.id]
      elements.push(instance.render.apply(instance, args))
    } else {
      instance = this.new ? new Callback(array[i].opts) : Callback(array[i].opts)
      newCache[array.id] = instance
      elements.push(instance.render.apply(instance, args))
    }
  }
  this.cache = newCache
  return elements
}

module.exports = Nanomap
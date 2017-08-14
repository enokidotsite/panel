var choo = require('choo')
var config = require('./app')

// wrap choo in cms
var app = config(choo())

// create your app
app.use(require('./plugins/scroll'))

// error route
app.route('*', require('./views/notfound'))

// public
if (module.parent) {
  module.exports = app
} else {
  app.mount('main')
}

var html = require('choo/html')
var choo = require('choo')
var config = require('./app')

// wrap choo in cms
var app = config(choo())

// create your app
app.use(require('./plugins/events'))
app.use(require('./plugins/panel'))

// error
app.route('*', require('./views/default'))

// public
if (module.parent) {
  module.exports = app
} else {
  app.mount('main')
}

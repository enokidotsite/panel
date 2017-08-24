var html = require('choo/html')
var choo = require('choo')
var config = require('./app')

// wrap choo in cms
var app = config(choo())

// panel api
app.use(require('./plugins/events'))
app.use(require('./plugins/interface'))
app.use(require('./plugins/panel'))

// panel catch all route
app.route('*', require('./views/default'))

// public
if (module.parent) {
  module.exports = app
} else {
  app.mount('#panel')
}

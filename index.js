var choo = require('choo')
var app = choo()

// beaker
app.use(require('choo-dat-hypha')('/content'))

app.use(require('./plugins/panel'))
app.use(require('./plugins/sites'))
app.use(require('./plugins/interface'))

// panel catch all route
app.route('*', require('./views/default'))

// public
if (!module.parent) app.mount('body')
else module.exports = app

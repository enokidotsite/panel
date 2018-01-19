var choo = require('choo')
var app = choo()
require('./design')

app.use(require('./plugins/panel'))
app.use(require('./plugins/sites'))
app.use(require('./plugins/interface'))

app.route('*', require('./views/default'))

if (!module.parent) app.mount('body')
else module.exports = app

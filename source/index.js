require('./design')

// dependencies
var wrapper = require('./containers/wrapper-site')
var choo = require('choo')

// create app
var app = choo()

// plugins / stores
app.use(require('./plugins/interface'))
app.use(require('./plugins/designs'))
app.use(require('./plugins/sites'))
app.use(require('./plugins/panel'))
app.use(require('./plugins/docs'))
app.use(require('./plugins/hub'))

// routes
app.route('*', wrapper(require('./views/default')))
app.route('#hub', wrapper(require('./views/hub')))
app.route('#hub/:page', wrapper(require('./views/hub')))
app.route('#hub/guides', wrapper(require('./views/guides')))
app.route('#hub/guides/:page', wrapper(require('./views/guide')))
app.route('#hub/log', wrapper(require('./views/log')))

// init
if (!module.parent) app.mount('body')
else module.exports = app

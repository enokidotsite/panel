var wrapper = require('./containers/wrapper-site')
var choo = require('choo')
require('./design')

// create app
var app = choo()

// external
app.use(require('enoki/choo-panel')())

// plugins
app.use(require('./plugins/interface'))
app.use(require('./plugins/designs'))
app.use(require('./plugins/scroll'))
app.use(require('./plugins/sites'))
app.use(require('./plugins/docs'))
app.use(require('./plugins/hub'))

// routes
app.route('*', wrapper(require('./views/default')))
app.route('#hub', wrapper(require('./views/network')))
app.route('#hub/:page', wrapper(require('./views/hub')))
app.route('#hub/guides', wrapper(require('./views/guides')))
app.route('#hub/guides/:page', wrapper(require('./views/guide')))
app.route('#hub/log', wrapper(require('./views/log')))

// init
if (!module.parent) app.mount('body')
else module.exports = app

var path = require('path')
var fs = require('fs')
var xtend = require('xtend')
var enoki = require('enoki')

var site = enoki({
  directory: path.join(__dirname, '../')
})

module.exports = setup

// wrap choo
function setup (app) {
  var views = getViews()

  app.use(exposeState)
  app.use(structure)

  return app

  // funny anti-pattern
  function exposeState (state, emitter) {
    app.state = state
  }

  // create the site structure
  function structure (state, emitter) {
    state.content = site.content

    // add the index route
    route(state.content)

    // create route
    function route (page) {
      var view = views[page.view] || views.default
      app.route(page.path, makePage(page, view))

      // if there are children, create them
      if (typeof page.children === 'object') {
        Object.values(page.children).forEach(function (child) {
          if (child.children) route(child)
        })
      }
    }
  }

  // composition to extend state obj with page
  function makePage (props, view) {
    return function (state, emit) {
      return view(xtend(state, { page: props }), emit)
    }
  }

  // hacky way to get our views depending upon environment
  function getViews () {
    return module.parent ? getNode() : getBrowserify()

    function getNode () {
      var pathViews = path.join(__dirname, './views')
      return fs.readdirSync(pathViews).reduce(function (result, file) {
        file = path.basename(file, path.extname(file))
        result[file] = require(path.join(pathViews, file))
        return result
      }, { })
    }

    function getBrowserify () {
      var viewSrc = require('./views/*.js', { mode: 'hash' })
      return Object.keys(viewSrc).reduce(function (result, value) {
        result[path.basename(value)] = viewSrc[value]
        return result
      }, { })
    }
  }
}

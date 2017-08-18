var html = require('choo/html')
var objectKeys = require('object-keys')
var path = require('path')

var Modal = require('../components/modal')
var PageNew = require('../containers/page-new')

var pageNew = PageNew()

module.exports = PageNewView 

function PageNewView (state, emit) {
  var blueprint = getBlueprint()
  var views = getViews()

  var content = pageNew.render({
    key: 'add',
    view: views.default ? 'default' : objectKeys(views)[0],
    views: views
  },
  function (name, data) {
    switch (name) {
      case 'save':
        if (!data.value.title || !data.value.uri || !data.value.view) {
          return alert('Missing data')
        }
        emit(state.events.PANEL_PAGE_ADD, {
          title: data.value.title,
          view: data.value.view || 'default',
          path: path.join(state.page.path, data.value.uri)
        })
        break
      case 'cancel': return emit(state.events.REPLACESTATE, '?')
    }
  })

  return Modal(state, emit, content)

  function getBlueprint () {
    if (!state.page) {
      return { }
    } else {
      return (
        state.site.blueprints[state.page.view] ||
        state.site.blueprints.default
      )
    }
  }

  // really gotta clean this one up
  function getViews () {
    if (
      blueprint.pages &&
      typeof blueprint.pages === 'object'
    ) {
      // disabled
      if (blueprint.pages.view === false) return false

      // presets
      if (typeof blueprint.pages.view === 'object') {
        return blueprint.pages.view.reduce(function (result, key) {
          result[key] = state.site.blueprints[key]
          return result
        }, { })
      } else {
        // if just a string
        return {
          [blueprint.pages.view]: state.site.blueprints[blueprint.pages.view]
        }
      }
    } else {
      return objectKeys(state.site.blueprints).reduce(function (result, key) {
        result[key] = state.site.blueprints[key]
        return result
      }, { })
    }
  }
}
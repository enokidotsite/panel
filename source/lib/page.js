var objectKeys = require('object-keys')
var Page = require('enoki/page')

var blueprintDefault = require('../blueprints/default')

module.exports = {
  getChanges: getChanges,
  getBlueprint: getBlueprint,
  getViews: getViews
}

function getChanges (state, emit, page) {
  try {
    page = page || Page(state)
    return state.enoki.changes[page.value('url')]
  } catch (err) {
    return { }
  }
}

function getBlueprint (state, emit, page) {
  try {
    page = page || Page(state)
    return (
      state.site.blueprints[page().value('view')] ||
      state.site.blueprints.default ||
      blueprintDefault
    )
  } catch (err) {
    return blueprintDefault
  }
}

function getViews (props) {
  props = props || { }
  if (!props.blueprint) return console.warn('must define blueprint')
  if (!props.blueprints) return console.warn('must define all blueprints')

  var blueprint = props.blueprint
  var blueprints = props.blueprints

  if (blueprint.pages && typeof blueprint.pages === 'object') {
    // if pages are disabled
    if (blueprint.pages.view === false) return false

    // presets
    if (typeof blueprint.pages.view === 'object') {
      return blueprint.pages.view.reduce(function (result, key) {
        result[key] = blueprints[key]
        return result
      }, { })
    } else {
      // if just a string
      return {
        [blueprint.pages.view]: blueprints[blueprint.pages.view]
      }
    }
  } else {
    return objectKeys(blueprints).reduce(function (result, key) {
      result[key] = blueprints[key]
      return result
    }, { })
  }

  return { }
}
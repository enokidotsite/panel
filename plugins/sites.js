var objectKeys = require('object-keys')

module.exports = sites

function sites (state, emitter, app) {
  var storage

  state.sites = {
    loaded: false,
    active: { }
  }

  state.events.SITES_LOADED = 'sites:loaded'
  state.events.SITE_LOADED = 'site:loaded'
  state.events.SITE_LOAD = 'site:load'

  emitter.on(state.events.DOMCONTENTLOADED, handleInitLoad)
  emitter.on(state.events.SITE_LOAD, handleLoad)

  function handleInitLoad () {
    storate = window.localStorage
    emitter.emit(state.events.SITES_LOADED)
  }

  function handleLoad (data) {

  }
}
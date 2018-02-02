var assert = require('assert')

module.exports = hub

function hub (state, emitter) {
  state.hub = {
    active: 'sites'
  }

  state.events.HUB_ACTIVE = 'state:hub'

  emitter.on(state.events.HUB_ACTIVE, handleHubActive)

  function handleHubActive (data) {
    assert(typeof data ==='object', 'arg1 must be type object')
    state.hub.active = data.active
    if (data.render === true) emitter.emit(state.events.RENDER)
  }
}
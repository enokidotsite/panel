module.exports = plugin

function plugin (state, emitter) {
  emitter.on(state.events.NAVIGATE, function () {
    window.scrollTo(0, 0)
  })
}
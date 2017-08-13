module.exports = counter

function counter (state, emitter) {
  state.count = 0

  emitter.on('count', function (data) {
    state.count += data || 1
    emitter.emit('render')
  })
}

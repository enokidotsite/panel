module.exports = scroll

function scroll (state, emitter) {
  emitter.on('pushState', function () {
    window.scrollTo(0, 0)
  })
}

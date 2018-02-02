var draggableCount = 0
var renderTimeout
var dragTimeout

module.exports = ui

function ui (state, emitter) {
  state.ui = {
    dragActive: false
  }

  emitter.on(state.events.DOMCONTENTLOADED, handleLoad)

  function handleLoad (data) {
    document.body.addEventListener('dragenter', handleDrag, false)
    window.addEventListener('dragend', handleDragEnd, false)
    window.addEventListener('drag', handleDrag, false)
    window.addEventListener('drop', handleDragEnd, false)
  }

  function handleDrag () {
    if (!state.ui.dragActive) {
      clearTimeout(dragTimeout)
      dragTimeout = setTimeout(handleDragEnd, 500)
      state.ui.dragActive = true
      emitter.emit(state.events.RENDER)
    }
  }

  function handleDragEnd (event) {
    if (event) event.preventDefault()
    state.ui.dragActive = false
    clearTimeout(dragTimeout)
    renderTimeout = setTimeout(function () {
      if (!state.ui.dragActive) emitter.emit(state.events.RENDER)
    }, 100)
  }
}

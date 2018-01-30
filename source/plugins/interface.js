var draggableCount = 0

module.exports = ui

function ui (state, emitter) {
  state.ui = {
    dragActive: false
  }

  emitter.on(state.events.DOMCONTENTLOADED, handleLoad)

  function handleLoad (data) {
    window.addEventListener('dragenter', handleDragEnter, false)
    window.addEventListener('dragleave', handleDragLeave, false)
    window.addEventListener('dragend', handleDragEnd, false)
    window.addEventListener('drop', handleDragEnd, false)
  }

  function handleDragEnter (event) {
    event.preventDefault()
    draggableCount += 1
    if (!state.ui.dragActive) {
      state.ui.dragActive = true
      emitter.emit(state.events.RENDER)
    }
  }

  function handleDragLeave (event) {
    event.preventDefault()
    draggableCount -= 1
    if (draggableCount <= 0) {
      state.ui.dragActive = false
      emitter.emit(state.events.RENDER)
      draggableCount = 0
    }
  }

  function handleDragEnd (event) {
    draggableCount = 0
    state.ui.dragActive = false
    emitter.emit(state.events.RENDER)
  }
}

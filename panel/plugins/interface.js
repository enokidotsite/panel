module.exports = interface

var draggableCount = 0

function interface (state, emitter) {
  state.ui = {
    dragActive: false
  }

  emitter.on(state.events.DOMCONTENTLOADED, handleLoad)

  function handleLoad (data) {
    window.addEventListener('dragenter', handleDragEnter, false)
    window.addEventListener('dragleave', handleDragLeave, false)
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
}

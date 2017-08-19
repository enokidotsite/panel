var html = require('choo/html')
var objectValues = require('object-values')

var Modal = require('../components/modal')
var Uploader = require('../components/uploader')

var uploader = Uploader()
var modal = Modal()

module.exports = FileNew

function FileNew (state, emit) {
  return modal.render({
    content: content(),
    handleContainerClick: function () {
      emit(state.events.REPLACESTATE, '?')
    }
  })

  function content () {
    return html`
      <div
        class="x xjc xac bgwhite p2 br1 fwb fs2 psr tac"
        style="height: 50vh; width: 75vw;"
      >
        ${uploader.render({
          upload: true,
          text: 'Drag and drop here, or click to select files',
          handleFile: handleUploadFile,
          handleDragEnter: handleDragEnter,
          handleDragLeave: handleDragLeave
        })}
      </div>
    `
  }

  function handleUploadFile (event, data) {
    emit(state.events.PANEL_FILE_ADD, {
      filename: data.name,
      path: state.page.path,
      result: data.result
    })
  }

  function handleDragEnter (event) {
    var el = event.target.parentNode.parentNode
    el.classList.remove('bgwhite', 'tcblack')
    el.classList.add('bgblack', 'tcwhite')
  }

  function handleDragLeave (event) {
    var el = event.target.parentNode.parentNode
    el.classList.add('bgwhite', 'tcblack')
    el.classList.remove('bgblack', 'tcwhite')
  }
}
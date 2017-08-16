var html = require('choo/html')
var objectValues = require('object-values')

var Modal = require('../components/modal')

module.exports = FileNew

function FileNew (state, emit) {
  return Modal(state, emit, content())

  function content () {
    return html`
      <div
        class="x xjc xac bgwhite p1 br1 fwb fs2 psr"
        style="height: 25vh"
      >
        ${Uploader({
          upload: true,
          handleFile: handleUploadFile
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
}

function Uploader (props) {
  props = props || { }

  return html`
    <div>
      <input
        id="select-file"
        type="file"
        multiple="true"
        class="psa t0 l0 r0 b0 z2 c12 curp"
        onchange=${handleChange}
      />
      <div>
        Drag and drop here
      </div>
    </div>
  `

  function handleChange (event) {
    var files = event.srcElement.files

    // if there are files and we can upload, go for it
    if (files && props.upload !== false) {
      objectValues(files).forEach(handleFile)
    }

    // little callback handler
    if (props.handleChange) {
      props.handleChange('change', {
        files: files ? files : { }
      })
    }
  }

  function handleFile (file) {
    var reader = new FileReader()

    // when the file loads, go for it
    reader.addEventListener('load', function () {
      if (props.handleFile) {
        props.handleFile('upload', {
          name: file.name,
          type: file.type,
          size: file.size,
          result: reader.result
        })
      }
    }, false)

    if (file) reader.readAsDataURL(file)
  }
}
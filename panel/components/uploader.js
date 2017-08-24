var html = require('choo/html')
var objectValues = require('object-values')
var Nanocomponent = require('nanocomponent')

module.exports = Uploader

function Uploader () {
  if (!(this instanceof Uploader)) return new Uploader()
  this.open = this.open.bind(this)
  this.handleChange = this.handleChange.bind(this)
  this.handleFile = this.handleFile.bind(this)
  this.handleDragEnter = this.handleDragEnter.bind(this)
  this.handleDragLeave = this.handleDragLeave.bind(this)
  Nanocomponent.call(this)
}

Uploader.prototype = Object.create(Nanocomponent.prototype)

Uploader.prototype.createElement = function (props) {
  this.props = props || { }
  this.text = this.props.text || 'Drag and drop here'
  this.active = this.props.active || false

  return html`
    <div>
      <input
        id="select-file"
        type="file"
        multiple="true"
        class="op0 psa t0 l0 r0 b0 z2 c12 curp"
        onchange=${this.handleChange}
        ondragenter=${this.handleDragEnter}
        ondragleave=${this.handleDragLeave}
      />
      <div>
        ${this.text}
      </div>
    </div>
  `
}

Uploader.prototype.handleChange = function (event) {
  var self = this
  var files = event.srcElement.files

  // if there are files and we can upload, go for it
  if (files && this.props.upload !== false) {
    objectValues(files).forEach(self.handleFile)
  }

  // little callback handler
  if (this.props.handleChange) {
    this.props.handleChange('change', {
      files: files ? files : { }
    })
  }
}

Uploader.prototype.handleFile = function (file) {
  var self = this
  var reader = new FileReader()

  // when the file loads, go for it
  reader.addEventListener('load', function () {
    if (self.props.handleFile) {
      self.props.handleFile('upload', {
        filename: file.name,
        type: file.type,
        size: file.size,
        result: reader.result
      })
    }
  }, false)

  if (file) reader.readAsDataURL(file)
}

Uploader.prototype.handleDragEnter = function (event) {
  if (this.props.handleDragEnter) {
    this.props.handleDragEnter(event)
  }
}

Uploader.prototype.handleDragLeave = function (event) {
  if (this.props.handleDragLeave) {
    this.props.handleDragLeave(event)
  }
}

Uploader.prototype.open = function () {
  var input = this.element.querySelector('input')
  if (input) input.click()
}

Uploader.prototype.update = function (props) {
  return true
}
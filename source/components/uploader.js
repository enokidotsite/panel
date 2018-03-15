var Nanocomponent = require('nanocomponent')
var objectValues = require('object-values')
var html = require('choo/html')

module.exports = function Wrapper () {
  if (!(this instanceof Uploader)) return new Uploader()
}

class Uploader extends Nanocomponent {
  constructor () {
    super()
    this.state = {

    }
    
    this.open = this.open.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDragEnter = this.handleDragEnter.bind(this)
    this.handleDragLeave = this.handleDragLeave.bind(this)
  }

  createElement (props) {
    this.props = props || { }
    this.text = this.props.text || 'Drag and drop here'
    this.active = this.props.active || false

    return html`
      <div>
        <form enctype="multipart/form-data">
          <input
            id="select-file"
            type="file"
            multiple="true"
            class="op0 psa t0 l0 r0 b0 z2 c12 curp"
            onchange=${this.handleChange}
            ondragenter=${this.handleDragEnter}
            ondragleave=${this.handleDragLeave}
          />
          <div class="p1">
            ${this.text}
          </div>
        </form>
      </div>
    `
  }

  handleChange (event) {
    var self = this
    var files = event.srcElement.files

    // if there are files and we can upload, go for it
    if (files && this.props.upload !== false) {
      if (self.props.handleFiles) {
        self.props.handleFiles('upload', {
          files: files
        })
      }
    }

    // little callback handler
    if (this.props.handleChange) {
      this.props.handleChange('change', {
        files: files ? files : { }
      })
    }
  }

  handleDragEnter (event) {
    if (this.props.handleDragEnter) {
      this.props.handleDragEnter(event)
    }
  }

  handleDragLeave (event) {
    if (this.props.handleDragLeave) {
      this.props.handleDragLeave(event)
    }
  }

  open () {
    var input = this.element.querySelector('input')
    if (input) input.click()
  }

  update (props) {
    return true
  }
}

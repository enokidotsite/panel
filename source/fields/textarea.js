var Nanocomponent = require('nanocomponent')
var SimpleMDE = require('simplemde')
var xtend = require('xtend')
var html = require('choo/html')

var toolbarDefaults = {
  condensed: [
    'bold', 'italic', 'heading', '|',
    'quote', 'unordered-list','|',
    'link', 'image'
  ],
  full: [
    'bold', 'italic', 'heading', '|',
    'quote', 'unordered-list', 'ordered-list', '|',
    'link', 'image', '|',
    'preview'
  ]
}

module.exports = class Textarea extends Nanocomponent {
  constructor () {
    super()
    this.state = {
      id: '',
      key: '',
      value: '',
      valueStart: '',
      toolbar: ''
    }

    this.wrapperLabel = false
    this.toolbar = { }
  }

  createElement (props, emit) {
    this.state = xtend(this.state, props.field)
    this.state.value = this.state.value || ''
    this.toolbar = getToolbar(this.state.toolbar)
    this.emit = emit

    return html`
      <div class="w100 rich-editor psr">
        <div class="psst l0 r0 z2 b0 pen" style="top: 2rem">
          <div class="psa l0 r0" style="background: rgba(255, 255, 255, 0.9); top: -2rem; height: 2rem;"></div>
          <div class="x xjb pea" style="background: linear-gradient(180deg,  rgba(255, 255, 255, 0.9),  rgba(255, 255, 255, 0.9) 75%,  rgba(255, 255, 255, 0));" data-editor-toolbar>
            <div class="py1 fwb usn fs0-8 ttu fc-bg25">
              ${this.state.label || this.state.key}
            </div>
          </div>
          <div class="pen c12" style="height: 5rem"></div>
        </div>
        <div class="input lh1-5" style="margin-top: -5rem">
          <textarea
            class="c12"
            oninput=${emit ? onInput : ''}
          ></textarea>
        </div>
      </div>
    `

    function onInput (event) {
      emit({ value: event.target.value })
    }
  }

  update (props) {
    var value = props.field.value || ''

    if (value !== this.state.value) {
      this.state.value = value
      this.element.querySelector('textarea').value = this.state.value
    }

    // cancel
    if (value === this.state.valueStart) {
      this.simplemde.value(this.state.value)
    }

    return false
  }

  load (element) {
    var self = this

    this.simplemde = new SimpleMDE({
      autoDownloadFontAwesome: false,
      element: element.querySelector('textarea'),
      forceSync: true,
      spellChecker: false,
      status: false,
      toolbar: self.toolbar
    })

    // set default vlue
    this.simplemde.value(this.state.value)
    var elToolbar = element.querySelector('.editor-toolbar')
    if (elToolbar) {
      element.querySelector('[data-editor-toolbar]').appendChild(elToolbar)
    }

    // send state up
    this.simplemde.codemirror.on('change', function () {
      var value = self.simplemde.value() || ''
      if (self.state.value !== value) {
        self.emit({ value: value })
      }
    }, false)
  }

  unload () {
    // this.simplemde.toTextArea()
    // this.simplemde = null
  }
}

function getToolbar (option) {
  var preset = toolbarDefaults[option]

  if (option === false) return false
  if (preset) return preset

  if (typeof option === 'object') {
    return option.map(function (opt) {
      if (opt === '') return '|'
      return opt
    })
  }

  return toolbarDefaults.full
}
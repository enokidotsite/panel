var Nanocomponent = require('nanocomponent')
var SimpleMDE = require('simplemde')
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

module.exports = function Wrapper () {
  if (!(this instanceof Textarea)) return new Textarea()
}

class Textarea extends Nanocomponent {
  constructor () {
    super()
    this.label = false
  }

  createElement (state, emit) {
    this.id = state.id
    this.key = state.key
    this.value = state.value || ''
    this.valueStart = state.value || ''
    this.toolbar = getToolbar(state.toolbar)
    this.emit = emit

    return html`
      <div class="w100 rich-editor psr">
        <div class="psst l0 r0 z2 b0 pen" style="top: 2rem">
          <div class="bgc-bg psa l0 r0" style="top: -2rem; height: 2rem;"></div>
          <div class="bgc-bg x xjb pea" data-editor-toolbar>
            <div class="py1 fwb usn fs0-8 ttu">
              ${state.label || state.key}
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
      emit('input', event.target.value)
    }
  }

  update (props) {
    var value = props.value || ''

    if (value !== this.value) {
      this.value = value
      this.element.querySelector('textarea').value = this.value
    }

    // cancel
    if (value === this.valueStart) {
      this.simplemde.value(this.value)
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
    this.simplemde.value(this.value)
    var elToolbar = element.querySelector('.editor-toolbar')
    if (elToolbar) {
      element.querySelector('[data-editor-toolbar]').appendChild(elToolbar)
    }

    // send state up
    this.simplemde.codemirror.on('change', function () {
      var value = self.simplemde.value() || ''
      if (self.value !== value) {
        self.emit('input', value)
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
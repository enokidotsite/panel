var html = require('choo/html')
var SimpleMDE = require('simplemde')
var Nanocomponent = require('nanocomponent')

var components = { }
module.exports = wrapper

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

function wrapper (state, emit) {
  if (!components[state.id]) components[state.id] = Textarea()
  return components[state.id].render(state, emit)
}

function Textarea () {
  if (!(this instanceof Textarea)) return new Textarea()
  Nanocomponent.call(this)
}

Textarea.prototype = Object.create(Nanocomponent.prototype)

Textarea.prototype.createElement = function (state, emit) {
  this.id = state.id
  this.key = state.key
  this.value = state.value || ''
  this.valueStart = state.value || ''
  this.toolbar = getToolbar(state.toolbar)
  this.emit = emit

  return html`
    <div class="input rich-editor">
      <textarea
        class="c12"
        oninput=${emit ? onInput : ''}
      ></textarea>
    </div>
  `

  function onInput (event) {
    emit('input', event.target.value)
  }
}

Textarea.prototype.update = function (state) {
  if (state.value !== this.value) {
    this.value = state.value || ''
    this.element.querySelector('textarea').value = this.value
  }

  // cancel
  if (state.value === this.valueStart) {
    this.simplemde.value(this.value)
  }

  return false
}

Textarea.prototype.load = function (element) {
  var self = this
  this.simplemde = new SimpleMDE({
    element: element.querySelector('textarea'),
    forceSync: true,
    spellChecker: false,
    status: false,
    toolbar: self.toolbar
  })

  this.simplemde.value(this.value)
  this.simplemde.codemirror.on('change', function () {
    self.emit('input', self.simplemde.value())
  })
}

Textarea.prototype.unload = function () {
  delete components[this.id]
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
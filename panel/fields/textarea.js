var html = require('choo/html')
var SimpleMDE = require('simplemde')
var Nanocomponent = require('nanocomponent')

var components = { }
module.exports = wrapper

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
    status: false
  })

  this.simplemde.value(this.value)
  this.simplemde.codemirror.on('change', function() {
    self.emit('input', self.simplemde.value())
  })
}

Textarea.prototype.unload = function () {
  delete components[this.id]
}

function textarea (state, emit) {
  var el = html`
    <textarea
      class="c12"
      oninput=${emit ? onInput : ''}
    ></textarea>
  `

  el.innerHTML = state.value || ''

  return el

  function onInput (event) {
    emit('update', event.target.value)
  }
}
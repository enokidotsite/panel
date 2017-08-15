var html = require('choo/html')
var SimpleMDE = require('simplemde')
var Nanocomponent = require('nanocomponent')

var components = { }
module.exports = wrapper

function wrapper (state, emit) {
  if (!components[state.id]) {
    components[state.id] = Textarea()
  }

  return components[state.id].render(state, emit)
}

function Textarea () {
  if (!(this instanceof Textarea)) return new Textarea()
  Nanocomponent.call(this)
}

Textarea.prototype = Object.create(Nanocomponent.prototype)

Textarea.prototype.createElement = function (state, emit) {
  this.id = state.id
  this.value = state.value || ''
  this.key = state.key
  this.emit = emit

  return html`
    <div>
      <textarea
        class="c12"
        oninput=${emit ? onInput : ''}
      ></textarea>
      <div id="${this.key}"></div>
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
  return false
}

Textarea.prototype.load = function (element) {
  var self = this
  var simplemde = new SimpleMDE({
    element: element.querySelector('textarea'),
    forceSync: true,
    spellChecker: false,
    status: false
  })

  simplemde.value(this.value)
  simplemde.codemirror.on('change', function() {
    self.emit('input', simplemde.value())
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
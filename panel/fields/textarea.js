var html = require('choo/html')
var Nanocomponent = require('nanocomponent')

var components = { }

module.exports = wrapper

function wrapper (state, emit) {
  var id = state.id + ':' + state.key
  if (!components[id]) {
    components[id] = Textarea()
  }

  return components[id].render(state, emit)
}

function Textarea () {
  if (!(this instanceof Textarea)) return new Textarea()
  Nanocomponent.call(this)
}

Textarea.prototype = Object.create(Nanocomponent.prototype)

Textarea.prototype.createElement = function (state, emit) {
  this.value = state.value || ''
  this.key = state.key

  return html`
    <div>
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
  return false
}

Textarea.prototype.load = function (element) {
  element.querySelector('textarea').value = this.value
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
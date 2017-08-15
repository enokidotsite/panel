var html = require('choo/html')
var Nanocomponent = require('nanocomponent')

var components = { }

module.exports = wrapper

function wrapper (state, emit) {
  if (!components[state.key]) {
    components[state.key] = Textarea()
  }

  return components[state.key].render(state, emit)
}

function Textarea () {
  if (!(this instanceof Textarea)) return new Textarea()
  this.value = { }
  Nanocomponent.call(this)
}

Textarea.prototype = Object.create(Nanocomponent.prototype)

Textarea.prototype.createElement = function (state, emit) {
  this.value = state.value
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
    this.value = state.value
    this.element.querySelector('textarea').innerHTML = state.value
  }
  return false
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
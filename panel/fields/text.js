var html = require('choo/html')
var Nanocomponent = require('nanocomponent')

var components = { }
module.exports = wrapper

function wrapper (state, emit) {
  if (!components[state.id]) components[state.id] = Text()
  return components[state.id].render(state, emit)
}

function Text () {
  if (!(this instanceof Text)) return new Text()
  this.value = { }
  Nanocomponent.call(this)
}

Text.prototype = Object.create(Nanocomponent.prototype)

Text.prototype.createElement = function (state, emit) {
  this.id = state.id
  this.value = state.value
  this.key = state.key

  return html`
    <div>
      <input
        name="${state.key}"
        class="c12"
        type="text"
        value="${state.value || ''}"
        oninput=${emit ? onInput : ''}
        onfocus=${emit ? onFocus : ''}
      />
    </div>
  `

  function onInput (event) {
    emit('input', event.target.value)
  }

  function onFocus (event) {
    emit('focus', event.target.value)
  }
}

Text.prototype.update = function (state) {
  if (state.value !== this.value) {
    this.value = state.value
    this.element.querySelector('input').value = state.value
  }
  return false
}

Text.prototype.load = function (state) {
  
}

Text.prototype.unload = function (state) {
  delete components[this.id]
}

function text (state, emit) {
  return html`
    <input
      name="${state.key}"
      class="c12"
      type="text"
      value="${state.value || ''}"
      oninput=${emit ? onInput : ''}
      onfocus=${emit ? onFocus : ''}
    />
  `

  function onInput (event) {
    emit('input', event.target.value)
  }

  function onFocus (event) {
    emit('focus', event.target.value)
  }
}

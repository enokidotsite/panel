var html = require('bel')
var tagsInput = require('tags-input')
var Nanocomponent = require('nanocomponent')

var components = { }

module.exports = wrapper

function wrapper (state, emit) {
  if (!components[state.key]) {
    components[state.key] = Tags()
  }

  return components[state.key].render(state, emit)
}

function Tags () {
  if (!(this instanceof Tags)) return new Tags()
  this.value = { }
  Nanocomponent.call(this)
}

Tags.prototype = Object.create(Nanocomponent.prototype)

Tags.prototype.createElement = function (state, emit) {
  this.value = state.value
  this.key = state.key

  return html`
    <div>
      <input
        name="${state.key}"
        class="c12"
        type="tags"
        value="${state.value || ''}"
        onchange=${onInput}
      />
    </div>
  `

  function onInput (event) {
    emit('change', event.target.value.split(','))
  }
}

Tags.prototype.update = function (state) {
  if (state.value !== this.value) {
    this.value = state.value
    this.element.querySelector('input').value = state.value
  }
  return false
}

Tags.prototype.load = function (state) {
  tagsInput(this.element.querySelector('input'))
}

Tags.prototype.unload = function (state) {
  delete components[this.key]
}

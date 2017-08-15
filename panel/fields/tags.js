var html = require('choo/html')
var tagsInput = require('tags-input')
var Nanocomponent = require('nanocomponent')

var components = { }

module.exports = wrapper

function wrapper (state, emit) {
  var id = state.id + ':' + state.key
  if (!components[id]) components[id] = Tags()
  return components[id].render(state, emit)
}

function Tags () {
  if (!(this instanceof Tags)) return new Tags()
  this.value = { }
  Nanocomponent.call(this)
}

Tags.prototype = Object.create(Nanocomponent.prototype)

Tags.prototype.createElement = function (state, emit) {
  this.key = state.key
  this.value = state.value
  this.valueStart = state.value

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
    var el = this.element.querySelector('.tags-input')
    this.value = state.value
    this.element.querySelector('input').value = state.value

    // reset
    if (this.value === this.valueStart) {
      this.element.removeChild(el)
      tagsInput(this.element.querySelector('input'))
    }
  }
  return false
}

Tags.prototype.load = function (state) {
  tagsInput(this.element.querySelector('input'))
}

Tags.prototype.unload = function (state) {
  delete components[this.key]
}

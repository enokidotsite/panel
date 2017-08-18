var html = require('choo/html')
var objectKeys = require('object-keys')
var Nanocomponent = require('nanocomponent')

module.exports = Dropdown

function Dropdown () {
  if (!(this instanceof Dropdown)) return new Dropdown()
  this.value = { }
  Nanocomponent.call(this)
}

Dropdown.prototype = Object.create(Nanocomponent.prototype)

Dropdown.prototype.createElement = function (state, emit) {
  var self = this
  this.key = state.key
  this.value = state.value || { }

  return html`
    <div>
      <select
        name="${state.key}"
        class="c12"
        type="tags"
        onchange=${onInput}
      />${options()}</select>
    </div>
  `

  function options () {
    return objectKeys(self.value).map(function (option) {
      return html`
        <option value="${option}">
          ${self.value[option].title || option}
        </option>
      `
    })
  }

  function onInput (event) {
    emit('change', event.target.value)
  }
}

Dropdown.prototype.update = function (state) {
  if (state.value !== this.value) {
    this.value = state.value
    // this.element.querySelector('input').value = state.value
  }
  return false
}

Dropdown.prototype.load = function (state) {
  
}

Dropdown.prototype.unload = function (state) {
  
}

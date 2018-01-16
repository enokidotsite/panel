var html = require('choo/html')
var objectKeys = require('object-keys')
var Nanocomponent = require('nanocomponent')

module.exports = function Wrapper () {
  if (!(this instanceof Dropdown)) return new Dropdown()
  this.value = { 
  Nanocomponent.call(this)
}

class Dropdown extends Nanocomponent {
  constructor () {
    super()
  }

  createElement (state, emit) {
    var self = this
    this.key = state.key
    this.value = state.value || { }
    this.value.selected = this.value.selected || ''
    this.value.options = this.value.options || { }

    return html`
      <div>
        <div class="select">
          <select
            name="${state.key}"
            class="c12"
            type="tags"
            onchange=${onInput}
          />${options()}</select>
        </div>
      </div>
    `

    function options () {
      return objectKeys(self.value.options).map(function (option) {
        return html`
          <option
            value="${option}"
            ${self.value.selected === option ? 'selected' : ''}
          >
            ${self.value.options[option].title || option}
          </option>
        `
      })
    }

    function onInput (event) {
      emit('change', event.target.value)
    }
  }

  update () {
    if (state.value && state.value.selected !== this.value.selected) {
      this.value.selected = state.value.selected
    }
    return false
  }
}

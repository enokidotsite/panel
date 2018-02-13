var Nanocomponent = require('nanocomponent')
var objectKeys = require('object-keys')
var html = require('choo/html')
var xtend = require('xtend')

module.exports = class Dropdown extends Nanocomponent {
  constructor () {
    super()
    this.state = {
      value: {
        selected:  '',
        options: { }
      }
    }
  }

  createElement (props, emit) {
    var self = this
    this.state = xtend(this.state, props.field)

    return html`
      <div>
        <div class="select">
          <select
            name="${this.state.key}"
            class="c12"
            type="tags"
            onchange=${onInput}
          />${options()}</select>
        </div>
      </div>
    `

    function options () {
      return objectKeys(self.state.value.options).map(function (option) {
        return html`
          <option
            value="${option}"
            ${self.state.value.selected === option ? 'selected' : ''}
          >
            ${self.state.value.options[option].title || option}
          </option>
        `
      })
    }

    function onInput (event) {
      emit('change', event.target.value)
    }
  }

  update (props) {
    if (props.field.value && props.field.value.selected !== this.state.value.selected) {
      this.value.selected = props.value.selected
    }
    return true
  }
}

var Nanocomponent = require('nanocomponent')
var html = require('choo/html')
var xtend = require('xtend')

module.exports = class Text extends Nanocomponent {
  constructor () {
    super()
    this.state = {
      value: ''
    }
  }

  createElement (props, emit) {
    this.state = xtend(this.state, props.field)
    this.state.value = this.state.value || ''

    return html`
      <div>
        <input
          name="${this.state.key}"
          class="input py1 px1-5"
          type="text"
          value="${this.state.value}"
          oninput=${onInput}
          ${this.state.required ? 'required' : ''}
        />
      </div>
    `

    function onInput (event) {
      emit({ value: event.target.value })
    }
  }

  update (props) {
    this.state = xtend(this.state, props.field)
    this.state.value = props.field.value || ''
    return true
  }
}
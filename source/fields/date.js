var Nanocomponent = require('nanocomponent')
var html = require('choo/html')
var xtend = require('xtend')

module.exports = class Date extends Nanocomponent {
  constructor () {
    super()
    this.state = {
      value: ''
    }
  }

  createElement (props, emit) {
    this.state = xtend(this.state, props.field)
    this.state.value = this.state.value || ''
    this.oninput = props.oninput

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
      props.oninput({ value: event.target.value })
    }
  }

  update (props) {
    return true
  }
}
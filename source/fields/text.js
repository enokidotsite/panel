var Nanocomponent = require('nanocomponent')
var html = require('choo/html')
var xtend = require('xtend')

module.exports = function Wrapper () {
  if (!(this instanceof Text)) return new Text()
}

class Text extends Nanocomponent {
  constructor () {
    super()
    this.state = {
      value: ''
    }
  }

  createElement (state, emit) {
    this.state = xtend(this.state, state)

    return html`
      <div>
        <input
          name="${this.state.key}"
          class="input py1 px1-5"
          type="text"
          value="${this.state.value}"
          oninput=${onInput}
        />
      </div>
    `

    function onInput (event) {
      emit({ value: event.target.value })
    }
  }

  update (props) {
    this.state.value = props.value || ''
    return true
  }
}
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

  load (element) {
    // override
    if (this.state.override === true) {
      this.oninput({ value: getNow() })
      return 
    }

    // default
    if (!this.state.value && this.state.default === 'today') {
      this.oninput({ value: getNow() })
      return
    }
  }

  createElement (props, emit) {
    this.state = xtend(this.state, props.field)
    this.state.value = this.state.value
    this.oninput = props.oninput

    return html`
      <div>
        <input
          name="${this.state.key}"
          class="input py1 px1-5"
          type="date"
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
    return props.field.value !== this.state.value
  }
}

function getNow () {
  var date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().substring(0, 10)
}

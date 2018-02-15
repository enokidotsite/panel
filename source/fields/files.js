var Nanocomponent = require('nanocomponent')
var html = require('choo/html')
var xtend = require('xtend')

module.exports = class Files extends Nanocomponent {
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
        Files
      </div>
    `

    function onInput (event) {
      emit({ value: event.target.value })
    }
  }

  update (props) {
    return true
  }
}
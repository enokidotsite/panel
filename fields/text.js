var html = require('choo/html')
var Nanocomponent = require('nanocomponent')

module.exports = function Wrapper () {
  if (!(this instanceof Text)) return new Text()
}

class Text extends Nanocomponent {
  constructor () {
    super()
    this.value = { }
  }

  createElement (state, emit) {
    this.id = state.id
    this.value = state.value
    this.key = state.key

    return html`
      <div>
        <input
          name="${state.key}"
          class="input p1"
          type="text"
          value="${state.value || ''}"
          oninput=${emit ? onInput : ''}
          onfocus=${emit ? onFocus : ''}
        />
      </div>
    `

    function onInput (event) {
      emit('input', event.target.value)
    }

    function onFocus (event) {
      emit('focus', event.target.value)
    }
  }

  update (state) {
    this.value = state.value
    return true
  }
}
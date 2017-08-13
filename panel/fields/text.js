var html = require('bel')

module.exports = text

function text (state, emit) {
  return html`
    <input
      name="${state.key}"
      class="c12"
      type="text"
      value="${state.value || ''}"
      oninput=${emit ? onInput : ''}
      onfocus=${emit ? onFocus : ''}
    />
  `

  function onInput (event) {
    emit('input', event.target.value)
  }

  function onFocus (event) {
    emit('focus', event.target.value)
  }
}

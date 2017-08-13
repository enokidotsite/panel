var html = require('bel')

module.exports = textarea

function textarea (state, emit) {
  var el = html`
    <textarea
      class="c12"
      oninput=${emit ? onInput : ''}
    ></textarea>
  `

  el.innerHTML = state.value || ''

  return el

  function onInput (event) {
    emit('update', event.target.value)
  }
}
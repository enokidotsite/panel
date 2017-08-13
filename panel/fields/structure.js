var html = require('bel')

module.exports = structure

function structure (state, emit) {
  return html`
    <pre class="ffmono" style="height: 10rem; overflow-y: auto;">${JSON.stringify(state.value, { } , 2) || ''}</pre>
  `

  function onInput (event) {
    emit('update', event)
  }
}
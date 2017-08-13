var html = require('bel')

module.exports = button

function button (state, emit) {
  return html`
    <div>${state.value}</div>
  `
}
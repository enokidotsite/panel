var html = require('choo/html')

module.exports = button

function button (state, emit) {
  return html`
    <div>${state.value}</div>
  `
}
var html = require('choo/html')
var wrapper = require('../containers/wrapper-hub')
var format = require('../components/format')

module.exports = wrapper(view)

function view (state, emit) {
  return html`
    <div class="p2">
      <div class="p2">
        <h2
          class="fs3 lh1-25"
          style="color: ${state.page.color}"
        >${state.page.title}</h2>
      </div>
      <div class="p2 x xjc">
        <div class="copy c12 sm-c10 md-c8 p2">
          ${format(state.page.text)}
        </div>
      </div>
    </div>
  `
}
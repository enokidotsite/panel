var html = require('choo/html')
var wrapper = require('../containers/wrapper-hub')
var format = require('../components/format')

module.exports = wrapper(view)

function view (state, emit) {
  var tags = state.page.tags || [ ]
  return html`
    <div class="p2">
      <div class="p2 c12">
        <h2
          class="fs3 lh1-25 tac"
          style="color: ${state.page.color}"
        >${state.page.title}</h2>
      </div>
      <div class="p2 sm-pt4 c12 tac fs0-8">
        ${tags.map(function (tag) {
          return html`<span class="button-inline">${tag}</span>`
        })}
      </div>
      <div class="p2 c12 x xjc">
        <div class="copy">
          ${format(state.page.text)}
        </div>
      </div>
    </div>
  `
}
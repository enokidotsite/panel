var html = require('choo/html')
var wrapper = require('../components/wrapper')
var format = require('../components/format')

module.exports = wrapper(view)

function view (state, emit) {
  return html`
    <div class="x xw xjc c12 p1">
      <div class="p1 c8 sm-c12">
        <div class="fs2 fwb">${state.page.title}</div>
        <div class="ffmono tcgrey">
          ${state.page.date}, 
          <a href="${state.page.source}">Source</a>
        </div>
      </div>
      <div class="c8 sm-c12 p1 copy">
        ${format(state.page.text)} 
      </div>
    </div>
  `
}

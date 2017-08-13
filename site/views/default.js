var html = require('bel')
var path = require('path')
var ov = require('object-values')
var wrapper = require('../components/wrapper')
var format = require('../components/format')

module.exports = wrapper(view)

function view (state, emit) {
  return html`
    <div class="x xw xjc c12 p1">
      <div class="p1 c8 sm-c12">
        <div class="fs2 fwb">${state.page.title}</div>
      </div>
      <div class="c8 sm-c12 p1 copy">
        ${format(state.page.text)} 
      </div>
    </div>
  `
}

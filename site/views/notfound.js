var html = require('bel')
var path = require('path')
var ov = require('object-values')
var wrapper = require('../components/wrapper')
var format = require('../components/format')

module.exports = wrapper(view)

function view (state, emit) {
  return html`
    <div class="x xw xjc c12 p1 fs2">
      Page not found
    </div>
  `
}

var html = require('choo/html')
var ov = require('object-values')
var xt = require('xtend')

var wrapper = require('../components/wrapper')
var thumbnail = require('../components/thumbnail')

module.exports = wrapper(projects)

function projects (state, emit) {
  var entries = ov(state.page.children)

  return html`
    <div class="p1 x xw sm-mt4">
      ${entries.map(thumbnail)}
    </div>
  `
}

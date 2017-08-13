var html = require('choo/html')
var ov = require('object-values')
var wrapper = require('../components/wrapper')

module.exports = wrapper(blog)

function blog (state, emit) {
  var entries = ov(state.page.children)

  return html`
    <div class="p1 x xw sm-mt4">
      ${entries.map(entry)}
    </div>
  `
}

function entry (state) {
  return html`
    <a href="${state.url}" class="db nbb p1 c6 sm-c12">
      <div class="fs2 fwb">
        ${state.title}
      </div>
      <div class="ffmono tcgrey">
        ${state.date}
      </div>
      <div class="pt1">
        ${state.excerpt}
      </div>
    </a>
  `
}

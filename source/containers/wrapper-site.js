var queryString = require('query-string')
var raw = require('choo/html/raw')
var html = require('choo/html')
var ok = require('object-keys')
var xtend = require('xtend')
var path = require('path')

module.exports = wrapper

function wrapper (view) {
  return function (state, emit) {
    var href = state.query.url || '/'
    var page = state.content[href] || { }
    
    return html`
      <body class="fs1 ff-sans x xdc vhmn100">
        ${view(xtend(state, { page: page }), emit)}
        ${state.panel.loading ? loading() : ''}
      </body>
    `
  }
}


function loading () {
  return html`
    <div class="psf z3 r0 b0">
      <div class="loader"></div>
    </div>
  `
}
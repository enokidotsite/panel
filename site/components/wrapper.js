var html = require('choo/html')
var ov = require('object-values')
var path = require('path')

module.exports = wrapper

function wrapper (view) {
  return function (state, emit) {
    return html`
      <main>
        <a class="db icon-panel" href="?panel=active"></a>
        <div class="c12 p1">
          ${title(state.content)}
          ${navigation({
            active: state.page ? state.page.path : '',
            links: state.content ? state.content.children : { }
          })}
        </div>
        ${view(state, emit)}
        ${footer(state, emit)}
      </main>
    `
  }
}

function title (state, emit) {
  return html` 
    <div class="c12 p1 fwb tac fs3 lh1">
      <a href="/" class="nbb">${state.title}</a>
    </div>
  `
}

function navigation (state, emit) {
  var active = state.active || ''
  var links = ov(state.links) || [ ]

  return html`
    <div class="x xjc ffmono">
      ${links.map(link)}
    </div>
  `

  function link (link) {
    var activeClass = isActive(link.dirname) ? 'fwb' : ''
    return html`
      <div class="p0-5 ${activeClass}">
        <a href="${link.url}">${link.title || link.dirname}</a>
      </div>
    `
  }

  function isActive (pathLink) {
    return active
      .split(path.sep)
      .filter(str => str)[0] ===
      path.basename(pathLink)
  }
}

function footer (state, emit) {
  return html`
    <div class="c12 p2 tcgrey">
      <div class="c12 x xjb pt1 bt1">
        <div>
          Enoki
        </div>
        <div>
          <a href="#">Back to Top</a>
        </div>
      </div>
    </div>
  `
}

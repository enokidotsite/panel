var format = require('../components/format')
var html = require('choo/html')

module.exports = Hub

function Hub (state, emit) {
  if (!state.docs.loaded) {
    emit(state.events.DOCS_LOAD)
    return ''
  }

  var page = state.docs.content['/' + state.query.hub] || { }

  return html`
    <div class="xx x xdc">
      ${renderNavigation(state, emit)}
      ${renderContent()}
    </div>
  `

  function renderContent () {
    return html`
      <div class="p2 x xjc">
        <div class="copy c12 sm-c10 md-c8 p2">
          ${format(page.text)}
        </div>
      </div>
    `
  }
}

function renderNavigation (state, emit) {
  var links = ['docs', 'faq', 'log']
  return html`
    <div class="px2">
      <div class="x xjb py1">
        <div class="x py1 fs2 fw500">
          ${links.map(renderLink)}
        </div>
        <div class="py1 px2">
          <input type="text" class="input px1-5" placeholder="Search" onfocus=${handleFocus} />
        </div>
      </div>
      <div class="w100 px2"><div class="w100 bb1-bg10"></div></div>
    </div>
  `

  function renderLink (href) {
    var hrefPage = state.docs.content['/' + href]
    var colorClass = state.query.hub === href ? '' : 'fc-bg25 fch-fg'
    return html`
      <div class="px2 py1">
        <a href="?hub=${href}" class="${colorClass} tfcm">${hrefPage.title}</a>
      </div>
    `
  }
}

function handleFocus (event) {
  event.target.value = 'Coming soon'
}
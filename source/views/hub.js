var html = require('choo/html')
var wrapper = require('../containers/wrapper-hub')
var format = require('../components/format')

module.exports = wrapper(hub)

function hub (state, emit) {
  return html`
    <div class="xx x xdc p2">
      <div class="p2 x xjc">
        <div class="copy">
          ${format(state.page.text)}
        </div>
      </div>
    </div>
  `
}

function renderNavigation (state, emit) {
  var links = ['guides', 'docs', 'faq', 'log']
  
  return html`
    <div class="px2">
      <div class="x xjb py1">
        <div class="x py1 fs2 fwb">
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
    var hrefPage = state.docs.content['/' + href] || { }
    var colorClass = state.params.page === href ? '' : 'fc-bg25 fch-fg'
    return html`
      <div class="px2 py1">
        <a href="/#hub/${href}" class="${colorClass} tfcm">${hrefPage.title}</a>
      </div>
    `
  }
}

function handleFocus (event) {
  event.target.value = 'Coming soon'
}

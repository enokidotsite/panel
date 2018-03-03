var html = require('choo/html')

var Header = require('../components/header')
var designOptions = require('../design/options')

module.exports = wrapper

function wrapper (view) {
  return function (state, emit) {

    // extend state
    var href = state.href.replace('/hub/', '')
    state.page = state.docs.content['/' + href] || { }

    if (state.ui.history.hub !== href) {
      emit(state.events.UI_HISTORY, {
        route: 'hub',
        path: href
      })
    }

    return [
      Header(state, emit),
      renderNavigation(state, emit),
      renderContent(),
      renderFooter(state, emit)
    ]

    function renderContent () {
      // async load content
      if (!state.docs.loaded) {
        emit(state.events.DOCS_LOAD)
        return html`<div class="bgc-fg xx bl1-bg90"></div>`
      } else {
        return view(state, emit)
      }
    }
  }
}

function renderNavigation (state, emit) {
  var hrefActive = state.href.replace('/hub/', '')
  var links = ['guides', 'docs', 'log']
  var highlight = state.page.background || designOptions.colors.fg

  return html`
    <div class="px2 bgc-fg bl1-bg90" style="--highlight: ${highlight}">
      <div class="x xjb oh">
        <div class="x py1 fs2 fwb">
          ${links.map(renderLink)}
        </div>
        <div class="px2 py2">
          <input
            type="text"
            class="input dark px1-5"
            placeholder="Search"
            onfocus=${handleFocus}
          />
        </div>
      </div>
    </div>
  `

  function renderLink (href) {
    var hrefPage = state.docs.content['/' + href] || { }
    var active = hrefActive.indexOf(href) >= 0
    var colorClass = active ? 'fc-bg' : 'fc-bg80 fch-bg'
    return html`
      <div class="p2 nav-link dark">
        <a href="/#hub/${href}" class="${colorClass} tfcm">${hrefPage.title}</a>
      </div>
    `
  }
}

function renderFooter (state, emit) {
  var hrefActive = state.href.replace('/hub/', '')
  var links = ['guides', 'docs', 'log']

  return html`
    <div class="bgc-fg fc-bg70 bt1-bg90 bl1-bg90 px2 x xw xjb usn">
      <div class="x p1">
        ${links.map(renderLink)}
      </div>
      <div class="p1 x">
        <div class="p1 fwb">enoki</div>
        <div class="p1 ff-mono">v${state.panel.version}</div>
      </div>
    </div>
  `

  function renderLink (href) {
    var hrefPage = state.docs.content['/' + href] || { }
    var active = hrefActive.indexOf(href) >= 0
    var colorClass = active ? 'fc-bg' : 'fc-bg70 fch-bg'
    return html`
      <div class="p1">
        <a href="/#hub/${href}" class="${colorClass} tfcm">${hrefPage.title}</a>
      </div>
    `
  }
}

function handleFocus (event) {
  event.target.value = 'Coming soon'
}

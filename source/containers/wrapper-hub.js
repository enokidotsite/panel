var html = require('choo/html')

var Header = require('../components/header')

module.exports = wrapper

function wrapper (view) {
  return function (state, emit) {

    // extend state
    var href = state.href.replace('/hub/', '')
    state.page = state.docs.content['/' + href] || { }

    return [
      Header(state, emit),
      renderNavigation(state, emit),
      renderContent() 
    ]

    function renderContent () {
      // async load content
      if (!state.docs.loaded) {
        emit(state.events.DOCS_LOAD)
        return
      }
      return view(state, emit)
    }
  }
}

function renderNavigation (state, emit) {
  var hrefActive = state.href.replace('/hub/', '')
  var links = ['guides', 'docs', 'log']
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
    var colorClass = hrefActive.indexOf(href) >= 0 ? '' : 'fc-bg25 fch-fg'
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

var queryString = require('query-string')
var html = require('choo/html')

var Breadcrumbs = require('./breadcrumbs')

module.exports = header

function header (state, emit) {
  var search = queryString.parse(location.search)
  var editorActive = typeof search.url !== 'undefined' && state.sites.active
  var sitesActive = typeof search.sites !== 'undefined'
  var hubActive = state.route.indexOf('hub') >= 0

  // non p2p
  if (!state.sites.p2p) return ''

  return html`
    <div id="header" class="x xjb usn z2 psr oh bgc-bg2-5">
      <div class="x xx oxh">
        ${editorActive ? breadcrumbs() : html`<div class="py2 px4 fwb">enoki</div>`}
      </div>
      <div class="x px2 fs0-8 ttu fwb">
        <div class="${state.sites.active ? '' : 'dn'}">
          <a href="/?url=/" class="nav-link ${editorActive ? 'fc-fg nav-active' : 'fc-bg25 fch-fg'} tfcm db p2">Editor</a>
        </div>
        <div class="psr">
          <a href="/?sites=all" class="nav-link ${sitesActive ? 'fc-fg nav-active' : 'fc-bg25 fch-fg'} tfcm db p2">Sites</a>
        </div>
        <div class="psr">
          <a href="/#hub/guides" class="nav-link ${hubActive ? 'fc-fg nav-active' : 'fc-bg25 fch-fg'} tfcm db p2">Hub</a>
        </div>
      </div>
    </div>
  `

  function breadcrumbs () {
    return html`
      <div class="x oxh px3">
        <a href="?url=/" class="bgc-bg2-5 db px1 nbb py2 breadcrumb fc-bg25 fch-fg">home</a>
        <div class="oxh xx breadcrumbs wsnw drtl">
          ${Breadcrumbs({ page: state.page })}
        </div>
      </div>
    `
  }
}
var queryString = require('query-string')
var objectKeys = require('object-keys')
var html = require('choo/html')
var xtend = require('xtend')

var Breadcrumbs = require('./breadcrumbs')

var links = {
  hub: {
    title: 'Hub',
    icon: 'home',
    url: '/#hub'
  },
  sites: {
    title: 'Sites',
    icon: 'sitemap',
    url: '/?sites=all'
  },
  editor: {
    title: 'Editor',
    icon: 'edit',
    url: '/?url=/'
  }
}

module.exports = header

function header (state, emit) {
  var search = queryString.parse(location.search)

  var activeStates = {
    editor: typeof search.url !== 'undefined' && state.sites.active,
    sites:  typeof search.sites !== 'undefined',
    hub: state.route.indexOf('hub') >= 0
  }

  // non p2p
  if (!state.sites.p2p) return ''

  return html`
    <nav id="header" class="x xdc xjb bgc-bg5 psf t0 l0 b0 z4" style="width: 7rem">
      <div class="p0-5">
        ${objectKeys(links).map(function (key) {
          var link = links[key]
          link.active = activeStates[key]
          return renderLink(link)
        })}
      </div>
    </nav>
  `

  function renderLink (props) {
    var activeClass = props.active ? 'bgc-fg fc-bg' : 'bgc-bg10 fc-bg70'
    return html`
      <div class="x p0-5" style="font-size: 2.0rem; height: 6rem; width: 6rem; line-height: 5rem">
        <a
          href="${props.url}"
          class="db w100 tac br1 ${activeClass}"
        >
          <span class="fa fa-${props.icon}"></span>
        </a>
      </div>
    `
  }

  function renderChanges () {
    var changes = objectKeys(state.panel.changes)
    var isActive = changes.length > 0 && editorActive
    var urlChanges = unescape(queryString.stringify(
      xtend({ changes: 'all' }, state.query)
    ))

    return html`
      <div class="p2 ${isActive ? 'db' : 'dn'}">
        <a
          href="/?${urlChanges}"
          class="indicator curp bgc-green"
        >${changes.length}</a>
      </div>
    `
  }
}
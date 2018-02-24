var queryString = require('query-string')
var objectKeys = require('object-keys')
var html = require('choo/html')
var xtend = require('xtend')

var Breadcrumbs = require('./breadcrumbs')

var links = {
  hub: {
    name: 'hub',
    title: 'Hub',
    icon: 'home'
  },
  sites: {
    name: 'sites',
    title: 'Sites',
    icon: 'clone'
  },
  editor: {
    name: 'editor',
    title: 'Editor',
    icon: 'i-cursor'
  }
}

module.exports = header

function header (state, emit) {
  var search = queryString.parse(location.search)

  var linksState = {
    editor: {
      active: typeof search.url !== 'undefined' && state.sites.active,
      url: '?url=' + state.ui.history.editor
    },
    sites: {
      active: typeof search.sites !== 'undefined',
      url: '?sites=' + state.ui.history.sites
    },
    hub: {
      active: state.route.indexOf('hub') >= 0,
      url: '/#hub/' + state.ui.history.hub
    }
  }

  // non p2p
  if (!state.sites.p2p) return

  return html`
    <nav id="header" class="x xdc xjb bgc-bg10 psf t0 l0 b0 z4" style="width: 7rem">
      <div class="p0-5">
        ${objectKeys(links)
        .filter(function (key) {
          if (key === 'editor' && !state.sites.active) return false
          else return true
        })
        .map(function (key) {
          var link = links[key]
          link.active = linksState[key].active
          link.url = linksState[key].url
          return renderLink(link)
        })}
      </div>
    </nav>
  `

  function renderLink (props) {
    var activeClass = props.active ? 'bgc-fg fc-bg' : 'fc-bg25 bgc-bg fch-fg'
    return html`
      <div class="psr x p0-5" style="font-size: 2.0rem; height: 6rem; width: 6rem; line-height: 5rem">
        <a
          href="${props.url}"
          class="nav-button db w100 tac br1 ${activeClass} nav-tooltip-c"
        >
          <span class="fa fa-${props.icon}"></span>
          <div class="nav-tooltip">${props.title}</div>
        </a>
        ${props.name === 'editor' ? renderChanges() : ''}
      </div>
    `
  }

  function renderChanges () {
    var changes = objectKeys(state.panel.changes)
    var isActive = changes.length > 0
    var urlChanges = unescape(queryString.stringify(
      xtend({ changes: 'all' }, state.query)
    ))

    return html`
      <div class="psa t0 r0 z2 ${isActive ? 'db' : 'dn'}">
        <a
          href="/?${urlChanges}"
          class="indicator curp bgc-green"
        >${changes.length}</a>
      </div>
    `
  }
}
var queryString = require('query-string')
var objectKeys = require('object-keys')
var html = require('choo/html')
var xtend = require('xtend')

// containers
var PageHeader = require('../containers/page-header')
var Fields = require('../containers/fields')

// components
var Breadcrumbs = require('../components/breadcrumbs')
var Header = require('../components/header')
var ActionBar = require('../components/actionbar')
var Publish = require('../components/publish')
var Split = require('../components/split')

// views
var FilesAll = require('./files-all')
var PagesAll = require('./pages-all')
var FileNew = require('./file-new')
var PageNew = require('./page-new')
var Changes = require('./changes')
var Sites = require('./sites')
var File = require('./file')

// methods
var methodsFile = require('../lib/file')
var methodsPage = require('../lib/page')

// misc

module.exports = view

function view (state, emit) {
  var search = queryString.parse(location.search)
  var changes = state.enoki.changes[search.url]

  return [
    Header(state, emit),
    content()
  ]

  // TODO: clean this up
  function content () {
    // non p2p
    if (!state.sites.p2p && state.sites.loaded) {
      return nonDat(state, emit)
    }

    // sites
    if (search.sites || !state.sites.active) {
      return Sites(state, emit)
    }

    // changes
    if (search.changes) {
      return [
        PageHeader(state, emit),
        Page(),
        Breadcrumbs(state, emit),
        Changes(state, emit)
      ]
    }

    // files
    if (search.file === 'new') {
      return [
        PageHeader(state, emit),
        Page(),
        Breadcrumbs(state, emit),
        FileNew(state, emit)
      ]
    }

    // single file
    if (search.file) return [
      File(state, emit),
      Breadcrumbs(state, emit)
    ]

    // pages
    if (search.pages === 'all') {
      return [
        PageHeader(state, emit),
        Breadcrumbs(state, emit),
        PagesAll(state, emit)
      ]
    }

    // create page
    if (search.page === 'new') {
      return [
        PageHeader(state, emit),
        Page(),
        Breadcrumbs(state, emit),
        PageNew(state, emit)
      ]
    }

    // all files
    if (search.files === 'all') {
      return [
        PageHeader(state, emit),
        FilesAll(state, emit),
        Breadcrumbs(state, emit)
      ]
    }

    // store route history
    if (state.ui.history.editor !== state.query.url || '/') {
      emit(state.events.UI_HISTORY, {
        route: 'editor',
        path: state.query.url || '/'
      })
    }

    return [
      PageHeader(state, emit),
      Page(),
      Breadcrumbs(state, emit)
    ]
  }

  function Page () {
    return html`
      <div id="content-page" class="x xdc c12" style="padding-bottom: 6rem">
        <form class="x xw p2 x1" onsubmit=${handleSavePage}>
          ${Fields(state, emit, {
            oninput: handleFieldUpdate
          })}
          <div class="psf b0 r0 py0-5 px3 pen z3">
            ${ActionBar({
              disabled: changes === undefined,
              saveLarge: true,
              handleCancel: handleCancelPage
            })}
          </div>
        </form>
      </div>
    `
  }

  function handleFieldUpdate (key, data) {
    emit(state.events.ENOKI_UPDATE, {
      url: state.page.url,
      data: { [key]: data }
    })
  }

  function handleSavePage (event) {
    if (!changes) return
    if (event) event.preventDefault()

    emit(state.events.ENOKI_SAVE, {
      file: state.page.file,
      path: state.page.path,
      url: state.page.url,
      data: xtend(state.page, changes)
    })
  }

  function handleCancelPage () {
    emit(state.events.ENOKI_CANCEL, {
      url: state.page.url
    })
  }
}

function nonDat (state, emit) {
  return html`
    <div class="xx c12 x xac psa t0 l0 r0 vhmn100">
      <div class="c12 p1 x xw xjc">
        <div class="p1 pb3 fs2 lh1-25 tac c12">
          Please open Enoki in Beaker, an<br class="dn sm-dib"> experimental peer-to-peer browser
        </div>
        <div class="x xjc c12">
          <div class="p1">
            <a href="https://beakerbrowser.com" target="_blank" class="button-large bgc-blue">
              Download Beaker Browser
            </a>
          </div>
        </div>
        <div class="p1 py3 tac fc-bg25 lh1-5 c12" style="max-width: 55rem">
          Want to edit your site offline? Navigate to the dat:// url and “Add to Library”, or customize to your liking by forking.
        </div>
        <div class="x xjc c12">
          <div class="p1">
            <a href="dat://panel.enoki.site" class="button-medium bgc-bg25 bgch-fg fc-bg">Open dat:// in Beaker Browser</a>
          </div>
        </div>
        <div class="p1 py3 tac fc-bg25 c12">
          Thanks for your patience; this flow will be improving soon :)
        </div>
      </div>
    </div>
  `
}

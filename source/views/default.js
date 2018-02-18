var queryString = require('query-string')
var objectKeys = require('object-keys')
var html = require('choo/html')
var xtend = require('xtend')

// containers
var PageHeader = require('../containers/page-header')
var Fields = require('../containers/fields')

// components
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
var methodsFile = require('../methods/file')
var methodsPage = require('../methods/page')
var methodsSite = require('../methods/site')

// misc
var blueprintDefault = require('../blueprints/default')

module.exports = view

function view (state, emit) {
  var search = queryString.parse(location.search)
  var draftPage = getDraftPage()
  var blueprint = getBlueprint()

  return [
    Header(state, emit),
    content()
  ]

  // TODO: clean this up
  function content () {
    if (!state.sites.p2p && state.sites.loaded) {
      // non p2p
      return nonDat(state, emit)
    }

    if (search.sites || !state.sites.active) {
      // sites
      return Sites(state, emit)
    }

    if (search.changes) {
      // files
      return [
        PageHeader(state, emit),
        Page(),
        Changes(state, emit)
      ]
    }

    if (search.file === 'new') {
      // files
      return [
        PageHeader(state, emit),
        Page(),
        FileNew(state, emit)
      ]
    }

    // single file
    if (search.file) return File(state, emit)

    // pages
    if (search.pages === 'all') {
      return [PageHeader(state, emit), PagesAll(state, emit)]
    }

    if (search.page === 'new') {
      // create page
      return [
        PageHeader(state, emit),
        Page(),
        PageNew(state, emit)
      ]
    }

    if (search.files === 'all') {
      // all files
      return [PageHeader(state, emit), FilesAll(state, emit)]
    }

    return [
      PageHeader(state, emit),
      Page()
    ]
  }

  function Page () {
    return html`
      <div id="content-page" class="x xdc c12" style="padding-bottom: 7rem">
        <form class="x xw p2 x1" onsubmit=${handleSavePage}>
          ${Fields({
            oninput: handleFieldUpdate,
            content: state.content,
            blueprint: blueprint,
            events: state.events,
            query: state.query,
            values: state.page,
            draft: draftPage,
            site: state.site,
            page: state.page
          }, emit)}
          <div class="psf b0 l0 r0 p1 pen z2">
            ${ActionBar({
              disabled: draftPage === undefined || search.page,
              saveLarge: true,
              handleCancel: handleCancelPage
            })}
          </div>
        </form>
      </div>
    `
  }

  function handleFieldUpdate (key, data) {
    emit(state.events.PANEL_UPDATE, {
      path: state.page.path,
      url: state.page.url,
      data: { [key]: data }
    })
  }

  function handleSavePage (event) {
    if (!draftPage) return
    if (typeof event === 'object' && event.preventDefault) event.preventDefault()

    emit(state.events.PANEL_SAVE, {
      file: state.page.file,
      path: state.page.path,
      url: state.page.url,
      page: xtend(state.page, draftPage)
    })
  }

  function handleCancelPage () {
    emit(state.events.PANEL_CANCEL, {
      url: state.page.url
    })
  }
  
  function getBlueprint () {
    if (!state.page || !state.site.loaded) {
      return { }
    } else {
      return (
        state.site.blueprints[state.page.view] ||
        state.site.blueprints.default ||
        blueprintDefault
      )
    }
  }

  function getDraftPage () {
    return state.panel && state.page && state.panel.changes[state.page.url]
  }
}

function nonDat (state, emit) {
  return html`
    <div class="xx c12 x xac">
      <div class="c12 p1 x xw xjc">
        <div class="p1 pb3 fs2 lh1-25 tac c12">
          Please open Enoki in Beaker, an<br class="dn sm-dib"> experimental peer-to-peer browser
        </div>
        <div class="x xjc c12">
          <div class="p1">
            <a href="https://beakerbrowser.com" target="_blank" class="button-large bgc-hg">
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

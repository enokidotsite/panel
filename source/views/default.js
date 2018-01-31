var queryString = require('query-string')
var html = require('choo/html')
var ok = require('object-keys')
var xtend = require('xtend')
var path = require('path')

// components
var ActionBar = require('../components/actionbar')
var Breadcrumbs = require('../components/breadcrumbs')
var Sidebar = require('../components/sidebar')
var Split = require('../components/split')
var Publish = require('../components/publish')

// containers
var Fields = require('../containers/fields')
var blueprintDefault = require('../blueprints/default')

// views
var File = require('./file')
var FilesAll = require('./files-all')
var FileNew = require('./file-new')
var PagesAll = require('./pages-all')
var PageNew = require('./page-new')
var Sites = require('./sites')
var Docs = require('./docs')

// methods
var methodsFile = require('../methods/file')
var methodsPage = require('../methods/page')
var methodsSite = require('../methods/site')

module.exports = wrapper(view)

function view (state, emit) {
  var search = queryString.parse(location.search)
  var draftPage = getDraftPage()
  var blueprint = getBlueprint()

  return html`
    <body class="fs1 ff-sans x xdc vhmn100">
      ${header()}
      ${content()}
      ${loading()}
    </body>
  `

  function header () {
    var editorActive = typeof search.url !== 'undefined'
    var sitesActive = typeof search.sites !== 'undefined'
    var docsActive = typeof search.docs !== 'undefined'

    return html`
      <div id="header" class="x xjb usn z2 psr bgc-fg fc-bg oxh">
        ${editorActive ? breadcrumbs() : html`<div class="py2 px3">Enoki</div>`}
        <div class="x">
          <div class="p1 bl1-bg90">
            <a href="/?url=/" class="${editorActive ? 'fc-bg' : 'fc-bg70'} fc-bg db p1">Editor</a>
          </div>
          <div class="p1 bl1-bg90 br1-bg90">
            <a href="/?sites=all" class="${sitesActive ? 'fc-bg' : 'fc-bg70'} fc-bg db p1">Hub</a>
          </div>
          <div style="height: 6rem; width: 6rem"></div>
        </div>
      </div>
    `
  }

  function breadcrumbs () {
    return html`
      <div class="oxh" style="direction: rtl;">
        <div class="px2 wsnw breadcrumbs">
          ${Breadcrumbs({ page: state.page })}
          <a href="?url=/" class="db p1 nbb">index</a>
        </div>
      </div>
    `
  }

  function loading () {
    if (!state.panel.loading) return
    return html`
      <div class="psf z2 t0 r0">
        <div class="loader"></div>
      </div>
    `
  }

  function sidebar () {
    return Sidebar({
      page: state.page,
      content: state.content,
      query: state.query,
      uploadActive: state.ui.dragActive,
      pagesActive: !(blueprint.pages === false),
      filesActive: !(blueprint.files === false),
      handleFiles: handleFilesUpload,
      handleRemovePage: handleRemovePage,
      handleFilesUpload: handleFilesUpload
    }, emit)
  }

  // TODO: clean this up
  function content () {
    // docs
    if (search.docs) {
      return Docs(state, emit)
    }

    // sites
    if (search.sites || !state.sites.active) {
      return Sites(state, emit)
    }

    // files
    if (search.file === 'new') {
      return Split(sidebar(), [FileNew(state, emit), Page()])
    }

    if (search.file) return File(state, emit)
    if (search.pages === 'all') return PagesAll(state, emit)

    if (search.page === 'new') {
      return Split(
        sidebar(),
        [PageNew(state, emit), Page()]
      )
    }

    if (search.files === 'all') {
      return FilesAll(state, emit)
    }

    return Split(
      sidebar(),
      Page()
    )
  }

  function Page () {
    return html`
      <div id="content-page" class="x xdc c12" style="padding-bottom: 7rem">
        <div class="x1">
          <div class="x xw">
            ${Fields({
              blueprint: blueprint,
              draft: draftPage,
              page: state.page,
              values: state.page,
              handleFieldUpdate: handleFieldUpdate
            })}
          </div>
          <div class="psf b0 l0 r0 p1 pen z2">
            <div class="c12 pea">
              ${ActionBar({
                disabled: draftPage === undefined || search.page,
                saveLarge: true,
                handleSave: handleSavePage,
                handleCancel: handleCancelPage,
                handleRemove: handleRemovePage
              })}
            </div>
          </div>
        </div>
      </div>
    `
  }

  function handleFieldUpdate (event, data) {
    emit(state.events.PANEL_UPDATE, {
      path: state.page.path,
      url: state.page.url,
      data: { [event]: data }
    })
  }

  function handleSavePage () {
    if (!draftPage) return

    emit(state.events.PANEL_SAVE, {
      file: state.page.file,
      path: state.page.path,
      url: state.page.url,
      page: ok(blueprint.fields)
        .reduce(function (result, field) {
          result[field] = draftPage[field] === undefined
            ? state.page[field]
            : draftPage[field]
          return result
        }, { })
    })
  }

  function handleCancelPage () {
    emit(state.events.PANEL_CANCEL, {
      url: state.page.url
    })
  }

  function handleRemovePage () {
    emit(state.events.PANEL_REMOVE, {
      confirm: true,
      title: state.page.title,
      path: state.page.path,
      url: state.page.url
    })
  }

  function handleFilesUpload (event, data) {
    emit(state.events.PANEL_FILES_ADD, {
      path: state.page.path,
      url: state.page.url,
      files: data.files
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

function wrapper (view) {
  return function (state, emit) {
    var href = state.query.url || '/'
    var page = state.content[href] || { }
    return view(xtend(state, { page: page }), emit)
  }
}

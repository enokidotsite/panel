var html = require('choo/html')
var ok = require('object-keys')
var xtend = require('xtend')
var path = require('path')
var queryString = require('query-string')

// Components
var ActionBar = require('../components/actionbar')
var Breadcrumbs = require('../components/breadcrumbs')
var Sidebar = require('../components/sidebar')
var Split = require('../components/split')

// Containers
var Fields = require('../containers/fields')

// Views
var File = require('./file')
var FilesAll = require('./files-all')
var FileNew = require('./file-new')
var PagesAll = require('./pages-all')
var PageNew = require('./page-new')

// Methods
var methodsFile = require('../methods/file')
var methodsPage = require('../methods/page')
var methodsSite = require('../methods/site')

module.exports = View

function View (state, emit) {
  var search = queryString.parse(location.search)
  var draftPage = getDraftPage()
  var blueprint = getBlueprint()

  // Page structure
  return html`
    <main class="x xdc vhmn100">
      <div class="c12">
        ${header()}
      </div>
      ${content()}
    </main>
  `

  function header () {
    return html`
      <div id="header" class="x usn px1 z2 psr bgblack tcwhite">
        <div class="c4 p1">
          <a href="/" class="nbb tcwhite">Site</a>
          ${state.panel.loading ? 'Saving…' : ''}
        </div>
        <div class="c8 breadcrumbs">
          ${Breadcrumbs({ page: state.page })}
        </div>
      </div>
    `
  }

  function sidebar () {
    return Sidebar({
      page: state.page,
      uploadActive: state.ui.dragActive,
      pagesActive: !(blueprint.pages === false),
      filesActive: !(blueprint.files === false),
      handleFile: handleFileUpload,
      handleRemovePage: handleRemovePage,
      handleFileUpload: handleFileUpload
    }, emit)
  }

  // TODO: clean this up
  function content () {
    if (search.file === 'new') {
      return Split(
        sidebar(),
        [FileNew(state, emit), Page()]
      )
    }

    if (search.file) {
      return File(state, emit)
    }

    if (search.files === 'all') {
      return Split(sidebar(), FilesAll())
    }

    if (search.page === 'new') {
      return Split(
        sidebar(),
        [PageNew(state, emit), Page()]
      )
    }

    if (search.pages === 'all') {
      return Split(
        sidebar(),
        PagesAll(state, emit)
      )
    }

    return Split(
      sidebar(),
      Page()
    )
  }

  function Page () {
    return html`
      <div id="content-page" class="x xdc c12">
        <div class="x1">
          <div class="x xw">
            ${Fields({
              blueprint: blueprint,
              draft: draftPage,
              site: state.site,
              page: state.page,
              values: state.page,
              handleFieldUpdate: handleFieldUpdate
            })}
          </div>
          <div class="psf b0 l0 r0 p1 pen z3">
            <div class="action-gradient ${draftPage === undefined ? 'dn' : 'db'}"></div>
            <div class="c4 pea">
              ${ActionBar({
                disabled: draftPage === undefined,
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
      data: { [event]: data }
    })
  }

  function handleSavePage () {
    // if there is no draft, don’t bother
    if (!draftPage) return

    emit(state.events.PANEL_SAVE, {
      file: state.page.file,
      path: state.page.path,
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
      path: state.page.path
    })
  }

  function handleRemovePage () {
    emit(state.events.PANEL_REMOVE, {
      path: state.page.path
    })
  }

  function handleFileUpload (event, data) {
    emit(state.events.PANEL_FILE_ADD, {
      filename: data.name,
      path: state.page.path,
      result: data.result
    })
  }

  function getBlueprint () {
    if (!state.page) {
      return { }
    } else {
      return (
        state.site.blueprints[state.page.view] ||
        state.site.blueprints.default
      )
    }
  }

  function getDraftPage () {
    return state.panel && state.page && state.panel.changes[state.page.path]
  }
}
var html = require('choo/html')
var ok = require('object-keys')
var xtend = require('xtend')
var path = require('path')
var queryString = require('query-string')

// Components
var ActionBar = require('../components/actionbar')
var Breadcrumbs = require('../components/breadcrumbs')
var Fields = require('../components/fields')
var Sidebar = require('../components/sidebar')
var Split = require('../components/split')

// Views
var File = require('./file')
var FilesAll = require('./files-all')
var FileNew = require('./file-new')
var PagesAll = require('./pages-all')
var PageNew = require('./page-new')
var NotFound = require('./notfound')

// Methods
var methodsSite = require('../methods/site')
var methodsFile = require('../methods/file')

module.exports = View

function View (state, emit) {
  if (!state.page) return NotFound(state, emit)
  var blueprint = getBlueprint()
  var search = queryString.parse(location.search)
  var draftPage = state.panel.changes[state.page.path]

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
      <div id="header" class="x usn px1 bgblack tcwhite">
        <div class="c4 p1">
          <a href="/" class="nbb tcwhite">Site</a>
          ${state.panel.loading ? 'Saving…' : ''}
        </div>
        <div class="c8 breadcrumbs">
          ${Breadcrumbs({ path: state.page.path })}
        </div>
      </div>
    `
  }

  function sidebar () {
    return Sidebar({
      page: state.page,
      pagesActive: !(blueprint.pages === false),
      filesActive: !(blueprint.files === false)
    })
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
              values: state.page,
              handleFieldUpdate: handleFieldUpdate
            })}
          </div>
        </div>
        ${ActionBar({
          saveLarge: true,
          handleSave: handleSavePage,
          handleCancel: handleCancelPage,
          handleRemove: handleRemovePage
        })}
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
}

var html = require('choo/html')
var ok = require('object-keys')
var xtend = require('xtend')
var path = require('path')

// Components
var ActionBar = require('../components/actionbar')
var Breadcrumbs = require('../components/breadcrumbs')
var Fields = require('../components/fields')
var Sidebar = require('../components/sidebar')

// Views
var File = require('../views/file')
var FilesAll = require('../views/files-all')
var FileNew = require('../views/file-new')
var PagesAll = require('../views/pages-all')
var PageNew = require('../views/page-new')

// Methods
var methodsPath = require('../methods/path')
var methodsSite = require('../methods/site')
var methodsFile = require('../methods/file')

module.exports = View

function View (state, emit) {
  var fields = methodsSite.getFields()
  var blueprint = getBlueprint()
  var search = methodsPath.getSearch()
  var draftPage = state.panel.changes[state.page.path]

  // Page structure
  return html`
    <main>
      <div class="c12">
        ${Header()}
      </div>
      <div class="x xw p1">
        <div class="c4">
          ${Sidebar({
            page: state.page,
            pagesActive: !(blueprint.pages === false),
            filesActive: !(blueprint.files === false)
          })}
        </div>
        <div class="c8">
          ${content()} 
        </div>
      </div>
    </main>
  `

  function Header () {
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

  // TODO: clean this up
  function content () {
    if (search.file === 'new') return FileNew(state, emit)
    if (search.file) return File(state, emit)
    if (search.files === 'all') return FilesAll()
    if (search.page === 'new') return [PageNew(state, emit), Page(state, emit)]
    if (search.pages === 'all') return PagesAll(state, emit)
    return Page()
  }

  function Page () {
    return html`
      <div id="content-page" class="x xw">
        ${Fields({
          blueprint: blueprint,
          draft: draftPage,
          fields: fields,
          values: state.page,
          handleFieldUpdate: handleFieldUpdate
        })}
        ${ActionBar({
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
    emit(state.events.PANEL_SAVE, {
      file: state.page.file,
      path: state.page.path,
      page: ok(blueprint.fields).reduce(function (result, field) {
          result[field] = draftPage[field] === undefined ? state.page[field] : draftPage[field]
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

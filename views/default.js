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

// views
var File = require('./file')
var FilesAll = require('./files-all')
var FileNew = require('./file-new')
var PagesAll = require('./pages-all')
var PageNew = require('./page-new')
var Upgrade = require('./upgrade')

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
    <body class="x xdc vhmn100">
      ${header()}
      ${content()}
      ${loading()}
    </body>
  `

  function header () {
    return html`
      <div id="header" class="x xjb usn z2 psr bgblack">
        <div class="px1 wsnw breadcrumbs">
          <a href="?url=/" class="db p1 nbb">index</a>
          ${Breadcrumbs({ page: state.page })}
        </div>
        ${state.panel.upgrade ? upgrade() : ''}
      </div>
    `

    function upgrade () {
      return html`
        <a
          href="?upgrade=true"
          class="tcwhite p1 curp"
        >Upgrade</a>
      `
    }
  }

  function loading () {
    if (!state.panel.loading) return
    return html`
      <div class="psf z2 t0 r0 p1">
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
    if (search.file === 'new') {
      return Split(sidebar(), [FileNew(state, emit), Page()])
    }

    if (search.file) return File(state, emit)
    if (search.pages === 'all') return PagesAll(state, emit)
    if (search.upgrade) return Upgrade(state, emit)

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
      <div id="content-page" class="x xdc c12">
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
          <div class="psf b0 l0 r0 p1 pen z3">
            <div class="action-gradient ${draftPage === undefined ? 'dn' : 'db'}"></div>
            <div class="c4 pea sm-c12">
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
        state.site.blueprints.default
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

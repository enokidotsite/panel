var html = require('choo/html')
var ok = require('object-keys')
var xtend = require('xtend')
var path = require('path')

var ActionBar = require('../components/actionbar')
var PageAdd = require('../components/page-add')
var Breadcrumbs = require('../components/breadcrumbs')
var Modal = require('../components/modal')
var Sidebar = require('../components/sidebar')
var Fields = require('../components/fields')

var methodsPath = require('../methods/path')
var methodsSite = require('../methods/site')
var files = require('../methods/files')

module.exports = view

function view (state, emit) {
  var fields = methodsSite.getFields()
  var blueprint = getBlueprint()
  var search = getSearch()
  var draftPage = state.panel.changes[state.page.path]

  return html`
    <main>
      <div class="c12">
        <div class="x usn px1 bgblack tcwhite">
          <div class="c4 p1">
            <a href="/" class="nbb tcwhite">Site</a>
            ${state.panel.loading ? 'Saving…' : ''}
          </div>
          <div class="c8 breadcrumbs">
            ${Breadcrumbs({ path: state.page.path })}
          </div>
        </div>
      </div>
      <div class="x xw p1">
        <div class="c4">
          ${Sidebar({ page: state.page })}
        </div>
        <div class="c8">
          ${Content()} 
        </div>
      </div>
    </main>
  `

  function Content () {
    if (search.file === 'new') return contentFileNew()
    if (search.file) return contentFile()
    if (search.files === 'all') return contentFilesAll()
    if (search.page === 'new') return [contentPageNew(), contentPage()]
    if (search.pages === 'all') return contentPagesAll()
    return contentPage()
  }

  function getBlueprint () {
    return (
      state.site.blueprints[state.page.view] ||
      state.site.blueprints.default
    )
  }

  function contentPagesAll () {
    return html`
      <div id="content-pagesall" class="p1 fwb">
        All pages coming soon
      </div>
    `
  }

  function contentPageNew () {
    var content = PageAdd({
      key: 'add',
      views: state.site.views,
      fields: fields
    },
    function (name, data) {
      switch (name) {
        case 'save':
          if (!data.value.uri) return alert('Missing data')
          emit(state.events.PANEL_PAGE_ADD, {
            title: data.value.title,
            view: 'default',
            path: path.join(state.page.path, data.value.uri)
          })
          break
        case 'cancel': return emit(state.events.REPLACESTATE, '?')
      }
    })

    return Modal(state, emit, content)
  }

  function contentFileNew () {
    return html`
      <div class="p1 fwb">
        New file coming soon
      </div>
    `
  }

  function contentFilesAll () {
    return html`
      <div class="p1 fwb">
        All Files coming soon
      </div>
    `
  }

  function contentFile () {
    var filename = files.decodeFilename(search.file)
    var activeFile = state.page.files[filename]

    return html`
      <div>
        <div class="p1">
          <div class="fwb">${filename}</div>
        </div>
        <div class="p1">
          ${activeFile.type === 'image' ? image() : ''}
        </div>
        <div>
          ${Fields({

          })}
        </div>
        ${ActionBar({

        })}
      </div>
    `

    function image () {
      return html`<img class="c12" src="${activeFile.path}" />`
    }
  }

  function contentPage () {
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
    emit(state.events.PANEL_PAGE_REMOVE, {
      path: state.page.path
    })
  }
}


function getSearch () {
  return (typeof window !== 'undefined' && window.location.search)
    ? methodsPath.queryStringToJSON(window.location.search)
    : false
}
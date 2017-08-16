var html = require('choo/html')
var path = require('path')
var objectKeys = require('object-keys')
var queryString = require('query-string')

var methodsFile = require('../methods/file')
var methodsSite = require('../methods/site')

var ActionBar = require('../components/actionbar')
var Fields = require('../components/fields')
var Split = require('../components/split')

module.exports = File

function File (state, emit) {
  var fields = methodsSite.getFields()
  var search = queryString.parse(location.search)
  var filename = methodsFile.decodeFilename(search.file)
  var blueprint = getBlueprint()
  var file = state.page.files[filename]
  var draftFile = file ? state.panel.changes[file.path] : { }

  if (!file) return notFound()

  return Split(
    sidebar(),
    content()
  )

  function content () {
    return html`
      <div
        id="content-file"
        class="c12 p1 psr file-preview"
      >
        ${file.type === 'image' ? image() : ''}
      </div>
    `
  }

  function sidebar () {
    return html`
      <div id="sidebar-file" class="x xdc c12 psst t0">
        <div class="x1">
          <div class="p1 c12">
            <div class="fwb">${filename}</div>
          </div>
          ${Fields({
            blueprint: blueprint,
            draft: draftFile,
            fields: fields,
            values: file,
            handleFieldUpdate: handleFieldUpdate
          })}
        </div>
        ${ActionBar({
          handleSave: handleSave,
          handleCancel: handleCancel,
          handleRemove: handleRemove
        })}
      </div>
    `
  }

  function image () {
    return html`<img src="${file.path}" class="ofc" />`
  }

  function notFound () {
    return html`
      <div class="fs2 p1">
        <b>${filename}</b> is not found 
      </div>
    `
  }

  function handleFieldUpdate (event, data) {
    emit(state.events.PANEL_UPDATE, {
      path: file.path,
      data: { [event]: data }
    })
  }

  function handleSave () {
    emit(state.events.PANEL_SAVE, {
      file: file.filename + '.txt',
      path: state.page.path,
      page: objectKeys(blueprint.fields).reduce(function (result, field) {
          result[field] = draftFile[field] === undefined ? file[field] : draftFile[field]
          return result
        }, { })
    })
  }

  function handleCancel () {
    emit(state.events.PANEL_CANCEL, {
      path: file.path
    })
  }

  function handleRemove () {
    emit(state.events.PANEL_REMOVE, {
      path: file.path
    })
  } 

  function getBlueprint () {
    if (
      state.page &&
      state.page.view &&
      state.site &&
      state.site.blueprints &&
      state.site.blueprints[state.page.view] &&
      state.site.blueprints[state.page.view].files
    ) {
      return state.site.blueprints[state.page.view].files
    } else {
      return { }
    }
  }
}
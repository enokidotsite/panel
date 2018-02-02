var queryString = require('query-string')
var objectKeys = require('object-keys')
var html = require('choo/html')
var path = require('path')

var methodsFile = require('../methods/file')
var methodsSite = require('../methods/site')

var ActionBar = require('../components/actionbar')
var Split = require('../components/split')
var Fields = require('../containers/fields')

module.exports = File

function File (state, emit) {
  var search = queryString.parse(location.search)
  var filename = methodsFile.decodeFilename(search.file)
  var file = state.page.files ? state.page.files[filename] : false
  if (!file) return notFound()
  var blueprint = getBlueprint()
  var draftFile = state.panel.changes[file.url]

  return Split(
    [sidebar(), actionbarWrapper()],
    content()
  )

  function content () {
    return html`
      <div
        id="content-file"
        class="psst t0 l0 r0 p1 file-preview"
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
            <div class="c12 fwb usn py1 fs0-8 ttu fc-bg25">
              Filename
            </div>
            <div class="py1 px1-5 input input-disabled truncate">
              ${filename}
            </div>
          </div>
          ${Fields({
            blueprint: blueprint,
            draft: draftFile,
            values: file,
            handleFieldUpdate: handleFieldUpdate
          })}
          <div class="p1">
            <span
              class="tac bgch-fg bgc-bg25 button-medium"
              onclick=${handleRemove}
            >Delete file</span>
          </div>
        </div>
      </div>
    `
  }

  function actionbarWrapper () {
    return html`
      <div class="psf b0 l0 r0 p1 pen z2">
        <div class="pea">
          ${ActionBar({
            disabled: draftFile === undefined,
            handleSave: handleSave,
            handleCancel: handleCancel
          })}
        </div>
      </div>
    `
  }

  function image () {
    return html`<img src="${file.source}" class="ofc" />`
  }

  function notFound () {
    return html`
      <div class="p1 xx x xjc xac">
        ${filename} is not found 
      </div>
    `
  }

  function handleFieldUpdate (event, data) {
    emit(state.events.PANEL_UPDATE, {
      url: file.url,
      path: file.path,
      data: { [event]: data }
    })
  }

  function handleSave () {
    alert('Image meta saving coming soon')
    // emit(state.events.PANEL_SAVE, {
    //   file: file.filename + '.txt',
    //   path: state.page.path,
    //   url: file.url,
    //   page: objectKeys(blueprint.fields).reduce(function (result, field) {
    //     result[field] = draftFile[field] === undefined ? file[field] : draftFile[field]
    //     return result
    //   }, { })
    // })
  }

  function handleCancel () {
    emit(state.events.PANEL_CANCEL, {
      path: file.path,
      url: file.url
    })
  }

  function handleRemove () {
    emit(state.events.PANEL_REMOVE, {
      path: file.path,
      url: file.url
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
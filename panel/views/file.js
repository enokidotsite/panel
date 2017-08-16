var html = require('choo/html')
var path = require('path')

var methodsFile = require('../methods/file')
var methodsPath = require('../methods/path')
var methodsSite = require('../methods/site')

var ActionBar = require('../components/actionbar')
var Fields = require('../components/fields')

module.exports = File

function File (state, emit) {
  var fields = methodsSite.getFields()
  var search = methodsPath.getSearch()
  var filename = methodsFile.decodeFilename(search.file)
  var blueprint = getBlueprint()
  var file = state.page.files[filename]
  var draftFile = state.panel.changes[file.path]

  return html`
    <div id="content-file" class="x xw">
      <div class="p1">
        <div class="fwb">${filename}</div>
      </div>
      <div class="p1">
        ${file.type === 'image' ? image() : ''}
      </div>
      ${Fields({
        blueprint: blueprint,
        draft: draftFile,
        fields: fields,
        values: file,
        handleFieldUpdate: handleFieldUpdate
      })}
      ${ActionBar({
        handleSave: handleSave,
        handleCancel: handleCancel,
        handleRemove: handleRemove
      })}
    </div>
  `

  function image () {
    return html`<img class="c12" src="${file.path}" />`
  }

  function handleFieldUpdate (event, data) {
    // console.log(event, data)
    emit(state.events.PANEL_UPDATE, {
      path: file.path,
      data: { [event]: data }
    })
  }

  function handleSave () {
    console.log('save')
    // emit(state.events.PANEL_SAVE, {
    //   file: state.page.file,
    //   path: state.page.path,
    //   page: ok(blueprint.fields).reduce(function (result, field) {
    //       result[field] = draftPage[field] === undefined ? state.page[field] : draftPage[field]
    //       return result
    //     }, { })
    // })
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
var html = require('bel')
var ok = require('object-keys')
var ov = require('object-values')
var xt = require('xtend')
var xtm = require('xtend/mutable')
var fs = require('fs')
var path = require('path')

var mp = require('../methods/path')
var files = require('../methods/files')
var fieldsDefault = require('../fields')

var breadcrumbs = require('../components/breadcrumbs')
var modal = require('../components/modal')
var sidebar = require('../components/sidebar')

var PageAdd = require('../components/page-add')

module.exports = view

function view (state, emit) {
  var fieldsCustom = getFields()
  var fieldsInputs = xt(fieldsDefault, fieldsCustom)

  var blueprint = getBlueprint()
  var fields = blueprint.fields
  var search = getSearch()
  var pathBread = getPathBread()

  var draft = state.panel.changes[state.page.path]

  return html`
    <main>
      <div class="c12">
        <div class="x bgblack tcwhite">
          <div class="c4 p1">
            <div class="px1">
              <a href="/" class="nbb tcwhite">Site</a>
              ${state.panel.loading ? 'Saving…' : ''}
            </div>
          </div>
          <div class="c8 px1 breadcrumbs">
            ${breadcrumbs(pathBread)}
          </div>
        </div>
      </div>
      <div class="x xw p1">
        <div class="c4">
          ${sidebar({ page: state.page })}
        </div>
        <div class="c8">
          ${elContent()} 
        </div>
      </div>
    </main>
  `

  function elContent () {
    if (search.file === 'new') return contentFileNew()
    if (search.file) return contentFile()
    if (search.files === 'all') return contentFilesAll()
    if (search.page === 'new') return [contentPageNew(), contentPage()]
    if (search.pages === 'all') return contentPagesAll()

    return contentPage()
  }

  function getPathBread () {
    // maybe add filename here
    return state.page.path
  }

  function getBlueprint () {
    return (
      state.site.blueprints[state.page.template] ||
      state.site.blueprints.default
    )
  }

  function contentPagesAll () {
    return html`
      <div class="p1 fwb">
        All pages coming soon
      </div>
    `
  }

  function contentPageNew () {
    var content = PageAdd({
      key: 'add',
      views: { },
      fields: fieldsInputs
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

    return modal(state, emit, content)
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
        <div class="p1">
          <pre>${JSON.stringify(activeFile, { } , 2)}</pre>
        </div>
        ${actionbar()}
      </div>
    `

    function image () {
      return html`<img class="c12" src="${activeFile.path}" />`
    }
  }

  function contentPage () {
    return html`
      <div class="x xw">
        ${elFields()}
        ${actionbar()}
      </div>
    `
  }

  function actionbar () {
    var disabledClass = (draft === undefined) ? 'pen op25' : ''
    return html`
      <div class="x xjb c12 lh1 usn">
        <div class="x ${disabledClass}">
          <div class="p1">
            <div class="bgblack tcwhite p1 curp fwb br1" onclick=${handleSave}>Save</div>
          </div>
          <div class="p1">
            <div class="bgblack tcwhite p1 curp br1" onclick=${handleCancel}>Cancel</div>
          </div>
        </div>
        <div class="p1">
          <div class="bgblack tcwhite p1 curp br1" onclick=${handleRemove}>Remove</div>
        </div>
      </div>
    `
  }

  // this could be cleaned up greatly.
  function elFields () {
    return ok(fields)
      .map(function (key) {
        var active = xt({
          key: key,
          value: (draft && draft[key] !== undefined) ? draft[key] : state.page[key]
        }, fields[key])

        return field({
          fields: fieldsInputs,
          field: active
        }, onFieldUpdate)

        function onFieldUpdate (event, data) {
          emit(state.events.PANEL_UPDATE, {
            path: state.page.path,
            data: {
              [key]: data
            }
          })
        }
      })
  }

  function handleSave () {
    emit(state.events.PANEL_SAVE, {
      file: state.page.file,
      path: state.page.path,
      page: ok(fields).reduce(function (result, field) {
          result[field] = draft[field] || state.page[field]
          return result
        }, { })
    })
  }

  function handleCancel () {
    emit(state.events.PANEL_CANCEL, {
      path: state.page.path
    })
  }

  function handleRemove () {
    emit(state.events.PANEL_PAGE_REMOVE, {
      path: state.page.path
    })
  }

  // hacky way to get custom fields depending upon environment
  function getFields () {
    return module.parent
      ? getNode()
      : getBrowserify()

    function getNode () {
      var pathFields = path.join(__dirname, '../../site/fields')
      return fs.readdirSync(pathFields).reduce(function (result, file) {
        file = path.basename(file, path.extname(file))
        result[file] = require(path.join(pathFields, file))
        return result
      }, { })
    }

    function getBrowserify () {
      var fieldsSrc = require('../../site/fields/*.js', { mode: 'hash' })
      return Object.keys(fieldsSrc).reduce(function (result, value) {
        result[path.basename(value)] = fieldsSrc[value]
        return result
      }, { })
    }
  }
}

function field (state, emit) {
  var fields = state.fields
  var field = state.field

  var input = (typeof fields[field.type] === 'function')
    ? fields[field.type]
    : fields.text

  var width = state.field.width === '1/2' ? 'c6' : 'c12'

  return html`
    <div class="${width} p1">
      <div class="c12 fwb usn mb1">
        ${field.label || field.key}
      </div>
      <div class="c12">
        ${input(field, emit)}
      </div>
    </div>
  `
}

function getSearch () {
  return (typeof window !== 'undefined' && window.location.search)
    ? mp.queryStringToJSON(window.location.search)
    : false
}

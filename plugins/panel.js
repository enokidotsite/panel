var queryString = require('query-string')
var objectKeys = require('object-keys')
var assert = require('nanoassert')
var html = require('choo/html')
var smarkt = require('smarkt')
var xtend = require('xtend')
var path = require('path')
var xhr = require('xhr')

var SOURCE = 'b34752de83c49c3ad2d90cb71376b1a76bc5010f545d91cc9ddbe1824da3504d'

module.exports = panel

async function panel (state, emitter) {
  var archive = new DatArchive(window.location.toString())
  var source = new DatArchive(SOURCE)

  state.panel = {
    changes: { },
    loading: false
  }

  state.site = {
    loaded: false,
    blueprints: { }
  }

  state.events.PANEL_UPDATE = 'panel:update'
  state.events.PANEL_MOVE = 'panel:move'
  state.events.PANEL_PAGE_ADD = 'panel:page:add'
  state.events.PANEL_FILES_ADD = 'panel:files:add'
  state.events.PANEL_LOADING = 'panel:loading'
  state.events.PANEL_SAVE = 'panel:save'
  state.events.PANEL_CANCEL = 'panel:cancel'
  state.events.PANEL_REMOVE = 'panel:remove'
  
  emitter.on(state.events.PANEL_UPDATE, onUpdate)
  emitter.on(state.events.PANEL_SAVE, onSave)
  emitter.on(state.events.PANEL_CANCEL, onCancel)
  emitter.on(state.events.PANEL_LOADING, onLoading)
  emitter.on(state.events.PANEL_REMOVE, onRemove)
  emitter.on(state.events.PANEL_PAGE_ADD, onPageAdd)
  emitter.on(state.events.PANEL_FILES_ADD, onFilesAdd)

  try {
    state.site.blueprints = await loadBlueprints('/blueprints')
    var panelPackage = await readPackageVersion(archive)
    var sourcePackage = await readPackageVersion(archive)
    console.log(panelPackage, sourcePackage)
  } catch (err) {
    state.p2p = false
  }

  state.site.loaded = true
  emitter.emit(state.events.RENDER)

  function onUpdate (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    assert.equal(typeof data.url, 'string', 'enoki: data.url must be type string')
    var changes = state.panel.changes[data.url]
    state.panel.changes[data.url] = xtend(changes, data.data)
    emitter.emit(state.events.RENDER)
  }

  async function onSave (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    assert.equal(typeof data.path, 'string', 'enoki: data.path must be type string')
    assert.equal(typeof data.url, 'string', 'enoki: data.url must be type string')
    assert.equal(typeof data.page, 'object', 'enoki: data.file must be type object')

    emitter.emit(state.events.PANEL_LOADING, { loading: true })
    emitter.emit(state.events.RENDER)

    // todo: cleanup
    try {
      var page = xtend(state.content[data.url], data.page)

      delete page.files
      delete page.pages
      delete page.url
      delete page.name

      var content = smarkt.stringify(page)
      await archive.writeFile(
        path.join(data.path, 'index.txt'),
        content
      )

      state.content[data.url] = xtend(state.content[data.url], state.panel.changes[data.url])
      delete state.panel.changes[data.url]
      emitter.emit(state.events.CONTENT_LOAD)
    } catch (err) {
      alert(err.message)
      console.log(err)
    }

    emitter.emit(state.events.PANEL_LOADING, { loading: false })
    emitter.emit(state.events.RENDER)
  }

  function onCancel (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    assert.equal(typeof data.url, 'string', 'enoki: data.url must be type string')

    delete state.panel.changes[data.url]
    emitter.emit(state.events.RENDER)
  }

  function onLoading (data) {
    if (data && data.loading !== undefined) {
      state.panel.loading = data.loading
    } else {
      state.panel.loading = false
    }
  }

  async function onPageAdd (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    assert.equal(typeof data.path, 'string', 'enoki: data.path must be type string')
    assert.equal(typeof data.url, 'string', 'enoki: data.url must be type string')
    assert.equal(typeof data.title, 'string', 'enoki: data.title must be type string')
    assert.equal(typeof data.view, 'string', 'enoki: data.view must be type string')

    emitter.emit(state.events.PANEL_LOADING, { loading: true })
    emitter.emit(state.events.RENDER)

    try {
      var content = { title: data.title, view: data.view }
      await archive.mkdir(data.path)
      await archive.writeFile(
        path.join(data.path, 'index.txt'),
        smarkt.stringify(content)
      )

      emitter.emit(state.events.CONTENT_LOAD)
    } catch (err) {
      alert(err.message)
      console.warn(err)
    }

    emitter.emit(state.events.PANEL_LOADING, { loading: false })
    emitter.emit(state.events.REPLACESTATE, '?url=' + data.url)
  }

  async function onRemove (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    assert.equal(typeof data.url, 'string', 'enoki: data.url must be type string')
    assert.equal(typeof data.path, 'string', 'enoki: data.path must be type string')

    if (data.confirm) {
      if (!window.confirm(`Are you sure you want to delete ${data.title || data.path}?`)) {
        return
      }
    }

    emitter.emit(state.events.PANEL_LOADING, { loading: true })
    emitter.emit(state.events.RENDER)

    try {
      var isFile = path.extname(data.path)

      if (isFile) await archive.unlink(data.path)
      else await archive.rmdir(data.path, { recursive: true })

      emitter.emit(state.events.CONTENT_LOAD)
      if (data.redirect !== false) {
        emitter.emit(state.events.REPLACESTATE, '?url=' + path.join(data.url, '../').replace(/\/$/, ''))
      }
    } catch (err) {
      alert(err.message)
      console.warn(err)
    }

    emitter.emit(state.events.PANEL_LOADING, { loading: false })
    emitter.emit(state.events.RENDER)
  }

  async function onFilesAdd (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    assert.equal(typeof data.url, 'string', 'enoki: data.url must be type string')
    assert.equal(typeof data.path, 'string', 'enoki: data.path must be type string')
    assert.equal(typeof data.files, 'object', 'enoki: data.files must be type object')

    emitter.emit(state.events.PANEL_LOADING, { loading: true })
    emitter.emit(state.events.RENDER)

    await Promise.all(objectKeys(data.files).map(saveFile))

    emitter.emit(state.events.PANEL_LOADING, { loading: false })
    emitter.emit(state.events.CONTENT_LOAD)

    async function saveFile (key) {
      try {
        var file = data.files[key]
        var filePath = path.join(data.path, file.name)
        var fileEncoded = await getBase64(file)
        var encoder = typeof fileEncoded === 'string' ? 'base64' : 'binary'
        return archive.writeFile(filePath, fileEncoded, encoder)
      } catch (err) {
        console.warn(err)
      }
    }
  }

  async function loadBlueprints (blueprintsDir) {
    var files = await archive.readdir(blueprintsDir)
    var output = { }
    await Promise.all(files.map(read))
    return output

    async function read (blueprintPath) {
      var ext = path.extname(blueprintPath)
      if (ext === '.json') {
        var data = await archive.readFile(path.join(blueprintsDir, blueprintPath))
        output[path.basename(blueprintPath, ext)] = JSON.parse(data)
        return data
      }
    }
  }

}

function getBase64 (file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      resolve(reader.result.split(',')[1])
    }
    reader.onerror = function (error) {
      reject(error)
    }
  })
}

async function readPackageVersion (archive) {
  var package = await archive.readFile('/package.json')
  return JSON.parse(package).version
}
var queryString = require('query-string')
var objectKeys = require('object-keys')
var html = require('choo/html')
var assert = require('assert')
var smarkt = require('smarkt')
var xtend = require('xtend')
var path = require('path')
var xhr = require('xhr')

var _package = require('../package.json')

module.exports = panel

async function panel (state, emitter) {
  var archive

  state.content = { }

  state.site = {
    loaded: false,
    blueprints: { },
    config: { },
    info: { }
  }

  state.panel = {
    version: _package.version,
    changes: { },
    loading: false
  }

  state.events.PANEL_FILES_ADD = 'panel:files:add'
  state.events.PANEL_LOAD_SITE = 'panel:load:site'
  state.events.PANEL_PAGE_ADD = 'panel:page:add'
  state.events.PANEL_LOADING = 'panel:loading'
  state.events.PANEL_UPGRADE = 'panel:upgrade'
  state.events.PANEL_UPDATED = 'panel:updated'
  state.events.PANEL_CANCEL = 'panel:cancel'
  state.events.PANEL_UPDATE = 'panel:update'
  state.events.PANEL_REMOVE = 'panel:remove'
  state.events.PANEL_MOVE = 'panel:move'
  state.events.PANEL_SAVE = 'panel:save'
  
  emitter.on(state.events.PANEL_FILES_ADD, onFilesAdd)
  emitter.on(state.events.PANEL_LOAD_SITE, onLoadSite)
  emitter.on(state.events.PANEL_PAGE_ADD, onPageAdd)
  emitter.on(state.events.DOMCONTENTLOADED, onLoad)
  emitter.on(state.events.PANEL_LOADING, onLoading)
  emitter.on(state.events.PANEL_UPGRADE, onUpgrade)
  emitter.on(state.events.PANEL_UPDATE, onUpdate)
  emitter.on(state.events.PANEL_CANCEL, onCancel)
  emitter.on(state.events.PANEL_REMOVE, onRemove)
  emitter.on(state.events.PANEL_SAVE, onSave)

  function onLoad () {

  }

  function onUpgrade () {
    confirm('do you want to upgrade?')
  }

  function onUpdate (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    assert.equal(typeof data.url, 'string', 'enoki: data.url must be type string')
    var changes = state.panel.changes[data.url]
    state.panel.changes[data.url] = xtend(changes, data.data)
    emitter.emit(state.events.PANEL_UPDATED)
    emitter.emit(state.events.RENDER)
  }

  async function onSave (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    assert.equal(typeof data.path, 'string', 'enoki: data.path must be type string')
    assert.equal(typeof data.url, 'string', 'enoki: data.url must be type string')
    assert.equal(typeof data.page, 'object', 'enoki: data.page must be type object')

    emitter.emit(state.events.PANEL_LOADING, { loading: true })
    emitter.emit(state.events.RENDER)

    // todo: cleanup
    try {
      var page = xtend(state.content[data.url], data.page)
      var file = data.file || state.site.config.file

      // cleanup
      delete page.files
      delete page.pages
      delete page.url
      delete page.name
      delete page.path

      await archive.writeFile(
        path.join(data.path, file),
        smarkt.stringify(page)
      )

      await archive.commit()

      // very messy
      state.content[data.url] = xtend(state.content[data.url], state.panel.changes[data.url])
      delete state.panel.changes[data.url]

      emitter.once(state.events.SITE_REFRESHED, async function () {
        try {
          await archive.writeFile(
            '/bundles/content.json',
            JSON.stringify(state.content, { }, 2)
          )
          await archive.commit()
        } catch (err) {
          console.warn(err)
        }
      })

      emitter.emit(state.events.SITE_REFRESH)
    } catch (err) {
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
    if (data.render === true) emitter.emit(state.events.RENDER)
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

      emitter.emit(state.events.SITE_REFRESH)
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

      if (isFile) {
        await archive.unlink(data.path)
        try { await archive.unlink(data.path + '.txt') } catch (err) { }
      } else {
        await archive.rmdir(data.path, { recursive: true })
      }

      emitter.emit(state.events.SITE_REFRESH)
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
    emitter.emit(state.events.SITE_REFRESH)

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

  function onLoadSite (data) {
    // var siteKey = data.site.info.key
    // var localVersion = window.localStorage.getItem('version-' + siteKey)
    // var fallbackVersion = data.site.config.version || state.panel.version
    // var activeVersion = localVersion ? JSON.parse(localVersion) : { selected: fallbackVersion }
    // var canUpgrade = activeVersion.checked !== state.panel.version

    if (data.content) state.content = data.content
    if (data.site) state.site = data.site
    if (data.archive) archive = data.archive

    // if (canUpgrade) {
      // var shouldUpgrade = confirm(`Panel update (${activeVersion.selected} to ${state.panel.version}) available. Would you like to upgrade?`) 
      // if (shouldUpgrade) {

      //   window.localStorage.setItem('version-selected-' + siteKey, state.panel.version)
      // }
    // } else {
    //   window.localStorage.setItem(
    //     'version-' + siteKey,
    //     JSON.stringify({ selected: state.panel.version, checked: state.panel.verison })
    //   )
    // }

    if (data.render !== false) emitter.emit(state.events.RENDER)
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

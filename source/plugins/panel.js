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

function panel () {
  return async function (state, emitter) {
    var archive

    state.content = { }

    state.site = {
      loaded: false,
      blueprints: { },
      config: { },
      info: { }
    }

    state.enoki = {
      version: _package.version,
      changes: { },
      loading: false
    }

    state.events.ENOKI_FILES_ADD = 'enoki:files:add'
    state.events.ENOKI_LOAD_SITE = 'enoki:load:site'
    state.events.ENOKI_PAGE_ADD = 'enoki:page:add'
    state.events.ENOKI_LOADING = 'enoki:loading'
    state.events.ENOKI_UPDATED = 'enoki:updated'
    state.events.ENOKI_CANCEL = 'enoki:cancel'
    state.events.ENOKI_UPDATE = 'enoki:update'
    state.events.ENOKI_REMOVE = 'enoki:remove'
    state.events.ENOKI_MOVE = 'enoki:move'
    state.events.ENOKI_SAVE = 'enoki:save'
    
    emitter.on(state.events.ENOKI_FILES_ADD, onFilesAdd)
    emitter.on(state.events.ENOKI_LOAD_SITE, onLoadSite)
    emitter.on(state.events.ENOKI_PAGE_ADD, onPageAdd)
    emitter.on(state.events.ENOKI_LOADING, onLoading)
    emitter.on(state.events.ENOKI_UPDATE, onUpdate)
    emitter.on(state.events.ENOKI_CANCEL, onCancel)
    emitter.on(state.events.ENOKI_REMOVE, onRemove)
    emitter.on(state.events.ENOKI_SAVE, onSave)

    function onLoad () {

    }

    function onUpdate (data) {
      assert.equal(typeof data, 'object', 'enoki: data must be type object')
      assert.equal(typeof data.url, 'string', 'enoki: data.url must be type string')

      var changes = state.enoki.changes[data.url]
      var shouldUpdate = data.render !== false

      state.enoki.changes[data.url] = xtend(changes, data.data)

      emitter.emit(state.events.ENOKI_UPDATED)
      if (shouldUpdate) emitter.emit(state.events.RENDER)
    }

    async function onSave (data) {
      assert.equal(typeof data, 'object', 'enoki: data must be type object')
      assert.equal(typeof data.path, 'string', 'enoki: data.path must be type string')
      assert.equal(typeof data.url, 'string', 'enoki: data.url must be type string')
      assert.equal(typeof data.page, 'object', 'enoki: data.page must be type object')

      emitter.emit(state.events.ENOKI_LOADING, { loading: true })
      emitter.emit(state.events.RENDER)

      // todo: cleanup
      try {
        var contentPage = state.content[data.url]
        var shouldMove = contentPage.name !== data.page.name
        var page = xtend(state.content[data.url], data.page)
        var file = data.file || state.site.config.file

        // TODO: create reserved keys
        delete page.files
        delete page.pages
        delete page.url
        delete page.name
        delete page.path

        // create the file
        await archive.writeFile(
          path.join(data.path, file),
          smarkt.stringify(page)
        )

        // save
        await archive.commit()

        // very messy
        state.content[data.url] = xtend(state.content[data.url], state.enoki.changes[data.url])
        delete state.enoki.changes[data.url]

        emitter.once(state.events.SITE_REFRESHED, async function () {
          // bundles directory
          try { await archive.readdir('/bundles') }
          catch (err) { await archive.mkdir('/bundles') }

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
        alert(err.message)
        console.warn(err)
      }

      emitter.emit(state.events.ENOKI_LOADING, { loading: false })
      emitter.emit(state.events.RENDER)
    }

    function onCancel (data) {
      assert.equal(typeof data, 'object', 'enoki: data must be type object')
      assert.equal(typeof data.url, 'string', 'enoki: data.url must be type string')

      delete state.enoki.changes[data.url]
      emitter.emit(state.events.RENDER)
    }

    function onLoading (data) {
      if (data && data.loading !== undefined) {
        state.enoki.loading = data.loading
      } else {
        state.enoki.loading = false
      }

      if (data.render !== false) emitter.emit(state.events.RENDER)
    }

    async function onPageAdd (data) {
      assert.equal(typeof data, 'object', 'enoki: data must be type object')
      assert.equal(typeof data.path, 'string', 'enoki: data.path must be type string')
      assert.equal(typeof data.url, 'string', 'enoki: data.url must be type string')
      assert.equal(typeof data.title, 'string', 'enoki: data.title must be type string')
      assert.equal(typeof data.view, 'string', 'enoki: data.view must be type string')

      emitter.emit(state.events.ENOKI_LOADING, { loading: true })

      try {
        var content = { title: data.title, view: data.view }
        var file = data.file || state.site.config.file

        await archive.mkdir(data.path)
        await archive.writeFile(
          path.join(data.path, file),
          smarkt.stringify(content)
        )

        emitter.emit(state.events.SITE_REFRESH)
      } catch (err) {
        alert(err.message)
        console.warn(err)
      }

      emitter.emit(state.events.ENOKI_LOADING, { loading: false, render: false })
      emitter.emit(state.events.REPLACESTATE, '?url=' + data.url)
    }

    async function onRemove (data) {
      assert.equal(typeof data, 'object', 'enoki: data must be type object')
      assert.equal(typeof data.url, 'string', 'enoki: data.url must be type string')
      assert.equal(typeof data.path, 'string', 'enoki: data.path must be type string')

      if (data.confirm) {
        return window.confirm(`Are you sure you want to delete ${data.title || data.path}?`)
      }

      emitter.emit(state.events.ENOKI_LOADING, { loading: true })

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
          emitter.emit(
            state.events.REPLACESTATE,
            '?url=' + path.join(data.url, '../').replace(/\/$/, '')
          )
        }
      } catch (err) {
        alert(err.message)
        console.warn(err)
      }

      emitter.emit(state.events.ENOKI_LOADING, { loading: false })
    }

    async function onFilesAdd (data) {
      assert.equal(typeof data, 'object', 'enoki: data must be type object')
      assert.equal(typeof data.url, 'string', 'enoki: data.url must be type string')
      assert.equal(typeof data.path, 'string', 'enoki: data.path must be type string')
      assert.equal(typeof data.files, 'object', 'enoki: data.files must be type object')

      emitter.emit(state.events.ENOKI_LOADING, { loading: true })
      await Promise.all(objectKeys(data.files).map(saveFile))
      emitter.emit(state.events.ENOKI_LOADING, { loading: false })

      async function saveFile (key) {
        try {
          var file = data.files[key]
          var filePath = path.join(data.path, file.name)
          var fileEncoded = await getBase64(file)
          var encoder = typeof fileEncoded === 'string' ? 'base64' : 'binary'
          return archive.writeFile(filePath, fileEncoded, encoder)
        } catch (err) {
          alert(err.message)
          console.warn(err)
        }
      }
    }

    function onLoadSite (data) {
      if (data.content) state.content = data.content
      if (data.site) state.site = data.site
      if (data.archive) archive = data.archive
      if (data.render !== false) emitter.emit(state.events.RENDER)
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

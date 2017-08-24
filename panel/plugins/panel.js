var queryString = require('query-string')
var assert = require('nanoassert')
var html = require('choo/html')
var xtend = require('xtend')
var path = require('path')
var xhr = require('xhr')

module.exports = panel

function panel (state, emitter) {
  state.panel = {
    changes: { },
    loading: false
  }

  // global hooks
  emitter.on(state.events.DOMCONTENTLOADED, onLoad)
  emitter.on(state.events.NAVIGATE, onNavigate)

  // api
  emitter.on(state.events.PANEL_UPDATE, onUpdate)
  emitter.on(state.events.PANEL_SAVE, onSave)
  emitter.on(state.events.PANEL_CANCEL, onCancel)
  emitter.on(state.events.PANEL_LOADING, onLoading)
  emitter.on(state.events.PANEL_REMOVE, onRemove)
  emitter.on(state.events.PANEL_PAGE_ADD, onPageAdd)
  emitter.on(state.events.PANEL_FILE_ADD, onFileAdd)


  function onUpdate (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    assert.equal(typeof data.path, 'string', 'enoki: data.path must be type string')
    var changes = state.panel.changes[data.path]
    state.panel.changes[data.path] = xtend(changes, data.data)
    emitter.emit(state.events.RENDER)
  }

  function onSave (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    assert.equal(typeof data.file, 'string', 'enoki: data.file must be type string')
    assert.equal(typeof data.pathPage, 'string', 'enoki: data.pathPage must be type string')
    assert.equal(typeof data.page, 'object', 'enoki: data.file must be type object')

    emitter.emit(state.events.PANEL_LOADING, { loading: true })
    emitter.emit(state.events.RENDER)

    xhr.put({
      uri: '/api/v1/update',
      body: data,
      json: true
    }, function (err, resp, body) {
      emitter.emit(state.events.PANEL_LOADING, { loading: false })
      emitter.emit(state.events.RENDER)
      if (err) alert(err.message)
    })    
  }

  function onCancel (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    assert.equal(typeof data.path, 'string', 'enoki: data.path must be type string')

    delete state.panel.changes[data.path]
    emitter.emit(state.events.RENDER)
  }

  function onLoading (data) {
    if (data && data.loading !== undefined) {
      state.panel.loading = data.loading
    } else {
      state.panel.loading = false
    }
  }

  function onPageAdd (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    assert.equal(typeof data.pathPage, 'string', 'enoki: data.pathPage must be type string')
    assert.equal(typeof data.title, 'string', 'enoki: data.title must be type string')
    assert.equal(typeof data.view, 'string', 'enoki: data.view must be type string')

    emitter.emit(state.events.PANEL_LOADING, { loading: true })
    emitter.emit(state.events.RENDER)

    xhr.put({
      uri: '/api/v1/add',
      body: data,
      json: true
    }, function (err, resp, body) {
      emitter.emit(state.events.PANEL_LOADING, { loading: false })
      emitter.emit(state.events.RENDER)
      if (err) return alert(err.message)
      emitter.emit(state.events.REPLACESTATE, data.pathPage + '?panel=active')
    })  
  }

  function onRemove (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    assert.equal(typeof data.pathPage, 'string', 'enoki: data.pathPage must be type string')

    emitter.emit(state.events.PANEL_LOADING, { loading: true })
    emitter.emit(state.events.RENDER)

    xhr.put({
      uri: '/api/v1/remove',
      body: data,
      json: true
    }, function (err, resp, body) {
      emitter.emit(state.events.PANEL_LOADING, { loading: false })
      emitter.emit(state.events.RENDER)
      if (err) return alert(err.message)
      emitter.emit(state.events.REPLACESTATE, path.join(data.pathPage, '../') + '?panel=active')
    })  
  }

  function onFileAdd (data) {
    assert.equal(typeof data, 'object', 'enoki: data must be type object')
    assert.equal(typeof data.pathPage, 'string', 'enoki: data.pathPage must be type string')
    assert.equal(typeof data.filename, 'string', 'enoki: data.filename must be type string')
    assert.equal(typeof data.result, 'string', 'enoki: data.result must be type string')

    emitter.emit(state.events.PANEL_LOADING, { loading: true })
    emitter.emit(state.events.RENDER)

    xhr.put({
      uri: '/api/v1/add-file',
      body: data,
      json: true
    }, function (err, resp, body) {
      emitter.emit(state.events.PANEL_LOADING, { loading: false })
      emitter.emit(state.events.RENDER)
      if (err) return alert(err.message)
      emitter.emit(state.events.REPLACESTATE, '?panel=active')
    })  
  }

  /**
   * Hacks
   */

  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', function () {
      emitter.emit(state.events.NAVIGATE)
    })
  }

  function onLoad () {
    if (typeof window !== 'undefined') {
      document.body.appendChild(html`<style id="panel-rules"></style>`)
      onNavigate()
    }
  }

  function onNavigate () {
    var search = queryString.parse(location.search)
    var rules = document.querySelector('#panel-rules')

    if (search.panel !== undefined) {
      rules.innerHTML = 'main { display: none !important }'
    } else {
      rules.innerHTML = '#panel { display: none !important }'
    }

    window.dispatchEvent(new CustomEvent('enokiNavigate', {
      detail: { panelActive: search.panel !== undefined }
    }))
  }
}

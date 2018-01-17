var assert = require('assert')
var objectKeys = require('object-keys')
var Archives = require('../lib/archives')

var archives = new Archives()

module.exports = sites

function sites (state, emitter, app) {
  var storage

  state.sites = {
    loaded: false,
    active: '',
    sources: [ ],
    archives: { }
  }

  state.events.SITES_LOADED = 'sites:loaded'
  state.events.SITES_RESET = 'sites:reset'
  state.events.SITE_LOADED = 'site:loaded'
  state.events.SITE_LOAD = 'site:load'
  state.events.SITE_ADD = 'site:add'
  state.events.SITE_REMOVE = 'site:remove'

  emitter.on(state.events.DOMCONTENTLOADED, handleSetup)
  emitter.on(state.events.SITE_ADD, handleAdd)
  emitter.on(state.events.SITE_LOAD, handleLoad)
  emitter.on(state.events.SITE_REMOVE, handleRemove)
  emitter.on(state.events.SITES_RESET, handleReset)

  async function handleSetup () {
    // localstorage and setup
    storage = window.localStorage
    // storage.setItem('sites', JSON.stringify([]))
    var sources = JSON.parse(storage.getItem('sites')) || [ ]
    var active = storage.getItem('active') || ''

    await Promise.all(sources.map(load))
    emitter.emit(state.events.RENDER)

    async function load (url) {
      return handleLoad({ url: url })
    }
  }

  async function handleAdd () {
    try {
      var archive = await DatArchive.selectArchive({
        title: 'Choose a Site or Content',
        buttonLabel: 'Add this archive',
        filters: { isOwner: true }
      })
      handleLoad({ url: archive.url, render: true })
    } catch (err) {
      alert('Can not load archive')
    }
  }

  async function handleLoad (props) {
    try {
      var archive = await archives.add(props.url)
      var info = await archive.getInfo()
      state.sites.archives[info.url] = info
      // local storage
      if (state.sites.sources.indexOf(info.url) < 0) {
        state.sites.sources.push(info.url)
        storage.setItem('sites', JSON.stringify(state.sites.sources))
      }
      // finish and render
      emitter.emit(state.events.SITE_LOADED)
      if (props.render === true) emitter.emit(state.events.RENDER)
      return info
    } catch (err) {

    }
  }

  function handleRemove (props) {
    var index = state.sites.sources.indexOf(props.url)
    if (index >= 0) {
      archives.remove(props.url)
      state.sites.sources.splice(index, 1)
      delete state.sites.archives[props.url]
      storage.setItem('sites', JSON.stringify(state.sites.sources))
      emitter.emit(state.events.SITE_LOADED)
      if (props.render === true) emitter.emit(state.events.RENDER)
    }
  }

  function handleReset () {
    state.sites.sources = [ ]
    state.sites.archives = { }
    storage.setItem('sites', JSON.stringify(state.sites.sources))
    emitter.emit(state.events.RENDER)
  }
}
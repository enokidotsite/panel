var Enoki = require('choo-dat-hypha/lib')
var enoki = new Enoki()

module.exports = docs

function docs (state, emitter, app) {
  state.docs = {
    loaded: false,
    content: { },
    site: { }
  }

  state.events.DOCS_LOAD = 'docs:load' 

  emitter.on(state.events.DOCS_LOAD, onLoad)

  async function onLoad () {
    await enoki.load()
    state.docs.content = await enoki.readContent()
    state.docs.loaded = true
    emitter.emit(state.events.RENDER)
  }
}

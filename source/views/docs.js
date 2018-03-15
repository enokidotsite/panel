var html = require('choo/html')

module.exports = NotFound

function NotFound (state, emit) {
  // load docs
  if (!state.docs.loaded) {
    emit(state.events.DOCS_LOAD)
    return ''
  }

  var page = state.docs.content['/'] || { }

  return html`
    <div class="p3">
      <div>${page.title}</div>
      ${page.text}
    </div>
  `
}

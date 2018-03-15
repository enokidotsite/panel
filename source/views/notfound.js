var html = require('choo/html')

module.exports = NotFound

function NotFound (state, emit) {
  return html`
    <main>
      Not Found
    </main>
  `
}

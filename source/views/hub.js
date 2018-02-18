var html = require('choo/html')
var wrapper = require('../containers/wrapper-hub')
var format = require('../components/format')

module.exports = wrapper(hub)

function hub (state, emit) {
  return html`
    <div class="xx x xdc p2 bgc-fg fc-bg25">
      <div class="p2 x xjc">
        <div class="copy">
          ${format(state.page.text)}
        </div>
      </div>
    </div>
  `
}

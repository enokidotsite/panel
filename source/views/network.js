var html = require('choo/html')
var wrapper = require('../containers/wrapper-hub')
var format = require('../components/format')

module.exports = wrapper(network)

function network (state, emit) {
  return html`
    <div class="xx x x xjc xac xdc p3 bgc-fg fc-bg25">
      <div class="tac">
        <div class="p1 fs3 fc-bg lh1">Network</div>
        <div class="p1 fc-bg70 ff-mono">Coming Soon</div>
      </div>
    </div>
  `
}

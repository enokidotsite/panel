var queryString = require('query-string')
var objectKeys = require('object-keys')
var html = require('choo/html')

var Modal = require('../components/modal')
var modal = Modal()

module.exports = changes

function changes (state, emit) {
  var activeChanges = objectKeys(state.panel.changes)
    .map(function (key) {
      return {
        state: state.content[key],
        changes: state.panel.changes[key]
      }
    })

  var content = html`
    <div class="bgc-bg br1">
      <div class="py1 px2 x ttu fs0-8 fc-bg25 fwb">
        <div class="c6">Title</div>
      </div>
      <ul class="myc1">
        ${activeChanges.map(renderRouteChanges)}
      </ul>
    </div>
  `

  return modal.render({
    content: content,
    className: 'c6',
    handleContainerClick: function (event) {
      emit(state.events.REPLACESTATE, '?url=' + state.page.url)
    }
  })
}

function renderRouteChanges (props) {
  if (!props.state.url) return
  return html`
    <li class="x py1 px2">
      <div class="xx">
        <a href="/?url=${props.state.url}">${props.state.title}</a>
      </div>
      <div class="x">
        <div class="indicator bgc-green">
          ${objectKeys(props.changes).length}
        </div>
      </div>
    </li>
  `
}

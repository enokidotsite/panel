var objectValues = require('object-values')
var html = require('choo/html')
var css = require('sheetify')

var guideThumbnail = require('../components/guide-thumbnail')
var wrapper = require('../containers/wrapper-hub')

module.exports = wrapper(view)

function view (state, emit) {
  var guides = objectValues(state.page.pages)
    .map(page => state.docs.content[page.url])
    .filter(page => (page && page.visible !== false))

  return html`
    <div class="xx bgc-bg2-5">
      <div class="guides-grid" style="padding-top: 0">
        ${guides.map(guideThumbnail)}
      </div>
    </div>
  `
}

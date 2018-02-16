var objectValues = require('object-values')
var html = require('choo/html')

var wrapper = require('../containers/wrapper-hub')

module.exports = wrapper(view)

function view (state, emit) {
  var guides = objectValues(state.page.pages).map(function (page){
    return state.docs.content[page.url] || { }
  })

  return html`
    <div class="xx x xdc">
      <div class="p3 x">
        ${guides.map(renderGuide)}
      </div>
    </div>
  `
}

function renderGuide (props) {
  return html`
    <div class="p1 c6 sm-c4">
      <a
        href="/#hub${props.url}"
        class="oh db p2 fc-bg br2"
        style="background: ${props.color || '#ccc'}"
      >
        <h2 class="fwb lh1-25 mb2">${props.title}</h2>
        <div class="copy fs0-8" style="max-height: 5.5rem;">
          <p>${props.excerpt}</p>
        </div>
      </a>
    </div>
  `
}

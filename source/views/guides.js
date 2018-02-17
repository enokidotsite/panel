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
      <div class="p3 x xw">
        ${guides.map(renderGuide)}
      </div>
    </div>
  `
}

function renderGuide (props) {
  return html`
    <div class="p1 c6 x ${props.featured ? 'sm-c8' : 'sm-c4'}">
      <a
        href="/#hub${props.url}"
        class="w100 oh x xdc xjb p2 bgc-bg2-5 fc-bg25 fch-fg  ${props.featured ? 'fs2' : ''} br2 tfyh"
      >
        <h2 class="fwb lh1-25 mb2 fc-fg" style="color: ${props.color}">${props.title}</h2>
        <div class="copy ${props.featured ? 'fs1' : 'fs0-8'}" style="${props.featured ? 'max-height: 10.5rem; max-width: 50rem;' : 'max-height: 5.5rem; max-width: 30rem;'}">
          <p>${props.excerpt}</p>
        </div>
      </a>
    </div>
  `
}

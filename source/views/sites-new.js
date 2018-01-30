var html = require('choo/html')

var TextArea = require('../fields/textarea')
var Text = require('../fields/text')

var description = new TextArea()
var name = new Text()

module.exports = SitesNew

function SitesNew (state, emit) {
  return html`
    <div class="x xx xjc xac">
      <div>
        Form
      </div> 
      <div class="psf b0 l0 r0 p1 x xjc">
        <div class="p1">
          <div
            class="bgc-fg button-large"
            onclick=${handleGenerate}
          >Generate Your New Site</div>
        </div>
      </div>
    </div>
  `

  function handleGenerate () {
    emit(state.events.SITE_GENERATE, { template: 'hey' })
  }
}

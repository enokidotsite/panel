var objectValues = require('object-values')
var html = require('choo/html')
var xtend = require('xtend')

var Fields = require('../containers/fields')
var blueprint = require('../blueprints/sites-create.json')

module.exports = SitesCreate

function SitesCreate (state, emit) {
  var designs = objectValues(state.designs.public)

  return html`
    <div class="x xx sm-xjc sm-xac">
      <div class="c12 sm-c6 p2" style="padding-bottom: 9rem">
        ${Fields({
          blueprint: blueprint,
          draft: { },
          page: state.sites.create,
          values: state.sites.create,
          handleFieldUpdate: handleFieldUpdate
        })}
        <div class="p1">
          <div class="ttu fc-bg25 fs0-8 py1 x xjb">
            <div class="fwb">Design</div>
            <div>More coming soon</div>
          </div>
          ${designs.map(renderDesign)}
        </div>
      </div> 
      <div class="psf b0 l0 r0 p1 x xjc">
        <div class="p1">
          <button
            type="submit"
            onclick=${handleCreate}
            class="bgc-fg button-large"
          >Generate Your New Site</button>
        </div>
      </div>
    </div>
  `

  function handleFieldUpdate (event, data) {
    emit(state.events.SITE_CREATOR, {
      path: 'sites-create',
      data: { [event]: data }
    })
  }

  function handleCreate (event) {
    event.preventDefault()
    emit(state.events.SITE_CREATE, {
      url: state.designs.public.starterkit.url
    })
  }
}

function renderDesign (props) {
  return html`
    <div class="br2 b1-bg10 curp oh">
      <img src="${props.thumbnail}" class="db">
      <div class="py1 px1-5 bt1-bg10 x xjb">
        <div class="fwb">${props.title}</div>
        <div><a href="${props.url}" class="fc-bg25 fch-fg external" target="_blank">Preview</a></div>
      </div>
    </div>
  `

  function handleCreate () {
    if (typeof props.handleCreate === 'function' && props.key) {
      props.handleCreate({
        design: props.key
      })
    }
  }
}
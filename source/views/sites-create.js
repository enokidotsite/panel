var objectKeys = require('object-keys')
var html = require('choo/html')
var xtend = require('xtend')

var Fields = require('../containers/fields')
var blueprint = require('../blueprints/sites-create.json')

module.exports = SitesCreate

function SitesCreate (state, emit) {
  var designs = objectKeys(state.designs.public)

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
    <div class="p1">
      ${props.title} 
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
var objectValues = require('object-values')
var html = require('choo/html')
var xtend = require('xtend')

var Fields = require('../containers/fields')
var blueprint = require('../blueprints/sites-create.json')

module.exports = SitesCreate

function SitesCreate (state, emit) {
  var designs = objectValues(state.designs.public)

  return html`
    <div class="c12 x xx xw p2 psr">
      <div class="c12 sm-c6">
        <div class="w100 psst p1" style="top: 0.75rem; padding-bottom: 8rem">
          ${Fields({
            blueprint: blueprint,
            draft: { },
            page: state.sites.create,
            values: state.sites.create,
            handleFieldUpdate: handleFieldUpdate
          })}
        </div>
      </div>
      <div class="c12 sm-c6 x xw p1" style="padding-bottom: 8rem">
        <div class="c12 ttu fc-bg25 p1 pt2 fs0-8 x xjb">
          <div class="fwb">Design</div>
          <div>More coming soon</div>
        </div>
        ${designs.map(function (design) {
          var props = xtend({
            active: state.sites.create.url === design.url,
            handleSelect: handleDesignSelect
          }, design)
          return renderDesign(props)
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

  function handleDesignSelect (data) {
    emit(state.events.SITE_CREATOR, {
      path: 'sites-create',
      data: { url: data.url }
    })
  }

  function handleCreate (event) {
    console.log(state.sites.createUrl)
    event.preventDefault()
    emit(state.events.SITE_CREATE, {
      url: state.sites.create.url
    })
  }
}

function renderDesign (props) {
  return html`
    <div class="c12 p1" onclick=${handleSelect}>
      <div class="br2 b1-bg10 curp oh">
        <img src="${props.thumbnail}" class="db">
      </div>
      <div class="py1 tac fs0-8 ttu">
        <a href="${props.url}" class="fc-bg25 fch-fg external" target="_blank">${props.title}</a>
      </div>
      active: ${props.active === true}
    </div>
  `

  function handleSelect () {
    if (typeof props.handleSelect === 'function' && props.url) {
      props.handleSelect({ url: props.url })
    }
  }
}
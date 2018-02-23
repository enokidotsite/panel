var objectValues = require('object-values')
var html = require('choo/html')
var xtend = require('xtend')

var Fields = require('../containers/fields')
var blueprint = require('../blueprints/sites-create.json')

module.exports = SitesCreate

function SitesCreate (state, emit) {
  var designs = objectValues(state.designs.public)

  return html`
    <div class="c12 psr">
      <div class="x xw py1 xjb px3 bb1-bg10">
        <div class="fs1 px1 py1 toe wsnw oxh c12 sm-xx fwb">
          Create a New Site
        </div>
      </div>
      <div class="x xw c12 p2" style="padding-bottom: 8rem">
        <div class="c12 sm-c6 p1">
          ${Fields({
            blueprint: blueprint,
            draft: { },
            page: state.sites.create,
            values: state.sites.create,
            oninput: handleFieldUpdate
          }, emit)}
        </div>
        <div class="c12 sm-c6">
          <div class="c12 px1 x xjb pt3 usn fs0-8 ttu fc-bg25">
            <div class="fwb">Design</div>
          </div>
          <div class="c12 x xw">
            ${designs.map(function (design) {
              var props = xtend({
                active: state.sites.create.url === design.url,
                handleSelect: handleDesignSelect
              }, design)
              return renderDesign(props)
            })}
          </div>
        </div>
      </div>
      <div class="psf b0 l0 r0 p1 x xjc">
        <div class="p1">
          <button
            type="submit"
            onclick=${handleCreate}
            class="bgch-fg bgc-blue button-large"
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
    event.preventDefault()
    emit(state.events.SITE_CREATE, {
      url: state.sites.create.url
    })
  }
}

function renderDesign (props) {
  return html`
    <div class="c6 p1" onclick=${handleSelect}>
      <div class="br2 psr ${props.active ? 'focused' : ''} b1-bg10 curp oh" style="padding-bottom: 75%">
        <img src="${props.thumbnail}" class="psa t0 l0 h100 w100 db">
      </div>
      <div class="py1 fs0-8 ttu">
        <a
          href="${props.url}"
          class="${props.active ? 'fc-fg' : 'fc-bg25'} fch-fg external"
          target="_blank"
        >${props.title}</a>
      </div>
    </div>
  `

  function handleSelect () {
    if (typeof props.handleSelect === 'function' && props.url) {
      props.handleSelect({ url: props.url })
    }
  }
}
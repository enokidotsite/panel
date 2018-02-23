var objectValues = require('object-values')
var html = require('choo/html')
var xtend = require('xtend')

var Fields = require('../containers/fields')
var blueprint = require('../blueprints/sites-create.json')

var subTitle = {
  designs: 'Select a design',
  meta: 'Enter the details'
}

module.exports = SitesCreate

function SitesCreate (state, emit) {
  var designs = objectValues(state.designs.public)
  var section = state.query.sites 
  var selected = designs.filter(function (design) {
    return state.sites.create.url === design.url
  })[0]

  function renderContainer (content) {

  }

  return html`
    <div class="c12 psr xx xdc x">
      <div class="x xw py1 xjb px3 bb1-bg10">
        <div class="fs1 px1 py1 toe wsnw oxh c12 sm-xx">
          <a href="/?sites=designs" class="fwb">Create a New Site</a> <span class="fc-bg25">→ ${subTitle[section]}</span>
        </div>
        <div class="p0-5 x">
          <div class="p0-5">
            <a href="/?sites=designs" class="indicator ${section === 'designs' ? 'bgc-blue' : 'bgc-bg10'}">1</a>
          </div>
          <div class="p0-5">
            <a href="/?sites=meta" class="indicator ${section === 'meta' ? 'bgc-blue' : 'bgc-bg10'}">2</a>
          </div>
        </div>
      </div>
      ${renderContent()}
    </div>
  `

  function renderContent () {
    // designs
    if (state.query.sites === 'designs') {
      return [
        renderDesigns(),
        renderButtonMeta()
      ]
    }

    // meta 
    if (state.query.sites === 'meta') {
      return [
        renderFields(),
        renderButtonGenerate()
      ]
    }
  }

  function renderFields () {
    return html`
      <div class="xx x xw xjc xac c12 p4" style="padding-bottom: 8rem">
        <div class="c6">
          ${Fields({
            blueprint: blueprint,
            draft: { },
            page: state.sites.create,
            values: state.sites.create,
            oninput: handleFieldUpdate
          }, emit)}
        </div>
      </div>
    `
  }

  function renderDesigns () {
    return html`
      <div class="xx x xw c12 p4" style="padding-bottom: 8rem">
        ${designs.map(function (design) {
          var props = xtend({
            active: state.sites.create.url === design.url,
            handleSelect: handleDesignSelect
          }, design)
          return renderDesign(props)
        })}
      </div>
    `
  }

  function renderButtonMeta () {
    return html`
      <div class="psf b0 l0 r0 w100 p1 p1 x xjc" style="margin-left: 7rem;">
        <div class="p1">
          <a
            class="bgch-fg bgc-blue button-large"
            href="/?sites=meta"
          >Select the ${selected.title} Design</a>
        </div>
      </div>
    `
  }

  function renderButtonGenerate () {
    return html`
      <div class="psf b0 l0 r0 w100 p1 p1 x xjc" style="margin-left: 7rem;">
        <div class="p1">
          <button
            type="submit"
            onclick=${handleCreate}
            class="bgch-fg bgc-blue button-large"
          >Generate Your New Site</button>
        </div>
      </div>
    `
  }

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
    <div class="c4 p1">
      <div class="ophc100 ${props.active ? 'fc-fg' : 'fc-bg25'} fch-fg" onclick=${handleSelect}>
        <div class="br1 psr ${props.active ? 'focused' : ''} b1-bg10 curp oh" style="padding-bottom: 75%">
          <img src="${props.thumbnail}" class="psa t0 l0 h100 w100 db">
        </div>
        <div class="py1 x xjb">
          <a
            href="${props.url}"
            class="fc-inherit ${props.active ? 'fwb' : ''}"
            target="_blank"
          >${props.title}</a>
          <div class="op0 oph">
            <a href="${props.url}" target="_blank" class="external fc-bg25 fch-fg">Preview</a>
          </div>
        </div>
      </div>
    </div>
  `

  function handleSelect () {
    if (typeof props.handleSelect === 'function' && props.url) {
      props.handleSelect({ url: props.url })
    }
  }
}
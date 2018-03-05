var objectValues = require('object-values')
var html = require('choo/html')
var xtend = require('xtend')

var Fields = require('../containers/fields')
var blueprint = require('../blueprints/sites-create.json')

var subTitle = {
  designs: 'Select a starting point',
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
      <div class="x xw py1 xjb px3 bgc-bg2-5">
        <div class="fs2 px1 py2 toe wsnw oxh c12 sm-xx fwb">
          Select a starting point
        </div>
        <div class="x">
          <div class="p1">
            <a
              class="b2-currentColor fch-fg fc-bg25 button-medium"
              href="/?sites=all"
            >Cancel</a>
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
      <div class="xx x xw xjc xac c12 p4" style="padding-bottom: 10rem">
        <div class="c6 bgc-bg p3 br1">
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
      <div class="xx x xw c12 p2" style="padding-bottom: 8rem">
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
      <div class="psf b0 l0 r0 p1 x xjc" style="margin-left: 7rem;">
        <div class="p1">
          <button
            type="submit"
            onclick=${handleCreate}
            class="bgch-fg bgc-blue button-large"
          >Start with the ${selected.title} Design</button>
        </div>
      </div>
    `
  }

  function renderButtonMetaOld () {
    return html`
      <div class="psf b0 l0 r0 p1 p1 x xjc" style="margin-left: 7rem;">
        <div class="p1">
          <a
            class="bgch-fg bgc-blue button-large"
            href="/?sites=meta"
          >Start with the ${selected.title} Design</a>
        </div>
      </div>
    `
  }

  function renderButtonGenerate () {
    return html`
      <div class="psf b0 l0 r0 p1 x xjc" style="margin-left: 7rem;">
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
    <div class="c12 sm-c6 md-c4 p2 pb0">
      <div class="ophc100 ${props.active ? 'fc-fg' : 'fc-bg25'} fch-fg">
        <div class="br1 psr design-thumbnail ${props.active ? 'design-focused' : ''} curp">
          <div
            class="psa t0 r0 z2 indicator indicator-medium bgc-blue tom pen ${props.active ? 'op100' : 'op0'}"
            style="margin: -1.5rem; font-weight: normal; font-size: 2.5rem;"
          >✓</div>
          <div class="br1 oh psr bgc-bg" style="padding-bottom: 75%">
            <img src="${props.thumbnail}" onclick=${handleSelect} class="psa t0 l0 h100 w100 db">
          </div>
        </div>
        <div class="x xjb pt1 ttu fs0-8 tfcm">
          <div>
            <span class="fwb">${props.title}</span>
          </div>
          <div class="oph op0 tom">
            <a href="${props.url}" target="_blank" class="oph button-inline">Preview</a>
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
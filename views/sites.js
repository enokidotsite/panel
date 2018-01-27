var assert = require('assert')
var objectValues = require('object-values')
var html = require('choo/html')
var xtend = require('xtend')

module.exports = view

function view (state, emit) {
  var sites = objectValues(state.sites.archives)

  if (sites.length > 0) {
    return renderSites({
      handleRemove: handleRemove,
      handleLoad: handleLoad,
      handleAdd: handleAdd,
      sites: sites
    })
  } else {
    return renderEmpty({
      handleAdd: handleAdd
    })
  }

  function handleAdd () {
    emit(state.events.SITE_ADD)
  }

  function handleLoad (props) {
    emit(state.events.SITE_LOAD, props)
  }

  function handleRemove (props) {
    emit(state.events.SITE_REMOVE, props)
  }
}

function renderSites (props) {
  return html`
    <div class="w100">
      <div class="p2 x xw" style="padding-bottom: 7rem">
        ${props.sites.map(function (site) {
          return renderSite(xtend(site, {
            handleLoad: props.handleLoad,
            handleRemove: props.handleRemove
          }))
        })}
        <div class="psf b0 l0 r0 w100 p1 p1 x xjc">
          <div class="p1">
            <div
              class="bgc-fg button-large"
              onclick=${props.handleAdd}
            >Load Existing Site</div>
          </div>
          <div class="p1">
            <div
              class="bgc-fg button-large"
            >Create New Site</button>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderEmpty (props) {
  return html`
    <div>
      No sites add one why not
      <button onclick=${props.handleAdd}>Add</button>
    </div>
  `
}

function renderSite (props) {
  return html`
    <div class="p1 w100">
      <div
        class="x xac bgc-bg5 fc-fg br1 curp usn p1"
        onclick=${handleSiteClick}
      >
        <div class="oh p1 xx">
          <div class="fs2">${props.title}</div>
        </div>
        <div class="p1">
          <button class="w100 fs1 p1 bgc-fg fc-bg br1">Settings</button>
        </div>
        <div class="p1 dn">
          <button class="w100 fs1 p1 bgc-fg fc-bg br1" onclick=${handleRemove}>Remove</button>
        </div>
      </div>
    </div>
  `

  function handleSiteClick () {
    if (typeof props.handleLoad === 'function') {
      props.handleLoad({url: props.url, redirect: true })
    }
  }

  function handleRemove () {
    if (typeof props.handleRemove === 'function') {
      props.handleRemove({ url: props.url, render: true })
    }
  }
}
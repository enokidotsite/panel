var assert = require('assert')
var objectValues = require('object-values')
var html = require('choo/html')
var xtend = require('xtend')

var RenderSiteCreate = require('./sites-create')

module.exports = view

function view (state, emit) {
  var sites = objectValues(state.sites.archives)

  // not loaded
  if (!state.sites.loaded) return

  // create
  if (state.query.sites === 'create') {
    return RenderSiteCreate(state, emit)
  }

  // all
  if (sites.length === 0 || state.query.sites === 'empty') {
    return renderEmpty({
      handleAdd: handleAdd
    })
  // empty
  } else {
    return renderSites({
      handleRemove: handleRemove,
      handleLoad: handleLoad,
      handleAdd: handleAdd,
      active: state.query.sites,
      sites: sites
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
      <div style="padding-bottom: 10rem">
        ${props.sites.map(function (site) {
          return renderSite(xtend(site, {
            active: props.active === site.url,
            handleLoad: props.handleLoad,
            handleRemove: props.handleRemove
          }))
        })}
        <div class="psf b0 l0 r0 w100 p1 p1 x xjc">
          <div class="p1">
            <a
              href="?sites=create"
              class="bgc-blue bgch-fg button-large"
            >Create a New Site</a>
          </div>
          <div class="p1">
            <div
              class="bgc-yellow bgch-fg button-large"
              onclick=${props.handleAdd}
            >Load an Existing Site</div>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderEmpty (props) {
  return html`
    <div class="xx c12 x xac">
      <div class="c12 p1 x xw xjc">
        <div class="p1 pb3 fs2 lh1-25 tac c12">
          Do you want to create a fresh new site,<br>or load a previously created site?
        </div>
        <div class="x xjc c12">
          <div class="p1">
            <a
              href="?sites=create"
              class="bgc-blue bgch-fg button-large"
            >Create a New Site</a>
          </div>
          <div class="p1">
            <button
              class="button-large bgc-yellow bgch-fg"
              onclick=${props.handleAdd}
            >Load an Existing Site</button>
          </div>
        </div>
        <div class="x xjc c12">
          <div class="p1 pt3">
            <a href="/#hub/guides/01-creating-your-first-site" class="fc-bg25 tfcm fch-fg">Need some help getting started?</a>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderSite (props) {
  var settingsUrl = props.active ? '?sites=all' : ('?sites=' + props.url)
  var settingsClass = props.active ? 'bgc-fg' : 'bgc-bg25 bgch-fg'
  return html`
    <div id="${props.title}" class="w100 px3 fc-fg bb1-bg10 ${props.active ? '' : 'ophc100'}">
      <div class="x xw xac py1">
        <div class="c12 sm-xx oh p1 curp" onclick=${handleSiteClick}>
          <div class="fs2 wsnw toe fwb">${props.title}</div>
        </div>
        <div class="p1 ${props.active ? '' : 'sm-op0'} oph tom">
          <a href="${settingsUrl}" class="db ${settingsClass} button-medium">Settings</a>
        </div>
        <div class="p1 ${props.active ? '' : 'sm-op0'} oph tom">
          <a href="${props.url}" target="_blank" class="db bgc-yellow bgch-fg button-medium external">Open</a>
        </div>
        <div class="p1 ${props.active ? '' : 'sm-op0'} oph tom">
          <button
            class="bgc-blue bgch-fg button-medium"
            onclick=${handleSiteClick}
          >Edit this Site</button>
        </div>
      </div>
      ${props.error ? renderError() : ''}
      ${props.active ? renderSettings() : ''}
    </div>
  `

  function renderError () {
    return html`<div class="px1 pb2 pt0 fc-red">${props.error}</div>`
  }

  function renderSettings () {
    return html`
      <div class="c12">
        <div class="px1">
          <div style="border-top: 1px solid #ddd"></div>
        </div>
        <div class="x xjb py1">
          <div class="px1 py2 fc-bg25">
            Additional settings and p2p stats coming soon
          </div>
          <div class="p1">
            <button class="bgch-fg bgc-red button-medium" onclick=${handleRemove}>Remove from Sites</button>
          </div>
        </div>
      </div>
    `
  }

  function handleSiteClick () {
    if (typeof props.handleLoad === 'function') {
      props.handleLoad({ url: props.url, redirect: true })
    }
  }

  function handleRemove () {
    if (typeof props.handleRemove === 'function') {
      props.handleRemove({ url: props.url, render: true })
    }
  }
}
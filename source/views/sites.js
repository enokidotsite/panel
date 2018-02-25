var objectValues = require('object-values')
var assert = require('assert')
var html = require('choo/html')
var xtend = require('xtend')

var RenderSiteCreate = require('./sites-create')

module.exports = view

function view (state, emit) {
  var sites = objectValues(state.sites.archives)

  // store route history
  if (state.ui.history.sites !== state.query.sites) {
    emit(state.events.UI_HISTORY, {
      route: 'sites',
      path: state.query.sites
    })
  }

  // not loaded
  if (!state.sites.loaded) return

  // create
  if (state.query.sites === 'designs' || state.query.sites === 'meta') {
    return RenderSiteCreate(state, emit)
  }

  // all
  if (sites.length === 0 || state.query.sites === 'empty') {
    return renderEmpty(state, emit)
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
    <div class="w100 xx bgc-bg5">
      <div class="x xw xjb py1 px3 bgc-bg">
        <div class="fs2 px1 py2 toe wsnw oxh c12 sm-xx fwb">
          Sites
        </div>
        <div class="x">
          <div class="p1">
            <div
              class="bgc-bg25 bgch-fg button-medium"
              onclick=${props.handleAdd}
            >Load an Existing Site</div>
          </div>
          <div class="p1">
            <a
              href="?sites=designs"
              class="bgc-blue button-medium"
            >Create a New Site</a>
          </div>
        </div>
      </div>
      <div class="p0-5">
        ${props.sites.map(function (site) {
          return renderSite(xtend(site, {
            active: props.active === site.url,
            handleLoad: props.handleLoad,
            handleRemove: props.handleRemove
          }))
        })}
      </div>
    </div>
  `
}

function renderEmpty (state, emit) {
  return html`
    <div class="x xx xdc c12">
      <div class="x xw xjb py1 px3 bgc-bg bb1-bg10">
        <div class="fs2 px1 py2 toe wsnw oxh c12 sm-xx fwb">
          enoki
        </div>
        <div class="p1">
          <button
            class="button-medium bgc-bg25 bgch-fg"
            onclick=${handleAdd}
          >Load an Existing Site</button>
        </div>
      </div>
      <div class="x xx w100 xjc xac fc-bg25">
        <div>ONBOARDING INTERACTIVE VIDEO PLACEHOLDER</div>
      </div>
      <div class="psf l0 r0 b0 x xjc py1" style="margin-left: 7rem">
        <div class="p1 dn" onclick=${handleTts}>Speak</div>
        <div class="p1">
          <a
            href="?sites=designs"
            class="bgc-blue bgch-fg button-large"
          >Create a Fresh New Site</a>
        </div>
      </div>
    </div>
  `

  function handleTts () {
    emit('tts:set-voice', 'Samantha')
    emit('tts:speak', {
      id: 1,
      text: 'Enoki is a publishing tool for the decentralized web',
      rate: 0.65,
      pitch: 0.1
    })
    console.log(state)
  }

  function handleAdd () {
    emit(state.events.SITE_ADD)
  }
}

function renderSite (props) {
  var settingsUrl = props.active ? '?sites=all' : ('?sites=' + props.url)
  var settingsClass = props.active ? 'bgc-fg' : 'bgc-bg25'

  return html`
    <div id="${props.title}" class="p0-5 w100">
      <div class="w100 br1 px2 bgc-bg ${props.active ? '' : 'ophc100'}">
        <div class="x xw xac py1">
          <div class="c12 sm-xx oh p1 curp" onclick=${handleSiteClick}>
            <div class="fs2 wsnw toe">${props.title}</div>
          </div>
          <div class="p1 ${props.active ? '' : 'sm-op0'} oph tom">
            <a href="${settingsUrl}" class="db ${settingsClass} button-medium">Settings</a>
          </div>
          <div class="p1 ${props.active ? '' : 'sm-op0'} oph tom">
            <a href="${props.url}" target="_blank" class="db bgc-yellow button-medium external">Open</a>
          </div>
          <div class="p1 ${props.active ? '' : 'sm-op0'} oph tom">
            <button
              class="bgc-blue button-medium"
              onclick=${handleSiteClick}
            >Edit this Site</button>
          </div>
        </div>
        ${props.error ? renderError() : ''}
        ${props.active ? renderSettings() : ''}
      </div>
    </div>
  `

  function renderError () {
    return html`<div class="px1 pb2 pt0 fc-red">${props.error}</div>`
  }

  function renderSettings () {
    return html`
      <div class="c12">
        <div class="px1">
          <div class="bt1-bg10"></div>
        </div>
        <div class="x xjb py1">
          <div class="px1 py2 fc-bg25">
            Additional settings and p2p stats coming soon
          </div>
          <div class="p1">
            <button class="bgc-red button-medium" onclick=${handleRemove}>Remove from Sites</button>
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
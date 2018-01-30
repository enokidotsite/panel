var assert = require('assert')
var objectValues = require('object-values')
var html = require('choo/html')
var xtend = require('xtend')

var renderNewSite = require('./sites-new')

module.exports = view

function view (state, emit) {
  var sites = objectValues(state.sites.archives)

  if (!state.sites.loaded) return

  // new
  if (state.query.sites === 'new') {
    return renderNewSite(state, emit)
  }

  // all
  if (sites.length > 0) {
    return renderSites({
      handleRemove: handleRemove,
      handleLoad: handleLoad,
      handleAdd: handleAdd,
      active: state.query.sites,
      sites: sites
    })
  // empty
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
            active: props.active === site.url,
            handleLoad: props.handleLoad,
            handleRemove: props.handleRemove
          }))
        })}
        <div class="psf b0 l0 r0 w100 p1 p1 x xjc">
          <div class="p1">
            <a
              href="?sites=new"
              class="bgc-fg button-large"
            >Create a New Site</a>
          </div>
          <div class="p1">
            <div
              class="bgc-fg button-large"
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
              href="?sites=new"
              class="bgc-fg button-large"
            >Create a New Site</a>
          </div>
          <div class="p1">
            <button
              class="button-large bgc-fg"
              onclick=${props.handleAdd}
            >Load an Existing Site</button>
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
    <div class="p1 w100">
      <div class="w100 bgc-bg5 fc-fg br1">
        <div class="x xw xac p1">
          <div class="oh p1 xx lh1">
            <div class="fs2">${props.title}</div>
          </div>
          <div class="p1">
            <a href="${settingsUrl}" class="db ${settingsClass} button-medium">Settings</a>
          </div>
          <div class="p1">
            <button
              class="bgc-fg button-medium"
              onclick=${handleSiteClick}
            >Edit Site</button>
          </div>
        </div>
        ${props.active ? renderSettings() : ''}
      </div>
    </div>
  `

  function renderSettings () {
    return html`
      <div class="c12 p2 bt2-bg">
        <button class="bgc-fg button-medium" onclick=${handleRemove}>Remove</button>
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
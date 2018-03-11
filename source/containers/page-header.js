var queryString = require('query-string')
var raw = require('choo/html/raw')
var html = require('choo/html')
var xtend = require('xtend')
var path = require('path')

var blueprintSettings = require('../blueprints/page-header.json')
var blueprintDefault = require('../blueprints/default')
var methodsPage = require('../lib/page')
var fields = require('./fields')

module.exports = pageHeader

function pageHeader (state, emit) {
  var search = queryString.parse(location.search)
  var blueprint = getParentBlueprint()
  var draftPage = getDraftPage()
  var views = methodsPage.getViews({
    blueprints: state.site.blueprints,
    blueprint: blueprint
  }) 

  // views
  if (views) {
    blueprintSettings.fields.view.options = views
  }

  return html`
    <div id="header-page" class="psr px3 bgc-bg2-5 ophc100">
      <div class="x xw py1 xjb">
        <div class="oph op0 tom psa t0 l0 ${state.page.url !== '/' ? 'db' : 'dn'}">
          <a
            href="?url=${path.resolve(state.page.url || '', '../')}"
            class="db ff-mono tac fc-bg25 fch-fg tfcm fwn"
            style="font-size: 2.5rem; line-height: 8rem; width: 4rem"
          >←</a>
        </div>
        <div class="fs2 py2 px1 toe wsnw oxh c12 sm-xx fwb">
          <a href="?url=${state.page.url}">${state.page.title || state.page.name || raw('&nbsp;')}</a>
        </div>
        ${elMeta()}
      </div>
      ${search.settings && state.page.url && state.page.url ? PageSettings() : ''}
    </div>
  `

  function PageSettings () {
    return html`
      <div class="x xje xw pb1">
        <div class="px1 w100">
          <div style="border-top: 1px dashed #ddd"></div>
        </div>
        ${fields({
          oninput: handleFieldUpdate,
          content: state.content,
          blueprint: blueprintSettings,
          events: state.events,
          query: state.query,
          values: state.page,
          draft: draftPage,
          site: state.site,
          page: state.page
        })}
        <div class="p1 c3">
          <div class="c12 py1 fwb usn fs0-8 ttu fc-bg25">
            Delete
          </div>
          <span
            class="tac bgc-bg fch-fg fc-red b2-currentColor button-medium"
            onclick=${handleRemovePage}
          >Delete Page</span>
        </div>
      </div>
    `
  }

  function elMeta () {
    var settingsUrl = search.settings ? unescape(queryString.stringify({ url: state.page.url })) : unescape(queryString.stringify(xtend(state.query, { settings: 'active' })))
    var settingsClass = search.settings ? 'fc-fg' : 'fc-bg25 fch-fg'
    return html`
      <div class="x xw">
        <div class="p1 tom ${state.page.url && state.page.url !== '/' ? 'db' : 'dn'}">
          <a href="?${settingsUrl}" class="db bgc-bg b2-currentColor ${settingsClass} button-medium">Settings</a>
        </div>
        <div class="p1 xx">
          <a
            href="${state.site.info.url}${state.page.url}"
            target="_blank"
            class="tac fch-fg fc-yellow bgc-bg button-medium b2-currentColor external"
          >Open</a>
        </div>
      </div>
    `
  }

  function getDraftPage () {
    return state.enoki && state.page && state.enoki.changes[state.page.url]
  }

  function getParentBlueprint () {
    if (!state.page || !state.site.loaded) return { }
    try {
      var parent = path.join(state.page.url, '../').replace(/\/$/, '')
      var parentState = state.content[parent]

      return (
        state.site.blueprints[parentState.view] ||
        state.site.blueprints.default ||
        blueprintDefault
      )
    } catch (err) {
      return blueprintDefault
    }
  } 

  function handleFieldUpdate (key, data) {
    emit(state.events.ENOKI_UPDATE, {
      path: state.page.path,
      url: state.page.url,
      data: { [key]: data }
    })
  }

  function handleRemovePage () {
    emit(state.events.ENOKI_REMOVE, {
      confirm: true,
      title: state.page.title,
      path: state.page.path,
      url: state.page.url
    })
  }
}
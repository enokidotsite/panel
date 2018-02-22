var queryString = require('query-string')
var raw = require('choo/html/raw')
var html = require('choo/html')
var xtend = require('xtend')
var path = require('path')

var blueprintSettings = require('../blueprints/page-header.json')
var blueprintDefault = require('../blueprints/default')
var methodsPage = require('../methods/page')
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
    <div class="px3 bb1-bg10">
      <div class="x xw py0-5 xjb">
        <div class="fs1 py1-5 px0-5 toe wsnw oxh c12 sm-xx fwb">
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
          <div class="bt1-bg10"></div>
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
            class="tac bgch-fg bgc-red button-medium"
            onclick=${handleRemovePage}
          >Delete Page</span>
        </div>
      </div>
    `
  }

  function elMeta () {
    var settingsUrl = search.settings ? unescape(queryString.stringify({ url: state.page.url })) : unescape(queryString.stringify(xtend(state.query, { settings: 'active' })))
    var settingsClass = search.settings ? 'bgc-fg' : 'bgc-bg25 bgch-fg'
    return html`
      <div class="x xw">
        <div class="p0-5 tom ${state.page.url && state.page.url !== '/' ? 'db' : 'dn'}">
          <a href="?${settingsUrl}" class="db ${settingsClass} button-medium">Settings</a>
        </div>
        <div class="p0-5 xx">
          <a
            href="${state.site.info.url}${state.page.url}"
            target="_blank"
            class="tac bgch-fg bgc-yellow button-medium external"
          >Open</a>
        </div>
      </div>
    `
  }

  function getDraftPage () {
    return state.panel && state.page && state.panel.changes[state.page.url]
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
    emit(state.events.PANEL_UPDATE, {
      path: state.page.path,
      url: state.page.url,
      data: { [key]: data }
    })
  }

  function handleRemovePage () {
    emit(state.events.PANEL_REMOVE, {
      confirm: true,
      title: state.page.title,
      path: state.page.path,
      url: state.page.url
    })
  }
}
var queryString = require('query-string')
var raw = require('choo/html/raw')
var html = require('choo/html')
var ok = require('object-keys')
var xtend = require('xtend')
var path = require('path')

// components
var ActionBar = require('../components/actionbar')
var Breadcrumbs = require('../components/breadcrumbs')
var Split = require('../components/split')
var Publish = require('../components/publish')

// containers
var Fields = require('../containers/fields')
var blueprintDefault = require('../blueprints/default')

// views
var File = require('./file')
var FilesAll = require('./files-all')
var FileNew = require('./file-new')
var PagesAll = require('./pages-all')
var PageNew = require('./page-new')
var Sites = require('./sites')
var Hub = require('./hub')

// methods
var methodsFile = require('../methods/file')
var methodsPage = require('../methods/page')
var methodsSite = require('../methods/site')

module.exports = wrapper(view)

function view (state, emit) {
  var search = queryString.parse(location.search)
  var draftPage = getDraftPage()
  var blueprint = getBlueprint()

  return html`
    <body class="fs1 ff-sans x xdc vhmn100">
      ${header()}
      ${content()}
      ${loading()}
    </body>
  `

  function header () {
    var editorActive = typeof search.url !== 'undefined' && state.sites.active
    var sitesActive = typeof search.sites !== 'undefined'
    var hubActive = typeof search.hub !== 'undefined'

    // non p2p
    if (!state.sites.p2p) return ''

    return html`
      <div id="header" class="x xjb usn z2 psr oh bgc-bg2-5">
        <div class="x xx oxh">
          ${editorActive ? breadcrumbs() : html`<div class="py2 px4 fwb">enoki</div>`}
        </div>
        <div class="x px2 fs0-8 ttu fwb">
          <div class="${state.sites.active ? '' : 'dn'}">
            <a href="/?url=/" class="nav-link ${editorActive ? 'fc-fg nav-active' : 'fc-bg25 fch-fg'} tfcm db p2">Editor</a>
          </div>
          <div class="psr">
            <a href="/?sites=all" class="nav-link ${sitesActive ? 'fc-fg nav-active' : 'fc-bg25 fch-fg'} tfcm db p2">Sites</a>
          </div>
          <div class="psr">
            <a href="/?hub=docs" class="nav-link ${hubActive ? 'fc-fg nav-active' : 'fc-bg25 fch-fg'} tfcm db p2">Hub</a>
          </div>
        </div>
      </div>
    `
  }

  function breadcrumbs () {
    return html`
      <div class="x oxh px3">
        <a href="?url=/" class="bgc-bg2-5 db px1 nbb py2 breadcrumb fc-bg25 fch-fg">home</a>
        <div class="oxh xx breadcrumbs wsnw drtl">
          ${Breadcrumbs({ page: state.page })}
        </div>
      </div>
    `
  }

  function loading () {
    if (!state.panel.loading) return
    return html`
      <div class="psf z2 t0 r0">
        <div class="loader"></div>
      </div>
    `
  }

  // TODO: clean this up
  function content () {
    if (!state.sites.p2p && state.sites.loaded) {
      // non p2p
      return nonDat(state, emit)
    }

    if (search.hub) {
      // docs
      return Hub(state, emit)
    }

    if (search.sites || !state.sites.active) {
      // sites
      return Sites(state, emit)
    }

    if (search.file === 'new') {
      // files
      return [
        PageHeader(),
        [FileNew(state, emit), Page()]
      ]
    }

    // single file
    if (search.file) return File(state, emit)

    // pages
    if (search.pages === 'all') {
      return [PageHeader(), PagesAll(state, emit)]
    }

    if (search.page === 'new') {
      // create page
      return [
        PageHeader(),
        [PageNew(state, emit), Page()]
      ]
    }

    if (search.files === 'all') {
      // all files
      return [PageHeader(), FilesAll(state, emit)]
    }

    return [
      // default fields
      PageHeader(),
      Page()
    ]
  }

  function Page () {
    return html`
      <div id="content-page" class="x xdc c12" style="padding-bottom: 7rem">
        <form class="x xw p2 x1" onsubmit=${handleSavePage}>
          ${Fields({
            oninput: handleFieldUpdate,
            content: state.content,
            blueprint: blueprint,
            events: state.events,
            query: state.query,
            values: state.page,
            draft: draftPage,
            site: state.site,
            page: state.page
          }, emit)}
          <div class="psf b0 l0 r0 p1 pen z2">
            ${ActionBar({
              disabled: draftPage === undefined || search.page,
              saveLarge: true,
              handleCancel: handleCancelPage,
              handleRemove: handleRemovePage
            })}
          </div>
        </form>
      </div>
    `
  }

  function PageHeader () {
    return html`
      <div class="px3">
        <div class="x xw py1 xjb">
          <div class="fs2 px1 py2 toe wsnw oxh c12 sm-xx fwb">
            <a href="?url=${state.page.url}">${state.page.title || state.page.name || raw('&nbsp;')}</a>
          </div>
          ${elMeta()}
        </div>
        <div class="px1"><div class="bb1-bg10"></div></div>
      </div>
    `
  }


  function elMeta () {
    return html`
      <div class="x">
        ${state.site.info ? elView() : ''}
        ${state.page.url && state.page.url !== '/' ? elRemove() : ''}
      </div>
    `
  }

  function elView () {
    return html`
      <div class="p1 xx">
        <a
          href="${state.site.info.url}${state.page.url}"
          target="_blank"
          class="tac bgch-fg bgc-blue button-medium external"
        >Open</a>
      </div>
    `
  }

  function elRemove () {
    return html`
      <div class="p1 xx">
        <span
          class="tac bgch-fg bgc-red button-medium"
          onclick=${handleRemovePage}
        >Delete</span>
      </div>
    `
  }

  function handleFieldUpdate (event, data) {
    emit(state.events.PANEL_UPDATE, {
      path: state.page.path,
      url: state.page.url,
      data: { [event]: data }
    })
  }

  function handleSavePage (event) {
    if (!draftPage) return
    if (typeof event === 'object' && event.preventDefault) event.preventDefault()

    emit(state.events.PANEL_SAVE, {
      file: state.page.file,
      path: state.page.path,
      url: state.page.url,
      page: ok(blueprint.fields)
        .reduce(function (result, field) {
          result[field] = draftPage[field] === undefined
            ? state.page[field]
            : draftPage[field]
          return result
        }, { })
    })
  }

  function handleCancelPage () {
    emit(state.events.PANEL_CANCEL, {
      url: state.page.url
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

  function handleFilesUpload (event, data) {
    emit(state.events.PANEL_FILES_ADD, {
      path: state.page.path,
      url: state.page.url,
      files: data.files
    })
  }

  function getBlueprint () {
    if (!state.page || !state.site.loaded) {
      return { }
    } else {
      return (
        state.site.blueprints[state.page.view] ||
        state.site.blueprints.default ||
        blueprintDefault
      )
    }
  }

  function getDraftPage () {
    return state.panel && state.page && state.panel.changes[state.page.url]
  }
}

function nonDat (state, emit) {
  return html`
    <div class="xx c12 x xac">
      <div class="c12 p1 x xw xjc">
        <div class="p1 pb3 fs2 lh1-25 tac c12">
          Please open Enoki in Beaker, an<br class="dn sm-dib"> experimental peer-to-peer browser
        </div>
        <div class="x xjc c12">
          <div class="p1">
            <a href="https://beakerbrowser.com" target="_blank" class="button-large bgc-hg">
              Download Beaker Browser
            </a>
          </div>
        </div>
        <div class="p1 py3 tac fc-bg25 lh1-5 c12" style="max-width: 55rem">
          Want to edit your site offline? Navigate to the dat:// url and “Add to Library”, or customize to your liking by forking.
        </div>
        <div class="x xjc c12">
          <div class="p1">
            <a href="dat://panel.enoki.site" class="button-medium bgc-bg25 bgch-fg fc-bg">Open dat:// in Beaker Browser</a>
          </div>
        </div>
        <div class="p1 py3 tac fc-bg25 c12">
          Thanks for your patience; this flow will be improving soon :)
        </div>
      </div>
    </div>
  `
}

function wrapper (view) {
  return function (state, emit) {
    var href = state.query.url || '/'
    var page = state.content[href] || { }
    return view(xtend(state, { page: page }), emit)
  }
}

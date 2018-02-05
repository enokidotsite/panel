var html = require('choo/html')
var objectValues = require('object-values')
var queryString = require('query-string')
var xtend = require('xtend')

var methodsFile = require('../methods/file')

module.exports = pagesAll

function pagesAll (state, emit) {
  var urlPageNew = unescape(queryString.stringify(xtend(state.query, { page: 'new', pages: undefined })))
  var pagePages = objectValues(state.page.pages || { }).map(function (pagePage) {
    return state.content[pagePage.url]
  })

  return html`
    <div class="p4">
      <div class="x xjb py1 c12 usn fs0-8 fc-bg25 ttu">
        <div class="fwb">
          Pages
        </div>
        <div>
          <a href="?${urlPageNew}" class="button-inline">Add</a>
        </div>
      </div>
      <ul class="c12 myc1 lsn">
        ${elsChildren(pagePages)}
      </div>
    </div>
  `
}

function elsChildren (children) {
  children = children || [ ]

  if (children.length <= 0) {
    return html`
      <li class="m0 py1 tcgrey">
        No sub-pages
      </li>
    `
  }

  return children.map(function (child) {
    if (!child.url) return
    return html`
      <li id="${child.url}" class="m0">
        <a
          href="?url=${child.url}"
          class="db py1 truncate"
        >${child.title || child.name}</a>
      </li>
    `
  })
}
var ok = require('object-keys')
var ov = require('object-values')
var html = require('choo/html')

var mf = require('../methods/file')

module.exports = sidebar

function sidebar (props) {
  props = props || { }
  props.pagesActive = (props.pagesActive === undefined) ? false : props.pagesActive
  props.filesActive = (props.filesActive === undefined) ? false : props.filesActive

  return html`
    <div id="sidebar" class="c12 t0 psst p1">
      ${props.pagesActive ? elChildren() : ''}
      ${props.filesActive ? elFiles() : ''}
    </div>
  `

  function elChildren () {
    return html`
      <div id="sidebar-children" class="mb2">
        <div class="x xjb c12 mb1 usn">
          <div class="fwb">
            <a href="?pages=all">Pages</a>
          </div>
          <div>
            <a href="?page=new" class="button-inline">Add</a>
            <a href="?pages=all" class="button-inline">All</a>
          </div>
        </div>
        <ul class="c12 myc1 lsn">
          ${elsChildren(props.page)}
        </ul>
      </div>
    `
  }

  function elFiles () {
    return html`
      <div id="sidebar-files">
        <div class="x xjb mb1 usn">
          <div class="fwb">
            <a href="?files=all">Files</a>
          </div>
          <div>
            <a href="?file=new" class="button-inline">Add</a>
            <a href="?files=all" class="button-inline">All</a>
          </div>
        </div>
        <ul class="c12 myc1 lsn">
          ${elsFiles(props.page)}
        </div>
      </div>
    `
  }
}

function elsChildren (props) {
  props = props || { }
  var children = (typeof props.children === 'object') ? ov(props.children) : [ ]

  if (children.length <= 0) {
    return html`
      <li class="m0 py0-5 tcgrey">
        No sub-pages
      </li>
    `
  }

  return children.map(function (child) {
    return html`
      <li id="${child.url}" class="m0">
        <a
          href="${child.url}"
          class="db py0-5 truncate"
        >${child.title || child.dirname}</a>
      </li>
    `
  })
}

function elsFiles (props) {
  props = props || { }
  var files = (typeof props.files === 'object') ? ov(props.files) : { }

  if (files.length <= 0) {
    return html`
      <li class="m0 py0-5 tcgrey">
        No files
      </li>
    `
  }

  return files.map(function (child) {
    var path = '?file=' + mf.encodeFilename(child.filename)
    return html`
      <li id="${child.url}" class="m0">
        <a href="${path}" class="db py0-5">${child.filename}</a>
      </li>
    `
  })
}

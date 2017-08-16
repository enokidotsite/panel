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
    <div id="sidebar" class="t0 psst p1">
      ${props.pagesActive ? elChildren() : ''}
      ${props.filesActive ? elFiles() : ''}
    </div>
  `

  function elChildren () {
    return html`
      <div id="sidebar-children" class="mb2">
        <div class="x xjb c12 mb1">
          <div class="fwb">
            <a href="?pages=all">Pages</a>
          </div>
          <div>
            <a href="?page=new">Add</a>
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
        <div class="x xjb mb1">
          <div class="fwb">
            <a href="?files=all">Files</a>
          </div>
          <div>
            <a href="?file=new">Add</a>
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
  props.children = (typeof props.children === 'object')
    ? props.children
    : { }

  return ov(props.children).map(function (child) {
    return html`
      <li id="${child.url}" class="m0">
        <a href="${child.url}" class="db py0-5 truncate">${child.title || child.dirname}</a>
      </li>
    `
  })
}

function elsFiles (props) {
  props = props || { }
  props.files = (typeof props.files === 'object') ? props.files : { }

  return ov(props.files).map(function (child) {
    var path = '?file=' + mf.encodeFilename(child.filename)
    return html`
      <li id="${child.url}" class="m0">
        <a href="${path}" class="db py0-5">${child.filename}</a>
      </li>
    `
  })
}

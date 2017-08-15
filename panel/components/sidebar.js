var ok = require('object-keys')
var ov = require('object-values')
var html = require('choo/html')

var mf = require('../methods/files')

module.exports = sidebar

function sidebar (state, emit) {
  return html`
    <div class="t0 psst p1">
      <div class="x xjb c12 mb1">
        <div class="fwb">
          <a href="?pages=all">Pages</a>
        </div>
        <div>
          <a href="?page=new">Add</a>
        </div>
      </div>
      <ul class="c12 myc1 lsn">
        ${elChildren(state.page)}
      </ul>
      <div style="height: 2rem"></div>
      <div class="x xjb mb1">
        <div class="fwb">
          <a href="?files=all">Files</a>
        </div>
        <div>
          <a href="?file=new">Add</a>
        </div>
      </div>
      <ul class="c12 myc1 lsn">
        ${elFiles(state.page)}
      </div>
    </div>
  `
}

function elChildren (state) {
  var children = (typeof state.children === 'object') ? state.children : { }

  return ov(children).map(function (child) {
    return html`
      <li id="${child.url}" class="m0">
        <a href="${child.url}" class="db py0-5 truncate">${child.title || child.dirname}</a>
      </li>
    `
  })
}

function elFiles (state) {
  var files = (typeof state.files === 'object')
    ? state.files : { }

  return ov(files).map(function (child) {
    var path = '?file=' + mf.encodeFilename(child.filename)
    return html`
      <li id="${child.url}" class="m0">
        <a href="${path}" class="db py0-5">${child.filename}</a>
      </li>
    `
  })
}

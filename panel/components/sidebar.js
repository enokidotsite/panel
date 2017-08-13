var ok = require('object-keys')
var ov = require('object-values')
var html = require('bel')

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
      ${elChildren(state.page)}
      <div style="height: 2rem"></div>
      <div class="x xjb mb1">
        <div class="fwb">
          <a href="?files=all">Files</a>
        </div>
        <div>
          <a href="?file=new">Add</a>
        </div>
      </div>
      ${elFiles(state.page)}
    </div>
  `
}

function elChildren (state) {
  var children = (typeof state.children === 'object')
    ? state.children : { }

  return ov(children)
    .map(function (child) {
      return html`
        <ul class="c12">
          <li><a href="${child.path}">${child.title || child.dirname}</a></li>
        </ul>
      `
    })
}

function elFiles (state) {
  var files = (typeof state.files === 'object')
    ? state.files : { }

  return ov(files).map(function (child) {
    var path = '?file=' + mf.encodeFilename(child.filename)
    return html`
      <url class="c12">
        <li><a href="${path}">${child.filename}</a></li>
      </url>
    `
  })
}

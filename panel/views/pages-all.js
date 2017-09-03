var html = require('choo/html')
var objectValues = require('object-values')
var methodsFile = require('../methods/file')

module.exports = FilesAll

function FilesAll (state, emit) {
  return html`
    <div class="p1">
      <div class="p1">
        <div class="x xjb c12 mb1 usn">
          <div class="fwb">
            Pages
          </div>
          <div>
            <a href="?page=new" class="button-inline">Add</a>
          </div>
        </div>
        <ul class="c12 myc1 lsn">
          ${elsChildren(state.page)}
        </div>
      </div>
    </div>
  `
}

function elsChildren (props) {
  props = props || { }
  var children = (typeof props.children === 'object') ? objectValues(props.children) : [ ]

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
          href="${child.url}?panel=active"
          class="db py0-5 truncate"
        >${child.title || child.dirname}</a>
      </li>
    `
  })
}
var ok = require('object-keys')
var ov = require('object-values')
var html = require('choo/html')

var Uploader = require('../components/uploader')
var methodsFile = require('../methods/file')

var uploader = Uploader()

module.exports = sidebar

function sidebar (props, emit) {
  props = props || { }
  props.pagesActive = (props.pagesActive === undefined) ? false : props.pagesActive
  props.filesActive = (props.filesActive === undefined) ? false : props.filesActive
  props.uploadActive = (props.uploadActive === undefined) ? false : props.uploadActive

  return html`
    <div id="sidebar" class="c12">
      <div class="psst p1" style="top: 0.75rem; padding-bottom: 5.5rem">
        ${props.pagesActive ? elChildren() : ''}
        ${props.filesActive ? elFiles() : ''}
        ${props.handleRemovePage ? elRemove() : ''}
      </div>
    </div>
  `

  function elChildren () {
    return html`
      <div id="sidebar-children" class="mb2">
        <div class="x xjb c12 mb1 usn">
          <div class="fwb">
            <a href="?panel=active&pages=all">Pages</a>
          </div>
          <div>
            <a href="?panel=active&page=new" class="button-inline">Add</a>
            <a href="?panel=active&pages=all" class="button-inline">All</a>
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
      <div id="sidebar-files" class="mb2 psr">
        <div class="x xjb mb1 usn">
          <div class="fwb">
            <a href="?panel=active&files=all">Files</a>
          </div>
          <div>
            <a
              href="?panel=active&file=new"
              class="button-inline"
              onclick=${handleFileAdd}
            >Add</a>
            <a href="?panel=active&files=all" class="button-inline">All</a>
          </div>
        </div>
        ${props.handleFileUpload ? elUploadContainer() : ''}
        <ul class="c12 myc1 lsn">
          ${elsFiles(props.page)}
        </div>
      </div>
    `
  }

  function elUploadContainer () {
    return html` 
      <div class="
        ${props.uploadActive ? 'x' : 'dn'}
        bgwhite input psa t0 l0 r0 b0 x xjc xac
      ">
        ${uploader.render({
          text: 'Drag and drop here to add file(s)',
          handleFile: props.handleFileUpload,
          handleDragEnter: function (event) {
            var el = event.target.parentNode.parentNode
            el.classList.remove('bgwhite', 'tcblack')
            el.classList.add('bgblack', 'tcwhite')
          },
          handleDragLeave: function (event) {
            var el = event.target.parentNode.parentNode
            el.classList.add('bgwhite', 'tcblack')
            el.classList.remove('bgblack', 'tcwhite')
          }
        }, emit)}
      </div>
    `
  }

  function elRemove () {
    return html`
      <div>
        <span
          class="tcgrey curp"
          onclick=${props.handleRemovePage}
        >Delete page</span>
      </div>
    `
  }

  function handleFileAdd (event) {
    uploader.open()
    event.preventDefault()
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

  return children
    .slice(0, 6)
    .map(function (child) {
      return html`
        <li id="${child.url}" class="m0">
          <a
            href="${child.url}?panel=active"
            class="db py0-5 truncate"
            ondragstart=${handleDragStart}
          >${child.title || child.dirname}</a>
        </li>
      `

    function handleDragStart (event) {
      event.dataTransfer.setData('text/plain', `[${child.title}](${child.url})`)
    }
  })
}

function elsFiles (props) {
  props = props || { }
  var files = (typeof props.files === 'object') ? ov(props.files) : [ ]

  // Hide if there is nothing
  if (files.length <= 0) return html`
    <li class="m0 py0-5 tcgrey">
      No files
    </li>
  `

  return files
    .slice(0, 6)
    .map(function (child) {
      var path = '?panel=active&file=' + methodsFile.encodeFilename(child.filename)

      return html`
        <li id="${child.url}" class="m0">
          <a
            href="${path}"
            class="db py0-5"
            ondragstart=${handleDragStart}
          >${child.filename}</a>
        </li>
      `

    function handleDragStart (event) {
      event.dataTransfer.setData('text/plain', '![](' +child.url + ')')
    }
  })
}
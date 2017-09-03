var objectValues = require('object-values')
var html = require('choo/html')

var Uploader = require('../components/uploader')
var methodsFile = require('../methods/file')
var uploader = Uploader()

module.exports = sidebar

function sidebar (props, emit) {
  props = props || { }
  props.pagesActive = props.pagesActive === true
  props.filesActive = props.filesActive === true
  props.uploadActive = props.uploadActive === true

  return html`
    <div id="sidebar" class="c12">
      <div class="psst p1" style="top: 0.75rem; padding-bottom: 5.5rem">
        ${props.pagesActive ? elPages() : ''}
        ${props.filesActive ? elFiles() : ''}
        ${props.handleRemovePage ? elRemove() : ''}
      </div>
    </div>
  `

  function elPage () {
    return html`
      <div id="sidebar-children" class="mb2">
        <div class="x xjb c12 mb1 usn">
          <div class="fwb">
            <a href="?">Page</a>
          </div>
        </div>
        <ul class="c12 myc1 lsn">
          <li class="m0 py0-5">
            Settings
          </li>
        </ul>
      </div>
    `
  }

  function elPages () {
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
      <div id="sidebar-files" class="mb2 psr">
        <div class="x xjb mb1 usn">
          <div class="fwb">
            <a href="?files=all">Files</a>
          </div>
          <div>
            <a
              href="?file=new"
              class="button-inline"
              onclick=${handleFilesAdd}
            >Add</a>
            <a href="?files=all" class="button-inline">All</a>
          </div>
        </div>
        ${props.handleFilesUpload ? elUploadContainer() : ''}
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
          text: 'Drag and drop here to add file',
          handleFiles: props.handleFilesUpload,
          handleDragEnter: function (event) {
            var el = event.target.parentNode.parentNode.parentNode
            el.classList.remove('bgwhite', 'tcblack')
            el.classList.add('bgblack', 'tcwhite')
          },
          handleDragLeave: function (event) {
            var el = event.target.parentNode.parentNode.parentNode
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
          class="tcgrey curp tcblack-hover"
          onclick=${props.handleRemovePage}
        >Delete page</span>
      </div>
    `
  }

  function handleFilesAdd (event) {
    uploader.open()
    event.preventDefault()
  }
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
  var files = (typeof props.files === 'object') ? objectValues(props.files) : [ ]

  // Hide if there is nothing
  if (files.length <= 0) return html`
    <li class="m0 py0-5 tcgrey">
      No files
    </li>
  `

  return files
    .slice(0, 6)
    .map(function (child) {
      var path = '?file=' + methodsFile.encodeFilename(child.filename)

      return html`
        <li id="${child.url}" class="m0">
          <a
            href="${path}"
            class="db py0-5 truncate"
            ondragstart=${handleDragStart}
          >${child.filename}</a>
        </li>
      `

    function handleDragStart (event) {
      event.dataTransfer.setData('text/plain', '![](' +child.url + ')')
    }
  })
}
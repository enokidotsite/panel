var Nanocomponent = require('nanocomponent')
var objectValues = require('object-values')
var queryString = require('query-string')
var html = require('choo/html')
var xtend = require('xtend')

var Uploader = require('../components/uploader')
var methodsFile = require('../methods/file')
var uploader = Uploader()

module.exports = class Files extends Nanocomponent {
  constructor () {
    super()
    this.label = false
    this.state = {
      value: ''
    }
  }

  createElement (props, emit) {
    this.state = xtend(this.state, props.field)
    this.state.value = this.state.value || ''

    var urlFileNew = unescape(queryString.stringify(xtend({ file: 'new' }, props.query)))
    var urlFilesAll = unescape(queryString.stringify(xtend({ files: 'all' }, props.query)))
    var pageFiles = objectValues(props.page.files || { }).map(function (pageFile) {
      var data = xtend(pageFile, { })
      data.urlPanel = queryString.stringify(xtend({
        file: methodsFile.encodeFilename(pageFile.filename)
      }, props.query))
      data.urlPanel = unescape(data.urlPanel)
      return data
    })

    return html`
      <div id="sidebar-files" class="mb2 psr">
        <div class="x xjb py1 fs0-8 ttu usn">
          <div class="fwb">
            <a href="?${urlFilesAll}" class="fc-bg25 fch-fg">Files</a>
          </div>
          <div>
            <a
              href="?${urlFileNew}"
              class="button-inline"
              onclick=${this.handleFilesAdd}
            >Upload</a>
            <a href="?${urlFilesAll}" class="button-inline">All</a>
          </div>
        </div>
        ${props.handleFilesUpload ? elUploadContainer() : ''}
        <ul class="c12 myc1 lsn">
          ${elsFiles(pageFiles)}
        </div>
      </div>
    `

    function onInput (event) {
      emit({ value: event.target.value })
    }
  }

  update (props) {
    return true
  }

  handleFilesAdd (event) {
    alert('add')
  }
}

function elsFiles (files) {
  files = files || [ ]

  // Hide if there is nothing
  if (files.length <= 0) return html`
    <li class="m0 py1 fc-bg25">
      No files
    </li>
  `

  return files
    .slice(0, 6)
    .map(function (child) {
      if (!child.url) return
      return html`
        <li id="${child.url}" class="m0">
          <a
            href="?${child.urlPanel}"
            class="db py1 truncate"
            ondragstart=${handleDragStart}
          >${child.filename}</a>
        </li>
      `

    function handleDragStart (event) {
      event.dataTransfer.setData('text/plain', '![](' +child.source + ')')
    }
  })
}
var Nanocomponent = require('nanocomponent')
var objectValues = require('object-values')
var queryString = require('query-string')
var html = require('choo/html')
var xtend = require('xtend')

var Uploader = require('../components/uploader')
var methodsFile = require('../methods/file')

module.exports = class Files extends Nanocomponent {
  constructor () {
    super()
    this.label = false
    this.state = {
      limit: 6,
      value: ''
    }

    this.handleFilesAdd = this.handleFilesAdd.bind(this)
  }

  load () {
    this.uploader = new Uploader()
    this.rerender()
  }

  createElement (props, emit) {
    var self = this
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
      <div id="sidebar-files" class="psr">
        <div class="x xjb py1 fs0-8 ttu usn">
          <div class="fwb">
            <a href="?${urlFilesAll}" class="fc-bg25 fch-fg">Files</a>
          </div>
          <div>
            <a
              href="?${urlFileNew}"
              class="button-inline green"
              onclick=${this.handleFilesAdd}
            >Upload</a>
            <a href="?${urlFilesAll}" class="button-inline blue">All</a>
          </div>
        </div>
        ${emit ? elUploadContainer() : ''}
        <ul class="c12 myc1 lsn">
          ${this.elsFiles(pageFiles)}
        </div>
      </div>
    `

    function elUploadContainer () {
      if (!self.uploader) return
      return html` 
        <div class="
          ${props.uploadActive ? 'x' : 'dn'}
          bgc-bg fc-fg psa t0 l0 r0 b0 x xjc xac z2
        ">
          ${self.uploader.render({
            text: 'Drag and drop here to add file',
            handleFiles: handleFilesUpload,
            handleDragEnter: function (event) {
              var el = event.target.parentNode.parentNode.parentNode
              el.classList.remove('bgc-bg', 'fc-fg')
              el.classList.add('bgc-fg', 'fc-bg')
            },
            handleDragLeave: function (event) {
              var el = event.target.parentNode.parentNode.parentNode
              el.classList.add('bgc-bg', 'fc-fg')
              el.classList.remove('bgc-fg', 'fc-bg')
            }
          }, emit)}
        </div>
      `
    }

    function handleFilesUpload (event, data) {
      emit(props.events.PANEL_FILES_ADD, {
        path: props.page.path,
        url: props.page.url,
        files: data.files
      })
    }

    function onInput (event) {
      emit({ value: event.target.value })
    }
  }

  elsFiles (files) {
    files = files || [ ]

    // Hide if there is nothing
    if (files.length <= 0) return html`
      <li class="m0 py1 fc-bg25">
        No files
      </li>
    `

    return files
      .slice(0, this.state.limit)
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

  update (props) {
    return true
  }

  handleFilesAdd (event) {
    this.uploader.open()
    event.preventDefault()
  }
}

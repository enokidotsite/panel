var Nanocomponent = require('nanocomponent')
var html = require('choo/html')

var methodsFile = require('../methods/file')
var fields = require('../fields')

var Title = new fields.text()
var Uri = new fields.text()
var View = new fields.dropdown()

module.exports = wrapper

function wrapper () {
  if (!(this instanceof PageNew)) return new PageNew()
}

class PageNew extends Nanocomponent {
  constructor () {
    super()
    this.id = 'pageAdd'
    this.customUri = false

    this.state = {

    }

    this.handleCancel = this.handleCancel.bind(this)
    this.handleTitle = this.handleTitle.bind(this)
    this.handleView = this.handleView.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleUri = this.handleUri.bind(this)
  }

  createElement (state, emit) {
    this.key = state.key
    this.views = state.views || { }
    this.value = state.value || { }
    this.value.view = state.view || 'default'
    this.emit = emit

    return html`
      <div class="bgc-bg br1">
        <form>
          <div class="p1">
            ${this.elTitle()}
            ${this.elUri()}
            ${this.elView()}
          </div>
          ${this.elActions()}
        </form>
      </div>
    `
  }

  load (element) {
    var title = element.querySelector('[name="title"]')
    if (title && title.focus) title.focus()
  }

  unload () {
    this.customUri = false
  }

  elTitle () {
    var titleProps = {
      oninput: this.handleTitle,
      field: {
        id: 'pageAdd',
        key: 'title',
        value: this.value.title || ''
      }
    }
    return html`
      <div class="p1">
        <div class="c12 fwb usn fs0-8 ttu fc-bg25 mb1">
          Title
        </div>
        ${Title.render(titleProps, this.emit)}
      </div>
    `
  }

  elView () {
    var viewProps = {
      oninput: this.handleView,
      field: {
        key: 'dropdown',
        options: this.views,
        value: this.value.view
      }
    }

    return html`
      <div class="p1">
        <div class="c12 fwb usn fs0-8 ttu fc-bg25 mb1">
          View
        </div>
        ${View.render(viewProps, this.emit)}
      </div>
    `
  }

  elUri () {
    var uriProps = {
      field: { id: 'pageAdd', key: 'uri', value: this.value.uri || '' },
      oninput: this.handleUri
    }
    return html`
      <div class="p1">
        <div class="c12 fwb usn fs0-8 ttu fc-bg25 mb1">
          Pathname
        </div>
        ${Uri.render(uriProps, this.emit)}
      </div>
    `
  }

  elActions () {
    return html`
      <div class="x xje c12 fs1 usn fs1 p1 bgc-bg2-5">
        <div class="p1">
          <button
            type="button"
            class="db button-medium b2-currentColor bgc-bg fc-bg25 fch-fg"
            onclick=${this.handleCancel}
          >Cancel</button>
        </div>
        <div class="p1">
          <button
            type="submit"
            class="xx button-medium fc-bg bgc-blue bgch-fg fwb"
            onclick=${this.handleSave}
          >Create</button>
        </div>
      </div>
    `
  }

  handleTitle (data) {
    this.value.title = data.value
    if (!this.customUri) {
      var el = this.element.querySelector('input[name="uri"]')
      var value = methodsFile.sanitizeName(data.value)
      this.value.uri = value
      if (el) el.value = value
    }
  }

  handleUri (data) {
    var el = this.element.querySelector('input[name="uri"]')
    this.value.uri = methodsFile.sanitizeName(data.value)
    this.customUri = true
    if (el) el.value = this.value.uri
  }

  handleView (data) {
    this.value.view = data.value
  }

  handleSave (event) {
    this.emit({ key: this.key, event: 'save', value: this.value })
    if (event) event.preventDefault()
  }

  handleCancel (event) {
    this.emit({ event: 'cancel' })
    if (event) event.preventDefault()
  }

  update (props) {
    return props.views !== this.views
  }
}

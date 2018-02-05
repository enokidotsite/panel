var Nanocomponent = require('nanocomponent')
var html = require('choo/html')

var methodsFile = require('../methods/file')
var fields = require('../fields')

var Title = fields.text()
var Uri = fields.text()
var View = fields.dropdown()

module.exports = wrapper

function wrapper () {
  if (!(this instanceof PageNew)) return new PageNew()
}

class PageNew extends Nanocomponent {
  super () {
    this.id = 'pageAdd'
    this.customUri = false
    this.super()
  }

  createElement (state, emit) {
    var self = this
    this.key = state.key
    this.views = state.views || { }
    this.value = state.value || { }
    this.value.view = state.view || 'default'
    this.emit = emit

    return html`
      <div class="bgc-bg br2">
        <form onsubmit={this.handleSave}>
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
    return html`
      <div class="p1">
        <div class="c12 fwb usn fs0-8 ttu fc-bg25 mb1">
          Title
        </div>
        ${Title.render(
          { id: 'pageAdd', key: 'title', value: this.value.title || '' },
          this.handleTitle.bind(this)
        )}
      </div>
    `
  }

  elView () {
    return html`
      <div class="p1">
        <div class="c12 fwb usn fs0-8 ttu fc-bg25 mb1">
          View
        </div>
        ${View.render({
          key: 'dropdown',
          value: {
            options: this.views,
            selected: this.value.view
          }
        }, this.handleView.bind(this))}
      </div>
    `
  }

  elUri () {
    return html`
      <div class="p1">
        <div class="c12 fwb usn fs0-8 ttu fc-bg25 mb1">
          Pathname
        </div>
        ${Uri.render(
          { id: 'pageAdd', key: 'uri', value: this.value.uri || '' },
          this.handleUri.bind(this)
        )}
      </div>
    `
  }

  elActions () {
    var self = this
    return html`
      <div class="x c12 fs1 usn fs1 p1 bt1-bg10">
        <div class="p1 xx x">
          <button
            type="submit"
            class="xx button-medium bgc-fg"
            onclick=${this.handleSave.bind(self)}
          >Create Page</button>
        </div>
        <div class="p1">
          <button
            class="db button-medium bgc-bg25 bgch-fg"
            onclick=${this.handleCancel.bind(self)}
          >Cancel</button>
        </div>
      </div>
    `
  }

  handleTitle (name, data) {
    this.value.title = data
    if (!this.customUri) {
      var el = this.element.querySelector('input[name="uri"]')
      var value = methodsFile.sanitizeName(data)
      this.value.uri = value
      if (el) el.value = value
    }
  }

  handleUri (name, data) {
    if (name === 'input') {
      var el = this.element.querySelector('input[name="uri"]')
      this.value.uri = methodsFile.sanitizeName(data)
      this.customUri = true
      if (el) el.value = this.value.uri
    }
  }

  handleView (name, data) {
    this.value.view = data
  }

  handleSave (event) {
    this.emit('save', { key: this.key, value: this.value })
    if (event) event.preventDefault()
  }

  handleCancel (event) {
    this.emit('cancel')
    if (event) event.preventDefault()
  }

  update (props) {
    return props.views !== this.views
  }
}

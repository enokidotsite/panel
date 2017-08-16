var html = require('choo/html')
var Nanocomponent = require('nanocomponent')
var methodsFile = require('../methods/file')

module.exports = PageNew

function PageNew () {
  if (!(this instanceof PageNew)) return new PageNew()
  Nanocomponent.call(this)
  this.id = 'pageAdd'
  this.customUri = false
}

PageNew.prototype = Object.create(Nanocomponent.prototype)

PageNew.prototype.createElement = function (state, emit) {
  var self = this
  this.key = state.key
  this.views = state.views || { }
  this.fields = state.fields || { }
  this.value = state.value || { }
  this.value.view = state.view || 'default'

  return html`
    <div class="bgwhite p1 br1">
      ${elTitle()}
      ${elUri()}
      ${elView()}
      ${elActions()}
    </div>
  `

  function elTitle () {
    return html`
      <div class="p1">
        <div class="c12 fwb usn mb1">
          Title
        </div>
        ${state.fields.text(
          { id: 'pageAdd', key: 'title', value: self.value.title },
          handleTitle.bind(self)
        )}
      </div>
    `
  }

  function elView () {
    return html`
      <div class="p1">
        <div class="c12 fwb usn mb1">
          View
        </div>
        ${state.fields.dropdown(
          { id: 'pageAdd', key: 'dropdown', value: self.views },
          handleView.bind(self)
        )}
      </div>
    `
  }

  function elUri () {
    return html`
      <div class="p1">
        <div class="c12 fwb usn mb1">
          Pathname
        </div>
        ${state.fields.text(
          { id: 'pageAdd', key: 'uri', value: self.value.uri },
          handleUri.bind(self)
        )}
      </div>
    `
  }

  function elActions () {
    return html`
      <div class="x c12 lh1 usn">
        <div class="p1">
          <div class="bgblack tcwhite p1 curp fwb br1" onclick=${handleSave.bind(self)}>Save</div>
        </div>
        <div class="p1">
          <div class="bgblack tcwhite p1 curp br1" onclick=${handleCancel.bind(self)}>Cancel</div>
        </div>
      </div>
    `
  }

  function handleTitle (name, data) {
    this.value.title = data
    if (!this.customUri) {
      var el = this.element.querySelector('input[name="uri"]')
      var value = methodsFile.sanitizeName(data)
      this.value.uri = value
      if (el) el.value = value
    }
  }

  function handleUri (name, data) {
    if (name === 'input') {
      this.value.uri = data
      this.customUri = true
    }
  }

  function handleView (name, data) {
    this.value.view = data
  }

  function handleSave () {
    emit('save', { key: this.key, value: this.value })
  }

  function handleCancel () {
    emit('cancel')
  }
}

PageNew.prototype.update = function (state) {
  return false
}
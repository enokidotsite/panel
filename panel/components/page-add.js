var html = require('choo/html')
var Nanocomponent = require('nanocomponent')
var mf = require('../methods/files')
var components = { }

module.exports = wrapper

function wrapper (state, emit) {
  if (!state || !state.fields) {
    return 'Please provide fields'
  }

  if (!components[state.key]) components[state.key] = PageAdd()
  return components[state.key].render(state, emit)
}

function PageAdd () {
  if (!(this instanceof PageAdd)) return new PageAdd()
  Nanocomponent.call(this)
  this.key = undefined
  this.value = { }
  this.customUri = false
}

PageAdd.prototype = Object.create(Nanocomponent.prototype)

PageAdd.prototype.createElement = function (state, emit) {
  var self = this
  this.key = state.key
  this.fields = state.fields || { }
  this.value = state.value || { }

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
          { key: 'title', value: self.value.title },
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
        ${state.fields.text(
          { key: 'uri', value: self.value.uri },
          handleUri.bind(self)
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
          { key: 'uri', value: self.value.uri },
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
      var value = mf.sanitizeName(data)
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

  function handleSave () {
    emit('save', { key: this.key, value: this.value })
  }

  function handleCancel () {
    emit('cancel')
  }
}

PageAdd.prototype.update = function (state) {
  return false
}

PageAdd.prototype.unload = function (state) {
  delete components[this.key]
}

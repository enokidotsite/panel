var Nanocomponent = require('nanocomponent')
var objectValues = require('object-values')
var objectKeys = require('object-keys')
var html = require('choo/html')
var xtend = require('xtend')
var path = require('path')

module.exports = class Dropdown extends Nanocomponent {
  constructor () {
    super()
    this.state = {
      options: { },
      value: ''
    }
  }

  load (element) {
    if (!this.state.value && this.state.default) {
      this.oninput({ value: this.state.default })
    }
  }

  createElement (props, emit) {
    var self = this
    this.state = xtend(this.state, props.field)
    this.oninput = props.oninput

    return html`
      <div>
        <div class="select">
          <select
            name="${this.state.key}"
            class="c12"
            type="tags"
            onchange=${onInput}
          />${options()}</select>
        </div>
      </div>
    `

    function options () {
      return objectKeys(self.state.options).map(function (option) {
        return html`
          <option
            value="${option}"
            ${self.state.value === option ? 'selected' : ''}
          >
            ${self.state.options[option].title || self.state.options[option]}
          </option>
        `
      })
    }

    function onInput (event) {
      props.oninput({ value: event.target.value })
    }
  }

  update (props) {
    var shouldUpdate = false

    // new value
    if (props.field.value !== this.state.value) {
      shouldUpdate = true
    }

    // new options
    if (
      objectKeys(props.field.options).length !==
      objectKeys(this.state.options).length
    ) {
      shouldUpdate = true
    }

    // if (props.field.value && props.field.value !== this.state.value) {
    //   this.state.value = props.value
    // }

    return shouldUpdate
  }
}

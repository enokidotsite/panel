var Nanocomponent = require('nanocomponent')
var html = require('choo/html')
var css = require('sheetify')
var xtend = require('xtend')

var style = css`
  :host label {
    border-radius: 1.75rem;
    background: #ddd;
    margin: 0.5rem;
    height: 3rem;
    width: 3rem;
  }

  :host input:checked+label {
    background: #000;
  }
`

module.exports = class Checkbox extends Nanocomponent {
  constructor () {
    super()
    this.state = {
      id: '',
      text: '',
      value: ''
    }

    this.onChange = this.onChange.bind(this)
  }

  createElement (props, emit) {
    this.state = xtend(this.state, props.field)
    this.emit = emit

    return html`
      <div class="input curp ${style}" onclick=${this.onChange}>
        <div class="x xjb usn">
          <div class="py1 px1-5 fc-bg25">
            ${this.state.text}
          </div>
          <input
            name="${this.state.key}"
            class="dn"
            type="checkbox"
            onchange=${this.onChange}
            ${this.state.value === true ? 'checked' : ''}
          />
          <label></label>
        </div>
      </div>
    `
  }

  onChange (event) {
    this.emit({ value: !this.state.value })
  }

  update (props) {
    this.state.value = props.field.value || false
    return true
  }
}
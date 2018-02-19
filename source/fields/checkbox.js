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
      true: '',
      false: '',
      value: false
    }

    this.onChange = this.onChange.bind(this)
  }

  createElement (props, emit) {
    this.state = xtend(this.state, props.field)
    this.state.value = props.field.value || false
    this.oninput = props.oninput

    return html`
      <div class="input curp ${style}" onclick=${this.onChange}>
        <div class="x xjb usn">
          <div class="py1 px1-5 fc-bg25">
            ${this.getText()}
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

  getText () {
    if (!this.state.true || !this.state.false) return this.state.text
    return this.state.value === true ? this.state.true : this.state.false
  }

  onChange (event) {
    this.oninput({ value: !this.state.value })
  }

  update (props) {
    return true
  }
}
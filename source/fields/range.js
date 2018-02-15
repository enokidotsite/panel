var Nanocomponent = require('nanocomponent')
var html = require('choo/html')
var xtend = require('xtend')
var css = require('sheetify')

var style = css`
  :host .value {
    background: linear-gradient(to right, #ddd calc(var(--value)*1%), #fff 0%)
  }

  :host input[type="range"] {
    cursor: ew-resize;
  }

  :host input[type=number]::-webkit-inner-spin-button, 
  :host input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    margin: 0; /* Removes leftover margin */
  }

  :host input[type="number"] {
    -moz-appearance: textfield;
  }
`

module.exports = class Range extends Nanocomponent {
  constructor () {
    super()
    this.state = {
      min: 0,
      max: 100,
      value: 0,
      focused: false
    }

    this.onInput = this.onInput.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  createElement (props, emit) {
    this.state = xtend(this.state, props.field)
    this.emit = emit

    if (this.state.focused) {
      this.state.value = props.field.value
    } else {
      this.state.value = props.field.value || 0
    }

    return html`
      <div class="${style}" style="--value: ${this.state.value}">
        <div class="input oh w100 x">
          <div class="psr xx">
            <div class="psa t0 l0 px1-5 py1 pen fc-bg25">
              ${this.state.text}
            </div>
            <input
              name="${this.state.key}"
              class="w100 psa t0 l0 h100 op0 z2"
              type="range"
              min="${this.state.min}"
              max="${this.state.max}"
              value="${this.state.value}"
              oninput=${this.onInput}
            />
            <div
              style="height: 4rem;"
              class="value w100"
            ></div>
          </div>
          <input
            type="number"
            class="bl1-bg10 ff-mono fs1 px1-5 tac"
            style="width: 6.5rem; outline: 0;"
            value="${this.state.value}"
            min="${this.state.min}"
            max="${this.state.max}"
            onfocus=${this.onFocus}
            onBlur=${this.onBlur}
            oninput=${this.onInput}
          />
        </div>
      </div>
    `

  }

  onInput (event) {
    var value = event.target.value
    if (isNaN(value)) value = min
    if (value > this.state.max) value = this.state.max
    if (value < this.state.min) value = this.state.min
    this.emit({ value: event.target.value })
  }

  onFocus (event) {
    this.state.focused = true
  }

  onBlur (event) {
    this.state.focused = true
  }

  update (props) {
    return true
  }
}
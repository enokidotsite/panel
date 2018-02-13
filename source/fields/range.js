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
`

module.exports = class Range extends Nanocomponent {
  constructor () {
    super()
    this.state = {
      min: 0,
      max: 100,
      value: 0
    }
  }

  createElement (props, emit) {
    this.state = xtend(this.state, props.field)
    this.state.value = props.field.value || 0

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
              oninput=${onInput}
            />
            <div
              style="height: 4rem;"
              class="value w100"
            ></div>
          </div>
          <input
            type="text"
            class="bl1-bg10 ff-mono fs1 px1-5 tac"
            style="width: 6.5rem; outline: 0;"
            value="${this.state.value}"
          />
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
}
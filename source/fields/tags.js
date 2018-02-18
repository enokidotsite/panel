var Nanocomponent = require('nanocomponent')
var tagsInput = require('tags-input')
var html = require('choo/html')
var css = require('sheetify')
var xtend = require('xtend')

var style = css`
  :host {
    display: block;
    padding: 0.2rem 0.2rem;
    background: #fff;
    border: 1px solid #ddd;
    width: 100%;
    border-radius: 2rem;
    min-height: 4rem;
    cursor: text;
  }

  :host .tag {
    display: inline-block;
    background: #eee;
    color: #000;
    height: 3rem;
    line-height: 3rem;
    padding: 0.5rem 1rem;
    margin: 0.2rem 0.2rem;
    border-radius: 2rem;
    font: inherit;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    vertical-align: middle;
  }

  :host .tag.selected {
    background-color: #000;
    border-color: #000;
    color: #fff
  }

  :host .tag.dupe {
    -webkit-transform: scale3d(1.2, 1.2, 1.2);
    transform: scale3d(1.2, 1.2, 1.2);
    background-color: #FCC;
    border-color: #700
  }

  :host input {
    -webkit-appearance: none!important;
    -moz-appearance: none!important;
    appearance: none!important;
    display: inline-block!important;
    padding: 0.5rem 1rem !important;
    margin: 0.2rem 0.2rem !important;
    background: none!important;
    border: none!important;
    height: 2.8rem !important;
    box-shadow: none!important;
    line-height: 2.8rem!important;
    font: inherit!important;
    font-size: 1.8rem!important;
    outline: 0!important;
    vertical-align: middle;
  }

  :host .selected~input {
    opacity: .3;
  }
`

module.exports = class Tags extends Nanocomponent {
  constructor () {
    super()
    this.state = {
      value: '',
      valueStart: ''
    }
  }

  createElement (props, emit) {
    var self = this
    this.state = xtend(this.state, props.field)
    this.state.value = this.state.value || ''
    this.oninput = props.oninput
    if (!this.state.valueStart) this.state.valueStart = this.state.value

    return html`
      <div class="${style}">
        <input
          name="${this.state.key}"
          class="c12 input"
          type="tags"
          value="${this.state.value}"
          onchange=${onChange}
        />
      </div>
    `

    function onChange (event) {
      var value = event.target.value.split(',') 
      if (!arraysEqual(self.state.value, value)) {
        props.oninput({ value: value })
      }
    }
  }

  update (props) {
    var value = props.field.value || ''
    if (value !== this.state.value) {
      var el = this.element.querySelector('.tags-input')
      this.state.value = value
      this.element.querySelector('input').value = value

      // reset
      if (this.state.value === this.state.valueStart) {
        this.element.removeChild(el)
        tagsInput(this.element.querySelector('input'))
      }
    }

    return false
  }

  load (props) {
    tagsInput(this.element.querySelector('input'))
  }
}

function arraysEqual (a, b) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length != b.length) return false

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }

  return true
}

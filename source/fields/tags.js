var Nanocomponent = require('nanocomponent')
var tagsInput = require('tags-input')
var html = require('choo/html')
var css = require('sheetify')
var xtend = require('xtend')

var style = css`
  :host {
    display: inline-block;
    padding: 0 0.25rem;
    background: #fff;
    border: 1px solid #ddd;
    width: 100%;
    border-radius: 2rem;
    cursor: text;
    line-height: 1;
  }

  :host .tag {
    display: inline-block;
    background: #eee;
    color: #000;
    padding: 0.5rem 1rem;
    margin: 0.25rem 0.25rem;
    border-radius: 2rem;
    font: inherit;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
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
    margin: 0.25rem 0.25rem !important;
    background: 0 0!important;
    border: none!important;
    height: 3.5rem !important;
    box-shadow: none!important;
    font: inherit!important;
    font-size: 100%!important;
    outline: 0!important;
  }

  :host .selected~input {
    opacity: .3;
  }
`


module.exports = function Wrapper () {
  if (!(this instanceof Tags)) return new Tags()
}

class Tags extends Nanocomponent {
  constructor () {
    super()
    this.state = {
      value: '',
      valueStart: ''
    }
  }

  createElement (props, emit) {
    var self = this
    this.state = xtend(this.state, props)

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
        emit({ value: value })
      }
    }
  }

  update (props) {
    var value = props.value || ''
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

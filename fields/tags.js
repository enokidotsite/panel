var Nanocomponent = require('nanocomponent')
var tagsInput = require('tags-input')
var html = require('choo/html')
var css = require('sheetify')

var style = css`
  :host {
      display: inline-block;
      padding: 0.5rem;
      background: #FFF;
      border: 1px solid #000;
      width: 100%;
      border-radius: 3px;
      cursor: text;
  }

  :host .tag {
      display: inline-block;
      background: #eee;
      color: #000;
      padding: 0 4px;
      margin: 2px;
      border-radius: 3px;
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
      padding: 3px;
      margin: 0!important;
      background: 0 0!important;
      border: none!important;
      box-shadow: none!important;
      font: inherit!important;
      font-size: 100%!important;
      outline: 0!important
  }

  :host .selected~input {
      opacity: .3
  }
`


module.exports = function Wrapper () {
  if (!(this instanceof Tags)) return new Tags()
}

class Tags extends Nanocomponent {
  constructor () {
    super()
  }

  createElement (state, emit) {
    var self = this
    this.id = state.id
    this.key = state.key
    this.value = state.value || [ ]
    this.valueStart = state.value

    return html`
      <div class="${style}">
        <input
          name="${state.key}"
          class="c12 input"
          type="tags"
          value="${state.value || ''}"
          onchange=${onChange}
        />
      </div>
    `

    function onChange (event) {
      if (self.value.join(',') !== event.target.value) {
        emit('change', event.target.value.split(','))
      }
    }
  }

  update (props) {
    if (props.value !== this.value) {
      var el = this.element.querySelector('.tags-input')
      this.value = props.value
      this.element.querySelector('input').value = props.value

      console.log(this.value, this.valueStart)

      // reset
      if (this.value === this.valueStart) {
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

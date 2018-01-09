var html = require('choo/html')
var tagsInput = require('tags-input')
var Nanocomponent = require('nanocomponent')

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
      <div>
        <input
          name="${state.key}"
          class="c12"
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

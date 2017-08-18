var html = require('choo/html')

var fields = require('../fields')
var cache = { }

module.exports = Field

function Field (props, emit) {
  props = props || { }
  props.field = props.field || { }
  props.fields = props.fields || { }

  var input = (typeof fields[props.field.type] === 'function')
    ? fields[props.field.type]
    : fields.text

  var width = props.field.width === '1/2' ? 'c6' : 'c12'

  return html`
    <div class="${width} p1">
      <div class="c12 fwb usn mb1">
        ${props.field.label || props.field.key}
      </div>
      <div class="c12">
        ${wrapper(props.field, emit)}
      </div>
    </div>
  `

  function wrapper (state, emit) {
    if (!cache[state.id]) cache[state.id] = input()
    return cache[state.id].render(state, emit)
  }
}
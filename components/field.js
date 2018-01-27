var html = require('choo/html')

var fields = require('../fields')
var cache = { }

module.exports = Field

function Field (props, emit) {
  props = props || { }
  props.field = props.field || { }
  props.fields = props.fields || { }
  props.page = props.page || { }
  props.site = props.site || { }

  // grab the input, or fallback to default
  var input = (typeof fields[props.field.type] === 'function')
    ? fields[props.field.type]
    : fields.text

  // field width
  var width = props.field.width === '1/2' ? 'c6' : 'c12'

  // extend the field with page and site
  props.field.site = props.site
  props.field.page = props.page

  // public
  return html`
    <div class="${width} p2">
      <div class="c12 py1 fwb usn fs0-8 ttu">
        ${props.field.label || props.field.key}
      </div>
      <div class="c12">
        ${wrapper(props.field, emit)}
      </div>
    </div>
  `

  // wrap the field in a cache for nanocomponent
  function wrapper (state, emit) {
    if (!cache[state.id]) cache[state.id] = input()
    return cache[state.id].render(state, emit)
  }
}
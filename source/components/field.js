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

  // public
  return html`
    <div class="${width} p1">
      ${wrapper(props, emit)}
    </div>
  `

  function label () {
    return html`
      <div class="c12 py1 fwb usn fs0-8 ttu fc-bg25">
        ${props.field.label || props.field.key}
      </div>
    `
  }

  // wrap the field in a cache for nanocomponent
  function wrapper (props, emit) {
    if (!cache[props.field.id]) cache[props.field.id] = new input()
    var hasState = typeof cache[props.field.id].state === 'object'
    var hasLabel = hasState && cache[props.field.id].wrapperLabel !== false

    return [
      hasLabel ? label() : '',
      cache[props.field.id].render(props, emit)
    ]
  }
}
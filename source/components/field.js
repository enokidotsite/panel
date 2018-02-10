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
    <div class="${width} p1">
      ${wrapper(props.field, emit)}
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
    if (!cache[props.id]) cache[props.id] = new input()
    var hasState = typeof cache[props.id].state === 'object'
    var hasLabel = hasState && cache[props.id].wrapperLabel !== false

    return [
      hasLabel ? label() : '',
      cache[props.id].render(props, emit)
    ]
  }
}
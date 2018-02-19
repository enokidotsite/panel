var html = require('choo/html')

var fields = require('../fields')
var cache = { }

module.exports = Field

function Field (props, emit) {
  props = props || { }

  props.content = props.content || { }
  props.fields = props.fields || { }
  props.field = props.field || { }
  props.query = props.query || { }
  props.page = props.page || { }
  props.site = props.site || { }

  var type = props.field.type.toLowerCase()

  // grab the input, or fallback to text
  var input = (typeof fields[type] === 'function')
    ? fields[type]
    : fields.text

  // field properties
  var width = getWidth(props.field.width)

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
    var hasLabel = cache[props.field.id].label !== false && props.field.label !== false

    return [
      hasLabel ? label() : '',
      cache[props.field.id].render(props, emit)
    ]
  }
}

function getWidth (width) {
  var widths = {
    false: '',
    auto: 'xx',
    '1/2': 'c12',
    '1/2': 'c6',
    '1/3': 'c4',
    '1/4': 'c3',
    '2/3': 'c8',
    '3/4': 'c10'
  }

  if (typeof width === 'undefined') return 'c12'
  var setting = widths[width.toString()]
  return typeof setting === 'undefined' ? 'c12' : setting
}

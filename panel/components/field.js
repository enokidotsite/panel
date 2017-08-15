var html = require('choo/html')

module.exports = Field

function Field (props, emit) {
  props = props || { }
  props.field = props.field || { }
  props.fields = props.fields || { }

  var input = (typeof props.fields[props.field.type] === 'function')
    ? props.fields[props.field.type]
    : props.fields.text

  var width = props.field.width === '1/2' ? 'c6' : 'c12'

  return html`
    <div class="${width} p1">
      <div class="c12 fwb usn mb1">
        ${props.field.label || props.field.key}
      </div>
      <div class="c12">
        ${input(props.field, emit)}
      </div>
    </div>
  `
}
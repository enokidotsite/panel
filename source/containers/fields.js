var objectKeys = require('object-keys')
var xtend = require('xtend')
var html = require('choo/html')

var Field = require('../components/field')
var blueprintDefault = require('../blueprints/default.json')

module.exports = Fields

function Fields (props) {
  props = props || { }
  props.blueprint = props.blueprint || blueprintDefault
  props.blueprint.layout = props.blueprint.layout || blueprintDefault.layout
  props.blueprint.fields = props.blueprint.fields || blueprintDefault.fields
  props.content = props.content || { }
  props.values = props.values || { }
  props.fields = props.fields || { }
  props.draft = props.draft || { }
  props.query = props.query || { }
  props.site = props.site || { }
  props.page = props.page || { }

  props.handleFieldUpdate = (props.handleFieldUpdate === undefined)
    ? function () { }
    : props.handleFieldUpdate

  // layout
  return objectKeys(props.blueprint.layout).map(function (key) {
    var column = props.blueprint.layout[key]
    var widths = { '1/1': 'c12', '1/2': 'c6', '1/3': 'c4', '2/3': 'c8' }
    var width = widths[column.width || '1/2']
    var fields = getFields()

    return html`
      <div class="psr p1 ${width}">
        <div class="x xw w100 ${column.sticky ? 'psst t0-75' : ''}">
          ${fields}
        </div>
      </div>
    `

    function getFields () {
      // show all unsorted fields
      if (column.fields === true) {
        return objectKeys(props.blueprint.fields)
          .filter(function (key) {
            // does the field not appear in a column?
            return objectKeys(props.blueprint.layout)
              .reduce(function (result, active) {
                var fields = props.blueprint.layout[active].fields
                if (result && typeof fields === 'object') {
                  result = fields.indexOf(key) < 0
                }
                return result
              }, true)
          })
          .map(createField)
      // custom fields
      } else if (typeof column === 'object') {
        return column.fields.map(createField)
      }
    }
  })

  // TODO: clean this up
  // return objectKeys(props.blueprint.fields).map(createField)

  function createField (key) {
    var fieldProps = props.blueprint.fields[key]
    var defaultProps = blueprintDefault.fields[key]

    if (!fieldProps) {
      if (
        !defaultProps ||
        props.blueprint[key] === false
      ) {
        return
      } else {
        fieldProps = defaultProps
      }
    }

    return Field({
      page: props.page,
      content: props.content,
      site: props.site,
      fields: props.fields,
      field: mergeDraftandState()
    }, handleFieldUpdate)

    function mergeDraftandState () {
      return xtend(fieldProps, {
        id: props.values.url + ':' + key,
        key: key,
        value: (props.draft && props.draft[key] !== undefined)
          ? props.draft[key]
          : props.values[key]
      })
    }

    function handleFieldUpdate (data) {
      if (
        typeof data === 'object' &&
        typeof data.value !== 'undefined'
      ) {
        props.handleFieldUpdate(key, data.value)
      }
    }
  }
}

var objectKeys = require('object-keys')
var xtend = require('xtend')
var html = require('choo/html')

var Field = require('../components/field')
var blueprintDefault = require('../blueprints/default.json')

/**
 * todo
 * - create `fields` component for array of fields
 * - create `page-fields` container for layout logic
 */

module.exports = Fields

function Fields (state, emit) {
  state = state || { }
  state.blueprint = state.blueprint || blueprintDefault
  state.content = state.content || { }
  state.values = state.values || { }
  state.fields = state.fields || { }
  state.draft = state.draft || { }
  state.query = state.query || { }
  state.site = state.site || { }
  state.page = state.page || { }

  // if no layout return unwrapped fields
  if (state.blueprint.layout === false) {
    return objectKeys(state.blueprint.fields || { }).map(createField)
  }

  // field and layout fallback
  state.blueprint.fields = state.blueprint.fields || blueprintDefault.fields
  state.blueprint.layout = state.blueprint.layout || blueprintDefault.layout

  // fields wrapped in layout
  return objectKeys(state.blueprint.layout).map(function (key) {
    var column = state.blueprint.layout[key]
    var widths = { '1/1': 'c12', '1/2': 'c6', '1/3': 'c4', '2/3': 'c8' }
    var width = widths[column.width || '1/2']
    var fields = getFields()

    return html`
      <div class="psr p1 pt0 c12 sm-${width}">
        <div class="x xw w100 ${column.sticky ? 'psst t0-75' : ''}">
          ${fields}
        </div>
      </div>
    `

    function getFields () {
      // show all unsorted fields
      if (column.fields === true) {
        return objectKeys(state.blueprint.fields)
          .filter(function (key) {
            // does the field not appear in a column?
            return objectKeys(state.blueprint.layout)
              .reduce(function (result, active) {
                var fields = state.blueprint.layout[active].fields
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

  function createField (key) {
    var fieldProps = state.blueprint.fields[key]
    var defaultProps = blueprintDefault.fields[key]

    if (!fieldProps) {
      if (
        !defaultProps ||
        state.blueprint[key] === false
      ) {
        return // nothing to see here
      } else {
        fieldProps = defaultProps
      }
    }

    return Field({
      content: state.content,
      events: state.events,
      fields: state.fields,
      query: state.query,
      page: mergeDraftAndState(),
      site: state.site,
      field: mergeFieldDraftAndState(),
      oninput: oninput
    }, emit)

    function mergeDraftAndState () {
      return xtend(state.page, state.draft)
    }

    function mergeFieldDraftAndState () {
      return xtend(fieldProps, {
        id: [state.values.url, state.page.view, key].filter(function (str) { return str }).join(':'),
        key: key,
        value: (state.draft && state.draft[key] !== undefined)
          ? state.draft[key]
          : state.values[key]
      })
    }

    function oninput (data) {
      if (typeof data !== 'object') return
      if (typeof data.value === 'undefined') return
      state.oninput(key, data.value)
    }
  }
}

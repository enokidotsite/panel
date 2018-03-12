var queryString = require('query-string')
var objectKeys = require('object-keys')
var Page = require('enoki/page')
var html = require('choo/html')
var assert = require('assert')
var xtend = require('xtend')

var blueprintDefault = require('../blueprints/default.json')
var Field = require('../components/field')
var methodsPage = require('../lib/page')

/**
 * todo
 * - create `fields` component for array of fields
 * - create `page-fields` container for layout logic
 */

module.exports = Fields

function Fields (state, emit, props) {
  assert.equal(typeof state, 'object', 'fields: typeof arg1 "state" must be type object')
  assert.equal(typeof state.content, 'object', 'fields: typeof arg1 "state.content" must be type object')
  assert.equal(typeof state.query, 'object', 'fields: typeof arg1 "state.query" must be type object')
  assert.equal(typeof state.site, 'object', 'fields: typeof arg1 "state.site" must be type object')

  props = props || { }
  var search = queryString.parse(location.search)
  var page = Page(xtend(state, { href: search.url }))
  var active = page()

  var blueprint = props.blueprint || methodsPage.getBlueprint(state, emit, page)
  var changes = methodsPage.getChanges(state, emit, active)
  var value = props.value || active.value()

  // if no layout return unwrapped fields
  if (blueprint.layout === false) {
    return objectKeys(blueprint.fields || { }).map(createField)
  }

  // field and layout fallback
  blueprint.fields = blueprint.fields || blueprintDefault.fields
  blueprint.layout = blueprint.layout || blueprintDefault.layout

  // fields wrapped in layout
  return objectKeys(blueprint.layout).map(function (key) {
    var column = blueprint.layout[key]
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
        return objectKeys(blueprint.fields)
          .filter(function (key) {
            // does the field not appear in a column?
            return objectKeys(blueprint.layout)
              .reduce(function (result, active) {
                var fields = blueprint.layout[active].fields
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
    var fieldProps = blueprint.fields[key]
    var defaultProps = blueprintDefault.fields[key]

    if (!fieldProps) {
      if (!defaultProps || blueprint[key] === false) {
        return // nothing to see here
      } else {
        fieldProps = defaultProps
      }
    }

    return Field({
      content: state.content,
      events: state.events,
      query: state.query,
      page: mergeDraftAndState(),
      site: state.site,
      field: mergeFieldDraftAndState(),
      oninput: oninput
    }, emit)

    function mergeDraftAndState () {
      return xtend(value, changes)
    }

    function mergeFieldDraftAndState () {
      return xtend(fieldProps, {
        id: [value.url, value.view, key].filter(str => str).join(':'),
        key: key,
        value: (changes && changes[key] !== undefined)
          ? changes[key]
          : value[key]
      })
    }

    function oninput (data) {
      if (typeof data !== 'object') return
      if (typeof data.value === 'undefined') return
      props.oninput(key, data.value)
    }
  }
}

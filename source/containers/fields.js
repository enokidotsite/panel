var objectKeys = require('object-keys')
var xtend = require('xtend')
var html = require('choo/html')

var Field = require('../components/field')

module.exports = Fields

function Fields (props) {
  props = props || { }
  props.blueprint = props.blueprint || { }
  props.blueprint.fields = props.blueprint.fields || { }
  props.draft = props.draft || { }
  props.fields = props.fields || { }
  props.site = props.site || { }
  props.page = props.page || { }
  props.values = props.values || { }

  props.handleFieldUpdate = (props.handleFieldUpdate === undefined)
    ? function () { }
    : props.handleFieldUpdate

  // TODO: clean this up
  return objectKeys(props.blueprint.fields).map(function (key) {
    return Field({
      page: props.page,
      site: props.site,
      fields: props.fields,
      field: mergeDraftandState()
    }, handleFieldUpdate)

    function mergeDraftandState () {
      return xtend(props.blueprint.fields[key], {
        id: props.values.url + ':' + key,
        key: key,
        value: (props.draft && props.draft[key] !== undefined)
          ? props.draft[key]
          : props.values[key]
      })
    }

    function handleFieldUpdate (event, data) {
      if (event === 'focus') return
      props.handleFieldUpdate(key, data)
    }
  })
}

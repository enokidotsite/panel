var objectKeys = require('object-keys')
var xtend = require('xtend')
var html = require('choo/html')

var Field = require('./field')

module.exports = Fields

function Fields (props) {
  props = props || { }
  props.blueprint = props.blueprint || { }
  props.blueprint.fields = props.blueprint.fields || { }
  props.draft = props.draft || { }
  props.values = props.values || { }
  props.fields = props.fields || { }

  props.handleFieldUpdate = (props.handleFieldUpdate === undefined)
    ? function () { }
    : props.handleFieldUpdate

  return objectKeys(props.blueprint.fields).map(function (key) {
    return Field({
      fields: props.fields,
      field: mergeDraftandState()
    }, handleFieldUpdate)

    function mergeDraftandState () {
      return xtend({
        id: props.values.path + ':' + key,
        key: key,
        value: (props.draft && props.draft[key] !== undefined)
          ? props.draft[key]
          : props.values[key]
      }, props.blueprint.fields[key])
    }

    function handleFieldUpdate (event, data) {
      props.handleFieldUpdate(key, data)
    }
  })
}
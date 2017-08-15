var fs = require('fs')
var path = require('path')
var xtend = require('xtend')

var fieldsDefault = require('../fields')

module.exports = {
  getFields: getFields,
  getFieldsDefault: fieldsDefault,
  getFieldsCustom: getFieldsCustom  
}

/**
 * Get Fields
 */
function getFields () {
  return xtend(fieldsDefault, getFieldsCustom())
}

/**
 * Get Custom Fields
 */
function getFieldsCustom () {
  return module.parent ? getNode() : getBrowserify()

  function getNode () {
    var pathFields = path.join(__dirname, '../../site/fields')
    return fs.readdirSync(pathFields).reduce(function (result, file) {
      file = path.basename(file, path.extname(file))
      result[file] = require(path.join(pathFields, file))
      return result
    }, { })
  }

  function getBrowserify () {
    var fieldsSrc = require('../../site/fields/*.js', { mode: 'hash' })
    return Object.keys(fieldsSrc).reduce(function (result, value) {
      result[path.basename(value)] = fieldsSrc[value]
      return result
    }, { })
  }
}
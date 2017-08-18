var xtend = require('xtend')
var fs = require('fs')
var path = require('path')

module.exports = xtend(getFieldsDefaults(), getFieldsCustom())

function getFieldsDefaults () {
  return module.parent ? getNode() : getBrowserify()

  function getNode () {
    var pathFields = path.join(__dirname, './')
    return fs.readdirSync(pathFields).reduce(function (result, file) {
      var file = path.basename(file, path.extname(file))
      if (file === 'index') return result
      result[file] = require(path.join(pathFields, file))
      return result
    }, { })
  }

  function getBrowserify () {
    var fieldsSrc = require('./*.js', { mode: 'hash' })
    return Object.keys(fieldsSrc).reduce(function (result, file) {
      if (path.basename(file) === 'index') return result
      result[path.basename(file)] = fieldsSrc[file]
      return result
    }, { })
  }
}

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
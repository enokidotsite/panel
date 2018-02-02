var queryString = require('query-string')
var objectKeys = require('object-keys')
var html = require('choo/html')

var methodsFile = require('../methods/file')

module.exports = breadcrumbs

function breadcrumbs (props) {
  props = props || { }
  var page = props.page || { }
  var path = page.url || ''
  var search = queryString.parse(location.search)

  var searchPaths = objectKeys(search)
    .reduce(function (result, key) {
      if (key !== 'file') return result
      if (key === 'file' && search[key] === 'new') return result
      var value = methodsFile.decodeFilename(search[key])
      result.push({
        path: '',
        el: html`<a href="" class="db p1 nbb wsnw toe dltr">${value}</a>`
      })
      return result
    }, [ ])

  var pagePaths = path
    .split('/')
    .filter(str => str)
    .reduce(function (result, path) {
      var href = result.map(crumb => crumb.path).join('/') + '/' + path
      result.push({
        path: path,
        el: html`<a href="?url=${href}" class="db p1 nbb wsnw toe dltr">${path}</a>`
      })
      return result
    }, [{ path: '', el: ''}])

    return pagePaths
      .concat(searchPaths)
      .reverse()
      .reduce(function (arr, crumb) {
        arr.push(crumb.el)
        return arr
      }, [ ])
}
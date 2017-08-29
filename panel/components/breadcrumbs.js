var queryString = require('query-string')
var objectKeys = require('object-keys')
var html = require('choo/html')

module.exports = breadcrumbs

function breadcrumbs (props) {
  props = props || { }
  var page = props.page || { }
  var path = page.path || ''
  var search = queryString.parse(location.search)

  var searchPaths = objectKeys(search)
    .reduce(function (result, key) {
      if (key !== 'file') return result
      if (key === 'file' && search[key] === 'new') return result
      result.push({
        path: '',
        el: html`<a href="" class="db p1 nbb">${search[key]}</a>`
      })
      return result
    }, [ ])

  var pagePaths = path
    .split('/')
    .filter(str => str)
    .reduce(function (result, path) {
      var href = result.map(crumb => crumb.path).join('/') + '/' + path + '/'
      result.push({
        path: path,
        el: html`<a href="${href}?panel=active" class="db p1 nbb">${path}</a>`
      })
      return result
    }, [{ path: '', el: ''}])

    return pagePaths
      .concat(searchPaths)
      .reduce(function (arr, crumb) {
        arr.push(crumb.el)
        return arr
      }, [ ])
}
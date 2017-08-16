var html = require('choo/html')
var queryString = require('query-string')
var objectKeys = require('object-keys')

module.exports = breadcrumbs

function breadcrumbs (props) {
  props = props || { }
  props.path = props.path === undefined ? '' : props.path
  var search = queryString.parse(location.search)

  var searchPaths = objectKeys(search).reduce(function (result, key) {
    if (key !== 'file') return result
    result.push({
      path: '',
      el: html`<a href="" class="db p1 tcwhite nbb">${search[key]}</a>`
    })
    return result
  }, [ ])

  var pagePaths = props.path
    .split('/')
    .filter(str => str)
    .reduce(function (result, path) {
      var href = result.map(crumb => crumb.path).join('/') + '/' + path + '/'
      result.push({
        path: path,
        el: html`<a href="${href}" class="db p1 tcwhite nbb">${path}</a>`
      })
      return result
    }, [{
      path: '', el: ''
    }])

    return pagePaths
      .concat(searchPaths)
      .reduce(function (arr, crumb) {
        arr.push(crumb.el)
        return arr
      }, [ ])
}
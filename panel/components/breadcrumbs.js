var html = require('choo/html')

module.exports = breadcrumbs

function breadcrumbs (opts) {
  opts = opts || { }
  return opts.path
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
    .reduce(function (arr, crumb, i, src) {
      arr.push(crumb.el)
      return arr
    }, [ ])
}
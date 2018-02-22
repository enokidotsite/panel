var queryString = require('query-string')
var objectKeys = require('object-keys')
var html = require('choo/html')

var methodsFile = require('../methods/file')

module.exports = container

function container (props) {
  return html`
    <div class="psf l0 b0 r0 z2 x xjb px3 oxh bgc-bg py1-5 bt1-bg10" style="margin-left: 7rem">
      <div class="x">
        <a href="?url=/" class="bgc-bg db px1 nbb py1 breadcrumb fc-bg25 fch-fg">home</a>
        <div class="oxh breadcrumbs wsnw drtl">
          ${breadcrumbs({ page: props.page })}
        </div>
      </div>
      <div></div>
    </div>
  `
}

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
        el: html`<a href="" class="db px1 nbb wsnw toe dltr">${value}</a>`
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
        el: html`<a href="?url=${href}" class="db px1 nbb wsnw toe dltr">${path}</a>`
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
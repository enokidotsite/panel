var html = require('choo/html')
var path = require('path')

var Modal = require('../components/modal')
var PageNew = require('../containers/page-new')
var methodsSite = require('../methods/site')

var pageNew = PageNew()

module.exports = PageNewView 

function PageNewView (state, emit) {
  var fields = methodsSite.getFields()

  var content = pageNew.render({
    key: 'add',
    views: state.site.views,
    fields: fields
  },
  function (name, data) {
    switch (name) {
      case 'save':
        if (!data.value.uri) return alert('Missing data')
        emit(state.events.PANEL_PAGE_ADD, {
          title: data.value.title,
          view: 'default',
          path: path.join(state.page.path, data.value.uri)
        })
        break
      case 'cancel': return emit(state.events.REPLACESTATE, '?')
    }
  })

  return Modal(state, emit, content)
}
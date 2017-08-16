var html = require('choo/html')
var path = require('path')

var Modal = require('../components/modal')
var PageAdd = require('../components/page-add')
var methodsSite = require('../methods/site')

module.exports = PageNew 

function PageNew (state, emit) {
  var fields = methodsSite.getFields()

  var content = PageAdd({
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
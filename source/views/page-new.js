var html = require('choo/html')
var objectKeys = require('object-keys')
var path = require('path')

var Modal = require('../components/modal')
var PageNew = require('../containers/page-new')
var methodsPage = require('../lib/page')

var modal = Modal()
var pageNew = PageNew()

module.exports = PageNewView 

function PageNewView (state, emit) {
  var blueprint = getBlueprint()
  var views = methodsPage.getViews({
    blueprint: blueprint,
    blueprints: state.site.blueprints
  })

  var content = pageNew.render({
    key: 'add',
    view: views.default ? 'default' : objectKeys(views)[0],
    views: views
  }, handleView)

  return modal.render({
    content: content,
    className: 'c6',
    handleContainerClick: function (event) {
      emit(state.events.REPLACESTATE, '?url=' + state.page.url)
    }
  })

  function handleView (data) {
    switch (data.event) {
      case 'save':
        if (!data.value.title || !data.value.uri || !data.value.view) {
          return alert('Missing data')
        }
        emit(state.events.ENOKI_PAGE_ADD, {
          title: data.value.title,
          view: data.value.view || 'default',
          path: path.join(state.page.path, data.value.uri),
          url: path.join(state.page.url, data.value.uri)
        })
        break
      case 'cancel': return emit(state.events.REPLACESTATE, '?url=' + state.page.url)
    }
  }

  function getBlueprint () {
    if (!state.page || !state.site.loaded) {
      return { }
    } else {
      return (
        state.site.blueprints[state.page.view] ||
        state.site.blueprints.default
      )
    }
  }
}

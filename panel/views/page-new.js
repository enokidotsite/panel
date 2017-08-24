var html = require('choo/html')
var objectKeys = require('object-keys')
var path = require('path')

var Modal = require('../components/modal')
var PageNew = require('../containers/page-new')
var methodsPage = require('../methods/page')

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
      emit(state.events.REPLACESTATE, '?panel=active')
    }
  })

  function handleView (event, data) {
    switch (event) {
      case 'save':
        if (!data.value.title || !data.value.uri || !data.value.view) {
          return alert('Missing data')
        }
        emit(state.events.PANEL_PAGE_ADD, {
          title: data.value.title,
          view: data.value.view || 'default',
          pathPage: path.join(state.page.path, data.value.uri)
        })
        break
      case 'cancel': return emit(state.events.REPLACESTATE, '?panel=active')
    }
  }

  function getBlueprint () {
    if (!state.page) {
      return { }
    } else {
      return (
        state.site.blueprints[state.page.view] ||
        state.site.blueprints.default
      )
    }
  }
}
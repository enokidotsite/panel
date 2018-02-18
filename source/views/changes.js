var queryString = require('query-string')
var html = require('choo/html')

var Modal = require('../components/modal')
var modal = Modal()

module.exports = changes

function changes (state, emit) {


  return modal.render({
    content: 'Hey whats good!',
    className: 'c6',
    handleContainerClick: function (event) {
      emit(state.events.REPLACESTATE, '?url=' + state.page.url)
    }
  })
}

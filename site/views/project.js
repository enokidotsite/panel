var html = require('choo/html')
var ov = require('object-values')
var wrapper = require('../components/wrapper')
var format = require('../components/format')

module.exports = wrapper(project)

function project (state, emit) {
  var state = state || { }
  var images = state.page.files
    ? ov(state.page.files).filter(file => file.type === 'image')
    : false

  return html`
    <div class="x xw p1 sm-mt4">
      <div class="c4 sm-c12">
        <div class="t0 psst p1">
          <div class="fs2 fwb lh1-25">
            ${state.page.title}
          </div>
          <div class="pt1 ffmono tcgrey">
            ${state.page.tags.join(', ')}
          </div>
          <div class="pt1 copy">
            ${format(state.page.text)}
          </div>
        </div>
      </div>
      <div class="c8 sm-c12 sm-mt4">
        ${images ? images.map(image) : ''}
      </div>
    </div>
  `

  function image (image) {
    return html`
      <div class="p1">
        <img class="c12 db" src="${image.path}" />
      </div>
    `
  }
}

var html = require('bel')
var path = require('path')
var ov = require('object-values')
var wrapper = require('../components/wrapper')
var format = require('../components/format')

module.exports = wrapper(view)

function view (state, emit) {
  return html`
    <div class="x xw c12 p1 sm-mt4">
      <div class="p1 copy c6 sm-c12">
          <div class="p1" style="border: 1px solid #000">
            ${stats().map(stat)}
          </div>
        ${format(state.page.text)} 
      </div>
      <div class="c6 sm-c12">
        ${state.page.image ? image() : ''}
      </div>
    </div>
  `

  function image () {
    return html` 
      <div class="p1">
        <div style="
          background-color: #eee;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          background-image: url(${path.join(state.page.path, state.page.image)});
          padding-bottom: 100%;
        "></div>
        <div class="pt1 copy">
          ${state.page.caption ? format(state.page.caption) : ''}
        </div>
      </div>
    `
  }

  function stats() {
    return [
      'kingdom', 'division', 'class', 'order',
      'family', 'genus', 'species'
    ].reduce(function (result, key) {
      if (state.page[key]) {
        result.push({
          key: key,
          value: state.page[key]
        })
      }
      return result
    }, [ ])
  }

  function stat (state) {
    return html`
      <div class="x ffmono">
        <div class="c6 ttu">${state.key}</div>
        <div class="c6">${state.value}</div>
      </div>
    `
  }
}

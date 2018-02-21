var html = require('choo/html')
var wrapper = require('../containers/wrapper-hub')
var format = require('../components/format')

module.exports = wrapper(view)

function view (state, emit) {
  var tags = state.page.tags || [ ]
  return html`
    <div>
      <div
        class="oh psr x xjc xac p4 c12 bgpc bgsct bgrn ${state.page.color ? 'fc-bg' : 'fc-fg'}"
        style="
          min-height: 50vh;
          background-color: ${state.page.background};
        "
      >
        ${state.page.files['image.svg'] ? renderImage() : ''}
        <div class="psr z3">
          <h2 class="c12 sm-c10 co0 sm-co1 fs3 lh1-25 tac">${state.page.title}</h2>
          <div class="p2 sm-pt4 c12 tac fs0-8 dn">
            ${tags.map(function (tag) {
              return html`<span class="mx0-5 button-inline white">${tag}</span>`
            })}
          </div>
        </div>
      </div>
      <div class="p4 c12 x xjc bgc-fg fc-bg25">
        <div class="copy">
          ${format(state.page.text)}
        </div>
      </div>
    </div>
  `

  function renderImage () {
    return html`
      <div
        class="psa t0 l0 r0 b0 bgsc bgpc bgrn"
        style="${!state.page.color ? 'filter: invert(1);' : ''} opacity: 0.25; background-image: url(${state.page.files['image.svg'].path}">
      ></div>
    `
  }
}
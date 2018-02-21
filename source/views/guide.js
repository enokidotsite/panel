var objectKeys = require('object-keys')
var html = require('choo/html')
var css = require('sheetify')
var xtend = require('xtend')
var path = require('path')

var guideThumbnail = require('../components/guide-thumbnail')
var wrapper = require('../containers/wrapper-hub')
var format = require('../components/format')

var styles = css`
  :host .guides-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 38rem) {
    :host .guides-grid {
      grid-template-columns: 1fr;
    }
  }
`

module.exports = wrapper(view)

function view (state, emit) {
  var tags = state.page.tags || [ ]
  var parent = state.content[path.resolve(state.page.url, '../')]
  if (!parent) return
  var pages = objectKeys(parent.pages)
  var pageIndex = pages.indexOf(state.page.name)
  var pagePrev = parent.pages[pages[mod(pageIndex - 1, pages.length)]]
  var pageNext = parent.pages[pages[mod(pageIndex + 1, pages.length)]]

  if (pagePrev) pagePrev = state.content[pagePrev.url]
  if (pageNext) pageNext = state.content[pageNext.url]

  return html`
    <div class="${styles}">
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
      <div class="guides-grid bgc-fg">
        ${renderGuide({ title: 'Previous Guide', page: pagePrev })}
        ${renderGuide({ title: 'Next Guide', page: pageNext })}
      </div>
    </div>
  `

  function renderGuide (props) {
    return html`
      <div class="x xw w100">
        <div class="c12 fwb ttu fc-bg70 py1 px3 fs0-8">${props.title}</div>
        ${guideThumbnail(xtend(props.page, { featured: false }))}
      </div>
    `
  }

  function renderImage () {
    return html`
      <div
        class="psa t0 l0 r0 b0 bgsc bgpc bgrn"
        style="${!state.page.color ? 'filter: invert(1);' : ''} opacity: 0.25; background-image: url(${state.page.files['image.svg'].path}">
      ></div>
    `
  }
}

function mod (num, mod) {
  var remain = num % mod
  return Math.floor(remain >= 0 ? remain : remain + mod)
}
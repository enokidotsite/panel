var objectKeys = require('object-keys')
var html = require('choo/html')
var css = require('sheetify')
var xtend = require('xtend')
var path = require('path')

var guideThumbnail = require('../components/guide-thumbnail')
var wrapper = require('../containers/wrapper-hub')
var format = require('../components/format')

var styles = css`
  :host {
    margin-top: -1px;
  }

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
  var parent = state.docs.content[path.resolve(state.page.url, '../')]
  if (!parent) return
  var pages = objectKeys(parent.pages)
  var pageIndex = pages.indexOf(state.page.name)
  var pagePrev = parent.pages[pages[mod(pageIndex - 1, pages.length)]]
  var pageNext = parent.pages[pages[mod(pageIndex + 1, pages.length)]]

  if (pagePrev) pagePrev = state.docs.content[pagePrev.url]
  if (pageNext) pageNext = state.docs.content[pageNext.url]

  return html`
    <div class="${styles}">
      <div
        class="oh psr x xjc xac p4 c12 bgpc bgsct bgrn fc-bg"
        style="
          min-height: 50vh;
          background-color: ${state.page.background};
        "
      >
        <div class="psr z3">
          <h2 class="c12 fs3 lh1-25 tac">${state.page.title}</h2>
          <div class="p2 sm-pt4 c12 tac fs0-8 dn">
            ${tags.map(function (tag) {
              return html`<span class="mx0-5 button-inline white">${tag}</span>`
            })}
          </div>
        </div>
      </div>
      <div class="p4 c12 x xjc fc-bg70">
        <div class="copy">
          ${format(state.page.text)}
        </div>
      </div>
      <div class="guides-grid bgc-bg2-5">
        ${renderGuide({ title: 'Previous Guide', page: pagePrev })}
        ${renderGuide({ title: 'Next Guide', page: pageNext })}
      </div>
    </div>
  `

  function renderGuide (props) {
    return html`
      <div class="x xw w100">
        ${guideThumbnail(xtend(props.page, { featured: false }))}
      </div>
    `
  }

  function renderImage () {
    return html`
      <div
        class="psa t0 l0 r0 b0 bgsc bgpc bgrn"
        style="mix-blend-mode: overlay; opacity: 0.25; background-image: url(${state.page.files['image.svg'].path}"
      ></div>
    `
  }
}

function mod (num, mod) {
  var remain = num % mod
  return Math.floor(remain >= 0 ? remain : remain + mod)
}
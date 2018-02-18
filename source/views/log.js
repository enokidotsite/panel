var objectValues = require('object-values')
var html = require('choo/html')
var css = require('sheetify')

var wrapper = require('../containers/wrapper-hub')
var format = require('../components/format')


var styles = css`
  :host {
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(30rem, 1fr));
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
  }

  :host > div {
    grid-column-end: span 1;
    padding: 2rem;
  }
`

module.exports = wrapper(view)

function view (state, emit) {
  var log = state.docs.content['/log']
  var issues = objectValues(state.docs.content['/issues'].pages || { })
    .map(function (props) { return state.docs.content[props.url] })

  return html`
    <div class="xx bgc-fg fc-bg25 ${styles}">
      <div class="grid-column">
        <div class="copy">
          ${format(log.text)}
        </div>
      </div>
      <div class="lh1-5">
        <h2 class="fs2 mb1 fc-bg">Issues</h2>
        <ul>
          ${issues.map(renderIssue)}
        </ul>
      </div>
    </div>
  `
}

function renderIssue (props) {
  return html`
    <li class="x xjb br1 mb2 p2 b1-bg25">
      <div class="fwb">
        ${props.title}
      </div>
      <div class="fs0-8">
        ${props.tags.map(function (tag) {
          return html`<span class="button-inline">${tag}</span>`
        })}
      </div>
    </li>
  `
}

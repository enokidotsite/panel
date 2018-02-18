var objectValues = require('object-values')
var html = require('choo/html')
var css = require('sheetify')

var styles = css`
  :host {
    padding: 1rem;
  }
  
  :host .guides-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
  }

  :host .grid-column {
    grid-column-end: span 1
  }

  :host .grid-featured {
    grid-column-end: span 2;
  }

  :host .grid-featured h2 {
    font-size: 3.6rem;
  }

  :host .grid-featured .copy {
    font-size: 1.8rem;
  }

  :host .copy {
    font-size: 1.4rem;
    max-height: 9.75rem;
  }

  :host .grid-featured .copy {
    max-height: 10.5rem;
    max-width: 50rem;
  }

  :host .guides-grid a {
    transition: 250ms ease-out transform;
    overflow: hidden;
    margin-bottom: -1rem;
  }

  :host .guides-grid a:hover {
    transform: translateY(-0.3rem);
  }

  :host .guides-grid a:active {
    transform: translateY(0rem);
    transition: 50ms ease-out transform;
  }

  @media (max-width: 38rem) {
    :host .grid-featured {
      grid-column-end: span 1;
    }

    :host h2 { font-size: 3.6rem }
    :host .copy { font-size: 1.8rem }
  }
`

var wrapper = require('../containers/wrapper-hub')

module.exports = wrapper(view)

function view (state, emit) {
  var guides = objectValues(state.page.pages).map(function (page){
    return state.docs.content[page.url] || { }
  })

  return html`
    <div class="xx x xdc bgc-fg ${styles}">
      <div class="x xw guides-grid">
        ${guides.map(renderGuide)}
      </div>
    </div>
  `
}

function renderGuide (props) {
  return html`
    <div
      class="psr x bgc-bg oh br1 grid-column ${props.featured ? 'grid-featured' : ''}"
      style="background: ${props.background}"
    >
      ${props.files['image.svg'] ? renderImage() : ''}
      <a
        href="/#hub${props.url}"
        class="psr z2 w100 x xdc xje p3 ${props.color ? 'fc-bg' : 'fc-fg'}"
      >
        <h2 class="fwb lh1-25 mb2">
          ${props.title}
        </h2>
        <div class="copy">
          <p>${props.excerpt}</p>
        </div>
      </a>
    </div>
  `

  function renderImage () {
    return html`
      <div
        class="psa t0 l0 r0 b0 bgsc bgpc bgrn"
        style="${!props.color ? 'filter: invert(1);' : ''} opacity: 0.25; background-image: url(${props.files['image.svg'].path}">
      ></div>
    `
  }
}

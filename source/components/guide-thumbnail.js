var html = require('choo/html')

module.exports = guideThumbnail

function guideThumbnail (props) {
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
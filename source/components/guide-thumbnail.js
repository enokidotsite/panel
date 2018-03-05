var html = require('choo/html')

module.exports = guideThumbnail

function guideThumbnail (props) {
  return html`
    <a
      href="/#hub${props.url}"
      class="db psr x xdc bgc-bg oh grid-column br1 ${props.featured ? 'grid-featured' : ''}"
      style="color: ${props.background}; --active: ${props.background}"
    >
      <div class="guide-border br1"></div>
      <div class="p3 xx psr x xdc xjb z2 w100 guide-meta">
        <h2 class="fwb lh1-25 mb2">
          ${props.title}
        </h2>
        <div class="copy fc-bg25">
          <p>${props.excerpt}</p>
        </div>
      </div>
    </a>
  `

  function renderImage () {
    return html`
      <div
        class="psa t0 l0 r0 b0 bgsc bgpc bgrn"
        style="mix-blend-mode: overlay; opacity: 0.25; background-image: url(${props.files['image.svg'].path}">
      ></div>
    `
  }
}
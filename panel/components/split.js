var html = require('choo/html')

module.exports = Split

function Split (left, right) {
  return html`
    <div class="x xw p1 x1">
      <div class="c4 x">
        ${left}
      </div>
      <div class="c8 x">
        ${right} 
      </div>
    </div>
  `
}

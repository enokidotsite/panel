var html = require('choo/html')

module.exports = Split

function Split (left, right) {
  return html`
    <div class="x xw p2 xx">
      <div class="c12 x p1 sm-c4">
        ${left}
      </div>
      <div class="c12 x p1 sm-c8">
        ${right} 
      </div>
    </div>
  `
}

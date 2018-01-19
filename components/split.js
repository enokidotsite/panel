var html = require('choo/html')

module.exports = Split

function Split (left, right) {
  return html`
    <div class="x xw p1 xx">
      <div class="c12 x sm-c4">
        ${left}
      </div>
      <div class="c12 x sm-c8">
        ${right} 
      </div>
    </div>
  `
}

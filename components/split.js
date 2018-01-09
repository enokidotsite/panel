var html = require('choo/html')

module.exports = Split

function Split (left, right) {
  return html`
    <div class="x xw p1 x1">
      <div class="c4 x sm-c12">
        ${left}
      </div>
      <div class="c8 x sm-c12">
        ${right} 
      </div>
    </div>
  `
}

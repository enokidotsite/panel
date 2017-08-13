var html = require('bel')
var md = require('nano-markdown')

module.exports = format

function format (str) {
  var output = md(str || '')
  if (typeof window === 'undefined') {
    var wrapper = new String(output)
    wrapper.__encoded = true
    return wrapper
  } else {
    var el = html`<div></div>`
    el.innerHTML = output
    return [...el.childNodes]
  }
}

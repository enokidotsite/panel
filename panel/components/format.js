var markdown = require('nano-markdown')
var html = require('choo/html')

module.exports = format

function format (str) {
  var output = markdown(str || '')
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

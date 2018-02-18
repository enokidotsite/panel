var MarkdownIt = require('markdown-it')
var raw = require('choo/html/raw')
var md = new MarkdownIt()

module.exports = format

function format (str) {
  return raw(md.render(str || ''))
}

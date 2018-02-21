var taskLists = require('markdown-it-task-lists')
var MarkdownIt = require('markdown-it')
var raw = require('choo/html/raw')
var md = new MarkdownIt()
  .use(taskLists) 

module.exports = format

function format (str) {
  return raw(md.render(str || ''))
}

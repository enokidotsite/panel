var Nanocomponent = require('nanocomponent')
var objectValues = require('object-values')
var queryString = require('query-string')
var html = require('choo/html')
var xtend = require('xtend')

module.exports = class Pages extends Nanocomponent {
  constructor () {
    super()
    this.label = false
    this.state = {
      limit: 6,
      value: ''
    }
  }

  createElement (props, emit) {
    this.state = xtend(this.state, props.field)
    this.state.value = this.state.value || ''

    var urlPageNew = unescape(queryString.stringify(xtend({ page: 'new' }, props.query)))
    var urlPagesAll = unescape(queryString.stringify(xtend({ pages: 'all' }, props.query)))

    var pages = objectValues(props.page.pages || { })
      .map(function (page) {
        return props.content[page.url]
      })

    return html`
      <div id="sidebar-pages" class="mb2">
        <div class="x xjb c12 py1 fs0-8 ttu usn">
          <div class="fwb">
            <a href="?${urlPagesAll}" class="fc-bg25 fch-fg">Pages</a>
          </div>
          <div>
            <a href="?${urlPageNew}" class="button-inline">Create</a>
            <a href="?${urlPagesAll}" class="button-inline">All</a>
          </div>
        </div>
        <ul class="c12 myc1 lsn">
          ${elsChildren(pages)}
        </ul>
      </div>
    `
  }

  update (props) {
    return true
  }
}

function elsChildren (children) {
  children = children || [ ]

  if (children.length <= 0) {
    return html`
      <li class="m0 py1 fc-bg25">
        No sub-pages
      </li>
    `
  }

  return children
    .slice(0, 6)
    .map(function (child) {
      if (!child.url) return
      return html`
        <li id="page-${child.url}" class="m0">
          <a
            href="?url=${child.url}"
            class="db py1 truncate"
            ondragstart=${handleDragStart}
          >${child.title || child.name}</a>
        </li>
      `

    function handleDragStart (event) {
      event.dataTransfer.setData('text/plain', `[${child.title}](${child.url})`)
    }
  })
}
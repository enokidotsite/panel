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
      pathnames: false,
      label: 'Pages',
      limit: 6,
      value: ''
    }
  }

  createElement (props, emit) {
    var self = this
    this.state = xtend(this.state, props.field)
    this.state.value = this.state.value || ''
    this.state.sort = props.field.sort || props.page.sort

    var urlPageNew = unescape(queryString.stringify(xtend({ page: 'new' }, props.query)))
    var urlPagesAll = unescape(queryString.stringify(xtend({ pages: 'all' }, props.query)))

    var pages = objectValues(props.page.pages || { })
      .map(function (page) {
        return props.content[page.url]
      })

    // custom sort
    if (typeof this.state.sort === 'string') {
      pages = getPagesSort(pages, this.state.sort) 
    }

    return html`
      <div id="sidebar-pages">
        <div class="x xjb c12 py1 fs0-8 ttu usn">
          <div class="fwb">
            <a href="?${urlPagesAll}" class="fc-bg25 fch-fg">${this.state.label}</a>
          </div>
          <div>
            <a href="?${urlPageNew}" class="button-inline">Create</a>
            <a href="?${urlPagesAll}" class="button-inline">All</a>
          </div>
        </div>
        <ul class="c12 myc1 lsn">
          ${this.elsChildren(pages)}
        </ul>
      </div>
    `
  }

  update (props) {
    return true
  }

  elsChildren (children) {
    var self = this
    children = children || [ ]

    if (children.length <= 0) {
      return html`
        <li class="m0 py1 fc-bg25">
          No sub-pages
        </li>
      `
    }

    return children
      .slice(0, this.state.limit)
      .map(function (child) {
        if (!child.url) return
        return html`
          <li id="page-${child.url}" class="m0">
            <a
              href="?url=${child.url}"
              class="x xjb py1 truncate"
              ondragstart=${handleDragStart}
            >
              <span>${child.title || child.name}</span>
              ${self.state.pathnames
                ? html`<span class="fc-bg25">/${child.name}</span>`
                : ''
              }
            </a>
          </li>
        `

      function handleDragStart (event) {
        event.dataTransfer.setData('text/plain', `[${child.title}](${child.url})`)
      }
    })
  }
}

function getPagesSort (pages, sort) {
  switch (sort) {
    case 'alphabetical':
      return pages.sort(function (a, b) { 
        return (a.title || a.name).localeCompare(b.title || b.name)
      })
    case 'reverse-alphabetical':
      return pages.sort(function (a, b) { 
        return (b.title || b.name).localeCompare(a.title || a.name)
      })
    case 'reverse-chronological':
      return pages.sort(function (a, b) { 
        if (a.date && b.date) return new Date(b.date) - new Date(a.date)
      })
    case 'chronological':
      return pages.sort(function (a, b) { 
        if (a.date && b.date) return new Date(a.date) - new Date(b.date)
      })
  }
}

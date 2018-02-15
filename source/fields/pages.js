var Nanocomponent = require('nanocomponent')
var objectValues = require('object-values')
var html = require('choo/html')
var xtend = require('xtend')

module.exports = class Pages extends Nanocomponent {
  constructor () {
    super()
    this.state = {
      limit: 6,
      value: ''
    }
  }

  createElement (props, emit) {
    this.state = xtend(this.state, props.field)
    this.state.value = this.state.value || ''

    var pages = objectValues(props.page.pages || { })
      .map(function (page) {
        return props.content[page.url]
      })

    return html`
      <ul class="c12 myc1 lsn">
        ${elsChildren(pages)}
      </ul>
    `

    function onInput (event) {
      emit({ value: event.target.value })
    }
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
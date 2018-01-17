var assert = require('assert')
var objectValues = require('object-values')
var html = require('choo/html')
var xtend = require('xtend')

module.exports = view

function view (state, emit) {
  var sites = objectValues(state.sites.archives)
  return html`
    <div>
      ${sites.length > 0
        ? renderSites({
          sites: sites,
          handleAdd: handleAdd,
          handleRemove: handleRemove
        })
        : renderEmpty({
          handleAdd: handleAdd
        })
      }
    </div>
  `

  function handleAdd () {
    emit(state.events.SITE_ADD)
  }

  function handleRemove (props) {
    emit(state.events.SITE_REMOVE, props)
  }
}

function renderSites (props) {
  return html`
    <div>
      ${props.sites.map(function (site) {
        return renderSite(xtend(site, {
          handleRemove: props.handleRemove
        }))
      })}
    </div>
  `
}

function renderEmpty (props) {
  return html`
    <div>
      No sites add one why not
      <button onclick=${props.handleAdd}>Add</button>
    </div>
  `
}

function renderSite (props) {
  return html`
    <div>
      <div>${props.title}</div>
      ${props.url}
      <button onclick=${handleRemove}>remove</button>
    </div>
  `

  function handleRemove () {
    if (typeof props.handleRemove === 'function') {
      props.handleRemove({ url: props.url, render: true })
    }
  }
}
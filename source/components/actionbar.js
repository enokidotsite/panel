var html = require('choo/html')

module.exports = ActionBar

function ActionBar (props) {
  props = props || { }
  var saveText = props.saveText || 'Save Changes'
  var cancelText = props.cancelText || 'Cancel'
  var disabled = (props.disabled === undefined) ? false : props.disabled
  var disabledClass = props.disabled ? 'pen dn' : 'x xjc'

  return html`
    <div id="action-bar" class="px0-5 pea psr c12 lh1 usn ${disabledClass}">
      ${props.handleCancel ? cancel() : ''}
      ${save()} 
    </div>
  `

  function save () {
    return html`
      <div class="p0-5 x1" id="save">
        <button
          class="bgc-blue fc-bg button-medium fwb"
          type="submit"
        >${saveText}</button>
      </div>
    `
  }

  function cancel () {
    return html`
      <div class="p0-5" id="cancel">
        <div
          class="fc-bg25 fch-fg bgc-bg b2-currentColor button-medium"
          onclick=${props.handleCancel}
        >${cancelText}</div>
      </div>
    `
  }
}
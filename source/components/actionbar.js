var html = require('choo/html')

module.exports = ActionBar

function ActionBar (props) {
  props = props || { }
  var saveText = props.saveText || 'Save changes'
  var cancelText = props.cancelText || 'Cancel'
  var disabled = (props.disabled === undefined) ? false : props.disabled
  var disabledClass = props.disabled ? 'pen dn' : 'x xjc'

  return html`
    <div id="action-bar" class="pea psr c12 lh1 usn ${disabledClass}">
      ${save()} 
      ${props.handleCancel ? cancel() : ''}
    </div>
  `

  function save () {
    return html`
      <div class="p0-5 x1" id="save">
        <button
          class="bgc-blue button-medium"
          type="submit"
        >${saveText}</button>
      </div>
    `
  }

  function cancel () {
    return html`
      <div class="p0-5" id="cancel">
        <div
          class="bgc-bg25 bgch-fg button-medium"
          onclick=${props.handleCancel}
        >${cancelText}</div>
      </div>
    `
  }
}
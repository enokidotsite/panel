var html = require('choo/html')

module.exports = ActionBar

function ActionBar (props) {
  props = props || { }
  var saveText = props.saveText || 'Save changes'
  var cancelText = props.cancelText || 'Cancel'
  var disabled = (props.disabled === undefined) ? false : props.disabled
  var disabledClass = props.disabled ? 'pen dn' : 'x xjc'

  return html`
    <div id="action-bar" class="psr c12 lh1 usn ${disabledClass}">
      ${props.handleSave ? save() : ''} 
      ${props.handleCancel ? cancel() : ''}
    </div>
  `

  function save () {
    return html`
      <div class="p1 x1" id="save">
        <div
          class="bgc-fg button-large"
          onclick=${props.handleSave}
        >${saveText}</div>
      </div>
    `
  }

  function cancel () {
    return html`
      <div class="p1" id="cancel">
        <div
          class="bgc-bg25 bgch-fg button-large"
          onclick=${props.handleCancel}
        >${cancelText}</div>
      </div>
    `
  }
}
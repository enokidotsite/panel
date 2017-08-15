var html = require('choo/html')

module.exports = ActionBar

function ActionBar (props) {
  props = props || { }
  props.disabled = (props.disabled === undefined) ? false : props.disabled
  var disabledClass = props.disabled ? 'pen op25' : ''

  return html`
    <div class="x xjb c12 lh1 usn">
      <div class="x ${disabledClass}">
        ${props.handleSave ? save() : ''} 
        ${props.handleCancel ? cancel() : ''}
      </div>
      ${props.handleRemove ? remove() : ''}
    </div>
  `

  function save () {
    return html`
      <div class="p1" id="save">
        <div
          class="bgblack tcwhite p1 curp fwb br1"
          onclick=${props.handleSave}
        >Save</div>
      </div>
    `
  }

  function cancel () {
    return html`
      <div class="p1" id="cancel">
        <div
          class="bgblack tcwhite p1 curp br1"
          onclick=${props.handleCancel}
        >Cancel</div>
      </div>
    `
  }

  function remove () {
    return html`
      <div class="p1" id="remove">
        <div
          class="bgblack tcwhite p1 curp br1"
          onclick=${props.handleRemove}
        >Remove</div>
      </div>
    `
  }
}
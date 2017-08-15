var html = require('choo/html')

module.exports = modal

function modal (state, emit, content) {
  return html`
    <div
      id="modal"
      class="p1 psf t0 l0 r0 b0 x xjc xac z2 curp"
      style="background: rgba(127, 127, 127, 0.5)"
      onclick=${handleContainerClick}
    >
      <div
        onclick=${handleContentClick}
        class="curd c6"
      >
        ${content || ''} 
      </div>
    </div>
  `

  function handleContainerClick (event) {
    if (typeof emit === 'function') {
      emit(state.events.REPLACESTATE, '?')
    }
  }

  function handleContentClick (event) {
    event.stopPropagation()
  }
}
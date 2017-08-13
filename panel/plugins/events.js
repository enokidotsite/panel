module.exports = events

function events (state, emitter) {
  state.events = state.events || { }

  // panel
  state.events.PANEL_UPDATE = 'panel:update'
  state.events.PANEL_SAVE = 'panel:save'
  state.events.PANEL_CANCEL = 'panel:cancel'
  state.events.PANEL_LOADING = 'panel:loading'
  state.events.PANEL_PAGE_ADD = 'panel:page:add'
  state.events.PANEL_PAGE_REMOVE = 'panel:page:remove'
}

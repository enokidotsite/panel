module.exports = events

function events (state, emitter) {
  state.events = state.events || { }

  state.events.PANEL_UPDATE = 'panel:update'
  state.events.PANEL_MOVE = 'panel:move'
  
  state.events.PANEL_PAGE_ADD = 'panel:page:add'
  state.events.PANEL_FILES_ADD = 'panel:files:add'

  state.events.PANEL_LOADING = 'panel:loading'
  state.events.PANEL_SAVE = 'panel:save'
  state.events.PANEL_CANCEL = 'panel:cancel'
  state.events.PANEL_REMOVE = 'panel:remove'
}

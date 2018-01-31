module.exports = designs

function designs (state, emitter) {
  state.designs = {
    loaded: false,
    public: {
      starterkit: {
        title: 'Starter Kit',
        url: 'dat://57cb1b649045ab34d762e25a16fc08dbe8ea2006d4373e10719899d2ae7c6ff5'
      }
    }
  }

  state.events.DESIGNS_SELECT = 'designs:select'

  emitter.on(state.events.DESIGNS_SELECT, onSelect)

  function onSelect (data) {
    console.log(data)
  }
}

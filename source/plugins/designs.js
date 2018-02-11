module.exports = designs

function designs (state, emitter) {
  state.designs = {
    loaded: false,
    public: {
      starterkit: {
        title: 'Starter Kit',
        thumbnail: '/assets/designs/starter-kit.png',
        url: 'dat://57cb1b649045ab34d762e25a16fc08dbe8ea2006d4373e10719899d2ae7c6ff5'
      },
      vacant: {
        title: 'Vacant',
        thumbnail: '/assets/designs/vacant.png',
        url: 'dat://68a206a64a3f30dda8720625592b8b07d02e2ad3a6116ce3b6b05230e7bb1566'
      }
    }
  }

  state.events.DESIGNS_SELECT = 'designs:select'

  emitter.on(state.events.DESIGNS_SELECT, onSelect)

  function onSelect (data) {
    console.log(data)
  }
}

var html = require('choo/html')
var Nanocomponent = require('nanocomponent')

module.exports = function wrapper () {
  if (!(this instanceof Publish)) return new Publish()
}

class Publish extends Nanocomponent {
  constructor () {
    super()
  }

  createElement (props) {
    return html`
      <div>
        Publish
      </div>
    `
  }

  update () {
    return true
  }
}
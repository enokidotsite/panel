var assert = require('assert')

module.exports = class Archives {
  constructor () {
    this.state = {
      active: '',
      archives: { }
    }

    // public methods
    this.archive = this.archive
    this.remove = this.remove
    this.add = this.add
  }

  async archive (url) {
    if (url && this.archives[url]) this.state.active = url
    else await this.add(url)
    return this.state.archives[this.state.active]
  }

  remove (url) {
    assert(typeof url === 'string', 'arg1 must be type string')
    if (this.state.archives[url]) delete this.state.archives[url]
  }

  add (url) {
    var self = this
    return new Promise(function (resolve, reject) {
      try {
        assert(typeof url === 'string', 'arg1 must be type string')
        if (!self.state.archives[url]) {
          self.state.archives[url] = new DatArchive(url)
        }
        resolve(self.state.archives[url])
      } catch (err) {
        reject(err)
      }
    })
  }
}

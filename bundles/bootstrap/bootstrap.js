// start
init()

// TODO: panel versioning
function init () {
  // var archiveActive = window.localStorage.getItem('active')
  // var localVersion = window.localStorage.getItem('version-' + archiveActive)
  var elHead = document.querySelector('head')
  var elScript = document.createElement('script')
  var elLink = document.createElement('link')
  // var version = localVersion
  //   ? JSON.parse(localVersion)
  //   : { selected: '0.1.0' }
  var version = { selected: '0.1.0' }

  elScript.setAttribute('src', '/bundles/' + version.selected + '/bundle.js')
  elLink.setAttribute('href', '/bundles/' + version.selected + '/bundle.css')
  elLink.setAttribute('rel', 'stylesheet')

  elHead.appendChild(elScript)
  elHead.appendChild(elLink)
}

// start
init()

function init () {
  var localVersion = window.localStorage.getItem('version')
  var elHead = document.querySelector('head')
  var elScript = document.createElement('script')
  var elLink = document.createElement('link')
  var version = localVersion || '0.1.0'

  elScript.setAttribute('src', '/bundles/' + version + '/bundle.js')
  elLink.setAttribute('href', '/bundles/' + version + '/bundle.css')
  elLink.setAttribute('rel', 'stylesheet')

  elHead.appendChild(elScript)
  elHead.appendChild(elLink)
}

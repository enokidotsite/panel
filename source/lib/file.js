module.exports = {
  getBlueprint,
  encodeFilename,
  decodeFilename,
  sanitizeName
}

function getBlueprint (state) {
  try {
    return state.site.blueprints[state.page.view].files || { }
  } catch (err) {
    return { }
  }
}

function encodeFilename (str) {
  return str.replace(/\.([^\.]*)$/, '-$1')
}

function decodeFilename (str) {
  return str.replace(/-([^\-]*)$/, '.$1')
}

function sanitizeName (str) {
  return str
    .replace(/\s+/g, '-')
    .replace(/[.,\/#!@?$%\^&\*;:{}=\_`~()]/g, '')
    .toLowerCase()
}
module.exports = {
  queryStringToJSON: queryStringToJSON,
  getSearch: getSearch
}

function queryStringToJSON (str) {            
  var pairs = str.slice(1).split('&');
  var result = { }

  pairs.forEach(function(pair) {
    pair = pair.split('=')
    result[pair[0]] = decodeURIComponent(pair[1] || '')
  })

  return JSON.parse(JSON.stringify(result))
}

function getSearch () {
  return (typeof window !== 'undefined' && window.location.search)
    ? queryStringToJSON(window.location.search)
    : false
}

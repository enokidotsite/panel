module.exports = {
  queryStringToJSON: queryStringToJSON
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
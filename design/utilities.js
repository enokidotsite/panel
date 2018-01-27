var gr8 = require('gr8')
var options = require('./options')
var utils = [ ]

utils.push({
  prop: 'font-family',
  join: '-',
  vals: options.typography
})

utils.push({
  prop: { bgc: 'background-color' },
  join: '-',
  vals: options.colors
})

utils.push({
  prop: { bgch: 'background-color' },
  tail: ':hover',
  join: '-',
  vals: options.colors
})

utils.push({
  prop: { fc: 'color' },
  join: '-',
  vals: options.colors
})

utils.push({
  prop: { fch: 'color' },
  join: '-',
  tail: ':hover',
  vals: options.colors
})

utils.push({
  prop: { oph: 'opacity' },
  tail: ':hover',
  vals: [0, 25, 50, 75, 100],
  transform: function (val) {
    return val / 100
  }
})

var borderWeights = [0, 1, 2]
var borders = {}
borderWeights.forEach(border => {
  Object.keys(options.colors).forEach(key => {
    borders[border + '-' + key] = `${border * 0.05}rem solid ${options.colors[key]}`
  })
})

utils.push({
  prop: [
    'border',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left'
  ],
  vals: borders
})

module.exports = gr8({
  fontSize: options.fontSize,
  spacing: options.spacing,
  breakpointSelector: 'class',
  utils: utils
})

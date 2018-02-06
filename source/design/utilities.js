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
  prop: { ophc: 'opacity' },
  tail: ':hover .oph',
  vals: [0, 25, 50, 75, 100],
  transform: function (val) {
    return val / 100
  }
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
    borders[border + '-' + key] = `${border}px solid ${options.colors[key]}`
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

utils.push({
  prop: 'font-weight',
  vals: ['normal', 500, { b: '600' }]
})

module.exports = gr8({
  lineHeight: [1, 1.25, 1.5],
  fontSize: options.fontSize,
  spacing: options.spacing,
  breakpointSelector: 'class',
  utils: utils
})

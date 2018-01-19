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
  prop: { fc: 'color' },
  join: '-',
  tail: ' a',
  vals: options.colors
})

utils.push({
  prop: { fch: 'color' },
  join: '-',
  tail: ':hover',
  vals: options.colors
})

module.exports = gr8({
  fontSize: options.fontSize,
  spacing: options.spacing,
  breakpointSelector: 'class',
  utils: utils
})

const { withTV } = require('tailwind-variants/transformer')

module.exports = withTV({
  content: ['./app/**/*.{tsx,css,ts}']
})
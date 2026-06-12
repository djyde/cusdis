const path = require('path')
const svelte = require('rollup-plugin-svelte')

module.exports = {
  root: 'widget',
  build: {
    lib: {
      entry: path.resolve(__dirname, '..', 'widget', 'sdk.js'),
      name: 'cusdis',
    },
    outDir: path.resolve(__dirname, '..', 'widget', 'dist'),
  },
  plugins: [
    svelte({ emitCss: false }),
  ],
}

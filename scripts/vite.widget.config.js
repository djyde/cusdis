const path = require('path')
const svelte = require('rollup-plugin-svelte')

module.exports = {
  root: 'widget',
  build: {
    lib: {
      entry: path.resolve(__dirname, '..', 'widget', 'index.js'),
      name: 'cusdis',
    },
    outDir: path.resolve(__dirname, '..', 'public', 'js'),
  },
  plugins: [
    svelte({ emitCss: false }),
  ],
}

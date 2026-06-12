const path = require('path')
const svelte = require('rollup-plugin-svelte')

module.exports = {
  root: 'widget',
  build: {
    lib: {
      entry: path.resolve(__dirname, '..', 'widget', 'count.js'),
      name: 'CUSDIS_COUNT',
      fileName: 'cusdis-count',
      formats: ['umd'],
    },
    outDir: path.resolve(__dirname, '..', 'public', 'js'),
  },
  plugins: [
    svelte({ emitCss: false }),
  ],
}

const { webPublicPath } = require('./constants');

module.exports = {
  build: {
    lib: {
      entry: 'src/count.js',
      name: 'CUSDIS_COUNT',
      fileName: 'cusdis-count',
      formats: ['umd'],
    },
    outDir: webPublicPath
  },
  plugins: [
    require('rollup-plugin-svelte')({
      emitCss: false,
    }),
  ],
}
